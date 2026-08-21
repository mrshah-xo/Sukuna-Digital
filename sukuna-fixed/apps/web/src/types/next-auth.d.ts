import 'next-auth';
import 'next-auth/jwt';

// Extend the User object returned by your authorize() function
declare module 'next-auth' {
  interface User {
    phone:    string;
    role:     string;
    schoolId: string;
  }

  // Extend the session.user object that pages can access
  interface Session {
    user: {
      id:       string;
      name?:    string | null;
      email?:   string | null;
      image?:   string | null;
      phone:    string;
      role:     string;
      schoolId: string;
    };
  }
}

// Extend the JWT token stored server-side
declare module 'next-auth/jwt' {
  interface JWT {
    id:       string;
    phone:    string;
    role:     string;
    schoolId: string;
  }
}