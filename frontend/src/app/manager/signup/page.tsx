import { prisma } from '@/lib/prisma';
import ManagerSignupForm from './ManagerSignupForm';

export const dynamic = 'force-dynamic';

export default async function ManagerSignupPage() {
  const teams = await prisma.team.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  });

  return <ManagerSignupForm teams={teams} />;
}
