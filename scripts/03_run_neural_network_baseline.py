from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from biodegradation_ml_framework.models import run_qsar_classification_baselines, run_qsar_fnn_classifier


PROJECT_ROOT = Path(__file__).resolve().parents[1]
REPORTS_DIR = PROJECT_ROOT / "reports"
RESULTS_METADATA_DIR = PROJECT_ROOT / "results" / "metadata"
JSON_PATH = RESULTS_METADATA_DIR / "neural_network_baseline_metrics.json"
TXT_PATH = REPORTS_DIR / "neural_network_baseline_summary.txt"


def main() -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    RESULTS_METADATA_DIR.mkdir(parents=True, exist_ok=True)

    baseline_results = run_qsar_classification_baselines()
    fnn_result = run_qsar_fnn_classifier()

    payload = {
        "created_at_utc": datetime.now(timezone.utc).isoformat(),
        "dataset": "qsar_biodegradation",
        "task_type": "classification",
        "train_test_split": {
            "test_size": 0.2,
            "stratified": True,
            "random_state": 42,
        },
        "baselines": [
            {
                "model_name": result.model_name,
                "metrics": result.metrics,
            }
            for result in baseline_results
        ],
        "fnn": {
            "model_name": fnn_result.model_name,
            "metrics": fnn_result.metrics,
            "confusion_matrix_labels": ["NRB", "RB"],
            "confusion_matrix": fnn_result.confusion_matrix,
        },
    }
    JSON_PATH.write_text(json.dumps(payload, indent=2) + "\n")

    lines = [
        "Feedforward Neural Network Baseline Results",
        "",
        "Dataset: QSAR biodegradation",
        "Task: binary classification (RB vs NRB)",
        "Train/test split: 80/20 stratified, random_state=42",
        "",
        "Why this model was tested:",
        "  A feedforward neural network was included as a nonlinear dense neural baseline for the same tabular QSAR descriptor inputs used by the classical models. This tested whether a more flexible neural model could learn useful descriptor interactions beyond Logistic Regression and Random Forest without requiring molecular graphs or structure strings.",
        "",
        "Baseline comparison:",
    ]
    for result in baseline_results:
        lines.append(result.model_name)
        for metric_name, value in result.metrics.items():
            lines.append(f"  {metric_name}: {value:.4f}")
        lines.append("")

    lines.extend(
        [
            "Feedforward neural network:",
            fnn_result.model_name,
        ]
    )
    for metric_name, value in fnn_result.metrics.items():
        lines.append(f"  {metric_name}: {value:.4f}")
    lines.append("")
    lines.append("Confusion matrix (rows=true [NRB, RB], cols=predicted [NRB, RB]):")
    for row in fnn_result.confusion_matrix:
        lines.append(f"  {row}")
    lines.append("")
    lines.extend(
        [
            "What was learned:",
            "  The feedforward neural network was useful as a complexity check, but it did not outperform the Random Forest baseline on the initial train/test split. This suggests that, for this descriptor-only dataset, added neural-network flexibility is not automatically better than a strong tree-based method.",
            "  The model remains scientifically useful because later reliability analysis shows where neural models can be competitive under selected feature sets, calibration checks, and selective prediction. Its role is therefore not to replace the classical models, but to test whether nonlinear dense learning changes the reliability story.",
            "",
            "Connection to the exploratory notebook:",
            "  The separate `fnn_biodegradability` notebook folder is best understood as historical exploration of this neural-network idea. The reproducible project version is this script and the corresponding framework modules.",
        ]
    )

    TXT_PATH.write_text("\n".join(lines).rstrip() + "\n")

    print(f"Wrote neural network metrics to {JSON_PATH}")
    print(f"Wrote neural network summary to {TXT_PATH}")


if __name__ == "__main__":
    main()
