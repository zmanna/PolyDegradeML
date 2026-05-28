# PolyDegradeML Manuscript Draft

## 1. Title Options

1. Reliability-Aware Machine Learning for Descriptor-Based Biodegradation Prediction
2. Reliability-Centered Evaluation of QSAR Machine Learning Models for Plastic Biodegradation Prediction
3. Calibration, Uncertainty, and Generalization in Descriptor-Based Biodegradation Prediction
4. Chemistry-Informed Feature Engineering and Reliability Analysis for Biodegradation QSAR Models
5. A Reliability-Aware QSAR Framework for Machine Learning Prediction of Biodegradation Behavior

## 2. Abstract

**Background:** Machine learning models can support computational screening of biodegradation behavior, but standard accuracy metrics alone may be insufficient for scientific model selection, especially when datasets are imbalanced or deployment conditions differ from training data.

**Objective:** This study evaluated whether chemistry-informed feature engineering and reliability-focused evaluation improve the trustworthiness of descriptor-based QSAR/QSPR machine learning models for biodegradation prediction.

**Methods:** PolyDegradeML was developed as a reproducible Python workflow using a QSAR biodegradation dataset with 1055 samples, 41 molecular descriptors, and binary not readily biodegradable/readily biodegradable labels. Logistic Regression, Random Forest, a feedforward neural network, and an exploratory descriptor-graph prototype were evaluated using train/test baselines, stratified cross-validation, SMOTE, feature engineering, feature selection, calibration metrics, uncertainty analysis, selective prediction, and proxy cross-environment validation.

**Results:** On the initial train/test split, Random Forest achieved accuracy 0.8768, macro-F1 0.8529, and ROC-AUC 0.9423. In the final reliability scoreboard, the top-ranked feature set with Random Forest achieved the highest overall reliability score, 0.8860, despite not having the single highest cross-validated accuracy. The highest standard accuracy was 0.8730 for the full-enhanced Logistic Regression candidate, while the top-ranked Random Forest candidate balanced cross-validated accuracy 0.8626, Brier score 0.1003, ECE 0.0297, selective accuracy at 25% coverage 0.8030, and cross-environment accuracy 0.5848.

**Conclusion:** Reliability-aware evaluation changed the interpretation of model quality. The results support using calibration, uncertainty, selective prediction, and cross-environment behavior alongside accuracy when selecting biodegradation prediction models.

## 3. Introduction

Plastic and polymer degradation is an environmentally important problem because material persistence depends on both chemical structure and exposure conditions. Environmental plastics can undergo weathering, fragmentation, oxidation, hydrolysis, and biological degradation, and these processes are not interchangeable. Andrady (2011) supports the distinction between physical fragmentation and chemical or biological degradation in marine environments, while Chamas et al. (2020) emphasize that degradation rates depend on polymer type, exposure pathway, and measured outcome. These distinctions matter for machine learning because a model trained on a simplified label can appear predictive while failing to represent the mechanism or measurement context that gives the label scientific meaning.

Experimental degradation testing can be slow, condition-dependent, and difficult to compare across studies [NEEDS CITATION]. Degradation outcomes may vary with ultraviolet exposure, oxygen availability, water activity, salinity, temperature, microbial conditions, sample geometry, and measurement method (Andrady, 2011; Chamas et al., 2020). The applied work that led to PolyDegradeML therefore began with a mechanistic and schema-driven framing before model training. The early project reports separated polymer-intrinsic descriptors, environmental variables, outcome variables, and metadata, establishing that future degradation datasets should preserve the distinction between material identity, exposure condition, time, outcome metric, and source traceability. In the current codebase, however, the available dataset is a descriptor-only QSAR biodegradation dataset rather than a full polymer degradation-rate dataset.

Machine learning can help screen chemical biodegradation behavior when experimental data are limited, particularly through QSAR/QSPR approaches that use molecular descriptors to predict activity or property labels. Mansouri et al. (2013) provides a biodegradability QSAR precedent for ready biodegradability classification, and broader polymer informatics literature emphasizes that representation and data quality are central to model usefulness (Butler et al., 2018; Chen et al., 2021; Patra, 2022). In this project, descriptor-based modeling was therefore treated as the appropriate starting point. Graph neural networks and polymer-specific representations were considered as future directions, but the current dataset does not contain atom/bond graphs, SMILES, BigSMILES, polymer names, repeat units, or continuous degradation-rate constants.

Raw predictive accuracy is not sufficient for a scientific biodegradation prediction workflow because machine learning evaluation can be sensitive to validation design, class imbalance, probability calibration, and distribution shift (Chawla et al., 2002; Hirschfeld et al., 2020; Japkowicz, 2006; Vaicenavicius et al., 2019; Yang & Li, 2023). A model may achieve high in-distribution accuracy while being poorly calibrated, overconfident on incorrect predictions, sensitive to feature-set changes, or unstable under distribution shift. These concerns are especially important in environmental and chemical prediction settings, where future molecules or exposure conditions may differ from the training data.

Following the case-analysis writing guidance provided for this project, the manuscript treats PolyDegradeML as a research case with a defined context, root problem, evidence base, analysis, and recommendations (Morelli, 2024). The case context is a course-originated descriptor-based biodegradation modeling project that evolved into a reproducible scientific workflow. The root problem is that standard ML model comparison did not provide enough evidence for trustworthy biodegradation prediction. The analysis therefore traces how the project moved from mechanistic framing and dataset schema design to baseline modeling, neural and graph-inspired experiments, imbalance handling, feature engineering, uncertainty evaluation, and final reliability-centered model selection.

The present study therefore reframes the project from simple model comparison to reliability-aware evaluation. The central research question is:

Can chemistry-informed feature engineering and reliability-focused evaluation improve the trustworthiness of machine learning models for biodegradation prediction?

## 4. Related Work

### 4.1 QSAR/QSPR Modeling For Biodegradation

QSAR/QSPR modeling provides a natural framework for descriptor-based biodegradation prediction because it links molecular descriptors to biological or environmental outcomes. Mansouri et al. (2013) provide the most directly relevant source in the project reading reports because they address quantitative structure-activity relationship models for ready biodegradability of chemicals. The present work follows that descriptor-based classification logic but shifts the emphasis from accuracy alone to reliability-aware evaluation. Additional biodegradation-specific context is provided by Shah et al. (2008), who review biological degradation of plastics and support the need to distinguish microbial biodegradation from other forms of degradation.

The current dataset should not be interpreted as a complete polymer degradation dataset. The repository metadata identifies it as a QSAR biodegradation dataset with anonymous molecular descriptors and a binary target. It does not contain polymer names, polymer repeat units, SMILES, BigSMILES, measured half-lives, or degradation-rate constants. A stronger future study would require a polymer-specific dataset with source-traceable experimental conditions and continuous degradation outcomes [NEEDS DATA].

### 4.2 Machine Learning For Polymer And Plastic Degradation

Machine learning in molecular and materials science depends strongly on data curation, representation, and validation design. Butler et al. (2018) provide a broad foundation for machine learning in molecular and materials science, while Chen et al. (2021), Kim et al. (2018), and Patra (2022) frame polymer informatics as a data-driven approach that requires careful polymer representation. Tian et al. (2023) further illustrate that model comparisons in plastic or polymer identification settings can depend on data size and representation. These sources support the project decision to treat descriptor-based models as interpretable baselines rather than as final mechanistic descriptions of polymer degradation.

The applied work reports also indicate that environmental degradation cannot be reduced to a single universal outcome. Andrady (2011) and Chamas et al. (2020) support the distinction between fragmentation, weathering, biodegradation, and degradation-rate measurement. The current study uses a binary ready-biodegradation classification target because that is what the available dataset provides; it does not model continuous environmental degradation rates.

