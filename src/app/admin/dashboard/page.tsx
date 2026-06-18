import { redirect } from 'next/navigation';

export default function DashboardOverview() {
  redirect('/admin/dashboard/home');
}
