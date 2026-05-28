# Publication Run: 2026-05-28

This file records the first stabilized publication-oriented regeneration after the codebase health check.

## Purpose

The goal of this run was to regenerate canonical result artifacts with a tested Python 3.11 scientific stack and avoid the broken dependency combination observed during the audit.

## Command

```sh
PYTHONPATH=/tmp/polydegrade_health_deps:src MPLBACKEND=Agg \
  /Library/Frameworks/Python.framework/Versions/3.11/bin/python3 \
  scripts/generate_all_results.py
```

For normal reuse, create a fresh environment from `requirements-verified.txt` instead of using `/tmp/polydegrade_health_deps`.

## Verified Core Package Versions

```text
numpy==2.3.5
pandas==2.3.3
scikit-learn==1.7.2
imbalanced-learn==0.14.0
matplotlib==3.10.7
scipy==1.17.1
joblib==1.5.3
threadpoolctl==3.6.0
```

## Outputs Regenerated

- `datasets/qsar_biodegradation_descriptor_benchmark/processed/qsar_biodegradation_curated.csv`
- `datasets/qsar_biodegradation_descriptor_benchmark/metadata/qsar_biodegradation_metadata.json`
- `results/metadata/*.json`
- `results/tables/*.csv`
- `results/predictions/*.csv`
- `figures/cross_environment/*.png`
- `figures/feature_engineering/*.png`
- `figures/feature_importance/*.png`
- `figures/uncertainty_calibration/*.png`
- `figures/model_selection/*.png`
- `figures/paper/figure_2_feature_importance.png`
- `figures/paper/figure_3_calibration_curve.png`
- `figures/paper/figure_4_reliability_scoreboard.png`
- `reports/*.md`
- `reports/*.txt`

## Final Scoreboard Snapshot

The final reliability scoreboard remained led by:

```text
top_ranked | random_forest_classifier
overall_rank: 1.0
overall_reliability_score: 0.8859987864815809
cv_accuracy: 0.8625592417061612
cross_accuracy: 0.5848341232227489
selective_accuracy_50: 0.7888257575757576
selective_accuracy_25: 0.803030303030303
```

Source: `results/tables/model_reliability_scoreboard.csv`

## Observed Differences From Previous Artifacts

- Most JSON metadata files changed only in `created_at_utc`.
- Figures were refreshed from the stabilized dependency environment.
- One feature-selection ROC-AUC value changed slightly:
  - `proxy_only | smote | random_forest_classifier | fold 3`
  - previous: `0.9142857142857143`
  - regenerated: `0.9138832997987927`
- The corresponding rounded report value changed from `0.8919` to `0.8918`.

This small numerical drift is consistent with dependency-version differences and does not change the project interpretation or final model selection.

## Known Warning

The descriptor-graph/feature-selection path emitted a NumPy correlation warning:

```text
RuntimeWarning: invalid value encountered in divide
```

This is already expected for constant or near-constant descriptor correlations in the exploratory descriptor-graph adjacency path. The code handles this with `nan_to_num`, and the warning did not cause a workflow failure.

## Verification Status

The full workflow completed successfully. Unit/regression tests also passed after regeneration:

```sh
PYTHONPATH=/tmp/polydegrade_health_deps:src MPLBACKEND=Agg \
  /Library/Frameworks/Python.framework/Versions/3.11/bin/python3 \
  -m unittest discover -s tests -p 'test*.py'
```

Result:

```text
Ran 16 tests in 147.575s
OK
```
