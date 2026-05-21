# Processed Data

This folder stores curated datasets generated from `data/raw/`.

Current file:

- `qsar_biodegradation_curated.csv`: curated QSAR biodegradation dataset with stable sample IDs, descriptor names, and readable target labels

Regenerate this file with:

```sh
python scripts/01_curate_dataset.py
```
