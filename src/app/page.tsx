import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect root to the portfolio page
  redirect('/portfolio');
}
