# Exploratory Notebooks

This folder is reserved for exploratory notebooks that helped shape the project but are not the canonical source of reproducible results.

Use this folder for:

- downloaded Kaggle notebooks used for early exploration
- quick experiments before converting an idea into `src/` modules or `scripts/`
- visual checks or scratch analyses that support thinking but should not be cited as the final workflow

The reproducible project pipeline lives in `scripts/` and `src/`. If a notebook produces a result that belongs in the paper or final report, convert that logic into a script and write its outputs to `results/`, `figures/`, or `reports/`.

The separate workspace folder `fnn_biodegradability/` is historical exploration of the feedforward neural-network idea. If it is incorporated into this repository, place it here and keep the reproducible version in `scripts/03_run_neural_network_baseline.py`.
