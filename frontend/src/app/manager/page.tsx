import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAdminJWT } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { Trophy, LogOut } from 'lucide-react';
import { logoutManagerAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function ManagerDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('manager_token')?.value;

  if (!token) {
    redirect('/manager/login');
  }

  const payload = await verifyAdminJWT(token);
  if (!payload || payload.role !== 'team_manager') {
    redirect('/manager/login');
  }

  // Fetch the manager's team
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    include: { team: true }
  });

  if (!user || !user.team) {
    return (
      <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>
        <h2>Error: Team not found for this manager account.</h2>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: '#fff', fontFamily: 'sans-serif', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        {/* Header Title */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem', marginBottom: '2rem', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,215,0,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${user.team.primaryColor}`
            }}>
              <Trophy size={24} color="#FFD700" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFD700', margin: 0 }}>
                {user.team.name}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.2rem' }}>
                Manager Console • {user.name}
              </p>
            </div>
          </div>
          
          <form action={logoutManagerAction}>
            <button
              type="submit"
              style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '0.5rem', color: '#ff6b6b', padding: '0.6rem 1.2rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </form>
        </div>

        {/* Dashboard Content */}
        <div style={{
          background: 'rgba(10, 10, 20, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '1rem',
          padding: '2.5rem',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>Welcome, {user.name}!</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', maxWidth: 600, margin: '0 auto' }}>
            This is the Team Manager dashboard placeholder. 
            Currently, you have been verified and assigned to <strong>{user.team.name}</strong>.
            <br/><br/>
            In the future, you will be able to edit your team's details, manage your players' stats, and update your squad directly from this page!
          </p>
        </div>

      </div>
    </div>
  );
}
