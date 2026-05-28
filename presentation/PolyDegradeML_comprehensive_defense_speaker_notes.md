# PolyDegradeML Comprehensive Defense Speaker Notes

Slide count: 116

## Slide 1. PolyDegradeML

Opening slide. State the thesis clearly: the project is not merely about achieving a high classification score; it is about deciding which biodegradation model is trustworthy under calibration, uncertainty, feature, and distribution-shift checks.

## Slide 2. The thesis in one sentence

This slide establishes the narrative logic. The project moves from prediction to scientific trustworthiness.

Core message: High accuracy alone was insufficient; reliability-aware evaluation changed how model quality was interpreted.

Talk track:

- A descriptor-based QSAR/QSPR biodegradation workflow was built and reorganized into a reusable research framework.

- Classical models, a neural baseline, chemistry-aware features, and reliability metrics were compared.

- The strongest final model was selected by balance across accuracy, calibration, uncertainty, selective prediction, and cross-environment robustness.

Evidence source: reports/main_findings.md; reports/model_reliability_report.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 3. What the audience should remember

Purpose: explain why "What the audience should remember" matters to the research argument.

Core message: The project’s contribution is an evaluation framework, not a new universal degradation simulator.

Key elements to walk through:

- Problem: Biodegradation prediction is scientifically useful but representation- and environment-dependent.

- Method: Classical descriptor models, neural baseline, feature engineering, cross-validation, calibration, and shift testing.

- Finding: The final candidate was top_ranked | random_forest_classifier with reliability score 0.8860.

- Boundary: No polymer structures, SMILES, BigSMILES, quantum ML, or continuous degradation rates are currently implemented.

- Value: The workflow shows how reliability criteria can change model selection.

- Next: Stronger molecular representations, external validation, and experimentally grounded environmental metadata.

Evidence source: paper/manuscript_draft.md; reports/main_findings.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 4. Main conclusions

Purpose: explain why "Main conclusions" matters to the research argument.

Core message: Each conclusion is tied to a generated report or results table.

Talk track:

- Random Forest gave the strongest initial train/test baseline and the strongest final reliability profile.

- The highest single metric did not determine the final recommendation.

- Chemistry-aware proxy features helped selected cases but required reliability validation.

- Neural complexity alone did not dominate strong classical baselines.

- Cross-environment validation exposed generalization risk hidden by ordinary validation.

Evidence source: reports/main_findings.md; reports/model_reliability_report.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 5. Final model selection at a glance

Purpose: explain why "Final model selection at a glance" matters to the research argument.

Core message: The selected candidate won by balanced reliability, not by winning every individual metric.

Talk track:

- Final candidate: top_ranked | random_forest_classifier.

- Reliability score: 0.8860.

- Best standard accuracy and best cross-environment accuracy belonged to other candidates.

Figure to reference: figures/paper/figure_4_reliability_scoreboard.png

Evidence source: reports/model_reliability_report.md; results/tables/model_reliability_scoreboard.csv

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 6. How the argument unfolds

Purpose: explain why "How the argument unfolds" matters to the research argument.

Core message: The deck is structured as a complete scientific defense.

Talk track:

- Background: biodegradation, QSAR, environmental chemistry, and reliability in scientific ML.

- Computational motivation: classical descriptors, probabilistic reasoning, and bounded quantum rationale.

- Methods: dataset, preprocessing, models, feature engineering, validation, calibration, and reliability scoring.

- Results: baseline, neural, descriptor-graph, SMOTE, features, cross-environment, uncertainty, and final scoreboard.

- Interpretation: why the results behaved as they did, what failed, and what must come next.

Evidence source: Presentation structure requested by author

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 7. Background and scientific context

Transition into scientific background.

Core message: Why biodegradation prediction is a hard scientific ML problem.

Evidence source: Section divider

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 8. Plastic degradation is not a single mechanism

Purpose: explain why "Plastic degradation is not a single mechanism" matters to the research argument.

Core message: Hydrolysis, photo-oxidation, biodegradation, fragmentation, and weathering can interact but are not equivalent.

Talk track:

- The current target is ready biodegradability, not a mechanistic simulation.

- Mechanistic clarity prevents overstating the model.

- The early Applied Work reports separated chemical mechanism from ML labels.

Evidence source: source_materials/reports/Week_01_Applied_Work.docx

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 9. Environmental context changes degradation outcomes

Purpose: explain why "Environmental context changes degradation outcomes" matters to the research argument.

Core message: Temperature, UV, oxygen, salinity, pH, water activity, microbial load, and abrasion can change outcomes.

Talk track:

- The dataset lacks most environmental metadata.

- Cross-environment testing is therefore a proxy stress test, not true external environmental validation.

- Future data must record exposure conditions and outcome definitions.

Evidence source: source_materials/reports/Week_02_Applied_Work.docx

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 10. Why experimental degradation data are difficult

Purpose: explain why "Why experimental degradation data are difficult" matters to the research argument.

Core message: Measurements depend on material, exposure, time, and outcome metric.

Talk track:

- A mass-loss experiment is not the same as mineralization.

- A binary ready-biodegradation label is not a degradation-rate constant.

- The paper flags this because the current dataset supports classification only.

Evidence source: reports/dataset_curation.md; paper/manuscript_draft.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 11. QSAR/QSPR gives the first computational bridge

Purpose: explain why "QSAR/QSPR gives the first computational bridge" matters to the research argument.

Core message: Chemical descriptors become numerical inputs for biological or environmental prediction.

Talk track:

- This is appropriate for a descriptor-only dataset.