### 4.3 Molecular Descriptors And Chemistry-Informed Features

Molecular descriptors are central to QSAR/QSPR modeling because they encode chemical structure into numerical inputs. Karelson et al. (1996) support the role of quantum-chemical descriptors in QSAR/QSPR studies, while Danishuddin and Khan (2016) and Kubinyi (1994) support the importance of descriptor selection. In PolyDegradeML, the original 41 descriptors were supplemented with 12 chemistry-aware proxy features, including heteroatom, halogen, polarity, donor/acceptor, mass-topology, ring-topology, and carbon-heteroatom ratio signals.

These added features should be interpreted cautiously. They are engineered proxy descriptors derived from available descriptor columns, not true computed quantum descriptors. The project metadata lists quantum-style features such as total energy, dipole moment, polarizability, HOMO energy, LUMO energy, HOMO-LUMO gap, quadrupole moment, and partial-charge dispersion as future work rather than current inputs.

### 4.4 Graph Neural Networks And Molecular Representation Learning

Graph neural networks are attractive for molecular property prediction because molecular structure can be represented as atoms and bonds through graph-structured inputs and message passing (Wu et al., 2021). Queen et al. (2023) provide a polymer graph neural network reference in the project reading reports. Lin et al. (2019) introduce BigSMILES as a polymer-oriented line notation, supporting the future need for polymer-specific structural representations.

The present project includes a descriptor-graph prototype, but this component is explicitly exploratory. Because the dataset contains descriptor vectors rather than atom-level molecular graphs, the prototype should not be described as a chemically complete graph neural network. Its role is to test whether a graph-inspired representation of descriptor relationships adds value, not to claim true molecular message passing.

### 4.5 Class Imbalance And Stratified Evaluation

The dataset is imbalanced, with 699 not readily biodegradable samples and 356 readily biodegradable samples according to the applied work reports. Class imbalance can make accuracy misleading because majority-class performance can obscure minority-class failures. Chawla et al. (2002) support the use of SMOTE as a training-data oversampling method, and Japkowicz (2006) motivates careful evaluation design for machine learning. PolyDegradeML therefore uses stratified splitting, stratified cross-validation, class-level metrics, RB recall, and SMOTE comparisons.

### 4.6 Calibration, Uncertainty, And Reliability

Reliability-aware evaluation is the main contribution of this project. Calibration and uncertainty are important because a model should indicate when its predictions may be unreliable. Hirschfeld et al. (2020) and Yang and Li (2023) support uncertainty quantification in molecular property prediction, while Vaicenavicius et al. (2019) support calibration evaluation in classification. In this project, reliability is evaluated through Brier score, log loss, expected calibration error, uncertainty separation, selective prediction, cross-environment performance, and confidence on incorrect predictions.

### 4.7 Why Quantum Methods Were Considered

Quantum methods were considered as a future research direction because quantum computation differs from classical computation in both representation and search strategy. This does not mean that quantum methods were selected over classical descriptors in the implemented PolyDegradeML workflow. The current results come from classical descriptor-based machine learning. Rather, quantum methods were considered alongside classical descriptors as a possible future extension for richer chemical representation. Classical computing manipulates explicit states through deterministic operations on binary information. Quantum computing represents computational states through probability amplitudes in a superposed wavefunction and manipulates the geometry of those amplitudes through unitary evolution and measurement [NEEDS CITATION]. In this view, a quantum algorithm is not simply an exhaustive search over classical candidates. It is an engineered physical process in which interference patterns can increase the probability of favorable computational outcomes and suppress unfavorable pathways.

This distinction is relevant to biodegradation prediction only as a conceptual motivation at the current stage. High-dimensional chemical descriptor spaces often contain nonlinear relationships, interacting variables, and uncertain boundaries between classes. Quantum representations may eventually offer alternative ways to encode and explore such relationships, particularly for problems where candidate solutions are easier to verify than to discover [NEEDS CITATION]. The motivation is therefore not a generic claim that quantum computation is faster, nor a claim that the present project achieved quantum advantage. Instead, quantum methods were considered because amplitude-based representations and interference-based search suggest a different computational lens for chemical prediction problems.

The current PolyDegradeML repository does not implement quantum machine learning. It uses classical descriptor-based models, including Logistic Regression, Random Forest, a feedforward neural network, and an exploratory descriptor-graph prototype. The benefit of the quantum framing in the current paper is therefore conceptual and methodological rather than empirical: it helps distinguish proxy chemistry features from true computed quantum descriptors, reinforces the probabilistic nature of model reliability, and clarifies a future benchmark question about whether richer representations improve calibration, uncertainty behavior, and generalization. Any future quantum extension would require a clearly defined encoding strategy, reproducible quantum or quantum-inspired algorithms, hardware or simulator constraints, and direct comparison against the classical reliability framework reported here. Until such experiments are implemented, quantum computation should be presented only as a carefully bounded future direction.

## 5. Methods

### 5.1 Case Analysis Design And Evidence Base

This manuscript uses a case-analysis structure adapted from Morelli (2024): case summary, problem identification, evidence-based analysis, recommendations, and broader implications. In this scientific version, the "case" is the development of PolyDegradeML from a weekly applied-work project into a reproducible reliability-aware ML framework. The case analysis emphasizes discernment between core evidence and peripheral exploratory work, root-cause identification, quantitative analysis, and recommendations grounded in the generated results.

All 13 Applied Work reports are incorporated as development evidence. The table below maps each week to its role in the manuscript.

| Week | Applied Work Focus | Role In The Case Analysis | Source File |
| --- | --- | --- | --- |
| 1 | Mechanistic framing for polymer degradation pathways | Established that hydrolysis, photo-oxidation, and biodegradation should not be collapsed into one undifferentiated degradation concept. Also motivated caution about label meaning. | `source_materials/reports/Week_01_Applied_Work.docx` |
| 2 | Environmental variables for polymer degradation modeling | Defined the need to separate environmental exposure, polymer descriptors, biological surface conditions, mechanical context, outcomes, and metadata. | `source_materials/reports/Week_02_Applied_Work.docx` |
| 3 | Machine-learning framework for polymer degradation prediction | Justified starting with descriptor-based QSAR baselines and reserving graph methods for datasets with chemically meaningful structures. | `source_materials/reports/Week_03_Applied_Work.docx` |
| 4 | Dataset schema for polymer degradation modeling | Established source traceability as a requirement for future polymer degradation datasets and clarified why the current descriptor-only dataset is limited. | `source_materials/reports/Week_04_Applied_Work.docx` |
| 5 | Baseline classification of ready biodegradability | Introduced Logistic Regression and Random Forest baselines; Random Forest achieved accuracy 0.8768, macro-F1 0.8529, and ROC-AUC 0.9423. | `source_materials/reports/Week_05_Applied_Work.docx`; `reports/baseline_modeling.md` |
| 6 | Feedforward neural network for biodegradability classification | Tested whether a dense nonlinear neural model improved on classical baselines; the FNN did not surpass Random Forest on the initial split. | `source_materials/reports/Week_06_Applied_Work.docx`; `reports/neural_network_baseline_summary.txt` |
| 7 | Descriptor-graph prototype | Tested a graph-inspired prototype while explicitly recognizing that descriptor vectors are not true molecular graphs. | `source_materials/reports/Week_07_Applied_Work.docx`; `reports/descriptor_graph_prototype_summary.txt` |
| 8 | Cross-distribution validation | Identified distribution-shift failure as a root reliability problem; Random Forest mean cross-environment accuracy was 0.4210 in the early proxy test. | `source_materials/reports/Week_08_Applied_Work.docx`; `reports/cross_environment_validation.md` |
| 9 | Class-balancing evaluation with SMOTE | Addressed class imbalance and RB recall; SMOTE improved several minority-class metrics but did not remove the need for reliability analysis. | `source_materials/reports/Week_09_Applied_Work.docx`; `reports/stratified_cross_validation_summary.txt` |
| 10 | Chemistry-aware proxy features | Tested whether descriptor engineering could improve model behavior; proxy features improved FNN recall and F1 under SMOTE. | `source_materials/reports/Week_10_Applied_Work.docx`; `reports/feature_engineering_summary.txt` |
| 11 | Feature-set reduction and descriptor interpretability | Tested whether reduced feature sets could retain performance while improving interpretability. | `source_materials/reports/Week_11_Applied_Work.docx`; `reports/feature_importance_selection_summary.txt` |
| 12 | Calibration and uncertainty under distribution shift | Shifted the project from accuracy-focused evaluation to reliability analysis using Brier score, ECE, uncertainty separation, and cross-environment behavior. | `source_materials/reports/Week_12_Applied_Work.docx`; `reports/uncertainty_reliability_summary.txt` |
| 13 | Final model selection through reliability analysis | Selected `top_ranked | random_forest_classifier` as the final recommendation using a reliability score rather than a single metric. | `source_materials/reports/Week_13_Applied_Work.docx`; `reports/model_reliability_report.md` |

