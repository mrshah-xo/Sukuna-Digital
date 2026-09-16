import { redirect } from 'next/navigation';

export default function BrandingRedirectPage() {
  redirect('/admin?section=branding');
}
