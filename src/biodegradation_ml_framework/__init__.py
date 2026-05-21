"""Biodegradation machine learning framework.

Import workflow modules directly, for example:

    from biodegradation_ml_framework.data import load_qsar_biodegradation
    from biodegradation_ml_framework.reliability_scoreboard import build_model_reliability_scoreboard

The package initializer stays intentionally lightweight so data-only imports do
not load plotting or modeling dependencies unnecessarily.
"""

__all__: list[str] = []
