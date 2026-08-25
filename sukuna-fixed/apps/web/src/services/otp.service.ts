import bcrypt from 'bcryptjs';
import { User, Otp } from '@/models';
import connectDB from '@/lib/mongodb';

type OTPProvider = 'AKASH_SMS' | 'SPARROW_SMS' | 'TWILIO';

interface OTPPayload {
  phone: string;
  otp: string;
}

/**
 * The provider-agnostic OTP Service Layer backed by MongoDB
 */
class OTPService {
  private currentProvider: OTPProvider = 'AKASH_SMS';

  /**
   * Generates a 6-digit OTP
   */
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Sends an OTP to a verified user phone number.
   * Throws an error if the phone number is not registered.
   */
  async sendOTP(phone: string): Promise<boolean> {
    await connectDB();
    
    // Check if user exists in the database
    const user = await User.findOne({ phone, status: { $in: ['ACTIVE', 'SUSPENDED'] } });
    if (!user) {
      throw new Error('This mobile number is not registered with the school.');
    }

    if (user.status === 'SUSPENDED') {
      throw new Error('This account has been suspended. Please contact administration.');
    }

    // Rate Limiting: Max 5 OTP requests per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentRequests = await Otp.countDocuments({ phone, createdAt: { $gt: oneHourAgo } });
    if (recentRequests >= 5) {
      throw new Error('Too many OTP requests. Please try again after an hour.');
    }

    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Hash the OTP before saving to database
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    // Save to MongoDB (handles persistence and rate-limit tracking)
    // Deactivate any older unused OTPs for this phone
    await Otp.updateMany({ phone, isUsed: false }, { isUsed: true });

    await Otp.create({
      phone,
      otp: hashedOtp, // Store hashed OTP
      expiresAt,
      isUsed: false,
      attempts: 0
    });

    let success = false;

    // Send via the active provider
    switch (this.currentProvider) {
      case 'AKASH_SMS':
        success = await this.akashSmsProvider({ phone, otp });
        break;
      default:
        console.warn(`Provider ${this.currentProvider} not implemented. Falling back to mock.`);
        success = await this.akashSmsProvider({ phone, otp });
    }

    return success;
  }

  /**
   * Verifies the OTP provided by the user.
   */
  async verifyOTP(phone: string, inputOTP: string): Promise<boolean> {
    await connectDB();

    const record = await Otp.findOne({ phone, isUsed: false }).sort({ createdAt: -1 });
    
    if (!record) {
      throw new Error('OTP expired or not requested.');
    }

    if (Date.now() > record.expiresAt.getTime()) {
      record.isUsed = true;
      await record.save();
      throw new Error('OTP has expired. Please request a new one.');
    }

    if (record.attempts >= 3) {
      record.isUsed = true;
      await record.save();
      throw new Error('Maximum attempts reached. Please request a new OTP.');
    }

    const isMatch = await bcrypt.compare(inputOTP, record.otp);

    if (isMatch) {
      // Verified successfully, clean up
      record.isUsed = true;
      await record.save();
      return true;
    }

    // Invalid attempt
    record.attempts += 1;
    await record.save();
    return false;
  }

  /**
   * Akash SMS Provider implementation
   */
  private async akashSmsProvider({ phone, otp }: OTPPayload): Promise<boolean> {
    console.log(`\n[AKASH SMS SERVICE]`);
    console.log(`Sending OTP: ${otp} to Phone: ${phone}`);
    console.log(`Status: SUCCESS\n`);
    
    // TODO: Implement actual Akash SMS API Call
    // const response = await fetch('https://aakashsms.com/admin/public/sms/v3/send', { ... })
    
    return true;
  }
}

export const otpService = new OTPService();
