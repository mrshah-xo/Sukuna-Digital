import 'dotenv/config';
import connectDB from './src/lib/mongodb.ts';
import { User } from './src/models/index.ts';
import { otpService } from './src/services/otp.service.ts';
import mongoose from 'mongoose';

async function run() {
  await connectDB();
  const phone = '9816348390';
  
  try {
    console.log('Sending OTP...');
    await otpService.sendOTP(phone);
    
    // get latest OTP
    const otpDoc = await mongoose.model('Otp').findOne({ phone }).sort({ createdAt: -1 });
    console.log('Latest OTP hash in DB:', otpDoc.otp);
    
    // We cannot know the unhashed OTP easily because it's random, but let's mock the compare
    console.log('Looking up user...');
    const user = await User.findOne({ phone, status: 'ACTIVE' });
    console.log('User found:', user ? user.name : 'null');
    
    if (user) {
      console.log('schoolId:', user.schoolId);
      console.log('schoolId.toString():', user.schoolId.toString());
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    mongoose.disconnect();
  }
}
run();
