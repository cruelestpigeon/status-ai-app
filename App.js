
import React, {useEffect, useState} from 'react';
import Storage from './lib/storage.js';
import Feed from './components/Feed.js';
import CharactersPanel from './components/CharactersPanel.js';
import PostView from './components/PostView.js';
import UniverseLoreEditor from './components/UniverseLoreEditor.js';
import DMView from './components/DMView.js';
import { generateCharacterAutoPosts } from './lib/aiInteractions.js';

export default function App(){
  const [state, setState] = useState({posts:[], characters:[], me:null, openPost:null, showUniverse:false, openDM:null});
  useEffect(()=>{(async ()=>{await Storage.init(); const me=await Storage.getMe(); const chars=await Storage.getCharacters(); const posts=await Storage.getPosts(); setState(s=>({...s,me,characters:chars,posts})); })();},[]);
  async function refresh(){ const posts=await Storage.getPosts(); const characters=await Storage.getCharacters(); setState(s=>({...s,posts,characters})); }
  async function createPost(authorId, text){ const post=await Storage.createPost({authorId,text}); // trigger auto posts
    await generateCharacterAutoPosts(post);
    refresh();
  }
  return (
    React.createElement('div',{className:'app'},
      React.createElement('div',{className:'header'}, React.createElement('div',{className:'logo'},'S'), React.createElement('div',null, React.createElement('div',{className:'title'},'Status — personal PWA'), React.createElement('div',{style:{fontSize:12,color:'#9ca3af'}},'Local — private'))),
      React.createElement('div',{className:'grid'}, 
        React.createElement('div',null,
          React.createElement(Feed, {posts:state.posts, characters:state.characters, me:state.me, onCreatePost:createPost, onOpenPost: p => setState(s=>({...s,openPost:p}))})
        ),
        React.createElement('aside',null,
          React.createElement('div',{className:'card'}, React.createElement(CharactersPanel,{characters:state.characters, me:state.me, onUpdate:refresh, onOpenDM: c => setState(s=>({...s,openDM:c}))})),
          React.createElement('div',{className:'card'}, React.createElement(UniverseLoreEditor,null))
        )
      ),
      state.openPost && React.createElement(PostView,{post:state.openPost, onClose:()=> setState(s=>({...s,openPost:null}))}),
      state.openDM && React.createElement(DMView,{character:state.openDM, me:state.me, onClose:()=> setState(s=>({...s,openDM:null})), onSend: async (text)=>{ await Storage.createDM({conversationId:`dm-${state.openDM.id}`, senderId: state.me.id, recipientId: state.openDM.id, text}); const reply=await (await import('./lib/aiEngine.js')).default({character:state.openDM, userMessage:text, memory:state.openDM.memoryShort||[], universeLore: await Storage.getUniverseLore()}); await Storage.createDM({conversationId:`dm-${state.openDM.id}`, senderId: state.openDM.id, recipientId: state.me.id, text: reply});}}
      ),
      React.createElement('button',{className:'fab', onClick: ()=> { const t = prompt('Write a quick post:'); if(t) createPost(state.me.id, t); }}, '+'),
      React.createElement('div',{className:'nav'}, React.createElement('button',null,'Feed'), React.createElement('button',null,'DMs'), React.createElement('button',null,'Characters'), React.createElement('button',null,'You'))
    )
  );
}