Several Applied Work reports mention sources not yet fully represented in the extracted reading-report reference list, including Wiles and Scott (2006), Gewert et al. (2015), Breiman (2001), Goodfellow et al. (2016), and Wieder et al. (2020). These should be verified before final submission if they remain in the manuscript narrative [NEEDS FULL CITATION].

### 5.2 Repository And Workflow

All analyses are implemented in the PolyDegradeML repository. The reproducible workflow is organized into ordered scripts under `scripts/`, reusable code under `src/biodegradation_ml_framework/`, generated numeric outputs under `results/`, generated figures under `figures/`, and human-readable summaries under `reports/`. The full workflow can be regenerated using `python scripts/generate_all_results.py`.

Source paths for this section include `README.md`, `scripts/README.md`, `src/biodegradation_ml_framework/README.md`, and the ordered workflow scripts from `scripts/01_curate_dataset.py` through `scripts/10_run_model_reliability_scoreboard.py`.

### 5.3 Dataset

The dataset is identified in the repository as `qsar_biodegradation`, version `v1`. The raw file is stored at `datasets/qsar_biodegradation_descriptor_benchmark/raw/qsar_biodegradation.csv`, and the curated file is stored at `datasets/qsar_biodegradation_descriptor_benchmark/processed/qsar_biodegradation_curated.csv`. Repository metadata reports 1055 rows, 41 descriptor features, no missing values after curation, and a binary target column, `biodegradation_class_id`. The target labels are:

- `1`: not readily biodegradable
- `2`: readily biodegradable

For human-readable reporting, the curation step adds stable sample identifiers, `biodegradation_class_label`, and `biodegradation_outcome`. The source paths are `reports/dataset_curation.md` and `datasets/qsar_biodegradation_descriptor_benchmark/metadata/qsar_biodegradation_metadata.json`.

Dataset citation and licensing require additional review before publication. The repository describes the source as Kaggle `muhammetvarl/qsarbiodegradation`, but the exact dataset license and citation should be verified before submission [NEEDS FULL CITATION] [ASK AUTHOR].

### 5.4 Preprocessing And Label Mapping

The curation workflow maps source descriptor columns from generic names such as `V1..V41` to published descriptor names such as `SpMax_L`, `J_Dz_e`, and `nX`. It preserves the original class IDs and adds readable class labels. The dataset is retained without row removal because no missing values are reported. Model workflows convert the target into a binary classification label for RB versus NRB prediction.

### 5.5 Train/Test Split And Cross-Validation

The initial baseline workflow uses an 80/20 stratified train/test split with `random_state=42`. Stratified cross-validation uses 5 folds and evaluates both baseline training and SMOTE-balanced training conditions. Fold diagnostics and model results are stored in `results/tables/stratified_cv_fold_diagnostics.csv` and `results/tables/stratified_cv_model_results.csv`. The summary report is `reports/stratified_cross_validation_summary.txt`.

### 5.6 Models

The project evaluates the following model families:

- Logistic Regression
- Random Forest Classifier
- Feedforward Neural Network
- Descriptor-graph neural network prototype

Logistic Regression and Random Forest are used as classical descriptor-based baselines. The feedforward neural network is included as a nonlinear dense baseline for tabular descriptor inputs, consistent with the broader use of deep neural networks for representation learning and nonlinear prediction (LeCun et al., 2015). The descriptor-graph prototype is included only as exploratory work because the dataset does not contain atom/bond graphs.

Source paths include `reports/baseline_modeling.md`, `reports/neural_network_baseline_summary.txt`, `reports/descriptor_graph_prototype_summary.txt`, `scripts/02_run_baseline_models.py`, `scripts/03_run_neural_network_baseline.py`, and `scripts/04_run_descriptor_graph_prototype.py`.

### 5.7 Class Imbalance Handling

Class imbalance is addressed through stratified splitting, class-level metrics, RB recall, and SMOTE comparisons. SMOTE is applied to training data only during cross-validation so that synthetic samples do not leak into validation folds, following the original role of SMOTE as a synthetic minority oversampling method for imbalanced learning (Chawla et al., 2002). The main evidence sources are `reports/stratified_cross_validation_summary.txt` and `results/tables/stratified_cv_model_results.csv`.

### 5.8 Feature Engineering

The feature engineering workflow compares the original 41 descriptors against a chemistry-aware proxy feature expansion. This design follows the QSAR/QSPR premise that chemically meaningful descriptors can encode predictive molecular information (Karelson et al., 1996; Mansouri et al., 2013). The 12 Tier 2 proxy features are:

- `heteroatom_total`
- `heteroatom_fraction`
- `halogen_presence`
- `aromatic_substitution_signal`
- `donor_acceptor_proxy`
- `donor_density`
- `polarity_proxy`
- `mass_topology_proxy`
- `ring_topology_proxy`
- `carbon_hetero_ratio_proxy`
- `nitro_ester_signal`
- `electronic_balance_proxy`

These are proxy features derived from available descriptors. They should not be described as experimentally measured features or computed quantum descriptors. The source files are `reports/feature_engineering_summary.txt`, `results/metadata/feature_engineering_sets.json`, and `figures/feature_engineering/feature_set_comparison.png`.

### 5.9 Feature Importance And Feature-Set Testing

Feature selection uses Random Forest importance, permutation importance, and mutual information to construct ranked feature sets, reflecting the broader QSAR/QSPR need to reduce descriptor noise and improve interpretability (Danishuddin & Khan, 2016; Kubinyi, 1994; Ponzoni et al., 2017). The feature sets evaluated in the final reliability workflow include:

- `full_enhanced`
- `top_ranked`
- `proxy_only`
- `reduced_hybrid`

The `top_ranked` feature set contains 15 features, including `SpMax_B_m`, `SpMax_L`, `SM6_B_m`, `SpPosA_B_p`, `mass_topology_proxy`, `Psi_i_A`, `SM6_L`, `F02_C_N`, `SdssC`, `SpMax_A`, `polarity_proxy`, `HyWi_B_m`, `Mi`, `nN`, and `LOC`. Source paths include `results/metadata/feature_selection_sets.json`, `results/tables/feature_importance_rankings.csv`, `figures/feature_importance/top_feature_importance.png`, and `reports/feature_importance_selection_summary.txt`.

### 5.10 Proxy Cross-Environment Validation

