# Processed Data

This folder stores curated versions of the Kaggle SMILES activity dataset.

Current file:

- `big_molecules_smiles_activity_curated.csv`

Curated columns:

- `sample_id`
- `smiles`
- `pic50`
- `num_atoms`
- `logp`

The source `mol` column was removed because it contains serialized Python/RDKit object display strings, not reusable molecular structure data.
