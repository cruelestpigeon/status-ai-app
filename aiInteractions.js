
import generateText from './aiEngine.js';
import Storage from './storage.js';
export async function generateCharacterAutoPosts(userPost){
  const all = await Storage.getCharacters();
  const universe = await Storage.getUniverseLore();
  for(const c of all){
    const instruction = `Write one short social post reacting to: "${userPost.text}". Keep 1-3 sentences, in-character and in-universe.`;
    const text = await generateText({character:c, userMessage:userPost.text, memory:c.memoryShort||[], universeLore:universe, instruction});
    await Storage.createPost({authorId:c.id, text, replyToId:userPost.id});
  }
}
export async function generateRepliesForPost(post, options={maxRepliesPerCharacter:1}){
  const all = await Storage.getCharacters();
  const universe = await Storage.getUniverseLore();
  const saved=[];
  for(const c of all){
    const existing = (await Storage.getRepliesForPost(post.id)).find(r=>r.characterId===c.id);
    if(existing) continue;
    const instruction = `Compose ${options.maxRepliesPerCharacter} short reply to: "${post.text}". Stay in-character, 1-2 sentences.`;
    const replyText = await generateText({character:c, userMessage:post.text, memory:c.memoryShort||[], universeLore:universe, instruction});
    const reply = {id:`reply-${Date.now()}-${Math.random().toString(36).slice(2,8)}`, postId:post.id, characterId:c.id, text:replyText, createdAt: Date.now()};
    await Storage.saveReply(reply);
    saved.push(reply);
  }
  return saved;
}