Cross-environment validation is implemented as a proxy distribution-shift test. The workflow defines three proxy environments using stratified k-means clustering on standardized descriptor vectors while preserving both classes across held-out environments. Models are trained on two clusters and evaluated on the held-out cluster. This design is motivated by the broader concern that ordinary evaluation can overstate future model reliability when data distributions change (Japkowicz, 2006). This is not true environmental validation with measured exposure metadata; it is a descriptor-space distribution-shift proxy. The evidence sources are `reports/cross_environment_validation.md`, `results/tables/cross_environment_validation_summary.csv`, and `figures/cross_environment/mean_scores.png`.

### 5.11 Calibration, Uncertainty, And Selective Prediction

Reliability analysis follows prior work emphasizing classification calibration and uncertainty quantification for molecular property prediction (Hirschfeld et al., 2020; Vaicenavicius et al., 2019; Yang & Li, 2023). It includes:

- Accuracy, precision, recall, F1 score, ROC-AUC, and RB recall
- Brier score
- Log loss
- Expected calibration error
- Mean confidence
- Mean uncertainty
- Mean entropy
- Uncertainty for correct versus incorrect predictions
- Selective prediction accuracy at reduced coverage
- Cross-environment confidence on incorrect predictions

Selective prediction evaluates performance when retaining only more confident predictions. Calibration and uncertainty sources include `reports/uncertainty_reliability_summary.txt`, `results/tables/uncertainty_reliability_metrics.csv`, `results/tables/cross_environment_uncertainty_metrics.csv`, `results/predictions/selective_prediction_results.csv`, `figures/uncertainty_calibration/calibration_curve.png`, and `figures/uncertainty_calibration/selective_accuracy.png`.

### 5.12 Final Reliability Scoreboard

The final model selection step compares each model and feature-set candidate using a composite reliability score. Each candidate is evaluated using cross-validated performance, calibration, uncertainty separation, selective prediction, cross-environment accuracy, cross-environment calibration, cross-environment uncertainty behavior, and overconfidence on incorrect cross-environment predictions. This approach operationalizes the reliability concerns raised by calibration and uncertainty literature rather than treating accuracy as the only selection criterion (Hirschfeld et al., 2020; Vaicenavicius et al., 2019; Yang & Li, 2023). The final scoreboard is stored in `results/tables/model_reliability_scoreboard.csv`, with the report in `reports/model_reliability_report.md`.

## 6. Results

### 6.1 Weekly Case Chronology: From Mechanistic Framing To Reliability Selection

The weekly Applied Work sequence forms the evidentiary development of this case study. Following the case-analysis guidance used for this manuscript, the weekly reports are treated as a staged investigation in which the problem definition, evidence base, analysis strategy, and recommendations became progressively more precise (Morelli, 2024). The sequence is important because the project did not begin as a reliability-centered framework. It began with a broad environmental and chemical problem, then moved through dataset design, baseline modeling, neural experimentation, feature engineering, distribution-shift testing, calibration analysis, and final model selection.

Week 1 established the mechanistic framing for plastic and polymer degradation. The analysis separated hydrolysis, photo-oxidation, and biodegradation as related but distinct degradation pathways. Hydrolysis was framed around hydrolyzable bonds and water-mediated chemical cleavage, photo-oxidation around ultraviolet radiation, oxygen, and radical chemistry, and biodegradation around microbial accessibility and biologically mediated transformation. This distinction shaped the later manuscript by preventing the model from being described as a universal polymer degradation simulator. The current workflow predicts binary biodegradability labels from descriptors; it does not directly simulate mechanistic hydrolysis, ultraviolet oxidation, biofilm formation, or mineralization. Source: `source_materials/reports/Week_01_Applied_Work.docx`.

Week 2 expanded the project from chemical mechanism to experimental context. The report identified environmental exposure variables, chemical-medium variables, biological surface conditions, mechanical context, polymer/material descriptors, and outcome variables. Important environmental variables included ultraviolet intensity, wavelength, duration, temperature, humidity or water activity, oxygen, salinity, and pH. Biological and physical variables included microbial load, biofilm formation, wave action, abrasion, stirring, sample thickness, and surface-area-to-volume ratio. The main finding was that biodegradation prediction depends not only on chemical identity but also on exposure context and measurement design. This is why the manuscript treats the current descriptor-only dataset as useful but incomplete. Source: `source_materials/reports/Week_02_Applied_Work.docx`.

Week 3 translated the environmental problem into an initial machine-learning framework. The Applied Work distinguished descriptor-based QSAR/QSPR modeling from more structurally detailed polymer representations. It established that tabular molecular descriptors were the appropriate starting point for the available dataset, while graph-based molecular learning would require molecular structures, repeat units, SMILES, BigSMILES, or atom/bond graphs that were not present in the current data. This decision shaped the model hierarchy used in the paper: Logistic Regression and Random Forest served as interpretable and robust tabular baselines; the FNN served as a nonlinear descriptor-based baseline; and the descriptor-graph prototype was interpreted as exploratory rather than as a true molecular graph neural network. Source: `source_materials/reports/Week_03_Applied_Work.docx`.

Week 4 focused on dataset schema and reproducibility. The report identified five components needed for a stronger biodegradation dataset: polymer identity, exposure condition, time point, outcome metric, and source metadata. This schema became the basis for the manuscript's limitation and future-work sections. The existing QSAR biodegradation dataset has 1055 samples, 41 descriptor features, no missing values, and binary ready biodegradability labels, but it does not include the full schema proposed in Week 4. The practical result is that the current project is reproducible as a descriptor-based classification workflow, while future publication-level environmental claims would require richer material, exposure, and outcome metadata. Sources: `source_materials/reports/Week_04_Applied_Work.docx`, `datasets/qsar_biodegradation_descriptor_benchmark/metadata/qsar_biodegradation_metadata.json`, and `reports/dataset_curation.md`.

Week 5 produced the first quantitative baseline. Logistic Regression achieved accuracy 0.8626, macro-F1 0.8456, and ROC-AUC 0.9136, while Random Forest achieved accuracy 0.8768, macro-F1 0.8529, and ROC-AUC 0.9423. These results demonstrated that the descriptor matrix contained usable predictive signal. However, the baseline also created the central methodological risk of the project: if the study stopped at baseline accuracy, the conclusion would have been a simple model-ranking exercise rather than a scientific evaluation of reliability. Source: `source_materials/reports/Week_05_Applied_Work.docx`, `reports/baseline_modeling.md`, and `results/metadata/baseline_model_metrics.json`.

Week 6 tested a feedforward neural network as a nonlinear tabular baseline. The FNN achieved accuracy 0.8246 and ROC-AUC 0.9025 on the same train/test split, with confusion matrix `[[125, 15], [22, 49]]` for rows true `[NRB, RB]` and columns predicted `[NRB, RB]`. The result was scientifically useful because it showed that model complexity alone did not improve performance on the available descriptor representation. The FNN was therefore retained in the manuscript not as a failed experiment, but as evidence that representation quality and evaluation design mattered more than simply adding a neural architecture. Sources: `source_materials/reports/Week_06_Applied_Work.docx` and `reports/neural_network_baseline_summary.txt`.

Week 7 introduced the descriptor-graph prototype. The prototype achieved accuracy 0.6967 and ROC-AUC 0.7689, substantially below the stronger tabular baselines. This result is important for interpretation because it demonstrates a boundary condition: graph-style modeling is not automatically meaningful when the available inputs are fixed descriptors rather than chemically valid graph structures. The manuscript therefore treats the descriptor-graph result as a representation experiment and a cautionary finding, not as evidence against molecular graph neural networks in general. Sources: `source_materials/reports/Week_07_Applied_Work.docx` and `reports/descriptor_graph_prototype_summary.txt`.

