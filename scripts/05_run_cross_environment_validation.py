from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path

from biodegradation_ml_framework.environment_validation import run_cross_environment_validation, write_cross_environment_charts


PROJECT_ROOT = Path(__file__).resolve().parents[1]
REPORTS_DIR = PROJECT_ROOT / "reports"
FIGURES_DIR = PROJECT_ROOT / "figures" / "cross_environment"
RESULTS_TABLES_DIR = PROJECT_ROOT / "results" / "tables"
RESULTS_METADATA_DIR = PROJECT_ROOT / "results" / "metadata"
JSON_PATH = RESULTS_METADATA_DIR / "cross_environment_validation_metrics.json"
CSV_PATH = RESULTS_TABLES_DIR / "cross_environment_validation_summary.csv"
MD_PATH = REPORTS_DIR / "cross_environment_validation.md"


def project_relative(path: Path) -> str:
    return str(path.resolve().relative_to(PROJECT_ROOT))


def report_relative(path: Path) -> str:
    return os.path.relpath(path.resolve(), start=MD_PATH.parent.resolve())


def dataframe_to_markdown(frame) -> str:
    columns = [str(column) for column in frame.columns]
    index_name = frame.index.name or "model_name"
    header = "| " + " | ".join([index_name] + columns) + " |"
    separator = "| " + " | ".join(["---"] * (len(columns) + 1)) + " |"
    rows = []
    for index, values in frame.iterrows():
        formatted = [f"{value:.4f}" if isinstance(value, float) else str(value) for value in values.tolist()]
        rows.append("| " + " | ".join([str(index)] + formatted) + " |")
    return "\n".join([header, separator] + rows)


def main() -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    FIGURES_DIR.mkdir(parents=True, exist_ok=True)
    RESULTS_TABLES_DIR.mkdir(parents=True, exist_ok=True)
    RESULTS_METADATA_DIR.mkdir(parents=True, exist_ok=True)
    fold_results, summary = run_cross_environment_validation()
    chart_paths = write_cross_environment_charts(summary, FIGURES_DIR)

    payload = {
        "created_at_utc": datetime.now(timezone.utc).isoformat(),
        "dataset": "qsar_biodegradation",
        "evaluation_type": "cross_environment_validation_proxy",
        "environment_definition": "stratified kmeans clustering on standardized descriptor vectors with 3 proxy environments",
        "fold_results": [
            {
                "model_name": result.model_name,
                "environment_id": result.environment_id,
                "metrics": result.metrics,
                "confusion_matrix": result.confusion_matrix,
            }
            for result in fold_results
        ],
        "charts": [project_relative(path) for path in chart_paths],
    }
    JSON_PATH.write_text(json.dumps(payload, indent=2) + "\n")
    summary.to_csv(CSV_PATH, index=False)

    mean_scores = summary.groupby("model_name")[["accuracy", "f1_score", "roc_auc", "rb_recall"]].mean()
    rb_drop = summary.groupby("model_name")["rb_recall"].agg(["min", "max", "mean"])

    lines = [
        "# Cross-Environment Validation",
        "",
        "## Objective",
        "Test whether the patterns learned by the current models generalize under a shifted data distribution.",
        "",
        "## Environment Definition",
        "Proxy environments were defined by running stratified k-means clustering with 3 clusters on standardized descriptor vectors, preserving both classes across the held-out environments.",
        "",
        "## Validation Setup",
        "- Leave-one-environment-out evaluation",
        "- Train on two clusters, test on the held-out cluster",
        "- Models: Logistic Regression, Random Forest, feedforward neural network, descriptor-graph prototype",
        "",
        "## Mean Performance Across Held-Out Environments",
        "",
        dataframe_to_markdown(mean_scores.round(4)),
        "",
        "## RB Recall Stability",
        "",
        dataframe_to_markdown(rb_drop.round(4)),
        "",
        "## Charts",
    ]
    for path in chart_paths:
        lines.append(f"- {project_relative(path)}")
        lines.append(f"![{Path(path).stem}]({report_relative(path)})")
        lines.append("")
    lines.extend(
        [
            "",
            "## Interpretation",
            "These results show how performance changes when models are tested outside the descriptor region they were trained on. The most important signal is whether RB recall collapses under distribution shift.",
        ]
    )
    MD_PATH.write_text("\n".join(lines) + "\n")

    print(f"Wrote cross-environment metrics to {JSON_PATH}")
    print(f"Wrote cross-environment summary table to {CSV_PATH}")
    print(f"Wrote cross-environment report to {MD_PATH}")


if __name__ == "__main__":
    main()