- It is not equivalent to full molecular structure learning.

- The project treats QSAR as the current scope and future structure learning as a next step.

Evidence source: reports/dataset_curation.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 12. Why machine learning is useful here

Purpose: explain why "Why machine learning is useful here" matters to the research argument.

Core message: ML can screen descriptor patterns that would be slow to inspect manually.

Talk track:

- The goal is not replacing experiments.

- The goal is prioritization, hypothesis generation, and reliability-aware screening.

- Trust depends on calibration and generalization, not accuracy alone.

Evidence source: reports/main_findings.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 13. Why scientific ML needs reliability

Purpose: explain why "Why scientific ML needs reliability" matters to the research argument.

Core message: Scientific models should communicate uncertainty and failure risk.

Talk track:

- A confident wrong answer can be more harmful than an uncertain wrong answer.

- Calibration asks whether predicted probabilities mean what they claim.

- Cross-environment testing asks whether the model survives shifted descriptor regions.

Evidence source: reports/uncertainty_reliability_summary.txt

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 14. Why class imbalance matters

Purpose: explain why "Why class imbalance matters" matters to the research argument.

Core message: The dataset contains more NRB than RB samples.

Talk track:

- Accuracy can hide minority-class errors.

- RB recall is important because the minority class matters scientifically.

- SMOTE was tested to improve class-level behavior.

Evidence source: reports/stratified_cross_validation_summary.txt

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 15. Why distribution shift matters

Purpose: explain why "Why distribution shift matters" matters to the research argument.

Core message: A model trained in one descriptor region may fail in another.

Talk track:

- Ordinary stratified validation tests familiar data.

- Proxy environment validation tests held-out descriptor clusters.

- This became one of the central reliability stress tests.

Evidence source: reports/cross_environment_validation.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 16. Why model complexity is not enough

Purpose: explain why "Why model complexity is not enough" matters to the research argument.

Core message: More flexible models can still fail if representation is weak.

Talk track:

- The FNN was useful as a nonlinear dense baseline.

- The descriptor-graph prototype was limited by descriptor-only input.

- Representation quality mattered as much as algorithm class.

Evidence source: reports/neural_network_baseline_summary.txt; reports/descriptor_graph_prototype_summary.txt

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 17. The research case evolved over time

Purpose: explain why "The research case evolved over time" matters to the research argument.

Core message: The work moved from weekly experiments to a coherent reliability-centered narrative.

Talk track:

- Weeks 1-4 established chemistry and dataset schema.

- Weeks 5-7 established baseline and model-complexity checks.

- Weeks 8-13 moved into distribution shift, feature design, calibration, and final reliability selection.

Evidence source: paper/evidence_mapped_outline.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 18. Classical and quantum motivation

Introduce computational framing and quantum limitations.

Core message: A comparative conceptual framework with strict evidence boundaries.

Evidence source: Section divider

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 19. Classical computing manipulates explicit states

Purpose: explain why "Classical computing manipulates explicit states" matters to the research argument.

Core message: The current models are classical: they operate on descriptor vectors and learned parameters.

Talk track:

- Classical bits encode explicit values.

- Classical ML searches parameter spaces and decision boundaries.

- The project's implemented results are entirely classical.

Evidence source: paper/manuscript_draft.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 20. Quantum computing manipulates amplitudes

Purpose: explain why "Quantum computing manipulates amplitudes" matters to the research argument.

Core message: Quantum states are described by probability amplitudes before measurement.

Talk track:

- Amplitudes can carry sign or phase.

- Interference can amplify or suppress outcome pathways.

- This is conceptual motivation, not a current implemented result.

Evidence source: paper/manuscript_draft.md [NEEDS CITATION]

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 21. Probability is the bridge concept

Purpose: explain why "Probability is the bridge concept" matters to the research argument.

Core message: Reliability analysis and quantum motivation both require careful probabilistic reasoning.

Talk track:

- Classical ML outputs probabilities that need calibration.

- Statistical mechanics uses distributions to reason about many microscopic possibilities.

- Quantum computation evolves amplitudes before measurement produces probabilities.

Evidence source: paper/manuscript_draft.md

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 22. Bits versus qubits

Purpose: explain why "Bits versus qubits" matters to the research argument.

Core message: The distinction is representational, not merely a slogan about speed.

Talk track:

- Bit: one explicit binary state at a time.

- Qubit: a quantum state described by amplitudes over basis states.

- Measurement converts the state into an observed outcome probabilistically.

Evidence source: Quantum primer slide; citation needed

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 23. Superposition is not parallel brute force

Purpose: explain why "Superposition is not parallel brute force" matters to the research argument.

Core message: Superposition is useful only when an algorithm creates meaningful interference.

Talk track:

- Incorrect pathways can be suppressed only if the algorithm is structured to do so.

- Quantum computing is not automatic exponential speedup.

- Hardware, noise, encoding, and measurement constraints matter.

Evidence source: Quantum primer slide; citation needed

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 24. Why high-dimensional chemistry raises the question

Purpose: explain why "Why high-dimensional chemistry raises the question" matters to the research argument.

Core message: Chemical behavior often depends on interacting variables and nonlinear relationships.

Talk track:

- Classical descriptors summarize chemistry but may omit electronic structure.

- Future quantum descriptors may capture energy, dipole, polarizability, orbital gaps, and charge distribution.

- Those descriptors are future work, not current inputs.

Evidence source: reports/feature_engineering_summary.txt

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 25. Why quantum was not chosen over classical descriptors

Purpose: explain why "Why quantum was not chosen over classical descriptors" matters to the research argument.

