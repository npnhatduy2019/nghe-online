
async function testInvidious() {
  const videoId = '30HCSjIBa2Q';
  const instances = [
    'https://inv.tux.pizza',
    'https://invidious.weblibre.org',
    'https://invidious.lunar.icu',
    'https://invidious.projectsegfau.lt',
    'https://inv.makerlab.tech',
    'https://inv.nadeko.net',
    'https://invidious.nerdvpn.de',
  ];
  
  for (const instance of instances) {
    try {
      console.log(`Testing Invidious: ${instance}`);
      const res = await fetch(`${instance}/api/v1/videos/${videoId}`);
      if (!res.ok) {
        console.log(`Status: ${res.status}`);
        continue;
      }
      const data = await res.json();
      const audioStream = data.adaptiveFormats
        ?.filter((f) => f.type?.startsWith('audio/'))
        ?.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))?.[0];
      
      if (audioStream?.url) {
        console.log(`Success! URL: ${audioStream.url.substring(0, 50)}...`);
        return;
      } else {
        console.log(`No audio stream found on ${instance}`);
      }
    } catch (err) {
      console.error(`Error on ${instance}:`, err.message);
    }
  }
}

testInvidious();
