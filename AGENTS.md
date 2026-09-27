# Working on Heartscope

Preserve the distinction between synthetic teaching signals and recorded ECGs. Do not infer a patient's exact activation map from a waveform or silently connect imported data to the synthetic model.

The public app lives in web/. Serve only that directory. Never add raw patient files, supplied books, local datasets, credentials, or private hosting metadata to Git. processed/, inbox/, and data/ are local-only ignored folders.

Use scripts/convert_wfdb.py for repeatable WFDB conversion. Keep physical units, calibration, lead names and timing intact. Do not silently normalize, fill missing values, or resample. Preserve attribution when adding public dataset examples. Existing source labels and algorithmic predictions must stay distinguishable.

Run npm test after data import changes. Verify the viewer in a browser after interface changes. Keep the app usable without a frontend build tool. Document user-facing limitations in README.md and docs/DATA.md.
