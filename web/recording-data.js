// Shared, DOM-free data boundary. No upload leaves the browser.
export const LEADS=['I','II','III','aVR','aVL','aVF','V1','V2','V3','V4','V5','V6'];
const canonical=s=>LEADS.find(l=>l.toLowerCase()===String(s).trim().toLowerCase());
export function validateRecord(r){
 if(r.schemaVersion!==1||r.units!=='mV')throw Error('Use schemaVersion 1 and units mV.');
 if(!Number.isFinite(r.sampleRateHz)||r.sampleRateHz<1||r.sampleRateHz>20000)throw Error('Invalid sampling rate.');
 if(!Array.isArray(r.leads)||!r.leads.length||r.leads.length>12)throw Error('Provide 1–12 named ECG leads.');
 const leads=r.leads.map(canonical);if(leads.some(x=>!x)||new Set(leads).size!==leads.length)throw Error('Unrecognized or duplicate lead names.');
 if(!Array.isArray(r.samples)||r.samples.length<2||r.samples.length>2000000)throw Error('Provide 2–2,000,000 samples.');
 if(r.samples.some(row=>!Array.isArray(row)||row.length!==leads.length||row.some(v=>!Number.isFinite(v))))throw Error('Every sample must contain a finite voltage for each lead; missing values are not silently filled.');
 return {...r,leads,duration:(r.samples.length-1)/r.sampleRateHz};
}
export function parseCSV(text){
 const rows=text.trim().split(/\r?\n/).map(l=>l.split(',').map(x=>x.trim()));
 const header=rows.shift();if(header[0]!=='time_s')throw Error('CSV must start with time_s, followed by lead names; voltages must be in mV.');
 const values=rows.map(row=>{if(row.length!==header.length||row.some(v=>v===''))throw Error('CSV has missing cells or inconsistent columns.');return row.map(Number);});
 if(values.length<2||values.some(row=>row.some(v=>!Number.isFinite(v))))throw Error('CSV must contain finite numeric values.');
 const dt=values[1][0]-values[0][0];if(dt<=0||values.some((r,i)=>Math.abs(r[0]-(values[0][0]+i*dt))>Math.max(1e-7,dt*.01)))throw Error('CSV timestamps must increase at a uniform sampling interval.');
 return validateRecord({schemaVersion:1,units:'mV',sampleRateHz:1/dt,leads:header.slice(1),samples:values.map(r=>r.slice(1)),source:{format:'CSV',startTimeSeconds:values[0][0]}});
}
export function parseWFDB(header,buffer,dataName){
 const lines=header.split(/\r?\n/).map(x=>x.trim()).filter(x=>x&&!x.startsWith('#'));
 const first=lines.shift().split(/\s+/),channels=Number(first[1]),fs=Number(first[2]),count=Number(first[3]);
 if(first[0].includes('/')||!Number.isInteger(channels)||channels<1||channels>12||!Number.isInteger(count)||count<2||count>2000000)throw Error('Unsupported WFDB record. Use the Python converter for other layouts.');
 const info=lines.slice(0,channels).map(line=>{const f=line.split(/\s+/),gain=/^([\d.]+)(?:\((-?\d+)\))?\/(mV|uV|V)$/.exec(f[2]);
 if(f[0]!==dataName||f[1]!=='16'||!gain||Number(gain[1])<=0)throw Error('Browser import supports one interleaved format-16 .dat file with calibrated units. Use the Python converter for other WFDB formats.');
 const baseline=Number(gain[2]??f[4]);if(!Number.isFinite(baseline))throw Error('Missing ADC baseline.');
 return {lead:f.at(-1),gain:Number(gain[1]),baseline,scale:gain[3]==='uV'?.001:gain[3]==='V'?1000:1};});
 if(info.length!==channels||buffer.byteLength!==count*channels*2)throw Error('Header and data file sizes do not match.');
 const view=new DataView(buffer),samples=Array.from({length:count},(_,i)=>info.map((s,j)=>{const raw=view.getInt16((i*channels+j)*2,true);if(raw===-32768)throw Error('Recording contains missing samples; review it with the Python converter.');return (raw-s.baseline)/s.gain*s.scale;}));
 return validateRecord({schemaVersion:1,units:'mV',sampleRateHz:fs,leads:info.map(s=>s.lead),samples,source:{format:'WFDB',record:first[0]}});
}
