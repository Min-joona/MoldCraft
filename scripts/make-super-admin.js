const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/moldcraft');
  console.log('Connected');

  const r = await mongoose.connection.db.collection('users').updateOne(
    { email: 'kimsabu36@gmail.com' },
    { $set: { role: 'super_admin' } }
  );
  console.log('Matched:', r.matchedCount, 'Modified:', r.modifiedCount);

  const user = await mongoose.connection.db.collection('users').findOne({ email: 'kimsabu36@gmail.com' });
  console.log('User:', user.name, user.email, 'Role:', user.role);

  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
