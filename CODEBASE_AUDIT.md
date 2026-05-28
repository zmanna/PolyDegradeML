# PolyDegradeML Codebase Audit

Date: 2026-05-28  
Scope: health check, stability review, and organization pass without major refactoring.

## Executive Summary

PolyDegradeML is in strong condition for a research-oriented machine learning repository. The current structure separates reusable source code, ordered workflow scripts, datasets, generated results, figures, reports, manuscript materials, presentation assets, and source reports. The main biodegradation workflow is understandable and mostly reproducible because scripts are numbered, path handling generally uses repository-relative `Path(__file__)` resolution, and most model functions expose deterministic `random_state` arguments.

The highest-priority risks are environment reproducibility and citation/data provenance rather than code architecture. The project currently uses broad lower-bound dependency specifications, the local `.venv` has shown interpreter/package instability, and some generated artifacts are committed intentionally but need a clearer regeneration policy. The scientific narrative is strong, but final publication use should verify dataset licenses, exact citations, software versions, and which figures/tables are canonical.

No major refactoring, model logic changes, file moves, or methodology changes were made during this pass.

## Project Structure Map

```text
.
├── README.md                         # Main scientific project overview
├── CODEBASE_AUDIT.md                 # This stability and health report
├── RUNBOOK.md                        # Operational run instructions
├── REPOSITORY_MAP.md                 # Folder and major-file inventory
├── pyproject.toml                    # Package metadata and dependencies
├── requirements.txt                  # Runtime dependency list
├── activate-project.sh               # Local helper for venv, PYTHONPATH, Kaggle config
├── CITATION.cff                      # Citation metadata
├── LICENSE                           # Repository license
├── datasets/                         # Dataset-specific raw/processed/metadata folders
├── src/biodegradation_ml_framework/  # Reusable project package
├── scripts/                          # Ordered executable research workflow scripts
├── results/                          # Generated machine-readable outputs
├── figures/                          # Generated and curated visual outputs
├── reports/                          # Human-readable generated summaries
├── docs/uml/                         # Mermaid UML and workflow diagrams
├── paper/                            # Manuscript draft, Word export, publication planning
├── presentation/                     # Slide decks, notes, and presentation assets
├── source_materials/                 # Applied Work and Outside Reading reports
├── notebooks/                        # Exploratory notebook area
└── tests/                            # Unit/regression tests for core workflows
```

## Main Workflow

The canonical biodegradation workflow is:

1. `scripts/01_curate_dataset.py`
   - Reads `datasets/qsar_biodegradation_descriptor_benchmark/raw/qsar_biodegradation.csv`.
   - Writes the curated dataset and dataset metadata.
2. `scripts/02_run_baseline_models.py`
   - Runs Logistic Regression and Random Forest train/test baselines.
3. `scripts/03_run_neural_network_baseline.py`
   - Runs the feedforward neural-network tabular baseline.
4. `scripts/04_run_descriptor_graph_prototype.py`
   - Runs the exploratory descriptor-graph prototype.
5. `scripts/05_run_cross_environment_validation.py`
   - Runs proxy environment generalization tests.
6. `scripts/06_run_stratified_cross_validation.py`
   - Runs five-fold stratified cross-validation with baseline and SMOTE conditions.
7. `scripts/07_run_feature_engineering_comparison.py`
   - Evaluates baseline descriptors against chemistry-informed proxy features.
8. `scripts/08_run_feature_importance_selection.py`
   - Ranks features and evaluates reduced feature sets.
9. `scripts/09_run_uncertainty_reliability_analysis.py`
   - Runs calibration, uncertainty, selective prediction, and cross-environment reliability analysis.
10. `scripts/10_run_model_reliability_scoreboard.py`
    - Builds the final reliability-centered model scoreboard.

The one-command orchestrator is `scripts/generate_all_results.py`.

## Strengths

- The repository now reads as a scientific machine learning framework rather than a course archive.
- Main workflow scripts are numbered and named by research purpose.
- Source code is isolated in `src/biodegradation_ml_framework/`.
- Dataset folders are dataset-specific and include `raw/`, `processed/`, and `metadata/`.
- Generated artifacts are separated into `results/`, `figures/`, and `reports/`.
- Reliability-aware evaluation is first-class: calibration, uncertainty, selective prediction, cross-environment validation, and final model scoring are preserved.
- Applied Work and reading reports are preserved in `source_materials/` for provenance.
- UML diagrams and presentation/paper materials are already available for scientific communication.
- Tests cover dataset loading, curation, modeling, feature engineering, uncertainty, and reliability scoreboard behavior.

## Risks

- Dependency versions are specified with broad lower bounds and may resolve differently across machines.
- The current local `.venv` has shown instability with newer Python builds and scientific packages; Python 3.11 is the safer target for now.
- The current dependency lower bound `scikit-learn>=1.8.0` is risky with `imbalanced-learn==0.14.0`; an isolated verification target failed importing imbalanced-learn against scikit-learn 1.8.0 and passed with scikit-learn 1.7.2.
- `activate-project.sh` assumes `.venv/` exists and may fail on a fresh clone until the environment is created.
- The Kaggle CLI in the local environment may have a stale shebang if the virtual environment was moved or recreated.
- Generated results are intentionally versioned, but a clear policy is needed for when to regenerate them and how to compare changes.
- Some source-material, paper, and presentation files are binary Word/PowerPoint artifacts; these are useful for sharing, but Git cannot diff them meaningfully.
- External datasets need license and citation verification before publication or redistribution.
- The descriptor-graph model is exploratory and should not be framed as a true molecular graph neural network because the QSAR dataset lacks molecular structure.

