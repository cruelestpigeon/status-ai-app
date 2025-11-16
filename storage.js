
import localforage from 'https://cdn.jsdelivr.net/npm/localforage@1.10.0/+esm';
const KEY='status-local-db-v1';
const defaultMe={id:'me', displayName:'You', username:'me', bio:'Local user'};
const Storage = {
  async init(){ localforage.config({name:'status_local'}); const data = (await localforage.getItem(KEY))||{}; if(!data.me) data.me=defaultMe; await localforage.setItem(KEY,data); },
  async _getAll(){ return (await localforage.getItem(KEY)) || {}; },
  async _saveAll(obj){ await localforage.setItem(KEY,obj); },
  async getMe(){ const d=await this._getAll(); return d.me||defaultMe; },
  async getCharacters(){ const d=await this._getAll(); return d.characters||[]; },
  async createCharacter(c){ const d=await this._getAll(); d.characters=d.characters||[]; const now=Date.now(); const entry={ id: c.id || `char-${now}`, displayName: c.displayName||'Unnamed', username:c.username||'', bio:c.bio||'', description:c.description||'', personalityPrompt:c.personalityPrompt||'Be friendly', avatarDataUrl:c.avatarDataUrl||null, relationships:c.relationships||[], memoryShort:[], memoryLong:[], createdAt: now }; d.characters.unshift(entry); await this._saveAll(d); return entry; },
  async deleteCharacter(id){ const d=await this._getAll(); d.characters=(d.characters||[]).filter(x=>x.id!==id); await this._saveAll(d); },
  async getPosts(){ const d=await this._getAll(); return (d.posts||[]).sort((a,b)=>b.createdAt - a.createdAt); },
  async createPost({authorId,text,replyToId=null}){ const d=await this._getAll(); d.posts=d.posts||[]; const post={ id:`post-${Date.now()}`, authorId, text, replyToId, createdAt: Date.now() }; d.posts.unshift(post); const char=(d.characters||[]).find(c=>c.id===authorId); if(char){ char.memoryShort=char.memoryShort||[]; char.memoryShort.push(`${authorId}: ${text}`); if(char.memoryShort.length>12) char.memoryShort.shift(); } await this._saveAll(d); return post; },
  async createDM({conversationId,senderId,recipientId,text}){ const d=await this._getAll(); d.dms=d.dms||{}; d.dms[conversationId]=d.dms[conversationId]||[]; const m={id:`dm-${Date.now()}`, conversationId, senderId, recipientId, text, createdAt: Date.now()}; d.dms[conversationId].push(m); const char=(d.characters||[]).find(c=>c.id===senderId||c.id===recipientId); if(char){ char.memoryShort=char.memoryShort||[]; char.memoryShort.push(`${m.senderId}: ${text}`); if(char.memoryShort.length>20) char.memoryShort.shift(); } await this._saveAll(d); return m; },
  async getDMs(conversationId){ const d=await this._getAll(); return d.dms && d.dms[conversationId] ? [...d.dms[conversationId]] : []; },
  async exportAll(){ const d=await this._getAll(); return JSON.stringify(d,null,2); },
  async importAll(jsonText){ try{ const parsed=JSON.parse(jsonText); await this._saveAll(parsed); }catch(e){ alert('Invalid JSON'); } },
  async getUniverseLore(){ const d=await this._getAll(); return d.universeLore||{name:'My Universe', tone:'light', rules:[], locations:[], timeline:[], factions:[], restrictedKnowledge:[]}; },
  async saveUniverseLore(lore){ const d=await this._getAll(); d.universeLore=lore; await this._saveAll(d); },
  async saveReply(reply){ const d=await this._getAll(); d.replies=d.replies||{}; d.replies[reply.postId]=d.replies[reply.postId]||[]; d.replies[reply.postId].push(reply); await this._saveAll(d); },
  async getRepliesForPost(postId){ const d=await this._getAll(); return (d.replies && d.replies[postId]) ? [...d.replies[postId]] : []; }
};
export default Storage;