Core message: Classical descriptors were the only valid implemented representation for the available dataset.

Talk track:

- No SMILES, BigSMILES, or structures were available.

- No quantum ML model was implemented.

- Quantum was considered as a future representation direction.

Evidence source: reports/dataset_curation.md; paper/manuscript_draft.md

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 26. How quantum thinking benefited the project

Purpose: explain why "How quantum thinking benefited the project" matters to the research argument.

Core message: The benefit was conceptual and methodological, not empirical performance.

Talk track:

- It clarified the difference between proxy chemistry and true computed descriptors.

- It reinforced that probabilities and uncertainty are central to trust.

- It created a future benchmark question: do richer representations improve reliability?

Evidence source: paper/manuscript_draft.md

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 27. What a future quantum extension would need

Purpose: explain why "What a future quantum extension would need" matters to the research argument.

Core message: A publishable extension requires much more than naming a quantum algorithm.

Talk track:

- Molecular encoding strategy.

- Hardware or simulator constraints.

- Direct comparison against classical baselines.

- Same reliability metrics: calibration, uncertainty, selective prediction, and shift behavior.

Evidence source: paper/manuscript_draft.md

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 28. Evidence boundary for quantum claims

Purpose: explain why "Evidence boundary for quantum claims" matters to the research argument.

Core message: No quantum advantage, quantum speedup, or quantum-derived metric improvement is claimed.

Talk track:

- The current results come from classical models.

- The quantum section is a future-work rationale.

- Citations are still required for quantum information framing.

Evidence source: paper/publication_readiness_checklist.md

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 29. Research questions and objectives

Move from motivation into hypotheses and objectives.

Core message: The study asks what makes a biodegradation model trustworthy.

Evidence source: Section divider

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 30. Primary research question

Purpose: explain why "Primary research question" matters to the research argument.

Core message: Can chemistry-informed feature engineering and reliability-focused evaluation improve the trustworthiness of ML models for biodegradation prediction?

Talk track:

- Trustworthiness is treated as measurable.

- Accuracy is necessary but not sufficient.

- The final decision integrates multiple reliability criteria.

Evidence source: paper/manuscript_draft.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 31. Primary hypothesis

Purpose: explain why "Primary hypothesis" matters to the research argument.

Core message: Reliability-focused evaluation will reveal meaningful differences hidden by accuracy alone.

Talk track:

- Calibration and uncertainty metrics should alter model interpretation.

- Cross-environment validation should expose generalization risk.

- Final selection should not be determined by one metric.

Evidence source: reports/model_reliability_report.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 32. Secondary hypothesis: feature engineering

Purpose: explain why "Secondary hypothesis: feature engineering" matters to the research argument.

Core message: Chemistry-aware proxy features may improve selected model-feature combinations.

Talk track:

- Proxy features summarize heteroatom, polarity, topology, and donor/acceptor signals.

- They are not true quantum descriptors.

- Their value must be judged by reliability, not only accuracy.

Evidence source: reports/feature_engineering_summary.txt

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 33. Secondary hypothesis: model complexity

Purpose: explain why "Secondary hypothesis: model complexity" matters to the research argument.

Core message: Neural or graph-style complexity may not outperform classical baselines without stronger representation.

Talk track:

- FNN tests nonlinear dense learning.

- Descriptor graph tests an exploratory graph-inspired representation.

- Neither should be overinterpreted as true molecular structure learning.

Evidence source: reports/neural_network_baseline_summary.txt; reports/descriptor_graph_prototype_summary.txt

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 34. Evaluation objectives

Purpose: explain why "Evaluation objectives" matters to the research argument.

Core message: The project intentionally evaluates more than standard classification accuracy.

Talk track:

- Stratified CV.

- SMOTE comparison.

- ROC-AUC, F1, RB recall.

- Brier score, log loss, ECE.

- Uncertainty gap, selective accuracy, cross-environment behavior.

Evidence source: reports/model_reliability_report.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 35. Dataset and data engineering

Dataset section.

Core message: What the data can answer, what it cannot answer, and why that matters.

Evidence source: Section divider

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 36. Dataset summary

Purpose: explain why "Dataset summary" matters to the research argument.

Core message: The current data support binary descriptor-based classification.

Key elements to walk through:

- Rows: 1,055 samples

- Features: 41 descriptor columns

- Target: Binary RB / NRB label

- Missing values: 0 after curation

- Representation: Flat tabular descriptors

- Source: Kaggle QSAR biodegradation dataset; license/citation still needs verification

Evidence source: datasets/qsar_biodegradation_descriptor_benchmark/metadata/qsar_biodegradation_metadata.json; reports/dataset_curation.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 37. Curation decisions

Purpose: explain why "Curation decisions" matters to the research argument.

Core message: The workflow maps anonymous columns to descriptor names and preserves readable labels.

Talk track:

- Raw file: datasets/qsar_biodegradation_descriptor_benchmark/raw/qsar_biodegradation.csv.

- Curated file: datasets/qsar_biodegradation_descriptor_benchmark/processed/qsar_biodegradation_curated.csv.

- Stable sample IDs and readable target labels were added.

Evidence source: reports/dataset_curation.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 38. What is not in the dataset

Purpose: explain why "What is not in the dataset" matters to the research argument.

Core message: Several scientifically important fields are unavailable.

Talk track:

- No polymer names.

- No repeat units.

- No SMILES or BigSMILES.

- No atom/bond graphs.

- No measured degradation rates or half-lives.

Evidence source: reports/dataset_curation.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 39. Morgan fingerprints status

Purpose: explain why "Morgan fingerprints status" matters to the research argument.