Week 8 introduced cross-distribution or proxy cross-environment validation. Mean held-out environment accuracy dropped to 0.4210 for Random Forest, 0.3727 for Logistic Regression, 0.3532 for the FNN, and 0.3688 for the descriptor-graph prototype. This was one of the most important turning points in the project because it showed that ordinary train/test results could substantially overstate robustness. The result reframed the project from "which model is most accurate?" to "which model is most trustworthy when evaluated under reliability stress tests?" Sources: `source_materials/reports/Week_08_Applied_Work.docx`, `reports/cross_environment_validation.md`, and `results/tables/cross_environment_validation_summary.csv`.

Week 9 tested class imbalance handling with SMOTE inside stratified cross-validation. The main finding was that SMOTE changed minority-class behavior, especially recall for the ready biodegradable class. Logistic Regression RB recall increased from 0.7922 to 0.8568, FNN accuracy increased from 0.8588 to 0.8730, and Random Forest RB recall increased from 0.7501 to 0.7837. These results supported the use of stratified evaluation and class-level metrics rather than relying only on aggregate accuracy. Sources: `source_materials/reports/Week_09_Applied_Work.docx`, `reports/stratified_cross_validation_summary.txt`, and `results/tables/stratified_cv_model_results.csv`.

Week 10 introduced chemistry-aware proxy features. These features summarized descriptor-level signals related to heteroatom content, halogen presence, donor/acceptor behavior, polarity, mass/topology, ring topology, carbon/heteroatom balance, nitro/ester-like signals, and electronic-balance proxies. Under SMOTE, the FNN improved from recall 0.8145 and F1 score 0.8126 with Tier 1 features to recall 0.8399 and F1 score 0.8204 with Tier 1 plus Tier 2 features. This finding supported the idea that chemistry-informed feature engineering can improve some model-feature combinations, while also showing that proxy features require reliability checks before being treated as generally superior. Sources: `source_materials/reports/Week_10_Applied_Work.docx`, `reports/feature_engineering_summary.txt`, and `results/tables/feature_engineering_model_results.csv`.

Week 11 tested feature importance and reduced feature sets. The full enhanced feature set achieved accuracy 0.8739, ROC-AUC 0.9367, and RB recall 0.7837; the reduced hybrid set achieved accuracy 0.8597, ROC-AUC 0.9190, and RB recall 0.8063; and the top-ranked feature set achieved accuracy 0.8673, ROC-AUC 0.9264, and RB recall 0.7978 in the reported comparison. The important finding was not that reduced feature sets dominated all metrics, but that feature-set design changed tradeoffs among accuracy, recall, and later reliability measures. The top-ranked feature set became central because it produced the strongest final reliability score when paired with Random Forest. Sources: `source_materials/reports/Week_11_Applied_Work.docx`, `reports/feature_importance_selection_summary.txt`, `results/tables/feature_importance_rankings.csv`, and `results/metadata/feature_selection_sets.json`.

Week 12 added calibration, uncertainty, and selective prediction. This step converted the project from ordinary model comparison into reliability-aware evaluation. For Random Forest, the full-enhanced feature set achieved accuracy 0.8711, ROC-AUC 0.9335, Brier score 0.0950, and ECE 0.0387, while the top-ranked feature set achieved accuracy 0.8626, ROC-AUC 0.9250, Brier score 0.1003, log loss 0.3312, and ECE 0.0297. The full-enhanced Random Forest had a large uncertainty gap between incorrect and correct predictions, while the top-ranked Random Forest later provided the strongest final reliability balance. The larger lesson was that a model can look strong by accuracy while still requiring calibration and overconfidence checks. Sources: `source_materials/reports/Week_12_Applied_Work.docx`, `reports/uncertainty_reliability_summary.txt`, `results/tables/uncertainty_reliability_metrics.csv`, and `figures/uncertainty_calibration/calibration_curve.png`.

Week 13 integrated the evidence into a final reliability scoreboard. The selected candidate was `top_ranked | random_forest_classifier`, with reliability score 0.8860, cross-validated accuracy 0.8626, Brier score 0.1003, selective accuracy at 25% coverage 0.8030, and cross-environment accuracy 0.5848. The selected model did not win every individual metric. Instead, it represented the strongest balance across accuracy, calibration, uncertainty behavior, selective prediction, and proxy cross-environment generalization. This final week supplies the manuscript's main contribution: reliability-aware evaluation changed the interpretation of model quality and produced a more defensible model recommendation than accuracy alone. Sources: `source_materials/reports/Week_13_Applied_Work.docx`, `reports/model_reliability_report.md`, and `results/tables/model_reliability_scoreboard.csv`.

### 6.2 Baseline Model Performance

The initial train/test baseline showed that both classical descriptor-based models learned signal from the dataset. Logistic Regression achieved accuracy 0.8626, macro-F1 0.8456, and ROC-AUC 0.9136. Random Forest achieved accuracy 0.8768, macro-F1 0.8529, and ROC-AUC 0.9423. These results are reported in `reports/baseline_modeling.md` and `results/metadata/baseline_model_metrics.json`.

The feedforward neural network baseline achieved accuracy 0.8246, precision 0.7656, recall 0.6901, F1 score 0.7259, and ROC-AUC 0.9025 on the same 80/20 split. Its confusion matrix was `[[125, 15], [22, 49]]` for rows true `[NRB, RB]` and columns predicted `[NRB, RB]`. The FNN did not outperform Random Forest on the initial split, supporting its interpretation as a complexity check rather than a final superior model. Source: `reports/neural_network_baseline_summary.txt`.

The descriptor-graph prototype achieved accuracy 0.6967, precision 0.5660, recall 0.4225, F1 score 0.4839, ROC-AUC 0.7689, and RB recall 0.4225. Because the dataset contains descriptors rather than atom/bond graphs, this result supports the decision not to overclaim graph-based modeling from the current data. Source: `reports/descriptor_graph_prototype_summary.txt`.

### 6.3 Stratified Cross-Validation

In 5-fold stratified cross-validation without SMOTE, Random Forest achieved mean accuracy 0.8711 and ROC-AUC 0.9364, while Logistic Regression achieved accuracy 0.8701 and ROC-AUC 0.9276. The feedforward neural network achieved accuracy 0.8588 and ROC-AUC 0.9234. With SMOTE, Random Forest achieved accuracy 0.8739, ROC-AUC 0.9369, and RB recall 0.7837. The FNN improved to accuracy 0.8730 and RB recall 0.8145, while Logistic Regression achieved RB recall 0.8568 with accuracy 0.8607.

These results show that SMOTE changed class-level behavior, especially minority-class recall, and that no single metric fully described model quality. Sources: `reports/stratified_cross_validation_summary.txt` and `results/tables/stratified_cv_model_results.csv`.

### 6.4 Feature Engineering Comparison

The feature engineering comparison tested the original Tier 1 descriptor set against the Tier 1 plus Tier 2 chemistry-aware proxy feature set. Under SMOTE, the FNN improved from accuracy 0.8730, recall 0.8145, F1 score 0.8126, and ROC-AUC 0.9289 with Tier 1 features to accuracy 0.8758, recall 0.8399, F1 score 0.8204, and ROC-AUC 0.9293 with Tier 1 plus Tier 2 features. Logistic Regression and Random Forest changed less substantially under the same comparison.

These findings suggest that chemistry-aware proxy features can improve some model-feature combinations, particularly the dense neural baseline, but they do not automatically produce the most reliable final model. Sources: `reports/feature_engineering_summary.txt`, `results/tables/feature_engineering_model_results.csv`, and `figures/feature_engineering/feature_set_comparison.png`.

### 6.5 Feature Importance And Reduced Feature-Set Testing

