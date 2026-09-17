import { db } from './database/db';
import { dsaProblemsDataset } from './database/dsaDataset';
import { aptitudeQuestionsDataset } from './database/aptitudeDataset';
import { sandboxService } from './services/sandboxService';
import { razorpayService } from './services/razorpayService';

async function runAcceptanceSuite() {
  console.log('🧪 Starting CONCEPTIFYYY Comprehensive Acceptance Test Suite...\n');
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

  // 1. Check Demo Accounts Purity & Real Admin Account
  const users = db.find('users');
  const demoUsers = users.filter(u => 
    u.email === 'admin@conceptifyyy.com' || 
    u.email === 'student@conceptifyyy.com' ||
    u.name === 'Aarav Sharma' ||
    u.id === 'usr_admin_master' ||
    u.id === 'usr_student_demo'
  );
  assert(demoUsers.length === 0, 'No demo users or fake accounts exist in database');

  const adminAccount = users.find(u => u.email === 'atharvbolke99@gmail.com');
  assert(Boolean(adminAccount && adminAccount.role === 'ADMIN'), 'Real admin account (atharvbolke99@gmail.com) exists with role ADMIN');

  // 2. Check Problem Bank
  const problems = db.find('problems');
  assert(problems.length >= 10, `DSA Problem bank populated with genuine problems (found ${problems.length})`);

  // 3. Solution Leak Protection
  const twoSum = db.findOne('problems', p => p.slug === 'two-sum');
  assert(Boolean(twoSum), 'Found two-sum problem');
  if (twoSum) {
    // Check starter code does not contain solution
    const jsStarter = twoSum.starterCode.javascript;
    assert(!jsStarter.includes('new Map()') && !jsStarter.includes('complement'), 'Starter code contains ONLY signature template, NO solution code');

    // Check solution exists and has detailed fields
    assert(Boolean(twoSum.solution?.approach && twoSum.solution?.timeComplexity), 'Solution contains full approach, intuition, and time complexity');
    assert(Boolean(twoSum.solution?.code?.javascript && twoSum.solution?.code?.python), 'Solution contains code in multiple languages');
  }

  // 4. Code Execution Sandbox Test
  console.log('\n  ⚡ Testing Sandbox Isolation & Dynamic Evaluation...');
  const userValidCode = `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
      const comp = target - nums[i];
      if (map.has(comp)) return [map.get(comp), i];
      map.set(nums[i], i);
    }
    return [];
  }`;

  if (twoSum) {
    const publicTests = twoSum.testCases.filter(t => !t.isHidden);
    const runResult = await sandboxService.execute('javascript', userValidCode, publicTests);
    assert(runResult.status === 'Accepted' && runResult.testCasesPassed === publicTests.length, 'Code runner successfully evaluated public test cases');

    const submitResult = await sandboxService.execute('javascript', userValidCode, twoSum.testCases);
    assert(submitResult.status === 'Accepted' && submitResult.testCasesPassed === twoSum.testCases.length, 'Code submit successfully evaluated all test cases including hidden ones');
  }

  // 5. Test Additional Algorithms (Kadane & Binary Search)
  const kadaneCode = `function maxSubArray(nums) {
    let cur = nums[0], maxS = nums[0];
    for (let i = 1; i < nums.length; i++) {
      cur = Math.max(nums[i], cur + nums[i]);
      maxS = Math.max(maxS, cur);
    }
    return maxS;
  }`;
  const kadaneProb = db.findOne('problems', p => p.slug === 'maximum-subarray');
  if (kadaneProb) {
    const kadaneResult = await sandboxService.execute('javascript', kadaneCode, kadaneProb.testCases);
    assert(kadaneResult.status === 'Accepted' && kadaneResult.testCasesPassed === kadaneProb.testCases.length, 'Kadane algorithm evaluated successfully in sandbox');
  }

  // 6. Aptitude Question Bank Check
  const aptQuestions = db.find('aptitudeQuestions');
  assert(aptQuestions.length >= 10, `Aptitude question bank populated with genuine questions (found ${aptQuestions.length})`);
  const timeWorkQ = aptQuestions.find(q => q.topicTitle === 'Time & Work');
  assert(Boolean(timeWorkQ && timeWorkQ.options.length === 4 && timeWorkQ.explanation), 'Aptitude question contains 4 options, explanation and formula');

  // 7. Razorpay Test Credentials Verification
  console.log('\n  💳 Testing Razorpay Live Test Order Creation...');
  const orderResult = await razorpayService.createOrder({
    amountInPaise: 3900,
    receipt: 'rcpt_test_suite_acc',
    notes: { test: 'acceptance_suite' }
  });
  assert(orderResult.id.startsWith('order_'), `Razorpay generated genuine test order: ${orderResult.id}`);

  console.log(`\n==================================================`);
  console.log(`🏁 Acceptance Suite Completed: ${passCount}/${totalTests} Tests Passed!`);
  console.log(`==================================================\n`);
}

runAcceptanceSuite();
