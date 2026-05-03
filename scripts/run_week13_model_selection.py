from __future__ import annotations

from pathlib import Path

from firstdataset.week13_model_selection import (
    build_week13_report_markdown,
    build_week13_scoreboard,
    build_week13_summary_text,
    write_week13_charts,
)


PROJECT_ROOT = Path(__file__).resolve().parents[1]
REPORTS_DIR = PROJECT_ROOT / "reports"
CHARTS_DIR = REPORTS_DIR / "week13_charts"
SCOREBOARD_CSV = REPORTS_DIR / "week13_model_reliability_scoreboard.csv"
PREDICTIONS_CSV = REPORTS_DIR / "week13_predictions_reused.csv"
METRICS_CSV = REPORTS_DIR / "week13_uncertainty_metrics_reused.csv"
SELECTIVE_CSV = REPORTS_DIR / "week13_selective_prediction_reused.csv"
REPORT_MD = REPORTS_DIR / "week13_model_selection_report.md"
SUMMARY_TXT = REPORTS_DIR / "week13_model_selection_summary.txt"


def main() -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    predictions, metrics, selective, scoreboard = build_week13_scoreboard()
    chart_paths = write_week13_charts(scoreboard, selective, CHARTS_DIR)
    report_md = build_week13_report_markdown(scoreboard)
    summary_txt = build_week13_summary_text(scoreboard)

    predictions.to_csv(PREDICTIONS_CSV, index=False)
    metrics.to_csv(METRICS_CSV, index=False)
    selective.to_csv(SELECTIVE_CSV, index=False)
    scoreboard.to_csv(SCOREBOARD_CSV, index=False)
    REPORT_MD.write_text(report_md)
    SUMMARY_TXT.write_text(summary_txt)

    print(f"Wrote Week 13 predictions CSV to {PREDICTIONS_CSV}")
    print(f"Wrote Week 13 metrics CSV to {METRICS_CSV}")
    print(f"Wrote Week 13 selective CSV to {SELECTIVE_CSV}")
    print(f"Wrote Week 13 scoreboard CSV to {SCOREBOARD_CSV}")
    print(f"Wrote Week 13 markdown report to {REPORT_MD}")
    print(f"Wrote Week 13 summary to {SUMMARY_TXT}")
    for chart_path in chart_paths:
        print(f"Wrote Week 13 chart to {chart_path}")


if __name__ == "__main__":
    main()
