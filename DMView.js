
import React,{useEffect,useState} from 'react';
import Storage from '../lib/storage.js';
export default function DMView({character, me, onClose, onSend}){
  const [messages, setMessages]=useState([]);
  const [text, setText]=useState('');
  useEffect(()=>{(async ()=>{ const convId = `dm-${character.id}`; const msgs = await Storage.getDMs(convId); setMessages(msgs); })();},[character]);
  async function send(){ if(!text.trim()) return; await onSend(text.trim()); const msgs = await Storage.getDMs(`dm-${character.id}`); setMessages(msgs); setText(''); }
  return (
    React.createElement('div',{className:'card', style:{position:'fixed',left:12,right:12,bottom:80,maxHeight:'50vh',overflow:'auto',zIndex:999}},
      React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center'}}, React.createElement('div',{style:{fontWeight:700}}, character.displayName), React.createElement('div',null, React.createElement('button',{className:'button small', onClick:onClose},'Close'))),
      React.createElement('div',{style:{marginTop:8}}, messages.map(m=> React.createElement('div',{key:m.id, style:{marginBottom:8,display:'flex',flexDirection: m.senderId===me.id ? 'row-reverse':'row',gap:8}},
        React.createElement('div',{style:{background: m.senderId===me.id? 'linear-gradient(90deg,#0ea5a4,#06b6d4)':'#1f2937', padding:8, borderRadius:8, maxWidth:'80%'}},
          React.createElement('div',{style:{fontSize:12,color:'#9ca3af'}}, m.senderId===me.id ? 'You' : character.displayName),
          React.createElement('div',{style:{marginTop:4}}, m.text),
          React.createElement('div',{style:{fontSize:11,color:'#9ca3af',marginTop:4}}, new Date(m.createdAt).toLocaleString())
        )
      ))),
      React.createElement('div',{style:{marginTop:8,display:'flex',gap:8}}, React.createElement('input',{className:'input', value:text, onChange:e=>setText(e.target.value), placeholder:'Send a DM...'}), React.createElement('button',{className:'button', onClick:send},'Send'))
    )
  );
}
