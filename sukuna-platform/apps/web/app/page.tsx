import { redirect } from 'next/navigation';

// Root route renders no UI of its own.
// Sends users directly to /login with a fast server-side redirect
// and no intermediate splash/loading screen.
export default function HomePage() {
  redirect('/login');
}
