const http = require('http')

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/health',
  method: 'GET',
  timeout: 2000
}

const healthCheck = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('Health check passed')
    process.exit(0)
  } else {
    console.log(`Health check failed with status: ${res.statusCode}`)
    process.exit(1)
  }
})

healthCheck.on('error', (err) => {
  console.log('Health check failed:', err.message)
  process.exit(1)
})

healthCheck.on('timeout', () => {
  console.log('Health check timed out')
  healthCheck.destroy()
  process.exit(1)
})

healthCheck.end()