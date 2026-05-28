# Evidence-Mapped Manuscript Outline

## Working Manuscript Focus

PolyDegradeML is framed as a reliability-aware machine learning case study for descriptor-based biodegradation prediction. The contribution is not the creation of a new biodegradation dataset or a new model architecture. The contribution is a reproducible evaluation workflow showing that model selection changes when accuracy is considered alongside calibration, uncertainty, selective prediction, feature-set design, and cross-environment generalization.

## Central Research Question

Can chemistry-informed feature engineering and reliability-focused evaluation improve the trustworthiness of machine learning models for biodegradation prediction?

## Section Map

| Manuscript Section | Evidence Sources | Notes |
| --- | --- | --- |
| Title options | `README.md`, `paper/outline.md`, `reports/main_findings.md` | Emphasize reliability-aware descriptor-based biodegradation prediction. |
| Abstract | `reports/main_findings.md`, `reports/model_reliability_report.md`, `results/tables/model_reliability_scoreboard.csv` | Numerical claims should come only from generated reports/tables. |
| Introduction | `source_materials/reports/Week_01_Applied_Work.docx`, `Week_02_Applied_Work.docx`, outside reading reports from Weeks 2-5 | Environmental degradation motivation and polymer informatics framing. |
| Related Work | `source_materials/reports/Week_*_Outside_Reading_Report_*.docx` | Use only references present in source reports unless additional sources are later added. |
| Dataset and Curation | `reports/dataset_curation.md`, `datasets/qsar_biodegradation_descriptor_benchmark/metadata/qsar_biodegradation_metadata.json` | Dataset has 1055 samples, 41 descriptors, no missing values, and binary RB/NRB target. |
| Baseline Models | `reports/baseline_modeling.md`, `results/metadata/baseline_model_metrics.json` | Logistic Regression and Random Forest train/test baselines. |
| Neural Baseline | `reports/neural_network_baseline_summary.txt`, `source_materials/reports/Week_06_Applied_Work.docx` | FNN is a nonlinear tabular baseline and complexity check. |
| Descriptor-Graph Prototype | `reports/descriptor_graph_prototype_summary.txt`, `source_materials/reports/Week_07_Applied_Work.docx` | Exploratory only because the dataset lacks true molecular graph inputs. |
| Stratified CV and SMOTE | `reports/stratified_cross_validation_summary.txt`, `results/tables/stratified_cv_model_results.csv`, `source_materials/reports/Week_09_Applied_Work.docx` | SMOTE applied only to training folds. |
| Feature Engineering | `reports/feature_engineering_summary.txt`, `results/metadata/feature_engineering_sets.json`, `figures/feature_engineering/feature_set_comparison.png` | Proxy features are not true quantum descriptors. |
| Feature Selection | `reports/feature_importance_selection_summary.txt`, `results/tables/feature_importance_rankings.csv`, `results/metadata/feature_selection_sets.json`, `figures/feature_importance/top_feature_importance.png` | Top-ranked feature set is central to final recommendation. |
| Cross-Environment Validation | `reports/cross_environment_validation.md`, `results/tables/cross_environment_validation_summary.csv`, `figures/cross_environment/mean_scores.png` | Proxy environments are derived by stratified k-means on descriptor vectors. |
| Calibration and Uncertainty | `reports/uncertainty_reliability_summary.txt`, `results/tables/uncertainty_reliability_metrics.csv`, `figures/uncertainty_calibration/calibration_curve.png` | Include Brier score, log loss, ECE, uncertainty separation, and confidence on incorrect predictions. |
| Quantum methods rationale | Author-provided quantum computing framing; future citation needed | Include only as conceptual future-work rationale. Do not claim quantum ML was implemented or that quantum advantage was demonstrated. |
| Final Reliability Scoreboard | `reports/model_reliability_report.md`, `results/tables/model_reliability_scoreboard.csv`, `figures/model_selection/overall_scoreboard.png` | Final model: `top_ranked | random_forest_classifier`, reliability score 0.8860. |
| Limitations | `reports/dataset_curation.md`, `datasets/qsar_biodegradation_descriptor_benchmark/metadata/qsar_biodegradation_metadata.json`, `README.md` | Descriptor-only, binary classification, no polymer identity, no SMILES/BigSMILES, limited external validation. |
| Future Work | `paper/outline.md`, source reports on BigSMILES, polymer informatics, GNNs, quantum descriptors, uncertainty | Mark unimplemented future directions clearly. |

## Weekly Applied Work Integration

The manuscript now includes a long-form chronology in Section 6.1 so that every Applied Work report is represented as part of the research case:

| Week | Manuscript Use |
| --- | --- |
| Week 1 | Mechanistic framing of hydrolysis, photo-oxidation, and biodegradation; used to narrow the claim away from universal degradation simulation. |
| Week 2 | Environmental and measurement variables; used to justify limitations around missing exposure metadata. |
| Week 3 | ML framework decision; used to justify descriptor-based QSAR/QSPR as the current scope. |
| Week 4 | Dataset schema; used to define future data requirements and reproducibility limits. |
| Week 5 | Baseline Logistic Regression and Random Forest results; used to establish predictive signal. |
| Week 6 | FNN baseline; used to test whether nonlinear tabular complexity improved performance. |
| Week 7 | Descriptor-graph prototype; used to show the limits of graph-style modeling without true molecular graph inputs. |
| Week 8 | Cross-environment validation; used as the turning point from accuracy comparison to reliability analysis. |
| Week 9 | SMOTE and stratified cross-validation; used to discuss class-level behavior and minority-class recall. |
| Week 10 | Chemistry-aware proxy features; used to evaluate whether engineered chemistry summaries improved model behavior. |
| Week 11 | Feature importance and reduced feature sets; used to explain why the top-ranked set mattered for final selection. |
| Week 12 | Calibration, uncertainty, and selective prediction; used to define the reliability-centered contribution. |
| Week 13 | Final reliability scoreboard; used to support the selected final candidate and conclusion. |

## Evidence Rules For Drafting

- Do not claim polymer-specific structural modeling from the current dataset; the dataset lacks polymer identities, SMILES, and BigSMILES.
- Do not claim degradation-rate regression; the target is binary class membership.
- Treat proxy chemistry features as engineered summaries, not measured quantum chemical descriptors.
- Treat the descriptor-graph prototype as exploratory, not a true molecular graph neural network.
- Use `[NEEDS DATA]`, `[NEEDS CITATION]`, `[VERIFY RESULT]`, or `[ASK AUTHOR]` wherever the evidence is incomplete.
