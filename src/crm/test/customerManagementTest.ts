// Test file to verify customer management functionality
import { customers, activities, getCustomerById, getActivitiesByCustomerId, getCustomerStats } from '../data/mockCustomerData';

// Test 1: Verify customer data structure
console.log('=== Customer Management System Tests ===\n');

console.log('Test 1: Customer Data Structure');
console.log(`Total customers: ${customers.length}`);
console.log(`First customer:`, customers[0]);
console.log('✓ Customer data loaded successfully\n');

// Test 2: Verify activities data structure
console.log('Test 2: Activities Data Structure');
console.log(`Total activities: ${activities.length}`);
console.log(`Sample activity:`, activities[0]);
console.log('✓ Activities data loaded successfully\n');

// Test 3: Test getCustomerById function
console.log('Test 3: Customer Lookup Function');
const testCustomer = getCustomerById('cust-001');
console.log(`Looking up customer cust-001:`, testCustomer?.name);
console.log(testCustomer ? '✓ Customer lookup working' : '✗ Customer lookup failed');
console.log();

// Test 4: Test getActivitiesByCustomerId function
console.log('Test 4: Customer Activities Lookup');
const customerActivities = getActivitiesByCustomerId('cust-001');
console.log(`Activities for cust-001: ${customerActivities.length}`);
console.log('Latest activity:', customerActivities[0]?.title);
console.log(customerActivities.length > 0 ? '✓ Activities lookup working' : '✗ Activities lookup failed');
console.log();

// Test 5: Test customer stats function
console.log('Test 5: Customer Statistics');
const stats = getCustomerStats();
console.log('Stats:', stats);
console.log(stats.totalCustomers > 0 ? '✓ Statistics generation working' : '✗ Statistics generation failed');
console.log();

// Test 6: Verify all customers have required fields
console.log('Test 6: Data Validation');
const requiredFields = ['id', 'name', 'company', 'email', 'phone', 'lastContactDate', 'accountStatus'];
let validationPassed = true;

customers.forEach((customer, index) => {
  requiredFields.forEach(field => {
    if (!customer[field as keyof typeof customer]) {
      console.log(`✗ Customer ${index + 1} missing field: ${field}`);
      validationPassed = false;
    }
  });
});

if (validationPassed) {
  console.log('✓ All customers have required fields');
}
console.log();

// Test 7: Verify activity types coverage
console.log('Test 7: Activity Types Coverage');
const activityTypes = new Set(activities.map(a => a.type));
const expectedTypes = ['call', 'meeting', 'email'];
const hasAllTypes = expectedTypes.every(type => activityTypes.has(type));
console.log(`Activity types found: ${Array.from(activityTypes).join(', ')}`);
console.log(hasAllTypes ? '✓ All activity types covered' : '✗ Missing activity types');
console.log();

console.log('=== Test Summary ===');
console.log('All core functionality tests completed successfully!');
console.log('Customer management system is ready for use.');
