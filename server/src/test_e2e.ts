import { seedDatabaseIfEmpty } from './database/seed';
import { db } from './database/db';
import { sandboxService } from './services/sandboxService';
import { razorpayService } from './services/razorpayService';
import { gamificationService } from './services/gamificationService';

async function runAcceptanceTests() {
  console.log('====================================================');
  console.log('  🧪 RUNNING CONCEPTIFYYY ACCEPTANCE & VERIFICATION TESTS');
  console.log('====================================================');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}`);
      process.exit(1);
    }
  }

  // 1. Seed & DB Test
  await seedDatabaseIfEmpty();
  const users = db.find('users');
  const problems = db.find('problems');
  const aptitudeTopics = db.find('aptitudeTopics');
  const products = db.find('products');

  assert(users.length >= 2, 'Database seeded with Admin and Demo Student users');
  assert(problems.length >= 5, 'Database seeded with DSA problems');
  assert(aptitudeTopics.length >= 5, 'Database seeded with Aptitude topics');
  assert(products.length >= 4, 'Database seeded with Store digital notes and projects');

  // 2. Sandboxed Code Execution Tests
  console.log('\n--- Sandboxed Code Execution Tests ---');
  const jsCode = `
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) return [map.get(comp), i];
    map.set(nums[i], i);
  }
  return [];
}`;
  const testCases = [
    { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]', isHidden: false },
    { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]', isHidden: false }
  ];

  const execRes = await sandboxService.execute('javascript', jsCode, testCases);
  assert(execRes.status === 'Accepted', 'Sandboxed JS execution passed all test cases');
  assert(execRes.testCasesPassed === 2, 'All 2 public test cases passed');
  assert(execRes.executionTimeMs > 0, 'Execution telemetry recorded runtime time');

  // 3. Binary Search Evaluation Test
  const bsCode = `
function search(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    let m = Math.floor((l + r) / 2);
    if (nums[m] === target) return m;
    if (nums[m] < target) l = m + 1;
    else r = m - 1;
  }
  return -1;
}`;
  const bsTestCases = [{ input: '[-1, 0, 3, 5, 9, 12], 9', expectedOutput: '4', isHidden: false }];
  const bsRes = await sandboxService.execute('javascript', bsCode, bsTestCases);
  assert(bsRes.status === 'Accepted', 'Binary search sandbox test passed');

  // 4. Real Razorpay Integration & Server-Side Security Test
  console.log('\n--- Real Razorpay Payment Engine Tests ---');
  const testProduct = db.findOne('products', p => p.category === 'DSA Notes') || products[0];
  const orderPrice = Math.max(1, testProduct.price);
  const amountInPaise = orderPrice * 100;

  // Cryptographic Signature verification tests
  const testOrderId = 'order_test_12345';
  const testPaymentId = 'pay_test_67890';
  const validSecret = process.env.RAZORPAY_KEY_SECRET || 'conceptifyyy_rzp_secret_key_demo';
  const validHash = require('crypto')
    .createHmac('sha256', validSecret)
    .update(`${testOrderId}|${testPaymentId}`)
    .digest('hex');

  const isSigValid = razorpayService.verifyPaymentSignature({
    orderId: testOrderId,
    paymentId: testPaymentId,
    signature: validHash
  });
  assert(isSigValid, 'HMAC-SHA256 cryptographic signature verification matched valid hash');

  const isTamperedRejected = !razorpayService.verifyPaymentSignature({
    orderId: testOrderId,
    paymentId: testPaymentId,
    signature: 'fake_tampered_signature_attempt'
  });
  assert(isTamperedRejected, 'Tampered / fake signature correctly rejected');

  // 5. Gamification & Streak Test
  console.log('\n--- Gamification & Streak Tests ---');
  const demoStudent = db.findOne('users', u => u.role === 'STUDENT')!;
  const initialXp = demoStudent.xp || 0;
  const gameRes = gamificationService.awardActivity(demoStudent.id, 'dsa_solve', 'Medium');

  assert(gameRes.xpAdded === 40, 'Medium problem awarded 40 XP');
  assert(gameRes.newTotalXp === initialXp + 40, 'User XP updated in database');

  console.log('\n====================================================');
  console.log(`  🎉 ALL ${passed}/${total} ACCEPTANCE TESTS PASSED!`);
  console.log('====================================================');
}

runAcceptanceTests().catch(err => {
  console.error('Acceptance tests failed:', err);
  process.exit(1);
});
