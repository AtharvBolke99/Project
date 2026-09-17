import { db } from './database/db';
import jwt from 'jsonwebtoken';
import { config } from './config/env';
import fs from 'fs';
import path from 'path';

async function runPipelineTests() {
  console.log('🧪 Starting CONCEPTIFYYY File Upload & Secure Delivery Pipeline Test...\n');
  let passCount = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passCount++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      process.exitCode = 1;
    }
  }

  // 1. Generate Admin JWT
  const admin = db.findOne('users', u => u.email === 'atharvbolke99@gmail.com');
  assert(Boolean(admin && admin.role === 'ADMIN'), 'Found admin account atharvbolke99@gmail.com');
  if (!admin) return;

  const adminToken = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  // 2. Test File Upload via FormData
  console.log('  📤 Testing Multipart/Form-Data File Upload API (/api/admin/upload)...');
  const tempPdfContent = '%PDF-1.4\n% CONCEPTIFYYY Pipeline Test Document\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF';
  const tempPdfPath = path.join(__dirname, 'test_upload.pdf');
  fs.writeFileSync(tempPdfPath, tempPdfContent);

  const fileBlob = new Blob([fs.readFileSync(tempPdfPath)], { type: 'application/pdf' });
  const formData = new FormData();
  formData.append('file', fileBlob, 'dsa_complete_roadmap_2026.pdf');

  const uploadRes = await (await fetch('http://localhost:5000/api/admin/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`
    },
    body: formData
  })).json();

  assert(uploadRes.success === true && Boolean(uploadRes.data?.filename), `File upload succeeded: ${uploadRes.data?.filename}`);
  if (fs.existsSync(tempPdfPath)) fs.unlinkSync(tempPdfPath);

  // 3. Create Product with Uploaded File
  const uploadedFilename = uploadRes.data.filename;
  const createProdRes = await (await fetch('http://localhost:5000/api/admin/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      title: 'Ultimate 2026 DSA Visual Handbook',
      category: 'DSA Notes',
      price: 49,
      originalPrice: 299,
      description: 'Comprehensive 200+ page visual handbook with all patterns.',
      digitalFile: uploadedFilename,
      fileFormat: 'PDF'
    })
  })).json();

  assert(createProdRes.success === true && Boolean(createProdRes.data?.id), `Product created with digital file link: ${createProdRes.data?.id}`);
  const newProdId = createProdRes.data.id;

  // 4. Test View/Download Endpoint
  console.log('\n  📥 Testing Secure File Stream / View Pipeline (/api/downloads/:id)...');
  const viewRes = await fetch(`http://localhost:5000/api/downloads/${newProdId}?view=true&token=${adminToken}`);
  const contentType = viewRes.headers.get('content-type');
  const contentDisp = viewRes.headers.get('content-disposition');
  
  assert(viewRes.status === 200, `Download endpoint returned HTTP 200 OK`);
  assert(contentType?.includes('application/pdf') === true, `Response Content-Type is application/pdf (received: ${contentType})`);
  assert(contentDisp?.includes('inline') === true, `Response Content-Disposition is inline for in-browser PDF viewing`);

  // 5. Test Unauthorized Access on Paid Resource (No Token)
  const unauthRes = await fetch(`http://localhost:5000/api/downloads/${newProdId}?view=true`);
  assert(unauthRes.status === 401, `Unauthenticated request for paid product correctly denied with HTTP 401`);

  console.log(`\n==================================================`);
  console.log(`🏁 Pipeline Suite Completed: ${passCount}/${totalTests} Tests Passed!`);
  console.log(`==================================================\n`);
}

runPipelineTests();