Core message: Morgan fingerprints were not generated because structures are unavailable.

Talk track:

- Morgan fingerprints require molecular structure strings such as SMILES.

- This dataset provides descriptors only.

- A future structure-enabled dataset could add fingerprints as an additional classical representation.

Evidence source: reports/dataset_curation.md; future-work limitation

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 40. BigSMILES status

Purpose: explain why "BigSMILES status" matters to the research argument.

Core message: BigSMILES standardization is blocked for the current dataset.

Talk track:

- No polymer repeat units or structure strings exist in the source file.

- The project explicitly records this limitation.

- This prevents polymer-specific structure claims.

Evidence source: reports/dataset_curation.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 41. Chemical space discussion

Purpose: explain why "Chemical space discussion" matters to the research argument.

Core message: Proxy environments approximate descriptor-space regions rather than real environments.

Talk track:

- Stratified k-means created three proxy environments.

- This tests descriptor distribution shift.

- It does not replace external environmental validation.

Evidence source: reports/cross_environment_validation.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 42. Class imbalance

Purpose: explain why "Class imbalance" matters to the research argument.

Core message: Class imbalance motivated stratified splits, class-level metrics, and SMOTE tests.

Talk track:

- NRB is the majority class.

- RB recall is tracked directly.

- SMOTE is applied only inside training folds.

Evidence source: reports/stratified_cross_validation_summary.txt

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 43. Feature engineering tiers

Purpose: explain why "Feature engineering tiers" matters to the research argument.

Core message: The project separates current descriptors, proxy features, and future quantum-style descriptors.

Talk track:

- Tier 1: 41 original descriptors.

- Tier 2: 12 chemistry-aware proxy features.

- Tier 3: planned quantum-style descriptors, not implemented.

Evidence source: reports/feature_engineering_summary.txt

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 44. Project workflow

Purpose: explain why "Project workflow" matters to the research argument.

Core message: The repository now separates data, source code, experiments, reports, figures, and paper outputs.

Figure to reference: figures/paper/figure_1_research_workflow.png

Evidence source: figures/paper/figure_1_research_workflow.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 45. Methodology and experimental design

Methods section.

Core message: Every model is interpreted in terms of representation, expected behavior, and reliability risk.

Evidence source: Section divider

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 46. Logistic Regression

Purpose: explain why "Logistic Regression" matters to the research argument.

Core message: A linear probabilistic baseline for descriptor-based classification.

Talk track:

- Strength: interpretable and calibrated relative to complex models.

- Limitation: linear boundary may underfit nonlinear descriptor interactions.

- Expected behavior: competitive baseline if descriptors are informative.

Evidence source: scripts and reports/baseline_modeling.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 47. Random Forest

Purpose: explain why "Random Forest" matters to the research argument.

Core message: A tree ensemble baseline for nonlinear descriptor interactions.

Talk track:

- Strength: robust tabular performance and nonlinear feature handling.

- Limitation: probabilities may still need calibration checks.

- Expected behavior: strong in-distribution performance.

Evidence source: reports/baseline_modeling.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 48. Feedforward Neural Network

Purpose: explain why "Feedforward Neural Network" matters to the research argument.

Core message: A nonlinear dense baseline for tabular descriptors.

Talk track:

- Strength: can model descriptor interactions.

- Limitation: needs enough data and good representation.

- Finding: useful but did not dominate the strongest classical baseline.

Evidence source: reports/neural_network_baseline_summary.txt

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 49. Descriptor-graph prototype

Purpose: explain why "Descriptor-graph prototype" matters to the research argument.

Core message: A graph-inspired prototype built from descriptor vectors, not molecular graphs.

Talk track:

- Strength: tests whether descriptor relationships can be structured.

- Limitation: not atom/bond message passing.

- Finding: underperformed and should remain exploratory.

Evidence source: reports/descriptor_graph_prototype_summary.txt

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 50. Quantum / quantum-inspired methods

Purpose: explain why "Quantum / quantum-inspired methods" matters to the research argument.

Core message: Conceptual future-work direction, not an implemented experimental model.

Talk track:

- No quantum model or quantum simulator results are in the repository.

- Future work must define encoding, algorithm, and hardware/simulator constraints.

- Any future results must be compared to this classical reliability baseline.

Evidence source: paper/manuscript_draft.md

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 51. Feature selection pipeline

Purpose: explain why "Feature selection pipeline" matters to the research argument.

Core message: Feature sets were compared to test whether fewer ranked features could improve reliability.

Talk track:

- Full enhanced: original plus proxy features.

- Top-ranked: 15 selected features.

- Proxy-only and reduced-hybrid variants tested boundaries.

Evidence source: reports/feature_importance_selection_summary.txt

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 52. SMOTE strategy

Purpose: explain why "SMOTE strategy" matters to the research argument.

Core message: SMOTE was used to test class-level behavior under imbalance.

Talk track:

- Applied within training folds.

- Evaluated with RB recall, accuracy, F1, and ROC-AUC.

- Helped recall but did not alone solve reliability.

Evidence source: reports/stratified_cross_validation_summary.txt

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 53. Cross-validation strategy

Purpose: explain why "Cross-validation strategy" matters to the research argument.

Core message: 5-fold stratified cross-validation provides more stable model comparison than one split.

Talk track:

- Preserves class ratios.

- Reports fold diagnostics.

- Used for baseline and feature-set comparisons.

Evidence source: results/tables/stratified_cv_fold_diagnostics.csv

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 54. Calibration metrics

Purpose: explain why "Calibration metrics" matters to the research argument.

