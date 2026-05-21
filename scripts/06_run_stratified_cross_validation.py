from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from biodegradation_ml_framework.cross_validation import run_cross_validation


PROJECT_ROOT = Path(__file__).resolve().parents[1]
REPORTS_DIR = PROJECT_ROOT / "reports"
RESULTS_TABLES_DIR = PROJECT_ROOT / "results" / "tables"
RESULTS_METADATA_DIR = PROJECT_ROOT / "results" / "metadata"
JSON_PATH = RESULTS_METADATA_DIR / "stratified_cv_metrics.json"
DIAGNOSTICS_CSV = RESULTS_TABLES_DIR / "stratified_cv_fold_diagnostics.csv"
RESULTS_CSV = RESULTS_TABLES_DIR / "stratified_cv_model_results.csv"
TXT_PATH = REPORTS_DIR / "stratified_cross_validation_summary.txt"


def project_relative(path: Path) -> str:
    return str(path.resolve().relative_to(PROJECT_ROOT))


def main() -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    RESULTS_TABLES_DIR.mkdir(parents=True, exist_ok=True)
    RESULTS_METADATA_DIR.mkdir(parents=True, exist_ok=True)
    diagnostics, results = run_cross_validation()

    diagnostics.to_csv(DIAGNOSTICS_CSV, index=False)
    results.to_csv(RESULTS_CSV, index=False)

    summary = (
        results.groupby(["sampling", "model_name"])[["accuracy", "precision", "recall", "f1_score", "roc_auc", "rb_recall"]]
        .mean()
        .reset_index()
    )

    payload = {
        "created_at_utc": datetime.now(timezone.utc).isoformat(),
        "dataset": "qsar_biodegradation",
        "validation_type": "5_fold_stratified_cross_validation",
        "diagnostics_csv": project_relative(DIAGNOSTICS_CSV),
        "results_csv": project_relative(RESULTS_CSV),
        "summary": summary.to_dict(orient="records"),
    }
    JSON_PATH.write_text(json.dumps(payload, indent=2) + "\n")

    lines = [
        "Stratified Cross-Validation Summary",
        "",
        "Validation: 5-fold stratified cross-validation",
        "Sampling conditions: baseline, smote",
        "",
        "Fold diagnostics file:",
        f"  {project_relative(DIAGNOSTICS_CSV)}",
        "",
        "Mean metrics by model and sampling:",
    ]
    for _, row in summary.iterrows():
        lines.append(f"{row['sampling']} | {row['model_name']}")
        lines.append(f"  accuracy: {row['accuracy']:.4f}")
        lines.append(f"  precision: {row['precision']:.4f}")
        lines.append(f"  recall: {row['recall']:.4f}")
        lines.append(f"  f1_score: {row['f1_score']:.4f}")
        lines.append(f"  roc_auc: {row['roc_auc']:.4f}")
        lines.append(f"  rb_recall: {row['rb_recall']:.4f}")
        lines.append("")
    TXT_PATH.write_text("\n".join(lines).rstrip() + "\n")

    print(f"Wrote cross-validation metadata to {JSON_PATH}")
    print(f"Wrote fold diagnostics to {DIAGNOSTICS_CSV}")
    print(f"Wrote model results to {RESULTS_CSV}")
    print(f"Wrote validation summary to {TXT_PATH}")


if __name__ == "__main__":
    main()
