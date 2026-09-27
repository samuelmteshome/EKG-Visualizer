# Recording preparation

## Browser import

Open `recordings.html` from the app. Input is limited to 64 MB per file and 2,000,000 sample rows. Use one JSON/CSV file, or select a matching `.hea` and `.dat` pair together. WFDB browser import supports one interleaved format-16 data file, recognized ECG lead names, calibrated units, and no missing samples. Other formats should use the Python converter.

CSV example (values in mV; time in seconds):

```csv
time_s,II,V1
0,0.1,-0.05
0.002,0.2,-0.1
0.004,0.3,-0.15
```

No missing values, irregular timestamps, or duplicate leads are silently repaired. Lead order comes from the file, not an assumed column order. Missing leads remain absent. Selecting an unsupported file reports an error while retaining any previously loaded recording.

## Portable JSON contract, version 1

```json
{
  "schemaVersion": 1,
  "sampleRateHz": 500,
  "units": "mV",
  "leads": ["II", "V1"],
  "samples": [[0.1, -0.05], [0.2, -0.1]],
  "source": {"type": "synthetic", "description": "Example only"}
}
```

`samples` is time-major: each row contains one simultaneous sample in the exact order of `leads`. Duration is `(sampleCount - 1) / sampleRateHz`. Supported names are I, II, III, aVR, aVL, aVF, V1–V6. Unknown metadata is retained during browser export. Never place identifying patient data in examples or Git commits.

This first schema assumes simultaneous, uniformly sampled leads. Do not use it to represent sequential printed ECG strips as simultaneous data. Such files need a future schema supporting per-lead timing and missing spans.

## Python conversion

From the repository folder:

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scripts/convert_wfdb.py "/path/to/record.hea" --output processed
python scripts/convert_wfdb.py "/path/to/a-small-folder" --output processed
```

On Windows, activate with `.venv\Scripts\activate`.

Open resulting JSON files through the recording viewer. Folder conversion recurses, preserves relative paths, and refuses to overwrite output files. Failures are printed individually and return a nonzero exit status. Start with a small folder rather than converting the full archive to large JSON files.

The converter uses WFDB calibration, converts recognized units to mV, and performs no filtering or resampling. It excludes free-text header comments and absolute paths from output metadata. This is not a complete de-identification tool: review inputs and outputs before sharing. Outputs and raw waveforms are ignored by Git by default.

The user's downloaded PTB-XL archive is separate from this repository. For curated cases, retain the original WFDB pairs, `ptbxl_database.csv`, `scp_statements.csv`, and license. Join labels by `ecg_id` in a future curation step; this converter does not assign diagnostic labels or infer diagnoses. Keep original statement likelihoods, dataset version, anonymized patient grouping and provided folds when doing research. PTB-XL statement likelihood 0 denotes unknown, not a negative finding.

## Next additions

1. A curated case manifest joining PTB-XL labels and provenance to selected records.
2. Reviewed waveform landmarks with annotation method, version, and confidence.
3. Explicit mechanism mappings for synchronizing an explanatory heart model.
4. Image digitization with calibration and user correction before importing PDF/photo ECGs.

There is no cloud processing endpoint, background ingestion service, or automatic diagnostic classifier in this release.