Core message: Calibration was evaluated with Brier score, log loss, and expected calibration error.

Talk track:

- Brier score penalizes probability error.

- Log loss penalizes confident wrong probabilities.

- ECE estimates calibration gap across confidence bins.

Evidence source: reports/uncertainty_reliability_summary.txt

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 55. Uncertainty estimation

Purpose: explain why "Uncertainty estimation" matters to the research argument.

Core message: Uncertainty was evaluated through confidence, entropy, and correct-vs-incorrect gaps.

Talk track:

- Useful models should be less confident when wrong.

- Incorrect high-confidence predictions are a deployment risk.

- Cross-environment uncertainty was especially important.

Evidence source: reports/uncertainty_reliability_summary.txt

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 56. Selective prediction

Purpose: explain why "Selective prediction" matters to the research argument.

Core message: Selective prediction asks what happens if only confident predictions are retained.

Talk track:

- Higher selective accuracy can support screened deployment.

- Coverage matters because abstaining reduces usable predictions.

- Selective performance was one component of final reliability.

Evidence source: results/predictions/final_selective_prediction_results.csv

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 57. Reliability scoring

Purpose: explain why "Reliability scoring" matters to the research argument.

Core message: Final scoring integrates performance, calibration, uncertainty, selective prediction, and shift behavior.

Talk track:

- It avoids one-metric selection.

- It ranks model-feature-set candidates.

- It selected top_ranked | random_forest_classifier.

Evidence source: reports/model_reliability_report.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 58. What each model was expected to test

Walk through the table by comparing columns first, then explaining the scientific implication of each row.

Core message: The models are not interchangeable; each answers a different methodological question.

Evidence source: reports/baseline_modeling.md; reports/neural_network_baseline_summary.txt; paper/manuscript_draft.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 59. Results

Results section.

Core message: Metrics are interpreted as scientific evidence, not just scoreboard values.

Evidence source: Section divider

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 60. Initial model comparison

Accuracy only. This slide intentionally sets up why deeper reliability analysis was needed.

Core message: The first split showed real descriptor signal, but did not answer reliability questions.

Quantitative emphasis:

- Random Forest: 0.8768

- Logistic Regression: 0.8626

- Feedforward NN: 0.8246

- Descriptor graph: 0.6967

Evidence source: reports/baseline_modeling.md; reports/neural_network_baseline_summary.txt; reports/descriptor_graph_prototype_summary.txt

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 61. Model progression visualization

Purpose: explain why "Model progression visualization" matters to the research argument.

Core message: The progression from classical baselines to neural and descriptor-graph tests clarified the role of model complexity.

Figure to reference: presentation/assets/model_progression_comparison.png

Evidence source: presentation/assets/model_progression_comparison.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 62. 5-fold stratified CV: baseline sampling

Purpose: explain why "5-fold stratified CV: baseline sampling" matters to the research argument.

Core message: Classical models remained strong under cross-validation.

Quantitative emphasis:

- Random Forest accuracy: 0.8711

- Logistic Regression accuracy: 0.8701

- FNN accuracy: 0.8588

- Random Forest ROC-AUC: 0.9364

Evidence source: reports/stratified_cross_validation_summary.txt

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 63. SMOTE changed class-level behavior

Purpose: explain why "SMOTE changed class-level behavior" matters to the research argument.

Core message: SMOTE improved selected RB recall values, especially for Logistic Regression and FNN.

Quantitative emphasis:

- LR RB recall with SMOTE: 0.8568

- FNN RB recall with SMOTE: 0.8145

- RF RB recall with SMOTE: 0.7837

- RF accuracy with SMOTE: 0.8739

Evidence source: reports/stratified_cross_validation_summary.txt

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 64. Feature engineering comparison

Purpose: explain why "Feature engineering comparison" matters to the research argument.

Core message: Chemistry-aware proxy features improved some model-feature combinations but did not guarantee best reliability.

Figure to reference: figures/feature_engineering/feature_set_comparison.png

Evidence source: figures/feature_engineering/feature_set_comparison.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 65. Feature engineering interpretation

Purpose: explain why "Feature engineering interpretation" matters to the research argument.

Core message: Proxy chemistry was useful, but not sufficient by itself.

Talk track:

- Tier 1 plus Tier 2 improved FNN recall from 0.8145 to 0.8399 under SMOTE.

- Logistic Regression and Random Forest changed less substantially.

- Proxy-only feature sets later showed overconfidence under cross-environment shift.

Evidence source: reports/feature_engineering_summary.txt; reports/model_reliability_report.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 66. Top feature importance

Purpose: explain why "Top feature importance" matters to the research argument.

Core message: Feature selection showed that a ranked subset could remain competitive and support the final reliability choice.

Figure to reference: figures/paper/figure_2_feature_importance.png

Evidence source: figures/paper/figure_2_feature_importance.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 67. Feature selection findings

Purpose: explain why "Feature selection findings" matters to the research argument.

Core message: The top-ranked feature set was important because of final reliability, not because it maximized every metric.

Talk track:

- Top-ranked feature set contained 15 features.

- Full enhanced feature set performed strongly in standard validation.

- Top-ranked features produced the strongest final model when paired with Random Forest.

Evidence source: reports/feature_importance_selection_summary.txt; results/metadata/feature_selection_sets.json

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 68. Cross-environment mean scores

Purpose: explain why "Cross-environment mean scores" matters to the research argument.

Core message: Distribution-shift testing produced the clearest warning about deployment robustness.

Figure to reference: figures/cross_environment/mean_scores.png

