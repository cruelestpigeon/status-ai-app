
import React, {useState} from 'react';
import Storage from '../lib/storage.js';
export default function CharactersPanel({characters=[], me, onUpdate, onOpenDM}) {
  const [showNew, setShowNew]=useState(false);
  const [form,setForm]=useState({displayName:'', username:'', bio:'', description:'', personalityPrompt:''});
  async function create(){ if(!form.displayName){alert('Name required'); return;} await Storage.createCharacter(form); setForm({displayName:'',username:'',bio:'',description:'',personalityPrompt:''}); setShowNew(false); onUpdate(); }
  return (
    React.createElement('div',null,
      React.createElement('div',{style:{fontWeight:700, marginBottom:8}},'Characters'),
      characters.map(c=> React.createElement('div',{key:c.id,className:'card', style:{padding:8,display:'flex',justifyContent:'space-between',alignItems:'center'}},
        React.createElement('div',null, React.createElement('div',{style:{fontWeight:700}}, c.displayName), React.createElement('div',{style:{fontSize:12,color:'#9ca3af'}}, '@'+(c.username||c.id)), React.createElement('div',{style:{fontSize:12,marginTop:6}}, c.bio)),
        React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:6}}, React.createElement('button',{className:'button small', onClick:()=> onOpenDM(c)},'DM'), React.createElement('button',{className:'button small', onClick: async ()=>{ await Storage.deleteCharacter(c.id); onUpdate(); }},'Delete'))
      )),
      !showNew && React.createElement('button',{className:'button', onClick: ()=> setShowNew(true)}, '+ New Character'),
      showNew && React.createElement('div',{className:'card'},
        React.createElement('div',{style:{fontWeight:700}},'Create Character'),
        React.createElement('input',{className:'input', placeholder:'Display name', value:form.displayName, onChange:e=>setForm({...form,displayName:e.target.value})}),
        React.createElement('input',{className:'input', placeholder:'Username (optional)', value:form.username, onChange:e=>setForm({...form,username:e.target.value})}),
        React.createElement('input',{className:'input', placeholder:'Short bio', value:form.bio, onChange:e=>setForm({...form,bio:e.target.value})}),
        React.createElement('textarea',{className:'input', rows:3, placeholder:'Description (backstory used by AI)', value:form.description, onChange:e=>setForm({...form,description:e.target.value})}),
        React.createElement('textarea',{className:'input', rows:3, placeholder:'Personality prompt', value:form.personalityPrompt, onChange:e=>setForm({...form,personalityPrompt:e.target.value})}),
        React.createElement('div',{style:{display:'flex',gap:8,marginTop:8}}, React.createElement('button',{className:'button', onClick:create},'Create'), React.createElement('button',{className:'button', onClick:()=>setShowNew(false)},'Cancel'))
      )
    )
  );
}
