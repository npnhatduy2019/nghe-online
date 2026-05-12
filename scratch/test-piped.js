
async function testPiped() {
  const videoId = '30HCSjIBa2Q';
  const instances = [
    'https://pipedapi.in.projectsegfau.lt',
    'https://pipedapi.us.projectsegfau.lt',
    'https://api.piped.projectsegfau.lt',
    'https://pipedapi.kavin.rocks',
    'https://pipedapi.syncpundit.io',
    'https://piped-api.garudalinux.org',
  ];
  
  for (const instance of instances) {
    try {
      console.log(`Testing Piped: ${instance}`);
      const res = await fetch(`${instance}/streams/${videoId}`);
      if (!res.ok) {
        console.log(`Status: ${res.status}`);
        continue;
      }
      const data = await res.json();
      const audioStream = data.audioStreams
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

testPiped();
