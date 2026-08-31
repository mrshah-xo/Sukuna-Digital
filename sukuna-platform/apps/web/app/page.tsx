import { redirect } from 'next/navigation';

// Root route renders no UI of its own.
//
// middleware.ts already protects "/" (it's not in its publicRoutes list),
// so an unauthenticated request is redirected to /login at the edge and
// this component never executes for a signed-out user. Re-checking the
// session here would just be a second, duplicate auth check for the same
// request, so we don't — reaching this line already means the user is
// authenticated. Send them straight to their dashboard with one fast
// server-side redirect and no intermediate splash/loading screen.
export default function HomePage() {
  redirect('/dashboard');
}
