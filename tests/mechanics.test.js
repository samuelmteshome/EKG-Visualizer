import test from 'node:test';
import assert from 'node:assert/strict';
import {mechanicalFrame} from '../web/mechanics.js';
const beats=[{q:0},{q:.8},{q:1.6}],atria=[-.16,.64,1.44];
test('ejection follows QRS with closed AV valves; filling never opens outflow valves',()=>{
 for(let t=0;t<1.6;t+=.001){const f=mechanicalFrame(t,beats,atria,'sinus');assert.ok(!(f.avOpen&&f.outOpen));assert.ok(f.volume>=.6&&f.volume<=1);}
 assert.equal(mechanicalFrame(.04,beats,atria,'sinus').stage,'Isovolumetric contraction');
 const eject=mechanicalFrame(.15,beats,atria,'sinus');assert.ok(eject.outOpen);assert.equal(eject.avOpen,false);
 const fill=mechanicalFrame(.5,beats,atria,'sinus');assert.ok(fill.avOpen);assert.equal(fill.outOpen,false);
});
test('isovolumetric periods preserve volume, scrubbing is deterministic',()=>{
 assert.equal(mechanicalFrame(.03,beats,atria,'sinus').volume,mechanicalFrame(.06,beats,atria,'sinus').volume);
 assert.equal(mechanicalFrame(.35,beats,atria,'sinus').volume,mechanicalFrame(.38,beats,atria,'sinus').volume);
 assert.deepEqual(mechanicalFrame(.17,beats,atria,'sinus'),mechanicalFrame(.17,beats,atria,'sinus'));
});
test('unsupported rhythms never imply a normal pump cycle',()=>{
 for(const key of ['vf','vt','af','flutter','rbbb','lbbb']){const f=mechanicalFrame(.15,beats,atria,key);assert.equal(f.supported,false);assert.equal(f.outOpen,false);assert.equal(f.avOpen,false);}
});
