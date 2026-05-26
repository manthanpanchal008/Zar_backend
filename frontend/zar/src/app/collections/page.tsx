import { redirect } from 'next/navigation';

export default function CollectionsRedirectPage() {
  // Defaulting to 22k collection
  redirect('/collections/22k');
}
