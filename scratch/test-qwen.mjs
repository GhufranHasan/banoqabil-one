import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.DASHSCOPE_API_KEY || '';
const baseUrl = process.env.DASHSCOPE_BASE_URL || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1';
const workspaceId = process.env.DASHSCOPE_WORKSPACE_ID;

console.log('Testing Alibaba DashScope connection...');
console.log('Base URL:', baseUrl);
console.log('Workspace ID:', workspaceId);
console.log('API Key configured:', apiKey.length > 0 ? `Yes (${apiKey.substring(0, 7)}... length ${apiKey.length})` : 'No');

async function testEndpoint(url, key, wsId) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${key}`
  };
  if (wsId) {
    headers['X-DashScope-WorkSpace'] = wsId;
  }

  try {
    const res = await fetch(`${url}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'qwen-plus',
        messages: [
          { role: 'system', content: 'You are an educational operational assistant for Bano Qabil.' },
          { role: 'user', content: 'Respond with "QWEN_ONLINE_OK" if you are online.' }
        ],
        temperature: 0.1,
        max_tokens: 50
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log(`HTTP Status from ${url}:`, res.status, res.statusText);
    const data = await res.json();
    console.log('Response body:', JSON.stringify(data, null, 2));
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    clearTimeout(timeoutId);
    console.log(`Error testing ${url}:`, err.name === 'AbortError' ? 'Timeout (8s)' : err.message);
    return { ok: false, error: err.message };
  }
}

async function main() {
  console.log('\n--- 1. Testing with configured workspace URL ---');
  await testEndpoint(baseUrl, apiKey, workspaceId);

  console.log('\n--- 2. Testing with International DashScope URL ---');
  await testEndpoint('https://dashscope-intl.aliyuncs.com/compatible-mode/v1', apiKey, workspaceId);
}

main();
