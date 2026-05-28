#!/usr/bin/env node

/**
 * Comprehensive test suite for student upload API
 * Tests: GET endpoints, file parsing, data validation, error handling
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============ CONFIGURATION ============
const API_BASE = 'http://localhost:3000';
const TESTS_DIR = path.join(__dirname, 'test-files');

// Create test files directory
if (!fs.existsSync(TESTS_DIR)) {
  fs.mkdirSync(TESTS_DIR, { recursive: true });
}

// ============ TEST DATA ============
const VALID_HEADERS = ['Admission Number', 'First Name', 'Last Name', 'Form', 'Parent Phone'];
const CSV_DATA = `${VALID_HEADERS.join(',')}
1001,John,Doe,Form 1,0712345678
1002,Jane,Smith,Form 2,0712345679
1003,Bob,Johnson,Form 3,0712345680
1004,Alice,Williams,Form 4,0712345681`;

const INVALID_CSV_DATA = `Name,Form
John Doe,Form 1
Jane Smith,Form 2`;

// ============ UTILITIES ============
const createTestFile = (filename, content) => {
  const filepath = path.join(TESTS_DIR, filename);
  fs.writeFileSync(filepath, content);
  return filepath;
};

const createCSVFile = (filename, data) => {
  return createTestFile(filename, data);
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const log = {
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  info: (msg) => console.log(`ℹ️  ${msg}`),
  warn: (msg) => console.warn(`⚠️  ${msg}`),
  header: (msg) => console.log(`\n${'═'.repeat(60)}\n📋 ${msg}\n${'═'.repeat(60)}`)
};

const headers = {
  'Content-Type': 'application/json'
};

// ============ TESTS ============

let testsPassed = 0;
let testsFailed = 0;

const test = async (name, fn) => {
  try {
    log.info(`Testing: ${name}`);
    await fn();
    log.success(`Passed: ${name}`);
    testsPassed++;
  } catch (error) {
    log.error(`Failed: ${name}`);
    console.error(`  Error: ${error.message}`);
    testsFailed++;
  }
};

// Test 1: Server is running
const testServerConnection = async () => {
  await test('Server connection', async () => {
    const res = await fetch(API_BASE);
    if (!res.ok && res.status !== 404) {
      throw new Error(`Server returned status ${res.status}`);
    }
  });
};

// Test 2: GET /api/studentupload - Fetch students
const testGetStudents = async () => {
  await test('GET /api/studentupload - Fetch students', async () => {
    const res = await fetch(`${API_BASE}/api/studentupload?limit=10`);
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }
    
    const data = await res.json();
    
    if (!data.success) {
      throw new Error(`Response not successful: ${data.error}`);
    }
    
    if (!data.data || !Array.isArray(data.data.students)) {
      throw new Error('Invalid response structure: missing students array');
    }
    
    if (!data.data.pagination) {
      throw new Error('Invalid response structure: missing pagination');
    }
  });
};

// Test 3: GET /api/studentupload?action=stats - Fetch statistics
const testGetStats = async () => {
  await test('GET /api/studentupload?action=stats - Statistics', async () => {
    const res = await fetch(`${API_BASE}/api/studentupload?action=stats`);
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    
    const data = await res.json();
    
    if (!data.success) {
      throw new Error(`Response not successful: ${data.error}`);
    }
    
    if (!data.data || !data.data.stats) {
      throw new Error('Missing statistics in response');
    }
    
    if (typeof data.data.stats.totalStudents !== 'number') {
      throw new Error('Invalid stats format');
    }
  });
};

// Test 4: GET /api/studentupload?action=uploads - Fetch upload history
const testGetUploads = async () => {
  await test('GET /api/studentupload?action=uploads - Upload history', async () => {
    const res = await fetch(`${API_BASE}/api/studentupload?action=uploads&limit=5`);
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    
    const data = await res.json();
    
    if (!data.success) {
      throw new Error(`Response not successful: ${data.error}`);
    }
    
    if (!Array.isArray(data.uploads)) {
      throw new Error('Invalid response structure: uploads should be array');
    }
    
    if (!data.pagination) {
      throw new Error('Missing pagination in response');
    }
  });
};

// Test 5: GET with filters
const testGetWithFilters = async () => {
  await test('GET /api/studentupload with filters', async () => {
    const res = await fetch(
      `${API_BASE}/api/studentupload?form=Form%201&limit=5&sortBy=createdAt&sortOrder=desc`
    );
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    
    const data = await res.json();
    
    if (!data.success) {
      throw new Error(`Response not successful: ${data.error}`);
    }
    
    if (!data.data.filters) {
      throw new Error('Missing filters in response');
    }
  });
};

// Test 6: GET pagination validation
const testPaginationValidation = async () => {
  await test('GET pagination validation (invalid page)', async () => {
    const res = await fetch(`${API_BASE}/api/studentupload?page=invalid&limit=abc`);
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    
    const data = await res.json();
    
    if (!data.success) {
      throw new Error(`Response not successful: ${data.error}`);
    }
    
    // Should default to page=1, limit=20
    if (!data.data.pagination) {
      throw new Error('Pagination defaults not applied');
    }
  });
};

// Test 7: POST - File parsing validation
const testPostFileValidation = async () => {
  await test('POST /api/studentupload - File validation (no file)', async () => {
    const formData = new FormData();
    formData.append('uploadType', 'new');
    formData.append('forms', JSON.stringify(['Form 1']));
    
    const res = await fetch(`${API_BASE}/api/studentupload`, {
      method: 'POST',
      body: formData
    });
    
    const data = await res.json();
    
    if (data.success) {
      throw new Error('Should reject request without file');
    }
    
    if (res.status !== 401 && res.status !== 400) {
      throw new Error(`Expected status 400 or 401, got ${res.status}`);
    }
  });
};

// Test 8: POST - Upload type validation
const testPostUploadTypeValidation = async () => {
  await test('POST /api/studentupload - Upload type validation', async () => {
    const csvPath = createCSVFile('test.csv', CSV_DATA);
    const fileStream = fs.createReadStream(csvPath);
    const formData = new FormData();
    formData.append('file', fileStream);
    
    const res = await fetch(`${API_BASE}/api/studentupload`, {
      method: 'POST',
      body: formData
    });
    
    const data = await res.json();
    
    if (data.success) {
      throw new Error('Should reject request without uploadType');
    }
    
    if (res.status !== 401 && res.status !== 400) {
      throw new Error(`Expected status 400 or 401, got ${res.status}`);
    }
  });
};

// Test 9: DELETE endpoints exist
const testDeleteEndpoint = async () => {
  await test('DELETE /api/studentupload - Endpoint exists', async () => {
    const res = await fetch(`${API_BASE}/api/studentupload`, {
      method: 'DELETE',
      body: JSON.stringify({ id: 'test-id-that-doesnt-exist' }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    // Should return 401 (auth required) or 400 (bad request)
    if (res.status === 404) {
      throw new Error('DELETE endpoint not found');
    }
  });
};

// Test 10: Error handling for missing contacts endpoint requirements
const testGetContactsAction = async () => {
  await test('GET /api/studentupload?action=contacts', async () => {
    const res = await fetch(`${API_BASE}/api/studentupload?action=contacts`);
    
    // Should either succeed or give 500 with meaningful error
    if (res.status === 404) {
      throw new Error('Action contacts endpoint not found');
    }
    
    if (!res.ok) {
      const data = await res.json();
      if (!data.error && !data.message) {
        throw new Error('Error response missing error message');
      }
    }
  });
};

// ============ RESPONSE STRUCTURE TESTS ============
const testResponseStructures = async () => {
  log.header('Testing Response Structures');
  
  await test('GET response has required fields', async () => {
    const res = await fetch(`${API_BASE}/api/studentupload?limit=1`);
    const data = await res.json();
    
    const requiredFields = ['success', 'data'];
    const missingFields = requiredFields.filter(f => !(f in data));
    
    if (missingFields.length > 0) {
      throw new Error(`Missing fields: ${missingFields.join(', ')}`);
    }
  });
  
  await test('Stats response has metrics', async () => {
    const res = await fetch(`${API_BASE}/api/studentupload?action=stats`);
    const data = await res.json();
    
    if (!data.data.stats) {
      throw new Error('Missing stats object');
    }
    
    const requiredStats = ['totalStudents', 'form1', 'form2', 'form3', 'form4'];
    const missingStats = requiredStats.filter(s => !(s in data.data.stats));
    
    if (missingStats.length > 0) {
      throw new Error(`Missing stat fields: ${missingStats.join(', ')}`);
    }
  });
};

// ============ PERFORMANCE TESTS ============
const testPerformance = async () => {
  log.header('Testing Performance');
  
  await test('GET with limit=500 (max allowed)', async () => {
    const start = Date.now();
    const res = await fetch(`${API_BASE}/api/studentupload?limit=500`);
    const duration = Date.now() - start;
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    
    if (duration > 10000) {
      log.warn(`Response took ${duration}ms (exceeded 10s threshold)`);
    } else {
      log.info(`Response time: ${duration}ms`);
    }
  });
};

// ============ RUN TESTS ============
const runAllTests = async () => {
  log.header('Student Upload API Test Suite');
  log.info(`API Base: ${API_BASE}`);
  log.info(`Test Directory: ${TESTS_DIR}\n`);
  
  try {
    // Connection test
    await testServerConnection();
    
    // GET endpoint tests
    log.header('GET Endpoint Tests');
    await testGetStudents();
    await testGetStats();
    await testGetUploads();
    await testGetWithFilters();
    await testPaginationValidation();
    
    // Response structure tests
    await testResponseStructures();
    
    // POST/DELETE validation tests
    log.header('Request Validation Tests');
    await testPostFileValidation();
    await testPostUploadTypeValidation();
    await testDeleteEndpoint();
    await testGetContactsAction();
    
    // Performance tests
    await testPerformance();
    
  } catch (error) {
    log.error(`Test suite error: ${error.message}`);
  }
  
  // Summary
  log.header('Test Summary');
  const total = testsPassed + testsFailed;
  const percentage = total > 0 ? ((testsPassed / total) * 100).toFixed(1) : 0;
  
  console.log(`
Total:   ${total}
Passed:  ${testsPassed} ✅
Failed:  ${testsFailed} ❌
Score:   ${percentage}%
  `);
  
  if (testsFailed === 0 && testsPassed > 0) {
    log.success('All tests passed!');
    process.exit(0);
  } else if (testsFailed > 0) {
    log.error(`${testsFailed} test(s) failed`);
    process.exit(1);
  } else {
    log.warn('No tests were executed');
    process.exit(1);
  }
};

// Start tests
runAllTests().catch(error => {
  log.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
