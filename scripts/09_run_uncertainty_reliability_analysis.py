from __future__ import annotations

from pathlib import Path

from biodegradation_ml_framework.uncertainty import run_uncertainty, write_uncertainty_charts


PROJECT_ROOT = Path(__file__).resolve().parents[1]
REPORTS_DIR = PROJECT_ROOT / "reports"
FIGURES_DIR = PROJECT_ROOT / "figures" / "uncertainty_calibration"
RESULTS_TABLES_DIR = PROJECT_ROOT / "results" / "tables"
RESULTS_PREDICTIONS_DIR = PROJECT_ROOT / "results" / "predictions"
PREDICTIONS_CSV = RESULTS_PREDICTIONS_DIR / "prediction_level_uncertainty.csv"
METRICS_CSV = RESULTS_TABLES_DIR / "uncertainty_reliability_metrics.csv"
SELECTIVE_CSV = RESULTS_PREDICTIONS_DIR / "selective_prediction_results.csv"
CROSS_ENV_CSV = RESULTS_TABLES_DIR / "cross_environment_uncertainty_metrics.csv"
SUMMARY_TXT = REPORTS_DIR / "uncertainty_reliability_summary.txt"


def project_relative(path: Path) -> str:
    return str(path.resolve().relative_to(PROJECT_ROOT))


