# Publication Readiness Checklist

## Missing Citations

- [ ] Verify and add complete citation/license information for the Kaggle QSAR biodegradation dataset.
- [ ] Confirm whether additional polymer degradation sources from Applied Work reports, such as Wiles and Scott or Gewert et al., should be included. They are mentioned in source reports but are not fully specified in the extracted outside-reading reference list.
- [ ] Verify the full citation details for Japkowicz (2006), currently listed from the source report as an AAAI workshop item.
- [ ] Add citations for any claims about environmental testing time, experimental cost, or deployment use cases if those claims remain in the final manuscript.
- [ ] Add authoritative citations for the quantum information framing if the "Why Quantum Methods Were Considered" subsection remains in the manuscript.

## Dataset And License

- [ ] Confirm dataset source URL, original authors, license, and acceptable redistribution status.
- [ ] Confirm whether the dataset should be described as chemicals, polymers, plastics, or QSAR biodegradation compounds. Current metadata says it is not polymer-specific.
- [ ] Confirm whether publication should include the raw dataset or only scripts that retrieve/process it.

## Figures

- [ ] Generate a clean baseline model comparison figure for publication.
- [ ] Decide which feature figure is main text and which is supplementary.
- [ ] Add final captions for all figures.
- [ ] Verify figure resolution and file format requirements for the target venue.
- [ ] Consider replacing the README-style workflow graphic with a simpler journal-style workflow diagram if needed.

## Methodology

- [ ] Review the expanded Section 6.1 chronology and confirm that each weekly Applied Work report is represented accurately.
- [ ] Decide whether the weekly chronology should remain in the main manuscript, become a shorter table, or move partly to supplementary materials depending on venue length limits.
- [ ] Confirm that the case-analysis framing from Morelli (2024) is appropriate for the final target venue, or rephrase it as a "research case study" if the venue expects conventional scientific structure.
- [ ] Review exact model hyperparameters in `src/` and `scripts/` before final submission.
- [ ] Explain the composite reliability score formula in enough detail for reproduction.
- [ ] Clarify whether selective accuracy values in the final scoreboard correspond to 25% coverage in all cases.
- [ ] Confirm whether reported SMOTE results should be included in the main text or supplement.
- [ ] Confirm whether the descriptor-graph prototype should appear in the main Results or only in limitations/supplement.

## Metrics Needing Verification

- [ ] Re-run `python scripts/generate_all_results.py` immediately before final submission.
- [ ] Re-run the test suite before final submission.
- [ ] Verify that all manuscript numbers match current files in `results/tables/` and `reports/`.
- [ ] Verify that no values were copied from older archived weekly reports when newer generated outputs exist.

## Claims To Soften

- [ ] Avoid claiming polymer-specific prediction from the current descriptor-only dataset.
- [ ] Avoid claiming continuous degradation-rate prediction.
- [ ] Avoid claiming true molecular graph neural network modeling.
- [ ] Avoid implying that proxy chemistry features are measured or quantum-computed descriptors.
- [ ] Avoid implying external environmental validation; current cross-environment validation is descriptor-space proxy validation.
- [ ] Avoid claiming that quantum machine learning was implemented or that quantum advantage was demonstrated. The current quantum section is conceptual future-work rationale only.

## Items To Review With Dr. Johnson

- [ ] Target venue: undergraduate journal, conference paper, or full journal article.
- [ ] Whether Dr. Johnson should be listed as co-author and how contributions should be described.
- [ ] Whether the paper should emphasize a case study, framework, or benchmark-style evaluation.
- [ ] Whether all source reports should be visible in the public repository.
- [ ] Whether to keep the repository name as `PolyDegradeML` for publication citation.
- [ ] Whether to add a formal software release and DOI before citation.