Feature selection produced ranked and reduced feature sets. The highest-ranked features included `SpMax_B_m`, `SpMax_L`, `SM6_B_m`, `SpPosA_B_p`, `mass_topology_proxy`, `Psi_i_A`, `SM6_L`, `F02_C_N`, `SdssC`, `SpMax_A`, and `polarity_proxy`. The final recommendation uses the `top_ranked` feature set rather than the full enhanced feature set.

The importance of this result is not that a smaller feature set maximized every metric, but that the top-ranked feature set supported the strongest final reliability score when combined with Random Forest. Sources: `results/tables/feature_importance_rankings.csv`, `results/metadata/feature_selection_sets.json`, `figures/feature_importance/top_feature_importance.png`, and `reports/feature_importance_selection_summary.txt`.

### 6.6 Cross-Environment Validation

Proxy cross-environment validation produced substantial performance drops relative to ordinary train/test and cross-validation results. Mean held-out environment accuracy was 0.4210 for Random Forest, 0.3727 for Logistic Regression, 0.3532 for the FNN, and 0.3688 for the descriptor-graph prototype. Mean RB recall was 0.4284 for Random Forest, 0.3143 for Logistic Regression, 0.3072 for the FNN, and 0.2484 for the descriptor-graph prototype.

These results show that ordinary validation performance overstated robustness under descriptor-space distribution shift. Random Forest remained the strongest model by mean cross-environment accuracy and RB recall in this proxy environment test, but absolute performance remained limited. Sources: `reports/cross_environment_validation.md`, `results/tables/cross_environment_validation_summary.csv`, `figures/cross_environment/mean_scores.png`, and `figures/cross_environment/rb_recall_heatmap.png`.

### 6.7 Calibration And Uncertainty Analysis

For Random Forest under stratified cross-validation, the full-enhanced feature set achieved accuracy 0.8711, ROC-AUC 0.9335, Brier score 0.0950, log loss 0.3464, and ECE 0.0387. The top-ranked feature set achieved accuracy 0.8626, ROC-AUC 0.9250, Brier score 0.1003, log loss 0.3312, and ECE 0.0297. The full-enhanced Random Forest feature set showed the largest uncertainty gap between incorrect and correct predictions, 0.1727, while the top-ranked Random Forest candidate had the strongest overall final reliability profile.

Under cross-environment reliability analysis, overconfidence became a central risk. For Random Forest, the proxy-only feature set had cross-environment accuracy 0.2493, Brier score 0.6144, log loss 4.6149, and mean confidence on incorrect predictions 0.8732. This indicates that some candidates were not merely inaccurate under shift; they were confidently wrong. Sources: `reports/uncertainty_reliability_summary.txt`, `results/tables/uncertainty_reliability_metrics.csv`, `results/tables/cross_environment_uncertainty_metrics.csv`, `figures/uncertainty_calibration/calibration_curve.png`, and `figures/uncertainty_calibration/uncertainty_correct_vs_incorrect.png`.

### 6.8 Selective Prediction

Selective prediction tested whether retaining only more confident predictions improved accuracy. In the final reliability scoreboard, the highest selective accuracy at 25% coverage was 0.8163 for `full_enhanced | feedforward_neural_network`, while the top three final reliability candidates had selective accuracy at 25% coverage of 0.8030 for `top_ranked | random_forest_classifier`, 0.8068 for `top_ranked | feedforward_neural_network`, and 0.8106 for `top_ranked | logistic_regression`.

Selective prediction therefore supported the broader reliability story: the model with the highest selective accuracy was not automatically the best final model because final selection also considered calibration, uncertainty, and cross-environment behavior. Sources: `results/predictions/final_selective_prediction_results.csv`, `results/tables/model_reliability_scoreboard.csv`, and `figures/model_selection/selective_top_candidates.png`.

### 6.9 Final Reliability Scoreboard

The final reliability scoreboard selected `top_ranked | random_forest_classifier` as the best overall candidate with reliability score 0.8860. This candidate achieved cross-validated accuracy 0.8626, ROC-AUC 0.9250, Brier score 0.1003, ECE 0.0297, selective accuracy at 25% coverage 0.8030, cross-environment accuracy 0.5848, cross-environment Brier score 0.2998, and incorrect cross-environment confidence 0.7748.

The highest cross-validated accuracy was 0.8730 for `full_enhanced | logistic_regression`, and the best in-distribution calibration by the report was `full_enhanced | logistic_regression` with Brier score 0.0980 and ECE 0.0280. The best cross-environment accuracy was 0.6455 for `top_ranked | logistic_regression`. The final selected model was therefore not the winner on every individual metric; it was the best balanced candidate across the reliability components. Sources: `reports/model_reliability_report.md`, `results/tables/model_reliability_scoreboard.csv`, `figures/model_selection/overall_scoreboard.png`, `figures/model_selection/accuracy_calibration_tradeoff.png`, and `figures/model_selection/metric_heatmap.png`.

## 7. Discussion

### 7.1 Integrated Interpretation Of The Weekly Findings

The weekly development of PolyDegradeML shows a methodological shift from problem exploration to reliability-centered model selection. The first four weeks established that polymer degradation prediction is not simply a classification problem. It is a chemically and environmentally conditioned inference problem. Hydrolysis, photo-oxidation, biodegradation, environmental exposure, surface conditions, mechanical abrasion, polymer identity, additives, crystallinity, and outcome definitions all affect the meaning of degradation. Because the current dataset lacks most of those variables, the appropriate scientific claim is narrower: the project evaluates descriptor-based QSAR/QSPR classification of ready biodegradability and uses reliability analysis to determine how trustworthy that classification appears under the available evidence.

Weeks 5 through 7 established the model baseline and the limits of added complexity. Random Forest performed strongly in the initial baseline, while Logistic Regression remained competitive and interpretable. The FNN did not surpass the Random Forest baseline on the initial split, and the descriptor-graph prototype underperformed. Together, these results show that more complex models did not automatically overcome the limits of the descriptor representation. This is an important case finding because it prevents the manuscript from overstating neural modeling. The project did not show that deep learning was unnecessary for biodegradation prediction in general. It showed that, for the available tabular descriptor dataset, architecture complexity was less important than representation quality, feature design, validation strategy, and uncertainty-aware evaluation.

Weeks 8 through 13 transformed the project into a reliability case study. Cross-environment validation revealed substantial performance degradation, SMOTE showed that class-level behavior could change even when aggregate metrics remained high, chemistry-aware proxy features improved selected outcomes but not all reliability outcomes, and feature-set selection changed the balance among accuracy, recall, calibration, and generalization. Calibration and uncertainty analysis then exposed the central risk: some candidates were not only wrong under shift, but confidently wrong. The final reliability scoreboard integrated these findings into a model-selection decision that was more scientifically cautious than choosing the highest-accuracy candidate.

The case-analysis framing is useful because it identifies the core problem of the study as trustworthiness rather than prediction alone (Morelli, 2024). The evidence does not support a broad claim that PolyDegradeML can predict polymer degradation under arbitrary environmental conditions. It does support a narrower and stronger claim: when applied to descriptor-based biodegradation classification, reliability-aware evaluation provides a more informative basis for model selection than raw accuracy, and it reveals failure modes that ordinary validation would obscure.

The central finding is that reliability-aware evaluation changed the interpretation of model quality. If the study had used only initial train/test accuracy, Random Forest would have been selected because it achieved the strongest baseline accuracy and ROC-AUC. If the study had used only cross-validated accuracy, `full_enhanced | logistic_regression` would have appeared strongest in the final scoreboard. If the study had used only cross-environment accuracy, `top_ranked | logistic_regression` would have been favored. The final reliability scoreboard instead selected `top_ranked | random_forest_classifier` because it provided the strongest overall balance across accuracy, calibration, uncertainty, selective prediction, and cross-environment behavior.