def main() -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    FIGURES_DIR.mkdir(parents=True, exist_ok=True)
    RESULTS_TABLES_DIR.mkdir(parents=True, exist_ok=True)
    RESULTS_PREDICTIONS_DIR.mkdir(parents=True, exist_ok=True)

    predictions, metrics, selective, cross_env = run_uncertainty()
    chart_paths = write_uncertainty_charts(predictions, selective, FIGURES_DIR)

    predictions.to_csv(PREDICTIONS_CSV, index=False)
    metrics.to_csv(METRICS_CSV, index=False)
    selective.to_csv(SELECTIVE_CSV, index=False)
    cross_env.to_csv(CROSS_ENV_CSV, index=False)

    rf_cv = metrics[
        (metrics["model_name"] == "random_forest_classifier")
        & (metrics["evaluation_type"] == "stratified_cv")
    ].copy()
    rf_cross = metrics[
        (metrics["model_name"] == "random_forest_classifier")
        & (metrics["evaluation_type"] == "cross_environment")
    ].copy()
    rf_selective = selective[
        (selective["model_name"] == "random_forest_classifier")
        & (selective["evaluation_type"] == "stratified_cv")
    ].copy()

    calibration_ranked = rf_cv.assign(
        brier_rank=rf_cv["brier_score"].rank(method="average"),
        log_loss_rank=rf_cv["log_loss"].rank(method="average"),
        ece_rank=rf_cv["ece"].rank(method="average"),
    )
    calibration_ranked["calibration_rank"] = calibration_ranked[
        ["brier_rank", "log_loss_rank", "ece_rank"]
    ].mean(axis=1)
    best_calibrated = calibration_ranked.sort_values("calibration_rank").iloc[0]
    best_accuracy = rf_cv.sort_values("accuracy", ascending=False).iloc[0]
    best_selective = rf_selective[rf_selective["coverage"] == 0.25].sort_values("accuracy", ascending=False).iloc[0]

    uncertainty_gap = rf_cv.assign(
        uncertainty_gap=lambda df: df["mean_uncertainty_incorrect"] - df["mean_uncertainty_correct"]
    )
    strongest_gap = uncertainty_gap.sort_values("uncertainty_gap", ascending=False).iloc[0]

    full_enhanced_row = rf_cv[rf_cv["feature_set"] == "full_enhanced"].iloc[0]
    reduced_hybrid_row = rf_cv[rf_cv["feature_set"] == "reduced_hybrid"].iloc[0]

    cross_shift = rf_cross.assign(
        confidence_gap=lambda df: df["mean_confidence_incorrect"] - (1.0 - df["mean_uncertainty_incorrect"])
    )
    most_overconfident = rf_cross.sort_values("mean_confidence_incorrect", ascending=False).iloc[0]

    lines = [
        "Uncertainty and Reliability Summary",
        "",
        "Top findings:",
        f"  - Best overall calibrated Random Forest feature set: {best_calibrated['feature_set']} (brier={best_calibrated['brier_score']:.4f}, ece={best_calibrated['ece']:.4f}, log_loss={best_calibrated['log_loss']:.4f})",
        f"  - Highest Random Forest cross-validated accuracy: {best_accuracy['feature_set']} (accuracy={best_accuracy['accuracy']:.4f}, roc_auc={best_accuracy['roc_auc']:.4f})",
        f"  - Largest uncertainty gap between wrong and correct Random Forest predictions: {strongest_gap['feature_set']} (gap={strongest_gap['uncertainty_gap']:.4f})",
        f"  - Best Random Forest selective accuracy at 25% coverage: {best_selective['feature_set']} (accuracy={best_selective['accuracy']:.4f}, mean_confidence={best_selective['mean_confidence']:.4f})",
        f"  - Most overconfident cross-environment Random Forest feature set: {most_overconfident['feature_set']} (incorrect_confidence={most_overconfident['mean_confidence_incorrect']:.4f}, cross_env_accuracy={most_overconfident['accuracy']:.4f})",
        "",
        "Random Forest reliability by feature set (stratified CV):",
    ]
    for _, row in rf_cv.sort_values("accuracy", ascending=False).iterrows():
        lines.append(f"{row['feature_set']}")
        lines.append(f"  accuracy: {row['accuracy']:.4f}")
        lines.append(f"  roc_auc: {row['roc_auc']:.4f}")
        lines.append(f"  brier_score: {row['brier_score']:.4f}")
        lines.append(f"  log_loss: {row['log_loss']:.4f}")
        lines.append(f"  ece: {row['ece']:.4f}")
        lines.append(f"  mean_uncertainty_correct: {row['mean_uncertainty_correct']:.4f}")
        lines.append(f"  mean_uncertainty_incorrect: {row['mean_uncertainty_incorrect']:.4f}")
        lines.append("")

    lines.extend(
        [
            "Cross-environment Random Forest reliability:",
        ]
    )
    for _, row in rf_cross.sort_values("accuracy", ascending=False).iterrows():
        lines.append(f"{row['feature_set']}")
        lines.append(f"  accuracy: {row['accuracy']:.4f}")
        lines.append(f"  brier_score: {row['brier_score']:.4f}")
        lines.append(f"  log_loss: {row['log_loss']:.4f}")
        lines.append(f"  mean_uncertainty: {row['mean_uncertainty']:.4f}")
        lines.append(f"  mean_uncertainty_correct: {row['mean_uncertainty_correct']:.4f}")
        lines.append(f"  mean_uncertainty_incorrect: {row['mean_uncertainty_incorrect']:.4f}")
        lines.append(f"  mean_confidence_incorrect: {row['mean_confidence_incorrect']:.4f}")
        lines.append("")

    lines.extend(
        [
            "Plain-language interpretation:",
            f"  - Uncertainty helps most when wrong predictions are noticeably less confident than correct ones. In this run, the strongest separation was for {strongest_gap['feature_set']}.",
            f"  - The model is easiest to trust when both calibration and selective prediction improve together. Here that points most strongly to {best_calibrated['feature_set']} for calibration and {best_selective['feature_set']} when keeping only the most confident predictions.",
            f"  - Reduced hybrid versus full enhanced: reduced_hybrid accuracy={reduced_hybrid_row['accuracy']:.4f}, brier={reduced_hybrid_row['brier_score']:.4f}; full_enhanced accuracy={full_enhanced_row['accuracy']:.4f}, brier={full_enhanced_row['brier_score']:.4f}.",
            f"  - Cross-environment failure should ideally come with higher uncertainty. Where incorrect cross-environment predictions still have high confidence, that is a sign of overconfidence under distribution shift. The clearest case here was {most_overconfident['feature_set']}.",
            "",
            "Charts:",
        ]
    )
    for chart_path in chart_paths:
        lines.append(f"  - {project_relative(chart_path)}")
        lines.append(f"![{Path(chart_path).stem}]({project_relative(chart_path)})")
        lines.append("")

    SUMMARY_TXT.write_text("\n".join(lines).rstrip() + "\n")

    print(f"Wrote uncertainty predictions CSV to {PREDICTIONS_CSV}")
    print(f"Wrote uncertainty metrics CSV to {METRICS_CSV}")
    print(f"Wrote selective prediction CSV to {SELECTIVE_CSV}")
    print(f"Wrote cross-environment uncertainty CSV to {CROSS_ENV_CSV}")
    print(f"Wrote uncertainty summary to {SUMMARY_TXT}")
    for chart_path in chart_paths:
        print(f"Wrote uncertainty chart to {chart_path}")


if __name__ == "__main__":
    main()
