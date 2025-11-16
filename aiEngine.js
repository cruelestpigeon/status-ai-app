
// Simple HF remote-first generator with local fallback
const HF_MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/google/gemma-2-2b-it";
async function callHF(prompt, parameters={max_new_tokens:120, temperature:0.7}) {
  try {
    const res = await fetch(HF_MODEL_ENDPOINT, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({inputs: prompt, parameters})});
    if(!res.ok) throw new Error('HF failed');
    const json = await res.json();
    if(Array.isArray(json) && json[0] && json[0].generated_text) return json[0].generated_text;
    if(json.generated_text) return json.generated_text;
    if(typeof json === 'string') return json;
    return JSON.stringify(json);
  } catch(e){
    console.warn('HF failed, using local fallback', e);
    return null;
  }
}
function localSimulator(character, prompt, userMessage='') {
  const name = character.displayName || character.username || 'Char';
  const p = (character.personalityPrompt||'').split('\n')[0] || 'neutral';
  const core = userMessage? `"${userMessage.slice(0,120)}"` : 'the situation';
  const variants = [
    `${name} (${p}): I noticed ${core}.`,
    `${name}: Hmm... about ${core.toLowerCase()} — that's interesting.`,
    `${name}: ${p}. Regarding ${core}, I wonder.`
  ];
  const idx = Math.floor((Date.now()/1000 + name.length) % variants.length);
  return variants[idx];
}
export default async function generateText({character, userMessage='', memory=[], universeLore={}, instruction=''}) {
  const system = `
You are ${character.displayName||character.username}.
Personality: ${character.personalityPrompt||character.description||'No special traits.'}
Relationships: ${JSON.stringify(character.relationships||[])}
Universe: ${universeLore.name||'Universe'} - Tone: ${universeLore.tone||'neutral'}.
Instruction: ${instruction||'Reply briefly and stay in character.'}
Memory: ${memory.slice(-6).join(' | ')}
User input: ${userMessage}
  `.trim();
  const hf = await callHF(system);
  if(hf) return hf.replace(system,'').trim() || hf.trim();
  return localSimulator(character, system, userMessage);
}