## Reproducibility Concerns

Most core stochastic operations use `random_state=42` or accept a configurable `random_state`:

- Train/test splitting in `data.py`
- Logistic Regression and Random Forest baselines
- Feedforward neural-network baseline
- SMOTE experiments
- Stratified cross-validation
- Feature ranking and permutation importance
- Proxy environment construction through KMeans
- Uncertainty/reliability workflows

Remaining concerns:

- Exact package versions are not pinned.
- Neural-network training can still vary slightly across library versions and BLAS implementations.
- Matplotlib output can vary across versions and backends.
- Result files include `created_at_utc` timestamps, so byte-for-byte reproducibility is not expected even when metrics match.
- The BigSMILES/Tg dataset builder downloads from an external source, so provenance depends on URL availability and upstream file stability.

Recommended reproducibility policy:

- Use Python 3.11 for final result generation.
- Save `python --version` and `python -m pip freeze` with publication artifacts.
- Run `PYTHONPATH=src MPLBACKEND=Agg python scripts/generate_all_results.py` before freezing final tables/figures.
- Treat `results/tables/model_reliability_scoreboard.csv` and `reports/model_reliability_report.md` as canonical final-selection artifacts.
- Keep raw datasets immutable once cited in a paper.

## Data Organization Concerns

The current dataset organization is appropriate for a multi-dataset research repo:

```text
datasets/<dataset_name>/
├── raw/
├── processed/
└── metadata/
```

This is better than a single global `data/raw` folder because the project now contains multiple dataset families with different purposes:

- `qsar_biodegradation_descriptor_benchmark`: primary biodegradation classification dataset.
- `homopolymer_bigsmiles_tg_benchmark`: structure-aware polymer property dataset for BigSMILES/Tg representation work.
- `big_molecules_smiles_activity_benchmark`: large SMILES/activity benchmark used as a structure-representation resource.
- `bigsmiles_common_repeat_units_reference`: schema/reference space for future curated repeat-unit examples.

Do not mix generated model outputs into `datasets/`. Keep generated outputs in `results/`, `figures/`, and `reports/`.

## Dependency Concerns

Declared runtime dependencies:

- `numpy`
- `pandas`
- `scikit-learn`
- `imbalanced-learn`
- `matplotlib`

Observed optional or workflow-specific tools:

- `kagglehub` or Kaggle CLI for acquiring some external datasets.
- Node.js dependencies for rebuilding presentation decks.
- Word/document tooling for manuscript export, if editing `.docx` outputs.

Recommendations:

- Keep dependency changes conservative until final publication results are regenerated.
- Before final publication runs, approve a dependency compatibility update that pins or constrains scikit-learn and imbalanced-learn to a tested pair.
- Add a lockfile or environment export before final paper submission.
- Consider maintaining `requirements-dev.txt` only after deciding which developer tools are truly needed.
- Document optional dataset-download dependencies separately from core model dependencies.

## Scientific Reporting Concerns

The project clearly preserves:

- Dataset description and limitations
- Preprocessing and label mapping
- Model settings
- Confusion matrices for relevant models
- Cross-validation and SMOTE comparisons
- Feature-engineering and feature-selection comparisons
- Calibration, uncertainty, selective prediction, and reliability-scoreboard outputs
- Paper-facing figures and tables

Items to verify before publication:

- Exact dataset citation and license for the QSAR biodegradation dataset.
- Citation/license status for Kaggle datasets and Figshare/Choi et al. data.
- Whether committed generated figures match the exact final tables in `results/`.
- Whether every manuscript claim maps to a source file in `results/`, `reports/`, `figures/`, or `source_materials/`.
- Whether the descriptor-graph prototype is labeled consistently as exploratory.

## Safe Changes Made

- Removed local `__pycache__/` bytecode cache directories.
- Added `.gitignore` entries for common local caches and logs:
  - `.pytest_cache/`
  - `.mypy_cache/`
  - `.ruff_cache/`
  - `.ipynb_checkpoints/`
  - `*.log`
- Added this audit document.
- Added `RUNBOOK.md`.
- Added `REPOSITORY_MAP.md`.
- Verified the smoke pipeline successfully with the local `.venv`.
- Verified the full unit/regression suite successfully in an isolated Python 3.11 dependency target using `numpy==2.3.5`, `pandas==2.3.3`, `scikit-learn==1.7.2`, `imbalanced-learn==0.14.0`, and `matplotlib==3.10.7`.

## Changes Requiring User Approval

- Rename or move any core scripts.
- Move large numbers of result, report, figure, paper, or presentation files.
- Delete archived reports or exploratory artifacts.
- Replace print-based scripts with a logging framework.
- Introduce a configuration system.
- Pin or change dependency versions aggressively.
- Update `requirements.txt` and `pyproject.toml` to replace the currently risky `scikit-learn>=1.8.0` lower bound with a tested compatibility range.
- Add new heavy dependencies such as RDKit or a BigSMILES parser to the core install.
- Change model hyperparameters, feature-selection logic, reliability-scoreboard weights, or final model selection methodology.
- Split binary paper/presentation artifacts into a separate release/archive workflow.

## Recommended Next Steps

1. Create a clean Python 3.11 environment and verify the full workflow.
2. Save a final environment export after regenerating publication results.
3. Verify dataset licenses and citations with Dr. Johnson before public citation.
4. Add an artifact provenance table mapping each final paper figure/table to the generating script and source result file.
5. Decide whether archived weekly reports should remain in Git or move to release artifacts.
6. Add a small `docs/publication_artifacts.md` after the final manuscript figure set is locked.
