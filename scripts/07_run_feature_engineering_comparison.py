from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from biodegradation_ml_framework.feature_engineering import (
    TIER1_BASELINE_FEATURES,
    TIER2_PROXY_FEATURES,
    TIER3_FUTURE_QUANTUM_FEATURES,
    run_feature_engineering_evaluation,
    write_feature_engineering_chart,
)


PROJECT_ROOT = Path(__file__).resolve().parents[1]
REPORTS_DIR = PROJECT_ROOT / "reports"
FIGURES_DIR = PROJECT_ROOT / "figures" / "feature_engineering"
RESULTS_TABLES_DIR = PROJECT_ROOT / "results" / "tables"
RESULTS_METADATA_DIR = PROJECT_ROOT / "results" / "metadata"
CHART_PATH = FIGURES_DIR / "feature_set_comparison.png"
FEATURES_JSON = RESULTS_METADATA_DIR / "feature_engineering_sets.json"
RESULTS_CSV = RESULTS_TABLES_DIR / "feature_engineering_model_results.csv"
DIAGNOSTICS_CSV = RESULTS_TABLES_DIR / "feature_engineering_diagnostics.csv"
TXT_PATH = REPORTS_DIR / "feature_engineering_summary.txt"


def project_relative(path: Path) -> str:
    return str(path.resolve().relative_to(PROJECT_ROOT))


def main() -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    FIGURES_DIR.mkdir(parents=True, exist_ok=True)
    RESULTS_TABLES_DIR.mkdir(parents=True, exist_ok=True)
    RESULTS_METADATA_DIR.mkdir(parents=True, exist_ok=True)
    diagnostics, results = run_feature_engineering_evaluation()
    diagnostics.to_csv(DIAGNOSTICS_CSV, index=False)
    results.to_csv(RESULTS_CSV, index=False)
    chart_path = write_feature_engineering_chart(results, CHART_PATH)

    feature_sets_payload = {
        "created_at_utc": datetime.now(timezone.utc).isoformat(),
        "tier1_baseline_features": TIER1_BASELINE_FEATURES,
        "tier2_proxy_features": TIER2_PROXY_FEATURES,
        "tier3_future_quantum_features": TIER3_FUTURE_QUANTUM_FEATURES,
    }
    FEATURES_JSON.write_text(json.dumps(feature_sets_payload, indent=2) + "\n")

    summary = (
        results.groupby(["feature_set", "sampling", "model_name"])[["accuracy", "precision", "recall", "f1_score", "roc_auc", "rb_recall"]]
        .mean()
        .reset_index()
    )

    lines = [
        "Feature Engineering Summary",
        "",
        "Objective: compare the existing descriptor baseline against a chemistry-aware proxy feature expansion.",
        "",
        "Tier 1 baseline features:",
        f"  {len(TIER1_BASELINE_FEATURES)} original descriptors",
        "",
        "Tier 2 proxy features added:",
    ]
    for name in TIER2_PROXY_FEATURES:
        lines.append(f"  - {name}")
    lines.extend(
        [
            "",
            "Tier 3 future quantum-style features planned:",
        ]
    )
    for name in TIER3_FUTURE_QUANTUM_FEATURES:
        lines.append(f"  - {name}")
    lines.extend(
        [
            "",
            "Mean metrics by feature set, sampling, and model:",
        ]
    )
    for _, row in summary.iterrows():
        lines.append(f"{row['feature_set']} | {row['sampling']} | {row['model_name']}")
        lines.append(f"  accuracy: {row['accuracy']:.4f}")
        lines.append(f"  precision: {row['precision']:.4f}")
        lines.append(f"  recall: {row['recall']:.4f}")
        lines.append(f"  f1_score: {row['f1_score']:.4f}")
        lines.append(f"  roc_auc: {row['roc_auc']:.4f}")
        lines.append(f"  rb_recall: {row['rb_recall']:.4f}")
        lines.append("")
    lines.append(f"Chart: {project_relative(chart_path)}")
    lines.append(f"![Feature set comparison]({project_relative(chart_path)})")
    TXT_PATH.write_text("\n".join(lines).rstrip() + "\n")

    print(f"Wrote feature set metadata to {FEATURES_JSON}")
    print(f"Wrote feature diagnostics table to {DIAGNOSTICS_CSV}")
    print(f"Wrote feature comparison results table to {RESULTS_CSV}")
    print(f"Wrote feature engineering summary to {TXT_PATH}")
    print(f"Wrote feature engineering chart to {chart_path}")


if __name__ == "__main__":
    main()
