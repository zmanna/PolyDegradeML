from __future__ import annotations

from pathlib import Path

from biodegradation_ml_framework.reliability_scoreboard import (
    build_model_reliability_report_markdown,
    build_model_reliability_scoreboard,
    build_model_reliability_summary_text,
    write_model_reliability_charts,
)


PROJECT_ROOT = Path(__file__).resolve().parents[1]
REPORTS_DIR = PROJECT_ROOT / "reports"
FIGURES_DIR = PROJECT_ROOT / "figures" / "model_selection"
RESULTS_TABLES_DIR = PROJECT_ROOT / "results" / "tables"
RESULTS_PREDICTIONS_DIR = PROJECT_ROOT / "results" / "predictions"
SCOREBOARD_CSV = RESULTS_TABLES_DIR / "model_reliability_scoreboard.csv"
PREDICTIONS_CSV = RESULTS_PREDICTIONS_DIR / "final_model_predictions.csv"
METRICS_CSV = RESULTS_TABLES_DIR / "final_uncertainty_metrics.csv"
SELECTIVE_CSV = RESULTS_PREDICTIONS_DIR / "final_selective_prediction_results.csv"
REPORT_MD = REPORTS_DIR / "model_reliability_report.md"
SUMMARY_TXT = REPORTS_DIR / "model_reliability_summary.txt"


def main() -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    FIGURES_DIR.mkdir(parents=True, exist_ok=True)
    RESULTS_TABLES_DIR.mkdir(parents=True, exist_ok=True)
    RESULTS_PREDICTIONS_DIR.mkdir(parents=True, exist_ok=True)

    predictions, metrics, selective, scoreboard = build_model_reliability_scoreboard()
    chart_paths = write_model_reliability_charts(scoreboard, selective, FIGURES_DIR)
    report_md = build_model_reliability_report_markdown(scoreboard)
    summary_txt = build_model_reliability_summary_text(scoreboard)

    predictions.to_csv(PREDICTIONS_CSV, index=False)
    metrics.to_csv(METRICS_CSV, index=False)
    selective.to_csv(SELECTIVE_CSV, index=False)
    scoreboard.to_csv(SCOREBOARD_CSV, index=False)
    REPORT_MD.write_text(report_md)
    SUMMARY_TXT.write_text(summary_txt)

    print(f"Wrote final predictions CSV to {PREDICTIONS_CSV}")
    print(f"Wrote final uncertainty metrics CSV to {METRICS_CSV}")
    print(f"Wrote final selective prediction CSV to {SELECTIVE_CSV}")
    print(f"Wrote model reliability scoreboard CSV to {SCOREBOARD_CSV}")
    print(f"Wrote model reliability markdown report to {REPORT_MD}")
    print(f"Wrote model reliability summary to {SUMMARY_TXT}")
    for chart_path in chart_paths:
        print(f"Wrote model selection chart to {chart_path}")


if __name__ == "__main__":
    main()
