# Tables And Figures Plan

## Proposed Figures

| Figure | Source File | What It Should Show | Status |
| --- | --- | --- | --- |
| Figure 1. Project workflow / architecture | `figures/paper/figure_1_research_workflow.png`; optional supporting UML in `docs/uml/project_architecture.mmd` | End-to-end PolyDegradeML workflow from descriptor dataset through curation, feature engineering, model baselines, validation, calibration/uncertainty, and reliability findings. | Exists. May need journal-style redesign before submission. |
| Figure 2. Baseline model comparison | Current source: `reports/baseline_modeling.md`, `results/metadata/baseline_model_metrics.json`; possible visual source: `presentation/assets/model_progression_comparison.png` | Logistic Regression versus Random Forest versus FNN versus descriptor-graph prototype on baseline metrics. | Partially exists. A clean publication figure should be generated from baseline and neural/prototype outputs. |
| Figure 3. Feature engineering or feature importance | `figures/feature_engineering/feature_set_comparison.png`; `figures/feature_importance/top_feature_importance.png`; curated copy `figures/paper/figure_2_feature_importance.png` | Either feature-set performance comparison or top-ranked features used in final model selection. | Exists. Choose one primary Figure 3 and move the other to supplement. |
| Figure 4. Calibration curve / uncertainty analysis | `figures/uncertainty_calibration/calibration_curve.png`; curated copy `figures/paper/figure_3_calibration_curve.png`; optional `figures/uncertainty_calibration/uncertainty_correct_vs_incorrect.png` | Calibration behavior and uncertainty separation supporting reliability-aware evaluation. | Exists. May need caption and panel labeling. |
| Figure 5. Reliability scoreboard / final model selection | `figures/model_selection/overall_scoreboard.png`; curated copy `figures/paper/figure_4_reliability_scoreboard.png`; optional `figures/model_selection/metric_heatmap.png` | Final reliability ranking showing why `top_ranked | random_forest_classifier` was selected. | Exists. Use as final results figure. |

## Proposed Tables

| Table | Source File | What It Should Show | Status |
| --- | --- | --- | --- |
| Table 1. Weekly case chronology and evidence map | `source_materials/reports/Week_01_Applied_Work.docx` through `source_materials/reports/Week_13_Applied_Work.docx`; manuscript Section 6.1 | Show how the project developed from mechanistic framing to dataset schema, baseline modeling, reliability analysis, and final model selection. | Drafted in manuscript narrative. Convert to concise publication table if venue allows. |
| Table 2. Dataset summary | `datasets/qsar_biodegradation_descriptor_benchmark/metadata/qsar_biodegradation_metadata.json`; `reports/dataset_curation.md` | Dataset name, rows, descriptors, target labels, missing values, representation limitations. | Needs manuscript table formatting. Data exists. |
| Table 3. Model comparison | `results/metadata/baseline_model_metrics.json`; `reports/neural_network_baseline_summary.txt`; `reports/descriptor_graph_prototype_summary.txt` | Initial train/test comparison of Logistic Regression, Random Forest, FNN, and descriptor-graph prototype. | Needs manuscript table formatting. Data exists. |
| Table 4. Cross-validation metrics | `results/tables/stratified_cv_model_results.csv`; `reports/stratified_cross_validation_summary.txt` | Mean 5-fold stratified CV metrics with and without SMOTE. | Needs aggregated publication table. Data exists. |
| Table 5. Final reliability scoreboard | `results/tables/model_reliability_scoreboard.csv`; `reports/model_reliability_report.md` | Candidate, rank, reliability score, CV accuracy, Brier score, ECE, selective accuracy, cross-environment accuracy, incorrect confidence. | Exists in report, needs publication formatting. |

## Supplementary Tables And Figures

| Supplement | Source File | Purpose | Status |
| --- | --- | --- | --- |
| Supplementary Figure S1. Cross-environment performance | `figures/cross_environment/mean_scores.png`; `figures/cross_environment/rb_recall_heatmap.png` | Show descriptor-space distribution-shift behavior. | Exists. |
| Supplementary Figure S2. Selective prediction | `figures/uncertainty_calibration/selective_accuracy.png`; `figures/model_selection/selective_top_candidates.png` | Show confidence-filtered prediction behavior. | Exists. |
| Supplementary Table S1. Feature rankings | `results/tables/feature_importance_rankings.csv` | Full ranked descriptor/proxy feature list. | Exists. |
| Supplementary Table S2. Cross-environment uncertainty | `results/tables/cross_environment_uncertainty_metrics.csv` | Confidence and uncertainty under shift. | Exists. |
| Supplementary Table S3. Source report provenance | `source_materials/reports/` | Map weekly applied work and outside readings to manuscript sections. | Needs literature matrix. |
| Supplementary Table S4. Weekly applied work extraction log | `source_materials/reports/Week_*_Applied_Work.docx`; `paper/evidence_mapped_outline.md` | Record the specific weekly claim, result, or methodological decision used in the paper. | Recommended before submission for traceability. |

## Figure Generation Needs

- Generate a clean publication-quality baseline comparison figure from the baseline, FNN, and descriptor-graph outputs.
- Decide whether Figure 3 should emphasize feature importance or feature-set performance.
- Add figure captions in manuscript style.
- Verify image resolution requirements for the target venue.
- Consider exporting final figures as both PNG and PDF/SVG if the publication venue prefers vector graphics.
