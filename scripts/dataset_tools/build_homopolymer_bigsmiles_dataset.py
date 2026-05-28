from __future__ import annotations

import argparse
import csv
import json
import shutil
import subprocess
import urllib.request
import zipfile
from datetime import datetime, timezone
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATASET_DIR = PROJECT_ROOT / "datasets" / "homopolymer_bigsmiles_tg_benchmark"
RAW_DIR = DATASET_DIR / "raw"
PROCESSED_DIR = DATASET_DIR / "processed"
METADATA_DIR = DATASET_DIR / "metadata"

WITH_TG_ARTICLE_ID = "24219958"
WITH_TG_DOI = "10.6084/m9.figshare.24219958.v1"
WITH_TG_DOWNLOAD_URL = "https://ndownloader.figshare.com/files/42507037"


def download_file(url: str, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if output_path.exists() and output_path.stat().st_size > 0:
        return
    try:
        with urllib.request.urlopen(url, timeout=60) as response:
            with output_path.open("wb") as handle:
                shutil.copyfileobj(response, handle)
    except Exception:
        subprocess.run(["curl", "-L", url, "-o", str(output_path)], check=True)


def extract_zip(zip_path: Path, output_dir: Path) -> list[Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path) as archive:
        archive.extractall(output_dir)
    return sorted(path for path in output_dir.rglob("*") if path.is_file())


def project_relative(path: Path) -> str:
    return str(path.resolve().relative_to(PROJECT_ROOT))


def normalize_header(value: str) -> str:
    return value.strip().replace("\ufeff", "")


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    last_error: Exception | None = None
    for encoding in ("utf-8-sig", "cp1252", "latin-1"):
        try:
            with path.open(newline="", encoding=encoding) as handle:
                reader = csv.DictReader(handle)
                if reader.fieldnames is None:
                    raise ValueError(f"No header row found in {path}")
                fieldnames = [normalize_header(field) for field in reader.fieldnames]
                rows = []
                for raw_row in reader:
                    rows.append({normalize_header(key): value for key, value in raw_row.items()})
            return fieldnames, rows
        except UnicodeDecodeError as exc:
            last_error = exc
    raise UnicodeDecodeError(
        "unknown",
        b"",
        0,
        1,
        f"Could not decode {path} with utf-8-sig, cp1252, or latin-1: {last_error}",
    )


def first_present(row: dict[str, str], candidates: list[str]) -> str:
    for candidate in candidates:
        if candidate in row:
            return row[candidate]
    return ""


def curate_with_tg_dataset(extracted_files: list[Path], output_path: Path) -> dict[str, object]:
    csv_files = [path for path in extracted_files if path.suffix.lower() == ".csv"]
    if not csv_files:
        raise FileNotFoundError("No CSV files were found in the extracted Figshare archive.")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = [
        "sample_id",
        "source_file",
        "source_subset",
        "polymer_name",
        "smiles",
        "bigsmiles",
        "tg_value",
        "tg_unit",
        "tg_source_type",
    ]

    total_rows = 0
    source_counts: dict[str, int] = {}
    missing_polymer_name = 0
    missing_smiles = 0
    missing_bigsmiles = 0
    missing_tg = 0

    with output_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()

        for csv_path in sorted(csv_files):
            _, rows = read_csv(csv_path)
            subset = csv_path.stem
            source_counts[subset] = len(rows)
            for row in rows:
                total_rows += 1
                polymer_name = first_present(row, ["Polymer name", "Polymer", "polymer_name", "Polymer Name"])
                smiles = first_present(row, ["SMILES", "smiles"])
                bigsmiles = first_present(row, ["BigSMILES", "bigsmiles"])
                tg_c = first_present(row, ["Tg (C)", "Tg(C)", "Tg_C", "Tg"])
                tg_k = first_present(row, ["Tg (K) exp", "Tg(K) exp", "Tg_K_exp", "Tg_K"])

                tg_value = tg_c or tg_k
                tg_unit = "C" if tg_c else ("K" if tg_k else "")
                tg_source_type = (
                    "experimental"
                    if "bicerano" in subset.lower()
                    else "machine_derived"
                    if "jcim" in subset.lower()
                    else "unknown"
                )

                missing_polymer_name += int(not polymer_name)
                missing_smiles += int(not smiles)
                missing_bigsmiles += int(not bigsmiles)
                missing_tg += int(not tg_value)

                writer.writerow(
                    {
                        "sample_id": f"homopolymer_bigsmiles_{total_rows:05d}",
                        "source_file": csv_path.name,
                        "source_subset": subset,
                        "polymer_name": polymer_name,
                        "smiles": smiles,
                        "bigsmiles": bigsmiles,
                        "tg_value": tg_value,
                        "tg_unit": tg_unit,
                        "tg_source_type": tg_source_type,
                    }
                )

    return {
        "row_count": total_rows,
        "source_counts": source_counts,
        "missing_values": {
            "polymer_name": missing_polymer_name,
            "smiles": missing_smiles,
            "bigsmiles": missing_bigsmiles,
            "tg_value": missing_tg,
        },
    }


def try_convert_smiles(smiles: str, *, move_parallel: int = -1) -> str:
    try:
        from BigSMILES_homopolymer import SMILES2BigSMILES as Converter
    except ImportError as exc:
        raise RuntimeError(
            "BigSMILES_homopolymer is not installed. Install it from "
            "https://github.com/CDAL-SChoi/BigSMILES_homopolymer to use conversion."
        ) from exc

    converter = Converter()
    result = converter.Converting_single(SMILES=smiles, move_parallel=move_parallel)
    if result == 0:
        return ""
    return str(result)


def write_manifest(zip_path: Path, extracted_files: list[Path], stats: dict[str, object]) -> None:
    manifest = {
        "dataset_name": "homopolymer_bigsmiles_tg_benchmark",
        "dataset_type": "polymer_structure_property_benchmark",
        "created_at_utc": datetime.now(timezone.utc).isoformat(),
        "source_article": "Choi et al. (2024), Automated BigSMILES conversion workflow and dataset for homopolymeric macromolecules",
        "source_article_doi": "10.1038/s41597-024-03212-4",
        "figshare_collection_doi": "10.6084/m9.figshare.c.6858337.v1",
        "figshare_with_tg_article_id": WITH_TG_ARTICLE_ID,
        "figshare_with_tg_doi": WITH_TG_DOI,
        "download_url": WITH_TG_DOWNLOAD_URL,
        "raw_zip_path": project_relative(zip_path),
        "raw_files": [project_relative(path) for path in extracted_files],
        "curated_path": "datasets/homopolymer_bigsmiles_tg_benchmark/processed/homopolymer_bigsmiles_tg_curated.csv",
        "row_count": stats["row_count"],
        "source_counts": stats["source_counts"],
        "missing_values": stats["missing_values"],
        "representation_status": {
            "smiles_available": True,
            "bigsmiles_available": True,
            "polymer_identity_available": True,
            "repeat_unit_available": True,
            "biodegradation_labels_available": False,
            "degradation_rates_available": False,
            "glass_transition_temperature_available": True,
        },
        "scientific_use": "Use as a polymer representation and Tg property benchmark. Do not use as biodegradation evidence.",
        "license_status": "Scientific Data article is CC BY 4.0; verify Figshare file terms before redistribution.",
    }
    METADATA_DIR.mkdir(parents=True, exist_ok=True)
    (METADATA_DIR / "source_manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Download and curate the Choi et al. homopolymer SMILES/BigSMILES Tg benchmark."
    )
    parser.add_argument(
        "--convert-smiles",
        help="Optional single homopolymer repeat-unit SMILES string with two asterisks to convert using BigSMILES_homopolymer.",
    )
    parser.add_argument("--move-parallel", type=int, default=-1)
    args = parser.parse_args()

    if args.convert_smiles:
        print(try_convert_smiles(args.convert_smiles, move_parallel=args.move_parallel))
        return

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    METADATA_DIR.mkdir(parents=True, exist_ok=True)

    zip_path = RAW_DIR / "with_Tg.zip"
    extract_dir = RAW_DIR / "with_Tg"
    curated_path = PROCESSED_DIR / "homopolymer_bigsmiles_tg_curated.csv"

    download_file(WITH_TG_DOWNLOAD_URL, zip_path)
    extracted_files = extract_zip(zip_path, extract_dir)
    stats = curate_with_tg_dataset(extracted_files, curated_path)
    write_manifest(zip_path, extracted_files, stats)

    print(f"Wrote curated dataset to {curated_path}")
    print(f"Wrote metadata to {METADATA_DIR / 'source_manifest.json'}")
    print(json.dumps(stats, indent=2))


if __name__ == "__main__":
    main()
