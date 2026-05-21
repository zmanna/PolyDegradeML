from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

from .uncertainty import SELECTIVE_COVERAGE_LEVELS, run_uncertainty


def _candidate_label(feature_set: str, model_name: str) -> str:
    return f"{feature_set} | {model_name}"


def _rank_desc(series: pd.Series) -> pd.Series:
    return series.rank(method="average", ascending=False)


def _rank_asc(series: pd.Series) -> pd.Series:
    return series.rank(method="average", ascending=True)


def _scale_positive(series: pd.Series) -> pd.Series:
    values = series.astype(float)
    min_value = float(values.min())
    max_value = float(values.max())
    if np.isclose(max_value, min_value):
        return pd.Series(np.ones(len(values)), index=series.index, dtype=float)
    return (values - min_value) / (max_value - min_value)


def _scale_negative(series: pd.Series) -> pd.Series:
    return 1.0 - _scale_positive(series)


def build_model_reliability_scoreboard(
    *,
    random_state: int = 42,
    model_names: tuple[str, ...] = (
        "random_forest_classifier",
        "logistic_regression",
        "feedforward_neural_network",
    ),
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    predictions, metrics, selective, _ = run_uncertainty(
        random_state=random_state,
        model_names=model_names,
    )

    cv_metrics = metrics[metrics["evaluation_type"] == "stratified_cv"].copy()
    cross_metrics = metrics[metrics["evaluation_type"] == "cross_environment"].copy()
    cv_metrics = cv_metrics.rename(columns=lambda name: f"cv_{name}" if name not in {"feature_set", "model_name", "evaluation_type"} else name)
    cross_metrics = cross_metrics.rename(columns=lambda name: f"cross_{name}" if name not in {"feature_set", "model_name", "evaluation_type"} else name)

    selective_focus = selective[selective["coverage"].isin({0.5, 0.25})].copy()
    selective_pivot = selective_focus.pivot_table(
        index=["feature_set", "model_name"],
        columns="coverage",
        values="accuracy",
    ).reset_index()
    selective_pivot = selective_pivot.rename(
        columns={
            0.5: "selective_accuracy_50",
            0.25: "selective_accuracy_25",
        }
    )

    scoreboard = cv_metrics.merge(
        cross_metrics.drop(columns=["evaluation_type"]),
        on=["feature_set", "model_name"],
        how="inner",
    ).merge(
        selective_pivot,
        on=["feature_set", "model_name"],
        how="left",
    )

    scoreboard["candidate"] = scoreboard.apply(
        lambda row: _candidate_label(str(row["feature_set"]), str(row["model_name"])),
        axis=1,
    )
    scoreboard["cv_uncertainty_gap"] = scoreboard["cv_mean_uncertainty_incorrect"] - scoreboard["cv_mean_uncertainty_correct"]
    scoreboard["cross_uncertainty_gap"] = scoreboard["cross_mean_uncertainty_incorrect"] - scoreboard["cross_mean_uncertainty_correct"]
    scoreboard["accuracy_drop"] = scoreboard["cv_accuracy"] - scoreboard["cross_accuracy"]
    scoreboard["brier_increase"] = scoreboard["cross_brier_score"] - scoreboard["cv_brier_score"]
    scoreboard["overconfidence_shift"] = scoreboard["cross_mean_confidence_incorrect"] - (1.0 - scoreboard["cross_mean_uncertainty_incorrect"])

    scoreboard["score_accuracy"] = _scale_positive(scoreboard["cv_accuracy"])
    scoreboard["score_roc_auc"] = _scale_positive(scoreboard["cv_roc_auc"])
    scoreboard["score_calibration"] = (
        _scale_negative(scoreboard["cv_brier_score"])
        + _scale_negative(scoreboard["cv_log_loss"])
        + _scale_negative(scoreboard["cv_ece"])
    ) / 3.0
    scoreboard["score_uncertainty"] = _scale_positive(scoreboard["cv_uncertainty_gap"])
    scoreboard["score_selective"] = _scale_positive(scoreboard["selective_accuracy_25"])
    scoreboard["score_cross_accuracy"] = _scale_positive(scoreboard["cross_accuracy"])
    scoreboard["score_cross_calibration"] = (
        _scale_negative(scoreboard["cross_brier_score"])
        + _scale_negative(scoreboard["cross_log_loss"])
    ) / 2.0
    scoreboard["score_cross_uncertainty"] = _scale_positive(scoreboard["cross_uncertainty_gap"])
    scoreboard["score_cross_overconfidence"] = _scale_negative(scoreboard["cross_mean_confidence_incorrect"])

    scoreboard["overall_reliability_score"] = (
        0.18 * scoreboard["score_accuracy"]
        + 0.10 * scoreboard["score_roc_auc"]
        + 0.18 * scoreboard["score_calibration"]
        + 0.10 * scoreboard["score_uncertainty"]
        + 0.10 * scoreboard["score_selective"]
        + 0.18 * scoreboard["score_cross_accuracy"]
        + 0.08 * scoreboard["score_cross_calibration"]
        + 0.04 * scoreboard["score_cross_uncertainty"]
        + 0.04 * scoreboard["score_cross_overconfidence"]
    )

    scoreboard["overall_rank"] = _rank_desc(scoreboard["overall_reliability_score"])
    scoreboard["cv_accuracy_rank"] = _rank_desc(scoreboard["cv_accuracy"])
    scoreboard["cv_calibration_rank"] = (
        _rank_asc(scoreboard["cv_brier_score"])
        + _rank_asc(scoreboard["cv_log_loss"])
        + _rank_asc(scoreboard["cv_ece"])
    ) / 3.0
    scoreboard["cross_accuracy_rank"] = _rank_desc(scoreboard["cross_accuracy"])
    scoreboard["cross_calibration_rank"] = (
        _rank_asc(scoreboard["cross_brier_score"])
        + _rank_asc(scoreboard["cross_log_loss"])
    ) / 2.0
    scoreboard = scoreboard.sort_values(["overall_rank", "overall_reliability_score"], ascending=[True, False]).reset_index(drop=True)

    return predictions, metrics, selective, scoreboard


def build_model_reliability_report_markdown(scoreboard: pd.DataFrame) -> str:
    top_row = scoreboard.iloc[0]
    calibration_best = scoreboard.sort_values("cv_calibration_rank").iloc[0]
    cross_best = scoreboard.sort_values("cross_accuracy", ascending=False).iloc[0]
    uncertainty_best = scoreboard.sort_values("cv_uncertainty_gap", ascending=False).iloc[0]
    selective_best = scoreboard.sort_values("selective_accuracy_25", ascending=False).iloc[0]
    most_overconfident = scoreboard.sort_values("cross_mean_confidence_incorrect", ascending=False).iloc[0]

    lines = [
        "# Model Reliability Scoreboard Report",
        "",
        "## Objective",
        "",
        "The final model selection step focuses on reliability-centered model selection through reliability analysis rather than raw performance alone. The goal is to compare model and feature-set combinations on accuracy, calibration, uncertainty behavior, selective prediction, and cross-environment robustness in order to recommend a final model that is not only accurate, but also trustworthy.",
        "",
        "## Approach",
        "",
        "The reliability pipeline reuses the selected feature sets and uncertainty analysis outputs. Each candidate combines one model and one feature set. Candidates are evaluated under both stratified cross-validation and cross-environment validation. The comparison includes accuracy, ROC-AUC, Brier score, log loss, expected calibration error, uncertainty separation between correct and incorrect predictions, selective prediction performance at reduced coverage, and cross-environment failure behavior.",
        "",
        "## Headline Findings",
        "",
        f"- Best overall candidate: `{top_row['candidate']}` with reliability score `{top_row['overall_reliability_score']:.4f}`.",
        f"- Strongest standard accuracy: `{scoreboard.sort_values('cv_accuracy', ascending=False).iloc[0]['candidate']}` at `{scoreboard['cv_accuracy'].max():.4f}`.",
        f"- Best calibration in-distribution: `{calibration_best['candidate']}` with Brier `{calibration_best['cv_brier_score']:.4f}` and ECE `{calibration_best['cv_ece']:.4f}`.",
        f"- Best cross-environment accuracy: `{cross_best['candidate']}` at `{cross_best['cross_accuracy']:.4f}`.",
        f"- Strongest uncertainty separation: `{uncertainty_best['candidate']}` with uncertainty gap `{uncertainty_best['cv_uncertainty_gap']:.4f}`.",
        f"- Best selective prediction at 25% coverage: `{selective_best['candidate']}` at `{selective_best['selective_accuracy_25']:.4f}`.",
        f"- Most overconfident under cross-environment shift: `{most_overconfident['candidate']}` with incorrect confidence `{most_overconfident['cross_mean_confidence_incorrect']:.4f}`.",
        "- Feedforward neural network finding: the dense neural baseline did not dominate the classical models by raw accuracy, but it remained informative as a nonlinear comparison point. In the reliability scoreboard, its strongest cases appear under selected feature sets, showing that model complexity only helps when paired with a suitable representation and reliability checks.",
        "",
        "## Final Recommendation",
        "",
        f"The recommended final model is `{top_row['candidate']}`. It provides the best overall balance between prediction quality and trustworthiness when the evaluation includes both in-distribution and cross-environment behavior. This recommendation is based on a composite reliability score rather than accuracy alone, which better reflects the project goal of selecting a model that is dependable as well as predictive.",
        "",
        "## Interpretation",
        "",
        "This analysis confirms that the strongest final model is not necessarily the one with the single highest accuracy on a standard split. A stronger final choice is the candidate that stays competitive on accuracy while also showing better calibration, better uncertainty behavior on wrong predictions, and less severe collapse under distribution shift. This allows the project to move from simple model comparison toward a more defensible final-model justification.",
        "",
        "The feedforward neural network was included to test whether dense nonlinear modeling could extract additional signal from tabular descriptor features. Its mixed performance is an important negative result: neural-network complexity alone did not solve the biodegradation prediction problem. The result supports a more careful interpretation that representation quality, feature selection, calibration, and distribution-shift behavior matter as much as model class.",
        "",
        "## Key Figures",
        "",
        "![Overall reliability scoreboard](../figures/model_selection/overall_scoreboard.png)",
        "",
        "![Accuracy calibration tradeoff](../figures/model_selection/accuracy_calibration_tradeoff.png)",
        "",
        "![Reliability component heatmap](../figures/model_selection/metric_heatmap.png)",
        "",
        "![Selective prediction top candidates](../figures/model_selection/selective_top_candidates.png)",
        "",
        "## Candidate Table",
        "",
        "| Rank | Candidate | Reliability Score | CV Accuracy | CV Brier | CV ECE | Selective Acc. 25% | Cross Acc. | Cross Brier | Incorrect Cross Confidence |",
        "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ]
    for _, row in scoreboard.iterrows():
        lines.append(
            f"| {int(row['overall_rank'])} | `{row['candidate']}` | {row['overall_reliability_score']:.4f} | {row['cv_accuracy']:.4f} | {row['cv_brier_score']:.4f} | {row['cv_ece']:.4f} | {row['selective_accuracy_25']:.4f} | {row['cross_accuracy']:.4f} | {row['cross_brier_score']:.4f} | {row['cross_mean_confidence_incorrect']:.4f} |"
        )
    return "\n".join(lines) + "\n"


def build_model_reliability_summary_text(scoreboard: pd.DataFrame) -> str:
    top_three = scoreboard.head(3)
    lines = [
        "Model Reliability Scoreboard Summary",
        "",
        "Top 3 candidates:",
    ]
    for _, row in top_three.iterrows():
        lines.append(f"{int(row['overall_rank'])}. {row['candidate']}")
        lines.append(f"   reliability_score: {row['overall_reliability_score']:.4f}")
        lines.append(f"   cv_accuracy: {row['cv_accuracy']:.4f}")
        lines.append(f"   cv_brier_score: {row['cv_brier_score']:.4f}")
        lines.append(f"   selective_accuracy_25: {row['selective_accuracy_25']:.4f}")
        lines.append(f"   cross_accuracy: {row['cross_accuracy']:.4f}")
        lines.append(f"   cross_incorrect_confidence: {row['cross_mean_confidence_incorrect']:.4f}")
        lines.append("")
    best = scoreboard.iloc[0]
    worst_cross = scoreboard.sort_values("cross_accuracy").iloc[0]
    lines.extend(
        [
            "Final recommendation:",
            f"  {best['candidate']}",
            f"  reliability_score: {best['overall_reliability_score']:.4f}",
            "",
            "Key caution:",
            f"  weakest cross-environment candidate: {worst_cross['candidate']} (cross_accuracy={worst_cross['cross_accuracy']:.4f})",
        ]
    )
    return "\n".join(lines) + "\n"


def write_model_reliability_charts(
    scoreboard: pd.DataFrame,
    selective: pd.DataFrame,
    output_dir: str | Path,
) -> list[Path]:
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    chart_paths: list[Path] = []

    scoreboard_sorted = scoreboard.sort_values("overall_reliability_score", ascending=True)
    fig, ax = plt.subplots(figsize=(12, 7))
    ax.barh(scoreboard_sorted["candidate"], scoreboard_sorted["overall_reliability_score"], color="#4C78A8")
    ax.set_title("Overall Reliability Score by Candidate")
    ax.set_xlabel("Composite reliability score")
    fig.tight_layout()
    path_1 = output_path / "overall_scoreboard.png"
    fig.savefig(path_1, dpi=200)
    plt.close(fig)
    chart_paths.append(path_1)

    fig, axes = plt.subplots(1, 2, figsize=(14, 6))
    axes[0].scatter(scoreboard["cv_brier_score"], scoreboard["cv_accuracy"], color="#59A14F")
    axes[0].set_title("CV Accuracy vs Calibration")
    axes[0].set_xlabel("Brier score (lower is better)")
    axes[0].set_ylabel("Accuracy")
    for _, row in scoreboard.iterrows():
        axes[0].annotate(row["candidate"], (row["cv_brier_score"], row["cv_accuracy"]), fontsize=7, alpha=0.85)

    axes[1].scatter(scoreboard["cross_brier_score"], scoreboard["cross_accuracy"], color="#E15759")
    axes[1].set_title("Cross-Environment Accuracy vs Calibration")
    axes[1].set_xlabel("Brier score (lower is better)")
    axes[1].set_ylabel("Accuracy")
    for _, row in scoreboard.iterrows():
        axes[1].annotate(row["candidate"], (row["cross_brier_score"], row["cross_accuracy"]), fontsize=7, alpha=0.85)

    fig.tight_layout()
    path_2 = output_path / "accuracy_calibration_tradeoff.png"
    fig.savefig(path_2, dpi=200)
    plt.close(fig)
    chart_paths.append(path_2)

    heatmap_columns = [
        "score_accuracy",
        "score_calibration",
        "score_uncertainty",
        "score_selective",
        "score_cross_accuracy",
        "score_cross_calibration",
        "score_cross_overconfidence",
    ]
    heatmap = scoreboard.set_index("candidate")[heatmap_columns]
    fig, ax = plt.subplots(figsize=(12, 7))
    image = ax.imshow(heatmap.values, cmap="YlGnBu", aspect="auto", vmin=0.0, vmax=1.0)
    ax.set_title("Normalized Reliability Components")
    ax.set_xticks(range(len(heatmap.columns)))
    ax.set_xticklabels(
        [
            "CV Accuracy",
            "CV Calibration",
            "Uncertainty Gap",
            "Selective",
            "Cross Accuracy",
            "Cross Calibration",
            "Cross Overconfidence",
        ],
        rotation=25,
        ha="right",
    )
    ax.set_yticks(range(len(heatmap.index)))
    ax.set_yticklabels(heatmap.index)
    fig.colorbar(image, ax=ax, label="Normalized score")
    fig.tight_layout()
    path_3 = output_path / "metric_heatmap.png"
    fig.savefig(path_3, dpi=200)
    plt.close(fig)
    chart_paths.append(path_3)

    top_candidates = scoreboard.head(4)[["feature_set", "model_name", "candidate"]]
    selective_focus = selective[
        selective.apply(
            lambda row: any(
                (row["feature_set"] == candidate["feature_set"]) and (row["model_name"] == candidate["model_name"])
                for _, candidate in top_candidates.iterrows()
            ),
            axis=1,
        )
    ].copy()
    selective_focus = selective_focus[selective_focus["evaluation_type"] == "stratified_cv"]

    fig, ax = plt.subplots(figsize=(10, 6))
    for _, candidate in top_candidates.iterrows():
        frame = selective_focus[
            (selective_focus["feature_set"] == candidate["feature_set"])
            & (selective_focus["model_name"] == candidate["model_name"])
        ].sort_values("coverage")
        ax.plot(frame["coverage"], frame["accuracy"], marker="o", label=candidate["candidate"])
    ax.set_title("Selective Prediction for Top Candidates")
    ax.set_xlabel("Coverage kept")
    ax.set_ylabel("Accuracy")
    ax.set_ylim(0.0, 1.0)
    ax.legend(loc="lower left", fontsize=8)
    fig.tight_layout()
    path_4 = output_path / "selective_top_candidates.png"
    fig.savefig(path_4, dpi=200)
    plt.close(fig)
    chart_paths.append(path_4)

    return chart_paths
