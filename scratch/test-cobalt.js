
async function testCobalt() {
  const videoId = '30HCSjIBa2Q';
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  console.log(`Testing Cobalt with URL: ${url}`);
  
  try {
    const res = await fetch('https://api.cobalt.tools/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        downloadMode: 'audio',
        audioFormat: 'mp3',
        audioBitrate: '128',
      }),
    });

    console.log(`Status: ${res.status}`);
    const data = await res.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

testCobalt();
