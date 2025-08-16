const http = require('http');

const data = JSON.stringify({
  username: 'newuser' + Date.now(),
  password: 'admin123',
  role: 'admin'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Testing registration on port 3001...');

const req = http.request(options, (res) => {
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
  console.log('Timeout');
  req.destroy();
  process.exit(1);
});

req.write(data);
req.end();