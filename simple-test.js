const http = require('http');

console.log('Testing ping...');

const req = http.get('http://localhost:3000/ping', (res) => {
  console.log(`Status: ${res.statusCode}`);
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('Response:', body);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
  process.exit(1);
});

req.setTimeout(5000, () => {
  console.log('Request timeout');
  req.destroy();
  process.exit(1);
});