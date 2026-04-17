const { scrypt, randomBytes } = require('crypto');
const { promisify } = require('util');
const { execSync } = require('child_process');

const scryptAsync = promisify(scrypt);
const password = 'Admin@123';
const salt = randomBytes(16).toString('hex');

scryptAsync(password, salt, 64).then(buf => {
  const hash = buf.toString('hex') + '.' + salt;
  
  // Write SQL to a temp file
  const fs = require('fs');
  const sql = `UPDATE users SET password = '${hash}', "onboardingStatus" = 'active', "currentStep" = 'completed' WHERE username = 'admin';`;
  fs.writeFileSync('/tmp/reset_admin.sql', sql);

  // Copy into container and run
  execSync('docker cp /tmp/reset_admin.sql wellbeing-support-db-1:/tmp/reset_admin.sql');
  const result = execSync('docker exec wellbeing-support-db-1 psql -U postgres -d mindfulspace -f /tmp/reset_admin.sql').toString();
  console.log('Done:', result);
  console.log('\nAdmin credentials reset successfully:');
  console.log('  Username: admin');
  console.log('  Password: Admin@123');
}).catch(console.error);
