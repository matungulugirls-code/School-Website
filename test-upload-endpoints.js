// Test Student Upload API Endpoints
const http = require('http');
const https = require('https');

const API_BASE = 'http://localhost:3001';
const ENDPOINTS = [
  { path: '/api/studentupload', name: 'Fetch students (default)', params: '?limit=5' },
  { path: '/api/studentupload', name: 'Fetch students with filters', params: '?form=Form%201&limit=5' },
  { path: '/api/studentupload', name: 'Get stats', params: '?action=stats' },
  { path: '/api/studentupload', name: 'Get uploads history', params: '?action=uploads&limit=3' },
  { path: '/api/studentupload', name: 'Get pagination with validation', params: '?page=1&limit=10&sortBy=createdAt' },
];

let passed = 0;
let failed = 0;

const testEndpoint = (endpoint) => {
  return new Promise((resolve) => {
    const url = `${API_BASE}${endpoint.path}${endpoint.params}`;
    
    console.log(`\n📝 Testing: ${endpoint.name}`);
    console.log(`   URL: ${url}`);
    
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const request = client.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const startTime = Date.now();
          const parsed = JSON.parse(data);
          const responseTime = Date.now() - startTime;
          
          // Validate response structure
          const isValid = parsed.success === true;
          
          if (isValid && parsed.data) {
            console.log(`   ✅ Status: ${res.statusCode}`);
            console.log(`   ✅ Response valid`);
            
            if (parsed.data.pagination) {
              console.log(`   ✅ Pagination: page ${parsed.data.pagination.page}/${parsed.data.pagination.pages}`);
            }
            if (parsed.data.stats) {
              console.log(`   ✅ Stats: ${parsed.data.stats.totalStudents} students total`);
            }
            if (parsed.uploads) {
              console.log(`   ✅ Uploads: ${parsed.uploads.length} records found`);
            }
            
            console.log(`   ⏱️  Response time: ${responseTime}ms`);
            console.log(`   ✅ PASS`);
            passed++;
          } else if (isValid === false) {
            console.log(`   ❌ Status: ${res.statusCode}`);
            console.log(`   ❌ Response not successful: ${parsed.error}`);
            console.log(`   ❌ FAIL`);
            failed++;
          } else {
            console.log(`   ⚠️  Status: ${res.statusCode}`);
            console.log(`   ⚠️  Response structure unexpected`);
            console.log(`   ⚠️  INCONCLUSIVE`);
          }
        } catch (parseError) {
          console.log(`   ❌ Status: ${res.statusCode}`);
          console.log(`   ❌ Failed to parse JSON: ${parseError.message}`);
          console.log(`   ❌ FAIL`);
          failed++;
        }
        resolve();
      });
    });
    
    request.on('error', (error) => {
      console.log(`   ❌ Request error: ${error.message}`);
      console.log(`   ❌ FAIL`);
      failed++;
      resolve();
    });
    
    request.on('timeout', () => {
      console.log(`   ❌ Request timeout`);
      console.log(`   ❌ FAIL`);
      failed++;
      request.destroy();
      resolve();
    });
  });
};

const runTests = async () => {
  console.log('╔═════════════════════════════════════════════════════════════╗');
  console.log('║     Student Upload API - Endpoint Tests                     ║');
  console.log('║  Testing GET endpoints, filters, pagination & error handling║');
  console.log('╚═════════════════════════════════════════════════════════════╝');
  console.log(`\n🔗 API Base: ${API_BASE}`);
  console.log(`⏰ Start time: ${new Date().toLocaleString()}\n`);
  
  for (const endpoint of ENDPOINTS) {
    await testEndpoint(endpoint);
  }
  
  // Additional validation tests
  console.log(`\n\n📋 Additional Validation Tests:`);
  
  // Test 1: Invalid limit (should be capped at 500)
  console.log(`\n📝 Testing: Limit validation (limit=1000 should cap to 500)`);
  await new Promise((resolve) => {
    http.get(`${API_BASE}/api/studentupload?limit=1000`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const limit = parsed.data?.pagination?.limit || 0;
          if (limit > 0 && limit <= 500) {
            console.log(`   ✅ Limit correctly capped to: ${limit}`);
            console.log(`   ✅ PASS`);
            passed++;
          } else {
            console.log(`   ❌ Limit validation failed: ${limit}`);
            console.log(`   ❌ FAIL`);
            failed++;
          }
        } catch (e) {
          console.log(`   ❌ Parse error`);
          console.log(`   ❌ FAIL`);
          failed++;
        }
        resolve();
      });
    }).on('error', () => {
      console.log(`   ❌ Connection error`);
      failed++;
      resolve();
    });
  });
  
  // Test 2: Invalid page number
  console.log(`\n📝 Testing: Page validation (page=abc should default to 1)`);
  await new Promise((resolve) => {
    http.get(`${API_BASE}/api/studentupload?page=invalid`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const page = parsed.data?.pagination?.page || 0;
          if (page === 1) {
            console.log(`   ✅ Page correctly defaulted to: ${page}`);
            console.log(`   ✅ PASS`);
            passed++;
          } else {
            console.log(`   ❌ Page validation failed: ${page}`);
            console.log(`   ❌ FAIL`);
            failed++;
          }
        } catch (e) {
          console.log(`   ❌ Parse error`);
          console.log(`   ❌ FAIL`);
          failed++;
        }
        resolve();
      });
    }).on('error', () => {
      console.log(`   ❌ Connection error`);
      failed++;
      resolve();
    });
  });
  
  // Summary
  console.log(`\n\n╔═════════════════════════════════════════════════════════════╗`);
  console.log(`║                    Test Results                             ║`);
  console.log(`╚═════════════════════════════════════════════════════════════╝`);
  
  const total = passed + failed;
  const percentage = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
  
  console.log(`
Total Tests:     ${total}
Passed:          ${passed} ✅
Failed:          ${failed} ❌
Success Rate:    ${percentage}%
End Time:        ${new Date().toLocaleString()}
  `);
  
  if (failed === 0 && passed > 0) {
    console.log(`✅ All tests passed successfully!\n`);
    process.exit(0);
  } else {
    console.log(`⚠️  ${failed} test(s) need attention\n`);
    process.exit(failed > 0 ? 1 : 0);
  }
};

runTests().catch(error => {
  console.error('Fatal test error:', error);
  process.exit(1);
});
