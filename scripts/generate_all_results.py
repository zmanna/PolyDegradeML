from __future__ import annotations

import subprocess
import sys
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]

WORKFLOW_SCRIPTS = [
    "01_curate_dataset.py",
    "02_run_baseline_models.py",
    "03_run_neural_network_baseline.py",
    "04_run_descriptor_graph_prototype.py",
    "05_run_cross_environment_validation.py",
    "06_run_stratified_cross_validation.py",
    "07_run_feature_engineering_comparison.py",
    "08_run_feature_importance_selection.py",
    "09_run_uncertainty_reliability_analysis.py",
    "10_run_model_reliability_scoreboard.py",
]


def main() -> None:
    scripts_dir = PROJECT_ROOT / "scripts"
    for script_name in WORKFLOW_SCRIPTS:
        script_path = scripts_dir / script_name
        print(f"Running {script_path}")
        subprocess.run([sys.executable, str(script_path)], cwd=PROJECT_ROOT, check=True)


if __name__ == "__main__":
    main()
