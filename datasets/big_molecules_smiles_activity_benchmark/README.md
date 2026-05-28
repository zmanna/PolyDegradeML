# Big Molecules SMILES Activity Benchmark

This folder contains the Kaggle `yanmaksi/big-molecules-smiles-dataset` dataset downloaded with `kagglehub`.

## Scientific Role

This dataset is useful for testing structure-aware molecular machine learning workflows because it contains SMILES strings and simple molecular properties. It can help prototype:

- SMILES parsing
- RDKit descriptor generation
- Morgan fingerprints
- graph-based molecular learning inputs
- regression workflows using `pIC50`

## Important Limitation

This is not a polymer biodegradation dataset. It does not contain:

- polymer names
- BigSMILES strings
- repeat-unit definitions
- biodegradation labels
- degradation-rate constants
- environmental exposure metadata

Use it as a SMILES/molecular-representation benchmark, not as evidence for polymer degradation prediction.

## Files

- `raw/SMILES_Big_Data_Set.csv`: source CSV downloaded from Kaggle.
- `processed/big_molecules_smiles_activity_curated.csv`: curated version with stable sample IDs and the unusable serialized RDKit-object column removed.
- `metadata/source_manifest.json`: provenance, shape, curation notes, and representation limits.

## Source

Kaggle dataset:

```text
yanmaksi/big-molecules-smiles-dataset
```

Downloaded with:

```python
import kagglehub

path = kagglehub.dataset_download("yanmaksi/big-molecules-smiles-dataset")
print("Path to dataset files:", path)
```

License and original-source details should be verified on Kaggle before redistribution or publication use.
