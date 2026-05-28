# BigSMILES Common Repeat Units Reference

This folder is reserved for a future BigSMILES reference dataset derived from the Olsen Lab MIT BigSMILES project:

https://github.com/olsenlabmit/BigSMILES

## Scientific Role

This source is useful for polymer representation work because it documents BigSMILES notation and includes a common repeat-unit list that maps polymer fragment names to SMILES-style repeat-unit replacements.

It is not a biodegradation dataset. It does not provide biodegradation labels, degradation rates, environmental exposure conditions, calibration data, or model targets.

## Why It Is Separate From The Current QSAR Dataset

The current PolyDegradeML benchmark is a descriptor-only biodegradation classification dataset. The BigSMILES source is a polymer-notation and repeat-unit reference. Keeping these separate prevents two common mistakes:

- treating BigSMILES notation examples as degradation measurements
- treating the descriptor benchmark as polymer-structure data

## Current Status

The upstream repository was inspected at commit:

```text
e4bc86d58a275568323d81bd9b9a7c7eccad9e89
```

No license file was found during inspection. For that reason, the full repeat-unit list is not copied into this repository yet. The folder currently stores provenance metadata and a schema template so future import can be done cleanly after license/citation terms are confirmed.

## Expected Future Fields

The reference table should use this schema:

- `fragment_name`
- `aliases`
- `repeat_unit_smiles`
- `polymer_family`
- `source_repository`
- `source_commit`
- `source_document`
- `license_status`
- `notes`

## Recommended Use

Use this source as BigSMILES/SMILES representation infrastructure. Do not use it as model training data for biodegradation prediction unless it is joined with a separate dataset containing measured biodegradation outcomes.
