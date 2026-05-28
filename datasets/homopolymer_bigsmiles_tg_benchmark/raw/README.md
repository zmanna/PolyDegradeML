# Raw Data

This folder stores the downloaded Figshare archive and extracted source files from Choi et al. (2024).

Current source:

```text
with_Tg.zip
```

Figshare article:

```text
https://doi.org/10.6084/m9.figshare.24219958.v1
```

Do not manually edit raw files. Regenerate the processed table with:

```sh
python scripts/dataset_tools/build_homopolymer_bigsmiles_dataset.py
```
