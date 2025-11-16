
import React, {useEffect, useState} from 'react';
import Storage from '../lib/storage.js';
import { generateRepliesForPost } from '../lib/aiInteractions.js';
export default function PostView({post, onClose}){
  const [replies,setReplies]=useState([]);
  const [loading,setLoading]=useState(false);
  useEffect(()=>{(async ()=>{ const saved = await Storage.getRepliesForPost(post.id); setReplies(saved); })();},[post]);
  async function loadGenerateReplies(){ setLoading(true); const newReplies = await generateRepliesForPost(post,{maxRepliesPerCharacter:1}); const saved = await Storage.getRepliesForPost(post.id); setReplies(saved); setLoading(false); }
  return (
    React.createElement('div',{className:'card', style:{position:'fixed',left:12,right:12,top:60,bottom:72,overflow:'auto',zIndex:999}},
      React.createElement('div',{style:{display:'flex',justifyContent:'space-between'}}, React.createElement('div',{style:{fontWeight:700}},'Thread'), React.createElement('div',null, React.createElement('button',{className:'button small', onClick:onClose},'Close'))),
      React.createElement('div',{style:{marginTop:10}},
        React.createElement('div',{style:{fontWeight:700}}, post.authorId),
        React.createElement('div',{style:{color:'#9ca3af', marginBottom:8}}, new Date(post.createdAt).toLocaleString()),
        React.createElement('div',null, post.text)
      ),
      React.createElement('div',{style:{marginTop:12}},
        React.createElement('div',{style:{display:'flex',gap:8}}, React.createElement('button',{className:'button', onClick:loadGenerateReplies}, loading? 'Generating...' : 'Show character replies'), React.createElement('button',{className:'button', onClick:async ()=>{ const saved=await Storage.getRepliesForPost(post.id); setReplies(saved); }}, 'Refresh Replies')),
        React.createElement('div',{style:{marginTop:12}},
          replies.length===0 && React.createElement('div',{className:'card'}, 'No replies yet. Tap "Show character replies" to generate them.'),
          replies.map(r => React.createElement('div',{key:r.id,className:'card thread-reply', style:{marginTop:8}},
            React.createElement('div',{style:{fontWeight:700}}, r.characterId, React.createElement('span',{style:{color:'#9ca3af', marginLeft:8, fontSize:12}}, new Date(r.createdAt).toLocaleString())),
            React.createElement('div',{style:{marginTop:6}}, r.text)
          ))
        )
      )
    )
  );
}
