import { saveTeam } from './src/app/admin/actions';

async function test() {
  try {
    const res = await saveTeam({
      name: 'Test Team',
      shortName: 'TST',
      slug: 'test-team',
      logo: '',
      city: 'Test City',
      founded: 2020,
      manager: 'Manager',
      stadium: 'Stadium',
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      description: 'Test description',
    });
    console.log('Success:', res);
  } catch (e) {
    console.error('Error:', e);
  }
}

test();
