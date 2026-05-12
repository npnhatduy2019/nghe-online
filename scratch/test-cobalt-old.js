
async function testCobaltOld() {
  const videoId = '30HCSjIBa2Q';
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  console.log(`Testing Cobalt (old endpoint/format) with URL: ${url}`);
  
  try {
    const res = await fetch('https://api.cobalt.tools/api/json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        isAudioOnly: true,
      }),
    });

    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

testCobaltOld();