This result supports the view that biodegradation prediction requires more than high in-distribution accuracy. The scientific use case is not simply to classify known descriptor vectors; it is to support screening decisions that may involve unfamiliar chemical space, imperfect representations, and uncertain deployment conditions. In that setting, a model that is slightly less accurate but better balanced across reliability indicators may be more defensible than a model that wins one isolated metric, consistent with concerns about evaluation design, uncertainty, and calibration in machine learning and molecular prediction (Hirschfeld et al., 2020; Japkowicz, 2006; Vaicenavicius et al., 2019).

Chemistry-aware proxy features were useful but not decisive on their own. They improved the feedforward neural network under SMOTE in the feature-engineering comparison, suggesting that engineered descriptor summaries can help some nonlinear models. However, the final model used the top-ranked feature set rather than the full enhanced feature set or proxy-only feature set. This indicates that feature engineering should be evaluated as part of the full reliability workflow rather than treated as automatically beneficial. The proxy-only feature set also produced some of the clearest overconfidence under cross-environment shift, which cautions against relying on simplified chemistry proxies without validation.

The neural-network results are scientifically informative because they are mixed. The FNN did not outperform Random Forest on the initial train/test split, but FNN candidates remained competitive in the final reliability scoreboard under selected feature sets. This suggests that neural-network complexity alone did not solve the biodegradation prediction problem. Representation quality, feature selection, calibration, and generalization checks mattered at least as much as model class, which is consistent with broader materials-informatics guidance that representation and data quality strongly condition machine learning performance (Butler et al., 2018; Chen et al., 2021).

The descriptor-graph prototype reinforces the same point. Graph-based molecular learning is promising when models have chemically meaningful nodes, edges, and molecular structure (Queen et al., 2023; Wu et al., 2021). The current dataset does not provide that information. The weak descriptor-graph prototype performance therefore should not be interpreted as evidence against molecular graph neural networks. Instead, it shows that graph-style modeling should be reserved for datasets with appropriate structural inputs.

Cross-environment validation was the most important stress test in the study. All model families showed substantial performance degradation under proxy descriptor-space shift, revealing that ordinary validation can hide generalization risk. The top-ranked Random Forest candidate achieved the best final balance, but even this candidate had cross-environment accuracy 0.5848, far below its cross-validated accuracy 0.8626. This gap suggests that the current model should be treated as a screening and methodological tool rather than a validated predictor for arbitrary new environments or chemical domains.

Overconfidence under shift is a major reliability concern. The proxy-only Random Forest and proxy-only Logistic Regression candidates showed high confidence on incorrect cross-environment predictions. For environmental biodegradation screening, such behavior is risky because a model that is confidently wrong may mislead downstream interpretation. The inclusion of Brier score, log loss, ECE, uncertainty separation, and selective prediction therefore strengthens the scientific defensibility of the workflow and aligns the evaluation with calibration and uncertainty literature (Hirschfeld et al., 2020; Vaicenavicius et al., 2019; Yang & Li, 2023).

Overall, PolyDegradeML is best understood as a reproducible reliability-aware evaluation template for descriptor-based biodegradation prediction. It is not yet a complete polymer degradation modeling platform. Its value is in demonstrating how a student-originated QSAR/QSPR workflow can be reframed into a more scientific pipeline that records dataset limitations, compares models systematically, evaluates feature representations, and treats reliability as a first-class result.

### 7.2 Case Analysis Recommendations

The case-analysis guide emphasizes recommendations that are feasible, evidence-based, and tied to the core problem (Morelli, 2024). For PolyDegradeML, the core problem is not simply choosing a classifier; it is deciding what evidence is sufficient to trust a biodegradation prediction workflow. The following recommendations follow from the weekly evidence base and generated results:

1. Retain reliability-aware evaluation as the central contribution. The final model decision should continue to be justified through calibration, uncertainty, selective prediction, and cross-environment behavior rather than accuracy alone.
2. Present descriptor-based QSAR modeling as the current scope. The manuscript should avoid claiming polymer-specific structure learning until a dataset with polymer identities, SMILES, BigSMILES, or atom/bond graphs is available.
3. Treat the feedforward neural network and descriptor-graph prototype as diagnostic experiments. Their value is in showing the consequences of model complexity under limited representation, not in replacing the final Random Forest recommendation.
4. Use the Week 1-4 schema work to frame future data collection. The strongest next dataset should separate polymer identity, environmental exposure, time, outcome metric, and source metadata.
5. Convert the current paper into either a conference-style case study or a reproducible framework paper before attempting stronger claims about environmental deployment.

## 8. Limitations

The current dataset is descriptor-only. It does not include polymer names, repeat units, molecular structures, SMILES, BigSMILES, atom/bond graphs, or measured degradation-rate constants. This prevents true polymer representation learning, true graph neural network modeling, and continuous degradation-rate regression.

The target is binary classification of ready biodegradability rather than quantitative degradation rate. The model cannot estimate half-life, mineralization rate, mass-loss rate, molecular-weight loss, or environmental persistence time from the current dataset.

The chemistry-aware features are proxy features derived from existing descriptors. They are not true quantum chemical descriptors, experimental measurements, or independently computed molecular properties.

Environmental metadata are limited. The cross-environment validation used proxy environments derived from descriptor-space clustering, not measured exposure conditions such as ultraviolet intensity, temperature, salinity, pH, oxygen, water activity, microbial community, or exposure duration.

The dataset is imbalanced, with fewer RB samples than NRB samples according to the applied work reports. SMOTE helps test training imbalance effects, but it does not replace additional experimental data.

External validation is limited. The repository currently evaluates proxy cross-environment generalization but does not validate against an independent external biodegradation dataset [NEEDS DATA].

The descriptor-graph prototype is exploratory. It should not be described as a full graph neural network for polymer degradation because chemically meaningful graph inputs are absent.

Dataset citation, licensing, and provenance require final verification before publication [NEEDS FULL CITATION] [ASK AUTHOR].

## 9. Conclusion

PolyDegradeML demonstrates that descriptor-based biodegradation prediction should be evaluated through reliability-aware model selection rather than accuracy alone. Using a QSAR biodegradation dataset with 1055 samples and 41 descriptors, the workflow compared classical models, a feedforward neural network, an exploratory descriptor-graph prototype, chemistry-aware proxy features, feature selection, stratified cross-validation, SMOTE, calibration, uncertainty, selective prediction, and proxy cross-environment validation.

The final selected model was `top_ranked | random_forest_classifier`, with reliability score 0.8860. This model was not the best candidate on every individual metric, but it provided the strongest overall balance across the reliability scoreboard. The result supports the main conclusion that trustworthy biodegradation prediction requires calibration, uncertainty, and generalization analysis in addition to standard predictive metrics.

As a scientific template, PolyDegradeML is useful because it makes dataset limitations explicit, preserves generated results, links figures to reproducible scripts, and separates raw source materials from generated outputs. The next step toward publication is to strengthen the literature review, verify dataset citation and licensing, and decide with Dr. Johnson whether the manuscript should be submitted first as a conference-style case study or expanded into a journal article.

## 10. Future Work

Future work should prioritize true molecular and polymer representations. A stronger dataset should include polymer names, repeat units, SMILES or BigSMILES, molecular structures, experimental conditions, measured outcome values, and source metadata.

Quantum chemical descriptors should be computed rather than approximated through proxy features. Candidate descriptors include total energy, dipole moment, polarizability, HOMO energy, LUMO energy, HOMO-LUMO gap, quadrupole moment, and partial-charge dispersion (Karelson et al., 1996).

