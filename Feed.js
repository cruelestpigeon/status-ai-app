
import React, {useState} from 'react';
import Storage from '../lib/storage.js';
export default function Feed({posts=[], characters=[], me, onCreatePost, onOpenPost}) {
  const [text, setText] = useState('');
  function authorDisplay(authorId){ if(authorId=== (me && me.id)) return (me.displayName||'You'); const c = characters.find(x=>x.id===authorId); return c? c.displayName || c.username : authorId;}
  async function submit(){ if(!text.trim()) return; await onCreatePost(me.id, text.trim()); setText(''); }
  return (
    React.createElement('div',null,
      React.createElement('div',{className:'card'},
        React.createElement('div',{style:{fontWeight:700}},'Create Post'),
        React.createElement('textarea',{value:text,onChange:e=>setText(e.target.value),rows:3,placeholder:'Write something...', style:{marginTop:8}}),
        React.createElement('div',{style:{display:'flex',gap:8,marginTop:8}},
          React.createElement('button',{className:'button',onClick:submit},'Post'),
          React.createElement('button',{className:'button',onClick:()=>setText('')},'Clear')
        )
      ),
      React.createElement('div',{style:{marginTop:10}},
        posts.length===0 && React.createElement('div',{className:'card'},'No posts yet'),
        posts.map(p => React.createElement('div',{key:p.id,className:'card feed-post', onClick: ()=> onOpenPost(p)},
          React.createElement('div',{className:'post-meta'},
            React.createElement('div',null, React.createElement('span',{style:{fontWeight:700}}, authorDisplay(p.authorId)), React.createElement('span',{style:{color:'#9ca3af', marginLeft:8}}, '@'+(p.authorId))),
            React.createElement('div',{style:{fontSize:12,color:'#9ca3af'}}, new Date(p.createdAt).toLocaleString())
          ),
          React.createElement('div',{className:'post-text'}, p.text),
          React.createElement('div',{style:{marginTop:8,display:'flex',gap:8}}, React.createElement('button',{className:'button small'},'Reply'))
        ))
      )
    )
  );
}
