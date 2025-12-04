const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const email = process.argv[2];

if (!email) {
  console.log('Please provide an email address.');
  process.exit(1);
}

const promoteUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB Connected');

    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`User ${user.name} (${user.email}) is now an ADMIN.`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

promoteUser();
