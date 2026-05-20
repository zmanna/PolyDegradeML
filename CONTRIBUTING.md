# Contributing

This project is organized so future contributors can extend the polymer degradation pathway prediction workflow without reverse-engineering the original experiment history.

## Development Setup

```sh
python -m venv .venv
source .venv/bin/activate
pip install -e .
```

Run tests before opening a pull request:

```sh
PYTHONPATH=src python -m unittest discover -s tests
```

## Repository Conventions

- Put reusable modeling code in `src/firstdataset/`.
- Put runnable experiment entry points in `scripts/`.
- Put curated datasets in `data/processed/`.
- Put generated artifacts in `reports/weekXX/`.
- Put human-readable summaries in `docs/weekly/`.
- Keep root-level files limited to project metadata, setup, and top-level documentation.

## Adding a New Experiment

1. Add reusable functions to `src/firstdataset/` when the logic should be imported by tests or other scripts.
2. Add a runner script in `scripts/`.
3. Write outputs into a new or existing `reports/weekXX/` folder.
4. Add a concise human-readable summary in `docs/weekly/`.
5. Add or update tests when behavior changes.

## Adding New Data

When adding datasets, include:

- Source and license.
- Collection or download date.
- Target definition.
- Feature/descriptor definitions.
- Any known bias, missingness, or representation limitations.

Do not commit private credentials, raw API tokens, or local machine paths.

