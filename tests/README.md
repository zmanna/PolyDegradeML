# Tests

This folder contains regression tests for the project workflows.

Run tests from the repository root:

```sh
PYTHONPATH=src python -m unittest discover -s tests -p 'test*.py'
```

The tests check dataset loading, curation, modeling outputs, validation outputs, feature engineering, uncertainty analysis, and final reliability scoreboard construction.
