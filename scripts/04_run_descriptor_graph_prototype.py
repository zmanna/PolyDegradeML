from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from biodegradation_ml_framework.models import run_qsar_classification_baselines, run_qsar_fnn_classifier
from biodegradation_ml_framework.descriptor_graph_model import run_descriptor_graph_prototype


PROJECT_ROOT = Path(__file__).resolve().parents[1]
REPORTS_DIR = PROJECT_ROOT / "reports"
RESULTS_METADATA_DIR = PROJECT_ROOT / "results" / "metadata"
JSON_PATH = RESULTS_METADATA_DIR / "descriptor_graph_prototype_metrics.json"
TXT_PATH = REPORTS_DIR / "descriptor_graph_prototype_summary.txt"


def main() -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    RESULTS_METADATA_DIR.mkdir(parents=True, exist_ok=True)

    baseline_results = run_qsar_classification_baselines()
    fnn_result = run_qsar_fnn_classifier()
    gnn_result = run_descriptor_graph_prototype()

    payload = {
        "created_at_utc": datetime.now(timezone.utc).isoformat(),
        "dataset": "qsar_biodegradation",
        "task_type": "classification",
        "prototype_scope": "Descriptor-graph GNN prototype adapted to the available descriptor dataset.",
        "baselines": [
            {"model_name": result.model_name, "metrics": result.metrics}
            for result in baseline_results
        ],
        "fnn": {
            "model_name": fnn_result.model_name,
            "metrics": fnn_result.metrics,
        },
        "descriptor_graph_model": {
            "model_name": gnn_result.model_name,
            "metrics": gnn_result.metrics,
            "confusion_matrix_labels": ["NRB", "RB"],
            "confusion_matrix": gnn_result.confusion_matrix,
            "graph_info": gnn_result.graph_info,
        },
    }
    JSON_PATH.write_text(json.dumps(payload, indent=2) + "\n")

    lines = [
        "Descriptor-Graph Prototype Results",
        "",
        "Dataset: QSAR biodegradation",
        "Prototype: descriptor-graph message-passing network",
        "Note: this is an adapted graph prototype because the current dataset has descriptor vectors, not polymer atom/bond graphs.",
        "",
        "Baseline models:",
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

    lines.extend(
        [
            "Descriptor-graph prototype:",
            gnn_result.model_name,
        ]
    )
    for metric_name, value in gnn_result.metrics.items():
        lines.append(f"  {metric_name}: {value:.4f}")
    lines.append("")
    lines.append("Confusion matrix (rows=true [NRB, RB], cols=predicted [NRB, RB]):")
    for row in gnn_result.confusion_matrix:
        lines.append(f"  {row}")
    lines.append("")
    lines.append("Graph info:")
    for key, value in gnn_result.graph_info.items():
        lines.append(f"  {key}: {value}")
    lines.append("")

    TXT_PATH.write_text("\n".join(lines))
    print(f"Wrote descriptor-graph metrics to {JSON_PATH}")
    print(f"Wrote descriptor-graph summary to {TXT_PATH}")


if __name__ == "__main__":
    main()
