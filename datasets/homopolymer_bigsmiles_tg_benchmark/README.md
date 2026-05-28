# Homopolymer BigSMILES Tg Benchmark

This dataset folder stores the first PolyDegradeML polymer-structure benchmark.

## Source

Choi, S., Lee, J., Seo, J., Han, S. W., Lee, S. H., Seo, J.-H., & Seok, J. (2024). Automated BigSMILES conversion workflow and dataset for homopolymeric macromolecules. *Scientific Data, 11*, 371. https://doi.org/10.1038/s41597-024-03212-4

Figshare collection:

```text
https://doi.org/10.6084/m9.figshare.c.6858337.v1
```

This folder currently uses the smaller `with_Tg.zip` article because it contains SMILES, BigSMILES, and glass-transition-temperature labels.

## Scientific Role

This is not a biodegradation dataset. It is a polymer representation and property benchmark that lets the project move beyond descriptor-only QSAR data into real polymer structure fields.

It can support:

- SMILES-to-BigSMILES workflow development
- polymer name / repeat-unit / BigSMILES curation
- polymer property regression using glass transition temperature
- Morgan fingerprint and RDKit descriptor generation from repeat-unit SMILES
- future comparison between descriptor, SMILES, BigSMILES, and graph representations

## Files

- `raw/with_Tg.zip`: Figshare archive for records with glass transition temperature.
- `raw/with_Tg/`: extracted source CSV files.
- `processed/homopolymer_bigsmiles_tg_curated.csv`: unified curated table.
- `metadata/source_manifest.json`: provenance, shape, representation status, and limitations.

## Curated Columns

- `sample_id`
- `source_file`
- `source_subset`
- `polymer_name`
- `smiles`
- `bigsmiles`
- `tg_value`
- `tg_unit`
- `tg_source_type`

## Limitations

- This dataset is for homopolymers, not copolymers or complex blends.
- The BigSMILES conversion workflow targets BigSMILES v1.0 notation from the original BigSMILES paper.
- The large no-Tg dataset is not imported by default because it has no property labels.
- No biodegradation labels or degradation-rate constants are present.

## Regeneration

From the repository root:

```sh
python scripts/dataset_tools/build_homopolymer_bigsmiles_dataset.py
```

Optional single-SMILES conversion requires the upstream `BigSMILES_homopolymer` package and RDKit:

```sh
python scripts/dataset_tools/build_homopolymer_bigsmiles_dataset.py --convert-smiles '*CCCCO*'
```
