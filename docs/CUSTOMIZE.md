# Customizing Heartscope

## Without editing code

Use the rhythm menu for the 14 teaching examples; the speed menu for slow motion; the lead buttons for the viewing direction; and the anatomy and lead toggles for label visibility. Under **Customize this view**, adjust ECG line width, heart signal thickness, and display gain. These settings save on the current device. Reset appearance restores defaults.

The recordings page has its own lead, playback speed, time window, and gain controls. Gain changes screen scale only; exported data keeps its original values.

## Editing the project with an assistant

Useful requests:

- “Make the labels larger while keeping them outside the heart.”
- “Add three reviewed RBBB examples from this local folder and preserve their attribution.”
- “Add a new teaching pattern, explain its assumptions, and test that its timings remain consistent.”
- “Process the WFDB files in this folder into processed/ and report rejected records.”

For a simple text change, open a file on GitHub and use the pencil button, or edit the local copy. GitHub Actions checks and publishes changes after a push. GitHub's public site never receives local edits until they are committed and pushed.

## Code entry points

- Text, controls, and page layout: `web/index.html`.
- Colors and spacing: `web/style.css`, `web/workspace.css`.
- Pattern definitions and explanatory text: `web/model.js`.
- ECG appearance settings: `web/settings.js`.
- Cross-section geometry: `web/heart.js`.
- Propagation timing: `web/conduction.js`.

Adding a pattern requires updating waveform generation and mechanism timing together, not merely adding a dropdown label. Preserve the shared playback clock. Do not connect an arbitrary imported ECG to a synthetic activation sequence without clearly stated assumptions and reviewed landmarks.

## Bundle-branch block teaching

Select RBBB or LBBB. A red × locates the schematic blocked branch. Mint marks the intact ventricular pathway; orange dashed paths show delayed myocardial spread. The comparison panel describes both ventricles at the current playhead. Use the three numbered buttons to pause in early QRS, transseptal spread, or delayed ventricular activation. Purple still denotes tissue recovery. These are illustrative mechanisms, not patient-specific maps.

## Hover and study speed

Hover over a chamber or conduction pathway for its name. SA/AV node hover reveals an illustrative cellular action potential (phases 4, 0 and 3 with ion movement). It disappears on leaving; keyboard focus also reveals it and Escape dismisses it. This cell demonstration is not time-aligned to the ECG and is not a pathological cellular simulation. It pauses with the main playback.

The model uses a study-relative scale: 1× is 0.1 real time, 1.25× is 0.125, and the fastest 2.5× is 0.25. This changes playback only, never the ECG time axis or heart rate.

On phones, tap a structure to reveal its detail and tap Close or outside to dismiss. “Start tutorial · new to ECGs?” opens an optional seven-step first-year medical student guide. It explains ECG waves, the conduction sequence, lead viewpoints, study speed, pathology and the separate recording viewer.

## Mobile lead navigation

On narrow screens, the selected ECG strip and time slider sit directly under the heart diagram. Use **Change lead strip** to jump to the twelve lead choices. Selecting a lead returns to the heart and updated strip. The desktop layout is unchanged, including when resizing between layouts.

## Electrical labels and plumbing

SA node, AV node, His bundle, bundle branches and Purkinje fibers stay labeled in both electrical views. Hover or tap their labels or locations for anatomical explanations; nodes also show the cellular illustration. The checkbox now controls chamber labels only.

Choose **Plumbing · flow / US**, then **Blood flow** or **Ultrasound-style**. Both use the ECG's simulation clock, pause and time slider. The circulation schematic shows the body, lungs, four chambers and valve-gated flow. The echo-style four-chamber diagram shows filling and ventricular contraction; outflow valves are outside this slice. It is not actual ultrasound, Doppler, or patient-specific imaging.

Mechanical animation currently supports sinus rhythm, sinus bradycardia/tachycardia and first-degree AV block. Other patterns show a static diagram with an explicit limitation and a button to select sinus rhythm. In particular, VF is never illustrated as normal effective pumping. Electrical lead selection stays available in plumbing mode; select Frontal or Transverse to return to electrical pathways.

## Injury-region teaching

Anterior and inferior ST-elevation examples show a persistent hatched LV territory. Its border responds to activation, ST and recovery phases. The tissue region is illustrative, not an infarct-size measurement or proof of necrosis. A mechanism panel relates possible coronary ischemia to altered ventricular-cell potentials and injury currents, with separate ST and T-wave inspection buttons. The normal/ischemic cell curves are qualitative; the waveform remains a synthetic lead example, not a solved injury-current simulation. The frontal view projects the territory; transverse anterior/posterior orientation is explicit.
