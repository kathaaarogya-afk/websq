const fs = require('fs');
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);
const uri = (fs.readFileSync('D:/australia/websq/.env.local', 'utf8').match(/MONGODB_URI=(.+)/) || [])[1].trim();
const mongoose = require('D:/australia/websq/node_modules/mongoose');
(async () => {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 25000 });
    const User = require('D:/australia/websq/src/models/User.ts');
    const Follow = require('D:/australia/websq/src/models/Follow.ts');
    const users = await User.find({ active: true }).select('_id name email').lean();
    console.log('active:', users.length);
    // mutual follow: for each pair? 
  } catch (e) { console.log('ERR', e.message); }
  process.exit(0);
})();