Evidence source: figures/cross_environment/mean_scores.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 69. RB recall under proxy environments

Purpose: explain why "RB recall under proxy environments" matters to the research argument.

Core message: Minority-class recall was unstable across held-out descriptor regions.

Figure to reference: figures/cross_environment/rb_recall_heatmap.png

Evidence source: figures/cross_environment/rb_recall_heatmap.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 70. Mean proxy cross-environment accuracy

Purpose: explain why "Mean proxy cross-environment accuracy" matters to the research argument.

Core message: All models degraded under held-out descriptor clusters.

Quantitative emphasis:

- Random Forest: 0.4210

- Logistic Regression: 0.3727

- Descriptor graph: 0.3688

- FNN: 0.3532

Evidence source: reports/cross_environment_validation.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 71. Calibration curves

Purpose: explain why "Calibration curves" matters to the research argument.

Core message: Calibration made probability quality visible rather than assuming that confidence was meaningful.

Figure to reference: figures/paper/figure_3_calibration_curve.png

Evidence source: figures/paper/figure_3_calibration_curve.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 72. Selective accuracy

Purpose: explain why "Selective accuracy" matters to the research argument.

Core message: Confidence-filtered prediction tested whether more certain predictions were more reliable.

Figure to reference: figures/uncertainty_calibration/selective_accuracy.png

Evidence source: figures/uncertainty_calibration/selective_accuracy.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 73. Uncertainty correct versus incorrect

Purpose: explain why "Uncertainty correct versus incorrect" matters to the research argument.

Core message: A useful model should generally show higher uncertainty for wrong predictions.

Figure to reference: figures/uncertainty_calibration/uncertainty_correct_vs_incorrect.png

Evidence source: figures/uncertainty_calibration/uncertainty_correct_vs_incorrect.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 74. Accuracy-calibration tradeoff

Purpose: explain why "Accuracy-calibration tradeoff" matters to the research argument.

Core message: The strongest single metric did not define the strongest overall candidate.

Figure to reference: figures/model_selection/accuracy_calibration_tradeoff.png

Evidence source: figures/model_selection/accuracy_calibration_tradeoff.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 75. Reliability component heatmap

Purpose: explain why "Reliability component heatmap" matters to the research argument.

Core message: Final ranking integrates multiple reliability components rather than optimizing one metric.

Figure to reference: figures/model_selection/metric_heatmap.png

Evidence source: figures/model_selection/metric_heatmap.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 76. Final reliability scoreboard

Purpose: explain why "Final reliability scoreboard" matters to the research argument.

Core message: The selected model was best balanced across performance, calibration, uncertainty, selective prediction, and shift behavior.

Figure to reference: figures/paper/figure_4_reliability_scoreboard.png

Evidence source: figures/paper/figure_4_reliability_scoreboard.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 77. Reliability scoreboard headline findings

Purpose: explain why "Reliability scoreboard headline findings" matters to the research argument.

Core message: The final model was not the winner on every individual metric.

Talk track:

- Best overall: top_ranked | random_forest_classifier, reliability score 0.8860.

- Strongest standard accuracy: full_enhanced | logistic_regression, accuracy 0.8730.

- Best cross-environment accuracy: top_ranked | logistic_regression, 0.6455.

- Most overconfident under shift: proxy_only | logistic_regression, incorrect confidence 0.9044.

Evidence source: reports/model_reliability_report.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 78. Deep interpretation and discussion

Discussion section.

Core message: Why the results behaved the way they did.

Evidence source: Section divider

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 79. Why Random Forest performed strongly

Purpose: explain why "Why Random Forest performed strongly" matters to the research argument.

Core message: Random Forest can capture nonlinear tabular interactions without requiring structure strings.

Talk track:

- The descriptors were informative.

- Tree ensembles handle feature interactions naturally.

- However, calibration and shift behavior still had to be evaluated.

Evidence source: reports/baseline_modeling.md; reports/model_reliability_report.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 80. Why calibration altered interpretation

Purpose: explain why "Why calibration altered interpretation" matters to the research argument.

Core message: High accuracy does not guarantee meaningful probabilities.

Talk track:

- Calibration metrics exposed probability quality.

- A model can be accurate but overconfident.

- Scientific screening requires knowing when confidence is warranted.

Evidence source: reports/uncertainty_reliability_summary.txt

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 81. Why neural complexity did not dominate

Purpose: explain why "Why neural complexity did not dominate" matters to the research argument.

Core message: The FNN was constrained by the same descriptor-only representation.

Talk track:

- More flexibility did not automatically create better chemistry.

- The FNN remained useful as a complexity check.

- Selected feature sets later made it competitive in parts of the reliability analysis.

Evidence source: reports/neural_network_baseline_summary.txt; reports/model_reliability_report.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 82. Why the descriptor graph underperformed

Purpose: explain why "Why the descriptor graph underperformed" matters to the research argument.

Core message: The prototype used descriptor vectors, not atom/bond graphs.

Talk track:

- Graph neural networks require meaningful nodes and edges.

- Descriptor-graph structure is not equivalent to molecular message passing.

- The result is a representation limitation, not a verdict against GNNs.

Evidence source: reports/descriptor_graph_prototype_summary.txt

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 83. Why robustness degraded under shift

Purpose: explain why "Why robustness degraded under shift" matters to the research argument.

Core message: Held-out descriptor clusters exposed distribution mismatch.

Talk track:

- Model behavior changed when tested outside familiar descriptor regions.

- Cross-environment performance was lower than standard CV.

- This supports cautious deployment framing.

Evidence source: reports/cross_environment_validation.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 84. What the final model means scientifically

