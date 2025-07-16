import fs from 'fs';

// Read the MP3 file into a buffer
try {
  const audioData = fs.readFileSync('./test_preview.mp3');
  
  // Output basic info
  console.log('File size:', audioData.length, 'bytes');
  
  // Check if it starts with the MP3 header (0xFF 0xFB)
  if (audioData.length >= 2 && audioData[0] === 0xFF && (audioData[1] & 0xE0) === 0xE0) {
    console.log('File appears to be a valid MP3 file (starts with MP3 header)');
  } else {
    console.log('File doesn\'t start with MP3 header');
    console.log('First 20 bytes as string:', audioData.slice(0, 20).toString());
    console.log('First 20 bytes as hex:');
    for (let i = 0; i < Math.min(20, audioData.length); i++) {
      process.stdout.write(audioData[i].toString(16).padStart(2, '0') + ' ');
      if ((i + 1) % 8 === 0) console.log('');
    }
    console.log('');
  }
  
} catch (error) {
  console.error('Error reading or processing file:', error.message);
}