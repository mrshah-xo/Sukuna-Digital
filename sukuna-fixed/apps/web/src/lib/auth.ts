import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/mongodb';
import { User } from '@/models';
import { otpService } from '@/services/otp.service';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'otp',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) return null;
        
        await connectDB();
        
        // 1. Verify OTP using the service layer
        const isValid = await otpService.verifyOTP(credentials.phone as string, credentials.otp as string);
        if (!isValid) return null;

        // 2. Fetch User & determine Role from DB
        const user = await User.findOne({ phone: credentials.phone, status: 'ACTIVE' });
        if (!user) return null; 

        // 3. Update last login
        user.lastLogin = new Date();
        await user.save();

        return { 
          id: user._id.toString(), 
          name: user.name, 
          phone: user.phone, 
          role: user.role,
          schoolId: user.schoolId.toString()
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { 
        if (user.id) token.id = user.id;
        token.phone = user.phone; 
        token.role = user.role; 
        token.schoolId = user.schoolId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) { 
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.schoolId = token.schoolId;
        session.user.phone = token.phone;
      }
      return session;
    },
  },
  pages: { signIn: '/login', error: '/login' },
  session: { strategy: 'jwt' },
});
