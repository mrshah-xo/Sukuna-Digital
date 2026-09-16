import { redirect } from 'next/navigation';

export default function MediaRedirectPage() {
  redirect('/admin?section=branding');
}
