import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
// Note: In a hybrid NextAuth/Express setup, you must share the same JWT secret.
// For NextAuth JWTs, the secret is typically process.env.NEXTAUTH_SECRET.
// NextAuth encrypts (JWE) tokens by default, so standard passport-jwt might need a custom extractor/decoder
// if using NextAuth's default encoder.
// For now, this prepares the foundation for when we issue pure JWTs or configure NextAuth to output standard JWTs.

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback_secret',
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // jwt_payload should contain { id, role, schoolId, phone }
      if (jwt_payload && jwt_payload.id) {
        return done(null, {
          id: jwt_payload.id,
          role: jwt_payload.role,
          schoolId: jwt_payload.schoolId
        });
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