Quantum or quantum-inspired machine learning could be explored only after the classical reliability baseline is fully reproducible. Future work should define whether quantum methods are being used for molecular representation, kernel construction, optimization, search, or uncertainty estimation. The key research question would not be whether quantum hardware is faster in general, but whether amplitude-based representations or interference-driven search provide measurable advantages for chemically meaningful prediction tasks under the same reliability criteria used in PolyDegradeML [NEEDS CITATION].

Graph neural networks should be revisited when chemically meaningful graph inputs are available. With atom/bond or repeat-unit structure, message-passing models could be evaluated more fairly than the current descriptor-graph prototype (Queen et al., 2023; Wu et al., 2021).

Larger external datasets are needed to test generalization beyond the current descriptor distribution. External validation should include independent chemical domains, environmental conditions, and measurement protocols.

Environmental metadata should be integrated into future modeling. Important variables include ultraviolet exposure, oxygen, moisture, pH, salinity, temperature, microbial context, exposure time, and measurement method.

Active learning could be used to identify compounds or polymers where new experimental measurements would most improve model reliability.

Experimental validation is needed before the model can support high-stakes environmental or materials decisions.

Continuous degradation-rate modeling should be developed once rate constants, half-lives, mass-loss rates, mineralization rates, or other quantitative degradation outcomes are available.

## 11. References

Andrady, A. L. (2011). Microplastics in the marine environment. *Marine Pollution Bulletin, 62*(8), 1596-1605. https://doi.org/10.1016/j.marpolbul.2011.05.030

Butler, K. T., Davies, D. W., Cartwright, H., Isayev, O., & Walsh, A. (2018). Machine learning for molecular and materials science. *Nature, 559*(7715), 547-555. https://doi.org/10.1038/s41586-018-0337-2

Chamas, A., Moon, H., Zheng, J., Qiu, Y., Tabassum, T., Jang, J. H., Abu-Omar, M., Scott, S. L., & Suh, S. (2020). Degradation rates of plastics in the environment. *ACS Sustainable Chemistry & Engineering, 8*(9), 3494-3511. https://doi.org/10.1021/acssuschemeng.9b06635

Chawla, N. V., Bowyer, K. W., Hall, L. O., & Kegelmeyer, W. P. (2002). SMOTE: Synthetic minority over-sampling technique. *Journal of Artificial Intelligence Research, 16*, 321-357. https://doi.org/10.1613/jair.953

Chen, L., Pilania, G., Batra, R., Huan, T. D., Kim, C., Kuenneth, C., & Ramprasad, R. (2021). Polymer informatics: Current status and critical next steps. *Materials Science and Engineering: R: Reports, 144*, 100595. https://doi.org/10.1016/j.mser.2020.100595

Danishuddin, & Khan, A. A. (2016). Descriptors and their selection methods in QSAR analysis: Paradigm for drug design. *Drug Discovery Today, 21*(8), 1291-1302. https://doi.org/10.1016/j.drudis.2016.06.013

Hirschfeld, L., Swanson, K., Yang, K., Barzilay, R., & Coley, C. W. (2020). Uncertainty quantification using neural networks for molecular property prediction. *Journal of Chemical Information and Modeling, 60*(8), 3770-3780. https://doi.org/10.1021/acs.jcim.0c00502

Japkowicz, N. (2006). Why question machine learning evaluation methods? An illustrative review of the shortcomings of current methods. *AAAI Workshop on Evaluation Methods for Machine Learning*. [NEEDS FULL CITATION]

Karelson, M., Lobanov, V. S., & Katritzky, A. R. (1996). Quantum-chemical descriptors in QSAR/QSPR studies. *Chemical Reviews, 96*(3), 1027-1044. https://doi.org/10.1021/cr950202r

Kim, C., Chandrasekaran, A., Huan, T. D., Das, D., & Ramprasad, R. (2018). Polymer Genome: A data-powered polymer informatics platform for property predictions. *The Journal of Physical Chemistry C, 122*(31), 17575-17585. https://doi.org/10.1021/acs.jpcc.8b02913

Kubinyi, H. (1994). Variable selection in QSAR studies. I. An evolutionary algorithm. *Quantitative Structure-Activity Relationships, 13*(3), 285-294. https://doi.org/10.1002/qsar.19940130306

LeCun, Y., Bengio, Y., & Hinton, G. (2015). Deep learning. *Nature, 521*(7553), 436-444. https://doi.org/10.1038/nature14539

Lin, T.-S., Coley, C. W., Mochigase, H., Beech, H. K., Wang, W., Wang, Z., Woods, E., Craig, S. L., Johnson, J. A., Kalow, J. A., Jensen, K. F., & Olsen, B. D. (2019). BigSMILES: A structurally-based line notation for describing macromolecules. *ACS Central Science, 5*(9), 1523-1531. https://doi.org/10.1021/acscentsci.9b00476

Mansouri, K., Ringsted, T., Ballabio, D., Todeschini, R., & Consonni, V. (2013). Quantitative structure-activity relationship models for ready biodegradability of chemicals. *Journal of Chemical Information and Modeling, 53*(4), 867-878. https://doi.org/10.1021/ci4000213

Morelli, K. E. (2024). *Case analysis writing* [PDF]. Harvard Graduate School of Education Writing Services. [NEEDS FULL CITATION]

Patra, T. K. (2022). Data-driven methods for accelerating polymer design. *ACS Polymers Au, 2*(1), 8-26. https://doi.org/10.1021/acspolymersau.1c00035

Ponzoni, I., Sebastian-Perez, V., Requena-Triguero, C., Roca, C., Martinez, M. J., Cravero, F., Diaz, M. F., Paez, J. A., Gomez Arrayas, R., Adrio, J., & Campillo, N. E. (2017). Hybridizing feature selection and feature learning approaches in QSAR modeling for drug discovery. *Scientific Reports, 7*, 2403. https://doi.org/10.1038/s41598-017-02114-3

Queen, O., McCarver, G. A., Thatigotla, S., Abolins, B. P., Brown, C. L., Maroulas, V., & Vogiatzis, K. D. (2023). Polymer graph neural networks for multitask property learning. *npj Computational Materials, 9*, 90. https://doi.org/10.1038/s41524-023-01034-3

Shah, A. A., Hasan, F., Hameed, A., & Ahmed, S. (2008). Biological degradation of plastics: A comprehensive review. *Biotechnology Advances, 26*(3), 246-265. https://doi.org/10.1016/j.biotechadv.2007.12.005

Tian, X., Been, F., Sun, Y., van Thienen, P., & Baeuerlein, P. S. (2023). Identification of polymers with a small data set of mid-infrared spectra: A comparison between machine learning and deep learning models. *Environmental Science & Technology Letters, 10*(11), 1030-1035. https://doi.org/10.1021/acs.estlett.2c00949

Vaicenavicius, J., Widmann, D., Andersson, C., Lindsten, F., Roll, J., & Schon, T. B. (2019). Evaluating model calibration in classification. *Proceedings of Machine Learning Research, 89*, 3459-3467.

Wu, Z., Pan, S., Chen, F., Long, G., Zhang, C., & Yu, P. S. (2021). A comprehensive survey on graph neural networks. *IEEE Transactions on Neural Networks and Learning Systems, 32*(1), 4-24. https://doi.org/10.1109/TNNLS.2020.2978386

Yang, C.-I., & Li, Y.-P. (2023). Explainable uncertainty quantifications for deep learning based molecular property prediction. *Journal of Cheminformatics, 15*, 13. https://doi.org/10.1186/s13321-023-00682-3

QSAR biodegradation dataset. Kaggle `muhammetvarl/qsarbiodegradation`. [NEEDS FULL CITATION] [VERIFY LICENSE]
