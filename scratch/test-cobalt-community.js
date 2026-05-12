
async function testCobaltCommunity() {
  const videoId = '30HCSjIBa2Q';
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const instance = 'https://cobalt.api.unv.me/';
  console.log(`Testing Cobalt Community (${instance}) with URL: ${url}`);
  
  try {
    const res = await fetch(instance, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        downloadMode: 'audio',
        audioFormat: 'mp3',
      }),
    });

    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

testCobaltCommunity();