Purpose: explain why "What the final model means scientifically" matters to the research argument.

Core message: The selected candidate is a screening framework result, not an environmental oracle.

Talk track:

- It is defensible because it balances multiple reliability indicators.

- It remains limited by descriptor-only data.

- It should be extended with richer representation and external validation.

Evidence source: reports/model_reliability_report.md; paper/manuscript_draft.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 85. Failure analysis and limitations

Limitations section.

Core message: Strong research names its boundaries explicitly.

Evidence source: Section divider

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 86. Dataset limitations

Purpose: explain why "Dataset limitations" matters to the research argument.

Core message: The dataset is not polymer-specific and lacks structure strings.

Talk track:

- No polymer identity.

- No SMILES or BigSMILES.

- No molecular graphs.

- Binary target rather than continuous degradation rate.

Evidence source: reports/dataset_curation.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 87. Feature limitations

Purpose: explain why "Feature limitations" matters to the research argument.

Core message: Proxy chemistry features are not true computed chemistry.

Talk track:

- They are derived from existing descriptors.

- They should not be described as quantum descriptors.

- True descriptors require molecular structures and computation.

Evidence source: reports/feature_engineering_summary.txt

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 88. Ecological realism limitations

Purpose: explain why "Ecological realism limitations" matters to the research argument.

Core message: Proxy environments are not measured environmental conditions.

Talk track:

- No UV exposure metadata.

- No pH/salinity/oxygen/microbial metadata.

- No direct external environmental validation.

Evidence source: reports/cross_environment_validation.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 89. Quantum limitations

Purpose: explain why "Quantum limitations" matters to the research argument.

Core message: Quantum methods were not implemented.

Talk track:

- No quantum circuit, simulator, or hardware results.

- No quantum advantage claim.

- Future work requires citations, encoding, and comparison.

Evidence source: paper/manuscript_draft.md; paper/publication_readiness_checklist.md

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 90. Statistical limitations

Purpose: explain why "Statistical limitations" matters to the research argument.

Core message: The composite reliability score is useful but should be reviewed before publication.

Talk track:

- Weighting choices require explanation.

- Confidence intervals or statistical significance tests could strengthen claims.

- Metrics should be regenerated before submission.

Evidence source: paper/publication_readiness_checklist.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 91. Computational constraints

Purpose: explain why "Computational constraints" matters to the research argument.

Core message: Model scope was constrained by available representation and project maturity.

Talk track:

- No hyperparameter sweep narrative is finalized.

- No external dataset benchmark yet.

- No production deployment validation.

Evidence source: paper/publication_readiness_checklist.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 92. Future work and conclusions

Future and conclusion.

Core message: The project is now a reproducible platform for stronger scientific modeling.

Evidence source: Section divider

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 93. Future data priorities

Purpose: explain why "Future data priorities" matters to the research argument.

Core message: The next dataset should be polymer-specific and experimentally traceable.

Talk track:

- Polymer identity and repeat units.

- SMILES/BigSMILES or graph inputs.

- Environmental metadata.

- Continuous degradation-rate outcomes.

Evidence source: paper/manuscript_draft.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 94. Future model priorities

Purpose: explain why "Future model priorities" matters to the research argument.

Core message: Representation should improve before more complex models are overclaimed.

Talk track:

- Molecular fingerprints when structures exist.

- Graph neural networks with true molecular graphs.

- Quantum chemical descriptors.

- External benchmark datasets.

Evidence source: paper/manuscript_draft.md

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 95. Future reliability priorities

Purpose: explain why "Future reliability priorities" matters to the research argument.

Core message: Reliability should remain the central evaluation lens.

Talk track:

- Calibrated probabilities.

- Selective prediction / abstention.

- Uncertainty-aware deployment.

- External validation under measured conditions.

Evidence source: reports/model_reliability_report.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 96. Future quantum priorities

Purpose: explain why "Future quantum priorities" matters to the research argument.

Core message: Quantum extensions should be benchmarked against the classical reliability framework.

Talk track:

- Define encoding.

- Use simulator or hardware transparently.

- Compare against Random Forest, Logistic Regression, and FNN.

- Report reliability, not only accuracy.

Evidence source: paper/manuscript_draft.md

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 97. Final conclusion

Purpose: explain why "Final conclusion" matters to the research argument.

Core message: PolyDegradeML demonstrates that reliable biodegradation prediction requires more than raw accuracy.

Talk track:

- The central contribution is reliability-aware evaluation.

- The final model is selected by balanced trustworthiness.

- The framework is reusable for future QSAR/QSPR biodegradation studies.

Evidence source: reports/main_findings.md; paper/manuscript_draft.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 98. Closing statement

Purpose: explain why "Closing statement" matters to the research argument.

Core message: The project’s strongest result is a scientific habit: measure uncertainty before trusting prediction.

Talk track:

- Prediction is useful.

- Calibrated prediction is more useful.

- Reliability-aware prediction is what environmental ML needs before deployment.

Evidence source: reports/main_findings.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 99. Supplementary evidence and reproducibility

Appendix starts here.

Core message: Supporting figures, source files, and implementation boundaries.

Evidence source: Section divider

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 100. A1. Research workflow

Purpose: explain why "A1. Research workflow" matters to the research argument.

Core message: Supplementary figure retained for reference and discussion.

Figure to reference: figures/paper/figure_1_research_workflow.png

Evidence source: figures/paper/figure_1_research_workflow.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 101. A2. Feature importance

Purpose: explain why "A2. Feature importance" matters to the research argument.

Core message: Supplementary figure retained for reference and discussion.

