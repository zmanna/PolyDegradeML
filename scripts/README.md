# Scripts

This folder contains ordered, reproducible workflow scripts.

Run the full workflow with:

```sh
python scripts/generate_all_results.py
```

Or run individual steps:

1. `01_curate_dataset.py`
2. `02_run_baseline_models.py`
3. `03_run_neural_network_baseline.py`
4. `04_run_descriptor_graph_prototype.py`
5. `05_run_cross_environment_validation.py`
6. `06_run_stratified_cross_validation.py`
7. `07_run_feature_engineering_comparison.py`
8. `08_run_feature_importance_selection.py`
9. `09_run_uncertainty_reliability_analysis.py`
10. `10_run_model_reliability_scoreboard.py`

Scripts should orchestrate workflows. Reusable logic belongs in `src/biodegradation_ml_framework/`.
