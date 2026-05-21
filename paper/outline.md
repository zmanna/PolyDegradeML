# Manuscript Outline

## Working Title

Reliability-Centered Evaluation of Machine Learning Models for Plastic Biodegradation Prediction

## Central Research Question

Can chemistry-informed feature engineering and reliability-focused evaluation improve the trustworthiness of machine learning models for biodegradation prediction?

## Suggested Structure

1. Introduction
2. Related Work
3. Dataset and Curation
4. Machine Learning Methods
5. Feature Engineering and Feature Selection
6. Reliability, Calibration, and Generalization Evaluation
7. Results
8. Discussion
9. Limitations
10. Future Work
11. Conclusion

## Repository Outputs To Use

- Dataset curation: `reports/dataset_curation.md`
- Baseline modeling: `reports/baseline_modeling.md`
- Feedforward neural network baseline: `reports/neural_network_baseline_summary.txt`
- Cross-environment validation: `reports/cross_environment_validation.md`
- Uncertainty and reliability: `reports/uncertainty_reliability_summary.txt`
- Final model selection: `reports/model_reliability_report.md`
- Final scoreboard: `results/tables/model_reliability_scoreboard.csv`
- Main figures: `figures/`

## Feedforward Neural Network Finding

The feedforward neural network should be discussed as a nonlinear dense baseline for tabular descriptor inputs. It was tested to determine whether a more flexible neural model could improve on Logistic Regression and Random Forest without requiring molecular graphs, SMILES, BigSMILES, or atom/bond structures.

The key finding is that the neural baseline was informative but not automatically superior. On the initial split it underperformed the Random Forest baseline, showing that additional model complexity did not compensate for the descriptor-only representation. In the final reliability scoreboard, neural-network candidates were competitive under selected feature sets but did not become the final recommendation. This supports the paper's central argument that accuracy and model complexity are insufficient without calibration, uncertainty, and generalization analysis.

The separate `fnn_biodegradability` notebook folder should be treated as historical exploration. The reproducible version of that idea is incorporated into this framework through `scripts/03_run_neural_network_baseline.py` and the later reliability analysis.