Figure to reference: figures/paper/figure_2_feature_importance.png

Evidence source: figures/paper/figure_2_feature_importance.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 102. A3. Feature engineering comparison

Purpose: explain why "A3. Feature engineering comparison" matters to the research argument.

Core message: Supplementary figure retained for reference and discussion.

Figure to reference: figures/feature_engineering/feature_set_comparison.png

Evidence source: figures/feature_engineering/feature_set_comparison.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 103. A4. Feature set comparison

Purpose: explain why "A4. Feature set comparison" matters to the research argument.

Core message: Supplementary figure retained for reference and discussion.

Figure to reference: figures/feature_importance/feature_set_comparison.png

Evidence source: figures/feature_importance/feature_set_comparison.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 104. A5. Cross-environment mean scores

Purpose: explain why "A5. Cross-environment mean scores" matters to the research argument.

Core message: Supplementary figure retained for reference and discussion.

Figure to reference: figures/cross_environment/mean_scores.png

Evidence source: figures/cross_environment/mean_scores.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 105. A6. RB recall heatmap

Purpose: explain why "A6. RB recall heatmap" matters to the research argument.

Core message: Supplementary figure retained for reference and discussion.

Figure to reference: figures/cross_environment/rb_recall_heatmap.png

Evidence source: figures/cross_environment/rb_recall_heatmap.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 106. A7. Calibration curve

Purpose: explain why "A7. Calibration curve" matters to the research argument.

Core message: Supplementary figure retained for reference and discussion.

Figure to reference: figures/paper/figure_3_calibration_curve.png

Evidence source: figures/paper/figure_3_calibration_curve.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 107. A8. Selective accuracy

Purpose: explain why "A8. Selective accuracy" matters to the research argument.

Core message: Supplementary figure retained for reference and discussion.

Figure to reference: figures/uncertainty_calibration/selective_accuracy.png

Evidence source: figures/uncertainty_calibration/selective_accuracy.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 108. A9. Uncertainty correct vs incorrect

Purpose: explain why "A9. Uncertainty correct vs incorrect" matters to the research argument.

Core message: Supplementary figure retained for reference and discussion.

Figure to reference: figures/uncertainty_calibration/uncertainty_correct_vs_incorrect.png

Evidence source: figures/uncertainty_calibration/uncertainty_correct_vs_incorrect.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 109. A10. Accuracy-calibration tradeoff

Purpose: explain why "A10. Accuracy-calibration tradeoff" matters to the research argument.

Core message: Supplementary figure retained for reference and discussion.

Figure to reference: figures/model_selection/accuracy_calibration_tradeoff.png

Evidence source: figures/model_selection/accuracy_calibration_tradeoff.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 110. A11. Metric heatmap

Purpose: explain why "A11. Metric heatmap" matters to the research argument.

Core message: Supplementary figure retained for reference and discussion.

Figure to reference: figures/model_selection/metric_heatmap.png

Evidence source: figures/model_selection/metric_heatmap.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 111. A12. Selective top candidates

Purpose: explain why "A12. Selective top candidates" matters to the research argument.

Core message: Supplementary figure retained for reference and discussion.

Figure to reference: figures/model_selection/selective_top_candidates.png

Evidence source: figures/model_selection/selective_top_candidates.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 112. A13. Reliability scoreboard

Purpose: explain why "A13. Reliability scoreboard" matters to the research argument.

Core message: Supplementary figure retained for reference and discussion.

Figure to reference: figures/paper/figure_4_reliability_scoreboard.png

Evidence source: figures/paper/figure_4_reliability_scoreboard.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 113. A14. Model progression

Purpose: explain why "A14. Model progression" matters to the research argument.

Core message: Supplementary figure retained for reference and discussion.

Figure to reference: presentation/assets/model_progression_comparison.png

Evidence source: presentation/assets/model_progression_comparison.png

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 114. Final reliability scoreboard top candidates

Walk through the table by comparing columns first, then explaining the scientific implication of each row.

Core message: Condensed from the generated model reliability report.

Evidence source: reports/model_reliability_report.md

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 115. Repository files that support this presentation

Purpose: explain why "Repository files that support this presentation" matters to the research argument.

Core message: The deck is evidence-mapped to project artifacts.

Talk track:

- Main manuscript: paper/manuscript_draft.md and paper/PolyDegradeML_consolidated_manuscript.docx.

- Reports: reports/main_findings.md and reports/model_reliability_report.md.

- Tables: results/tables/model_reliability_scoreboard.csv and supporting CSV files.

- Figures: figures/paper, figures/model_selection, figures/feature_engineering, figures/cross_environment, figures/uncertainty_calibration.

- Source reports: source_materials/reports/Week_01 through Week_13 Applied Work and Outside Reading reports.

Evidence source: Repository structure

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.

## Slide 116. Open items before publication

Purpose: explain why "Open items before publication" matters to the research argument.

Core message: These are intentionally visible so unsupported claims do not enter the final paper.

Talk track:

- Verify dataset citation, license, and original authorship.

- Add authoritative citations for quantum information theory framing.

- Regenerate all results before final submission.

- Review composite reliability score formula with Dr. Johnson.

- Confirm author list, venue, and whether source reports should remain public.

Evidence source: paper/publication_readiness_checklist.md; paper/missing_information_to_ask_author.md

Boundary condition: present quantum computing as conceptual motivation and future direction unless a cited result is explicitly shown; do not claim implemented quantum advantage.

Transition: connect this slide back to the central claim that trustworthy biodegradation prediction requires reliability-aware evidence, not a single accuracy score.
