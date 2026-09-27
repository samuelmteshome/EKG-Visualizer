# Heartscope · EKG Visualizer

Explore how the twelve ECG leads relate to a heart cross-section, then open your own digital recordings.

**[Open the interactive viewer](https://samuelmteshome.github.io/EKG-Visualizer/)** · [Recording formats](docs/DATA.md) · [Customization guide](docs/CUSTOMIZE.md)

## Start here — no coding required

1. Open the viewer above. Start with **Normal sinus rhythm** and **¼× Study** speed.
2. Choose a lead. The diagram switches between the frontal and transverse cross-sections.
3. Pause, drag the time slider, or click a peak or trough to inspect that moment.
4. Open **Customize this view** to change line thickness and display gain. Preferences stay on your device.
5. Choose **Open your ECG recordings** to import files. Try the sample first.

The model includes 14 illustrative rhythm/morphology examples. The recording viewer supports lead selection, playback, slow motion, time scrubbing, display gain, and portable JSON export.

## Run on your computer

Download this repository using **Code → Download ZIP**, then unzip it.

- **Mac:** double-click `Start Heartscope.command`.
- **Windows:** double-click `Start Heartscope.bat`.
- Requires Python 3. If it is missing, install it from [python.org](https://www.python.org/downloads/).
- If macOS does not run the launcher, open Terminal in this folder and run `python3 scripts/serve.py`.
- The browser opens automatically. Close the terminal window to stop the app.
- For a different port: `python3 scripts/serve.py --port 8766`.

Do not double-click `web/index.html`: browser module security requires a local web server. The launcher serves only `web/`, bound to your own computer, so sibling datasets are not exposed.

## Open a recording

Click **Open your ECG recordings** and select:

- One matching `.hea` and `.dat` pair together (interleaved WFDB format 16, including PTB-XL).
- A CSV with `time_s` first, then named ECG leads, with voltages in mV.
- A Heartscope JSON file produced by the converter or exported by this viewer.

Files are read locally in your browser. There is no upload server or account. Selecting a file does not add it to GitHub. Exported copies preserve supplied metadata; review it before sharing.

PDF/photo digitization, automatic diagnosis, and patient-specific activation reconstruction are **not implemented**. Recorded waveforms do not drive the synthetic heart animation. The two views are deliberately labeled and separate until reviewed timing annotations and mechanism mappings are available.

## Preparing more files with an assistant

See [the data guide](docs/DATA.md). A repeatable Python converter accepts one WFDB record or a folder, keeps calibrated mV values, rejects invalid samples, and writes portable JSON outside the public site. Ask an assistant to process a specific folder, inspect the conversion report, and help curate examples. Conversion is manual; there is no background watcher.

## Project map

| Location | Purpose |
|---|---|
| `web/index.html`, `web/style.css` | Teaching interface and layout |
| `web/model.js` | Synthetic rhythms, lead definitions, and waveform generation |
| `web/conduction.js`, `web/heart.js` | Conduction timing and SVG cross-sections |
| `web/inspector.js`, `web/app.js` | Beat inspector and shared playback |
| `web/settings.js` | Adjustable appearance and device-local preferences |
| `web/recordings.html`, `web/recordings.js` | Recorded-signal viewer |
| `web/recording-data.js` | Validated CSV/JSON/WFDB import boundary |
| `scripts/convert_wfdb.py` | Offline WFDB conversion |
| `tests/` | Data integrity checks |

No frontend dependencies or build step are required. For contributors: Node 20+ and `npm test`. Python dependencies are only needed for the offline WFDB converter. GitHub Actions checks every push and deploys `web/` to GitHub Pages after successful checks.

## Scientific scope and attribution

This is an educational tool, not a diagnostic device. Lead territories describe viewing directions, not isolated electrical sources. Synthetic propagation, timings, and anatomy are schematic. Imported voltages remain measured data; the software does not infer their diagnosis or cardiac source map.

The existing Heartscope code has been transferred without the supplied textbook, private hosting configuration, or research dataset. The included JSON example is synthetic. Consult the references in the viewer for the educational model. PTB-XL is separate CC BY 4.0 material; retain its license, version and citations when curating recordings: [PTB-XL 1.0.3](https://physionet.org/content/ptb-xl/1.0.3/).

No open-source license has been assigned to this project's code yet. The owner should choose a license before inviting redistribution; public visibility alone is not a license grant.
