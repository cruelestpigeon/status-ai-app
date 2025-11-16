
import React, {useEffect, useState} from 'react';
import Storage from '../lib/storage.js';
export default function UniverseLoreEditor(){
  const [lore,setLore]=useState({name:'My Universe', tone:'light', rules:[], locations:[], timeline:[], factions:[], restrictedKnowledge:[]});
  useEffect(()=>{(async ()=>{ const existing = await Storage.getUniverseLore(); setLore(existing); })();},[]);
  async function save(){ await Storage.saveUniverseLore(lore); alert('Universe saved'); }
  function setList(key, value){ setLore({...lore, [key]: value.split('\n').map(s=>s.trim()).filter(Boolean)}); }
  return (
    React.createElement('div',null,
      React.createElement('div',{style:{fontWeight:700, marginBottom:8}}, 'Universe Editor'),
      React.createElement('label',null,'Universe name'), React.createElement('input',{className:'input', value:lore.name, onChange:e=>setLore({...lore,name:e.target.value})}),
      React.createElement('label',null,'Tone'), React.createElement('input',{className:'input', value:lore.tone, onChange:e=>setLore({...lore,tone:e.target.value})}),
      React.createElement('label',null,'Rules (one per line)'), React.createElement('textarea',{className:'input', rows:3, value:(lore.rules||[]).join('\n'), onChange:e=>setList('rules', e.target.value)}),
      React.createElement('label',null,'Locations (one per line)'), React.createElement('textarea',{className:'input', rows:2, value:(lore.locations||[]).join('\n'), onChange:e=>setList('locations', e.target.value)}),
      React.createElement('label',null,'Timeline (one per line)'), React.createElement('textarea',{className:'input', rows:2, value:(lore.timeline||[]).join('\n'), onChange:e=>setList('timeline', e.target.value)}),
      React.createElement('div',{style:{marginTop:8}}, React.createElement('button',{className:'button', onClick:save},'Save Universe'))
    )
  );
}
