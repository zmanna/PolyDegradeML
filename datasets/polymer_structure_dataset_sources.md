# Polymer Structure Dataset Sources

This note separates the current descriptor benchmark from future datasets that could support polymer identity, SMILES, BigSMILES, molecular graphs, Morgan fingerprints, and stronger biodegradation claims.

## Current Dataset

The current project dataset is `qsar_biodegradation_descriptor_benchmark/`.

It is appropriate for descriptor-based QSAR/QSPR classification, reliability analysis, calibration, uncertainty analysis, and model-selection experiments. It should not be described as a polymer-structure dataset because it does not contain polymer names, repeat units, SMILES, BigSMILES, molecular graphs, or continuous degradation-rate measurements.

Authoritative source to cite and verify:

- UCI Machine Learning Repository, QSAR biodegradation dataset: https://archive.ics.uci.edu/dataset/254/qsar+biodegradation

## Best Near-Term Upgrade: SMILES-Level Biodegradability Data

These sources are closest to the current research question because they retain biodegradation labels while adding chemical identifiers or structure strings.

1. OPERA / CompTox environmental fate resources
   - Use case: QSAR-ready structures, SMILES/SDF inputs, environmental fate endpoints, and regulatory-style model documentation.
   - Why useful: Strong candidate for extending the current project from descriptor-only inputs to structure-derived descriptors and fingerprints.
   - Source: https://ntp.niehs.nih.gov/whatwestudy/niceatm/comptox/ct-opera/opera
   - Related EPA downloadable data: https://www.epa.gov/comptox-tools/downloadable-computational-toxicology-data

2. Ready biodegradability literature datasets with CAS-RN and SMILES
   - Use case: Binary ready biodegradability classification with explicit chemical identifiers and SMILES strings.
   - Why useful: Enables RDKit descriptors, Morgan fingerprints, molecular graphs, and direct comparison to the current descriptor benchmark.
   - Example source: https://pmc.ncbi.nlm.nih.gov/articles/PMC7763457/

3. enviPath
   - Use case: Biotransformation pathways for organic environmental contaminants using SMILES-based compound inputs.
   - Why useful: Better for mechanistic pathway context than bulk polymer degradation labels.
   - Source: https://wiki.envipath.org/

## Best Polymer-Structure Sources

These sources are stronger for polymer identity and polymer representation, but they are not automatically biodegradation datasets.

1. PoLyInfo
   - Use case: polymer names, constitutional-unit information, chemical structures, sample conditions, and polymer properties.
   - Why useful: Strong source for real polymer identity and structure metadata.
   - Important caution: account/terms apply, and mass downloading or scraping is prohibited.
   - Source: https://polymer.nims.go.jp/en/

2. Polymer Genome / NIST PolymerGenome XML
   - Use case: polymer property prediction datasets and polymer SMILES/property information.
   - Why useful: Useful for learning polymer representations and building a structure-aware workflow.
   - Source: https://materials.registry.nist.gov/data?id=282
   - Related paper: https://www.nature.com/articles/sdata201612

3. PI1M
   - Use case: approximately one million generated polymer structures in p-SMILES format.
   - Why useful: Good for representation learning, pretraining, and polymer chemical-space exploration.
   - Important caution: many entries are hypothetical and do not include biodegradation measurements.
   - Source: https://github.com/RUIMINMA1996/PI1M

4. BigSMILES homopolymer conversion dataset
   - Use case: homopolymer BigSMILES representations at large scale, including a smaller verified subset with glass-transition data.
   - Why useful: Strong candidate for adding BigSMILES parsing and validation to the project.
   - Important caution: property focus is not biodegradation; use as representation infrastructure unless degradation labels are added separately.
   - Source: https://www.nature.com/articles/s41597-024-03212-4

## Recommended Dataset Strategy

For the next scientific phase, avoid replacing the current benchmark. Add a second dataset beside it:

```text
datasets/
├── qsar_biodegradation_descriptor_benchmark/
└── structure_biodegradation_smiles_benchmark/
```

The second dataset should ideally contain:

- chemical or polymer name
- CAS-RN or other stable identifier
- SMILES and, for polymers, BigSMILES or repeat-unit representation
- biodegradation label or continuous degradation outcome
- test method, exposure medium, temperature, time, and source citation
- split metadata for reproducibility

If no single dataset contains all fields, build a staged benchmark:

1. Start with SMILES-level ready biodegradability chemicals.
2. Generate RDKit descriptors and Morgan fingerprints.
3. Add molecular graph baselines.
4. Separately prototype polymer BigSMILES parsing using BigSMILES/PI1M/Polymer Genome sources.
5. Only merge polymer representation and biodegradation claims when biodegradation labels are linked to specific polymer identities or repeat units.
