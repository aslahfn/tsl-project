import { Team, Player, Fixture, Standing, NewsArticle, GalleryImage, Sponsor } from './types';

export const teams: Team[] = [
  {
    id: 't1',
    name: 'PETTIKADA FC',
    shortName: 'PKD',
    slug: 'pettikada-fc',
    logo: '/logos/pkd.svg',
    city: 'Pettikada',
    founded: 2015,
    manager: 'Faize',
    stadium: 'Pettikada Arena',
    primaryColor: '#00FF87',
    secondaryColor: '#0A0A0F',
    description: 'The powerhouse of Super League Season 08. Pettikada FC play with intensity, flair, and a relentless drive to win every match.',
  },
  {
    id: 't2',
    name: 'AL MOTHALZ FC',
    shortName: 'ALM',
    slug: 'al-mothalz-fc',
    logo: '/logos/alm.svg',
    city: 'Mothalz',
    founded: 2016,
    manager: 'Siraj Zain',
    stadium: 'Mothalz Ground',
    primaryColor: '#FFD700',
    secondaryColor: '#1A1A2E',
    description: 'A technically gifted side led by Siraj Zain. Al Mothalz FC boast some of the sharpest attacking play in the league.',
  },
  {
    id: 't3',
    name: 'KP MONJANZ FC',
    shortName: 'KPM',
    slug: 'kp-monjanz-fc',
    logo: '/logos/kpm.svg',
    city: 'Monjanz',
    founded: 2017,
    manager: 'Rasheed',
    stadium: 'Monjanz Park',
    primaryColor: '#FF6B35',
    secondaryColor: '#1C1C1C',
    description: 'Coached by Rasheed, KP Monjanz FC are the dark horses of Season 08 — unpredictable, energetic, and dangerous on the counter.',
  },
  {
    id: 't4',
    name: 'TARGARYENS FC',
    shortName: 'TGR',
    slug: 'targaryens-fc',
    logo: '/logos/tgr.svg',
    city: 'Targaryen',
    founded: 2018,
    manager: 'Niyas & Aslam',
    stadium: "Dragon's Den",
    primaryColor: '#E74C3C',
    secondaryColor: '#2C0A0A',
    description: 'Co-managed by Niyas and Aslam, Targaryens FC play with fire — aggressive, passionate, and built to dominate.',
  },
  {
    id: 't5',
    name: 'LUCA SOCCER FC',
    shortName: 'LSF',
    slug: 'luca-soccer-fc',
    logo: '/logos/lsf.svg',
    city: 'Luca',
    founded: 2016,
    manager: 'Subijith, Masheesh & Sujith',
    stadium: 'Luca Stadium',
    primaryColor: '#3498DB',
    secondaryColor: '#FFFFFF',
    description: 'A collective vision from three managers — Subijith, Masheesh, and Sujith. Luca Soccer FC play beautiful, flowing football.',
  },
  {
    id: 't6',
    name: 'LIONS FC',
    shortName: 'LFC',
    slug: 'lions-fc',
    logo: '/logos/lfc.svg',
    city: 'Lions',
    founded: 2015,
    manager: 'Shuhaib',
    stadium: 'Lions Den',
    primaryColor: '#F39C12',
    secondaryColor: '#1A0A00',
    description: 'Roaring back every season, Lions FC under Shuhaib are tenacious, physical, and built on unshakeable team spirit.',
  },
];

export const players: Player[] = [
  // PETTIKADA FC
  { id: 'p1', name: 'Arjun Faize', teamId: 't1', teamName: 'PETTIKADA FC', teamLogo: '/logos/pkd.svg', position: 'FWD', number: 9, nationality: 'India', nationalityFlag: '🇮🇳', age: 24, photo: '/players/p1.jpg', goals: 14, assists: 6, matches: 10, yellowCards: 2, redCards: 0, rating: 8.7 },
  { id: 'p2', name: 'Rafi Pettikada', teamId: 't1', teamName: 'PETTIKADA FC', teamLogo: '/logos/pkd.svg', position: 'MID', number: 8, nationality: 'India', nationalityFlag: '🇮🇳', age: 23, photo: '/players/p2.jpg', goals: 5, assists: 9, matches: 10, yellowCards: 1, redCards: 0, rating: 8.3 },
  { id: 'p3', name: 'Salam PKD', teamId: 't1', teamName: 'PETTIKADA FC', teamLogo: '/logos/pkd.svg', position: 'DEF', number: 5, nationality: 'India', nationalityFlag: '🇮🇳', age: 26, photo: '/players/p3.jpg', goals: 1, assists: 2, matches: 10, yellowCards: 3, redCards: 0, rating: 7.6 },
  { id: 'p4', name: 'Hasib GK', teamId: 't1', teamName: 'PETTIKADA FC', teamLogo: '/logos/pkd.svg', position: 'GK', number: 1, nationality: 'India', nationalityFlag: '🇮🇳', age: 27, photo: '/players/p4.jpg', goals: 0, assists: 0, matches: 10, yellowCards: 0, redCards: 0, cleanSheets: 5, rating: 8.1 },

  // AL MOTHALZ FC
  { id: 'p5', name: 'Siraj Junior', teamId: 't2', teamName: 'AL MOTHALZ FC', teamLogo: '/logos/alm.svg', position: 'FWD', number: 10, nationality: 'India', nationalityFlag: '🇮🇳', age: 22, photo: '/players/p5.jpg', goals: 11, assists: 4, matches: 10, yellowCards: 2, redCards: 0, rating: 8.5 },
  { id: 'p6', name: 'Zain AL', teamId: 't2', teamName: 'AL MOTHALZ FC', teamLogo: '/logos/alm.svg', position: 'MID', number: 7, nationality: 'India', nationalityFlag: '🇮🇳', age: 25, photo: '/players/p6.jpg', goals: 4, assists: 8, matches: 10, yellowCards: 1, redCards: 0, rating: 8.0 },
  { id: 'p7', name: 'Amjad Mothalz', teamId: 't2', teamName: 'AL MOTHALZ FC', teamLogo: '/logos/alm.svg', position: 'DEF', number: 4, nationality: 'India', nationalityFlag: '🇮🇳', age: 28, photo: '/players/p7.jpg', goals: 1, assists: 1, matches: 10, yellowCards: 4, redCards: 0, rating: 7.4 },

  // KP MONJANZ FC
  { id: 'p8', name: 'Rasheed Jr', teamId: 't3', teamName: 'KP MONJANZ FC', teamLogo: '/logos/kpm.svg', position: 'FWD', number: 9, nationality: 'India', nationalityFlag: '🇮🇳', age: 21, photo: '/players/p8.jpg', goals: 9, assists: 5, matches: 10, yellowCards: 3, redCards: 0, rating: 8.2 },
  { id: 'p9', name: 'Monjanz Ace', teamId: 't3', teamName: 'KP MONJANZ FC', teamLogo: '/logos/kpm.svg', position: 'MID', number: 6, nationality: 'India', nationalityFlag: '🇮🇳', age: 24, photo: '/players/p9.jpg', goals: 3, assists: 7, matches: 10, yellowCards: 2, redCards: 0, rating: 7.9 },

  // TARGARYENS FC
  { id: 'p10', name: 'Niyas Dragon', teamId: 't4', teamName: 'TARGARYENS FC', teamLogo: '/logos/tgr.svg', position: 'FWD', number: 11, nationality: 'India', nationalityFlag: '🇮🇳', age: 23, photo: '/players/p10.jpg', goals: 8, assists: 6, matches: 10, yellowCards: 5, redCards: 1, rating: 8.0 },
  { id: 'p11', name: 'Aslam Fire', teamId: 't4', teamName: 'TARGARYENS FC', teamLogo: '/logos/tgr.svg', position: 'MID', number: 8, nationality: 'India', nationalityFlag: '🇮🇳', age: 26, photo: '/players/p11.jpg', goals: 5, assists: 7, matches: 10, yellowCards: 3, redCards: 0, rating: 8.1 },

  // LUCA SOCCER FC
  { id: 'p12', name: 'Subijith Luca', teamId: 't5', teamName: 'LUCA SOCCER FC', teamLogo: '/logos/lsf.svg', position: 'MID', number: 10, nationality: 'India', nationalityFlag: '🇮🇳', age: 25, photo: '/players/p12.jpg', goals: 6, assists: 10, matches: 10, yellowCards: 1, redCards: 0, rating: 8.4 },
  { id: 'p13', name: 'Masheesh Star', teamId: 't5', teamName: 'LUCA SOCCER FC', teamLogo: '/logos/lsf.svg', position: 'FWD', number: 9, nationality: 'India', nationalityFlag: '🇮🇳', age: 22, photo: '/players/p13.jpg', goals: 10, assists: 3, matches: 10, yellowCards: 2, redCards: 0, rating: 8.2 },

  // LIONS FC
  { id: 'p14', name: 'Shuhaib Lion', teamId: 't6', teamName: 'LIONS FC', teamLogo: '/logos/lfc.svg', position: 'FWD', number: 7, nationality: 'India', nationalityFlag: '🇮🇳', age: 27, photo: '/players/p14.jpg', goals: 7, assists: 4, matches: 10, yellowCards: 2, redCards: 0, rating: 7.8 },
  { id: 'p15', name: 'Lions Keeper', teamId: 't6', teamName: 'LIONS FC', teamLogo: '/logos/lfc.svg', position: 'GK', number: 1, nationality: 'India', nationalityFlag: '🇮🇳', age: 29, photo: '/players/p15.jpg', goals: 0, assists: 0, matches: 10, yellowCards: 0, redCards: 0, cleanSheets: 4, rating: 7.9 },
];

export const standings: Standing[] = [
  { position: 1, teamId: 't1', teamName: 'PETTIKADA FC',   teamLogo: '/logos/pkd.svg', teamShort: 'PKD', played: 10, won: 7, drawn: 2, lost: 1, goalsFor: 26, goalsAgainst: 11, goalDifference: 15, points: 23, form: ['W', 'W', 'D', 'W', 'W'], positionChange: 'SAME' },
  { position: 2, teamId: 't2', teamName: 'AL MOTHALZ FC',  teamLogo: '/logos/alm.svg', teamShort: 'ALM', played: 10, won: 6, drawn: 2, lost: 2, goalsFor: 22, goalsAgainst: 13, goalDifference: 9,  points: 20, form: ['W', 'D', 'W', 'W', 'L'], positionChange: 'UP' },
  { position: 3, teamId: 't4', teamName: 'TARGARYENS FC',  teamLogo: '/logos/tgr.svg', teamShort: 'TGR', played: 10, won: 5, drawn: 3, lost: 2, goalsFor: 20, goalsAgainst: 14, goalDifference: 6,  points: 18, form: ['D', 'W', 'W', 'D', 'W'], positionChange: 'UP' },
  { position: 4, teamId: 't5', teamName: 'LUCA SOCCER FC', teamLogo: '/logos/lsf.svg', teamShort: 'LSF', played: 10, won: 5, drawn: 2, lost: 3, goalsFor: 18, goalsAgainst: 15, goalDifference: 3,  points: 17, form: ['W', 'D', 'L', 'W', 'W'], positionChange: 'DOWN' },
  { position: 5, teamId: 't3', teamName: 'KP MONJANZ FC',  teamLogo: '/logos/kpm.svg', teamShort: 'KPM', played: 10, won: 4, drawn: 1, lost: 5, goalsFor: 15, goalsAgainst: 19, goalDifference: -4, points: 13, form: ['L', 'W', 'L', 'W', 'D'], positionChange: 'SAME' },
  { position: 6, teamId: 't6', teamName: 'LIONS FC',       teamLogo: '/logos/lfc.svg', teamShort: 'LFC', played: 10, won: 2, drawn: 2, lost: 6, goalsFor: 11, goalsAgainst: 22, goalDifference: -11,points: 8,  form: ['L', 'L', 'D', 'L', 'W'], positionChange: 'DOWN' },
];

export const fixtures: Fixture[] = [
  { id: 'f1', homeTeamId: 't1', homeTeamName: 'PETTIKADA FC', homeTeamLogo: '/logos/pkd.svg', homeTeamShort: 'PKD', awayTeamId: 't6', awayTeamName: 'LIONS FC', awayTeamLogo: '/logos/lfc.svg', awayTeamShort: 'LFC', date: '2026-06-07', time: '16:30', venue: 'THOZHUPADAM HOME GROUND', matchday: 1, status: 'UPCOMING' },
  { id: 'f2', homeTeamId: 't3', homeTeamName: 'KP MONJANZ FC', homeTeamLogo: '/logos/kpm.svg', homeTeamShort: 'KPM', awayTeamId: 't2', awayTeamName: 'AL MOTHALZ FC', awayTeamLogo: '/logos/alm.svg', awayTeamShort: 'ALM', date: '2026-06-07', time: '17:00', venue: 'THOZHUPADAM HOME GROUND', matchday: 1, status: 'UPCOMING' },
  { id: 'f3', homeTeamId: 't5', homeTeamName: 'LUCA SOCCER FC', homeTeamLogo: '/logos/lsf.svg', homeTeamShort: 'LSF', awayTeamId: 't4', awayTeamName: 'TARGARYENS FC', awayTeamLogo: '/logos/tgr.svg', awayTeamShort: 'TGR', date: '2026-06-07', time: '17:30', venue: 'THOZHUPADAM HOME GROUND', matchday: 1, status: 'UPCOMING' },

  { id: 'f4', homeTeamId: 't5', homeTeamName: 'LUCA SOCCER FC', homeTeamLogo: '/logos/lsf.svg', homeTeamShort: 'LSF', awayTeamId: 't6', awayTeamName: 'LIONS FC', awayTeamLogo: '/logos/lfc.svg', awayTeamShort: 'LFC', date: '2026-06-13', time: '17:00', venue: 'THOZHUPADAM HOME GROUND', matchday: 2, status: 'UPCOMING' },
  { id: 'f5', homeTeamId: 't3', homeTeamName: 'KP MONJANZ FC', homeTeamLogo: '/logos/kpm.svg', homeTeamShort: 'KPM', awayTeamId: 't4', awayTeamName: 'TARGARYENS FC', awayTeamLogo: '/logos/tgr.svg', awayTeamShort: 'TGR', date: '2026-06-13', time: '17:30', venue: 'THOZHUPADAM HOME GROUND', matchday: 2, status: 'UPCOMING' },

  { id: 'f6', homeTeamId: 't2', homeTeamName: 'AL MOTHALZ FC', homeTeamLogo: '/logos/alm.svg', homeTeamShort: 'ALM', awayTeamId: 't4', awayTeamName: 'TARGARYENS FC', awayTeamLogo: '/logos/tgr.svg', awayTeamShort: 'TGR', date: '2026-06-14', time: '17:00', venue: 'THOZHUPADAM HOME GROUND', matchday: 3, status: 'UPCOMING' },
  { id: 'f7', homeTeamId: 't1', homeTeamName: 'PETTIKADA FC', homeTeamLogo: '/logos/pkd.svg', homeTeamShort: 'PKD', awayTeamId: 't5', awayTeamName: 'LUCA SOCCER FC', awayTeamLogo: '/logos/lsf.svg', awayTeamShort: 'LSF', date: '2026-06-14', time: '17:30', venue: 'THOZHUPADAM HOME GROUND', matchday: 3, status: 'UPCOMING' },

  { id: 'f8', homeTeamId: 't1', homeTeamName: 'PETTIKADA FC', homeTeamLogo: '/logos/pkd.svg', homeTeamShort: 'PKD', awayTeamId: 't3', awayTeamName: 'KP MONJANZ FC', awayTeamLogo: '/logos/kpm.svg', awayTeamShort: 'KPM', date: '2026-06-20', time: '17:00', venue: 'THOZHUPADAM HOME GROUND', matchday: 4, status: 'UPCOMING' },
  { id: 'f9', homeTeamId: 't6', homeTeamName: 'LIONS FC', homeTeamLogo: '/logos/lfc.svg', homeTeamShort: 'LFC', awayTeamId: 't2', awayTeamName: 'AL MOTHALZ FC', awayTeamLogo: '/logos/alm.svg', awayTeamShort: 'ALM', date: '2026-06-20', time: '17:30', venue: 'THOZHUPADAM HOME GROUND', matchday: 4, status: 'UPCOMING' },

  { id: 'f10', homeTeamId: 't4', homeTeamName: 'TARGARYENS FC', homeTeamLogo: '/logos/tgr.svg', homeTeamShort: 'TGR', awayTeamId: 't6', awayTeamName: 'LIONS FC', awayTeamLogo: '/logos/lfc.svg', awayTeamShort: 'LFC', date: '2026-06-21', time: '17:00', venue: 'THOZHUPADAM HOME GROUND', matchday: 5, status: 'UPCOMING' },
  { id: 'f11', homeTeamId: 't3', homeTeamName: 'KP MONJANZ FC', homeTeamLogo: '/logos/kpm.svg', homeTeamShort: 'KPM', awayTeamId: 't5', awayTeamName: 'LUCA SOCCER FC', awayTeamLogo: '/logos/lsf.svg', awayTeamShort: 'LSF', date: '2026-06-21', time: '17:30', venue: 'THOZHUPADAM HOME GROUND', matchday: 5, status: 'UPCOMING' },

  { id: 'f12', homeTeamId: 't2', homeTeamName: 'AL MOTHALZ FC', homeTeamLogo: '/logos/alm.svg', homeTeamShort: 'ALM', awayTeamId: 't5', awayTeamName: 'LUCA SOCCER FC', awayTeamLogo: '/logos/lsf.svg', awayTeamShort: 'LSF', date: '2026-06-27', time: '17:00', venue: 'THOZHUPADAM HOME GROUND', matchday: 6, status: 'UPCOMING' },
  { id: 'f13', homeTeamId: 't4', homeTeamName: 'TARGARYENS FC', homeTeamLogo: '/logos/tgr.svg', homeTeamShort: 'TGR', awayTeamId: 't1', awayTeamName: 'PETTIKADA FC', awayTeamLogo: '/logos/pkd.svg', awayTeamShort: 'PKD', date: '2026-06-27', time: '17:30', venue: 'THOZHUPADAM HOME GROUND', matchday: 6, status: 'UPCOMING' },

  { id: 'f14', homeTeamId: 't6', homeTeamName: 'LIONS FC', homeTeamLogo: '/logos/lfc.svg', homeTeamShort: 'LFC', awayTeamId: 't3', awayTeamName: 'KP MONJANZ FC', awayTeamLogo: '/logos/kpm.svg', awayTeamShort: 'KPM', date: '2026-06-28', time: '17:00', venue: 'THOZHUPADAM HOME GROUND', matchday: 7, status: 'UPCOMING' },
  { id: 'f15', homeTeamId: 't1', homeTeamName: 'PETTIKADA FC', homeTeamLogo: '/logos/pkd.svg', homeTeamShort: 'PKD', awayTeamId: 't2', awayTeamName: 'AL MOTHALZ FC', awayTeamLogo: '/logos/alm.svg', awayTeamShort: 'ALM', date: '2026-06-28', time: '17:30', venue: 'THOZHUPADAM HOME GROUND', matchday: 7, status: 'UPCOMING' },
];

// The next upcoming match (for countdown)
const nextMatch =
  fixtures.find((f: Fixture) => f.status === 'UPCOMING') || null;

export const newsArticles: NewsArticle[] = [
  {
    id: 'n1',
    title: 'Pettikada FC Dominate AL Mothalz in Thrilling 3-1 Victory',
    slug: 'pettikada-fc-dominate-al-mothalz-3-1',
    excerpt: 'Arjun Faize led the charge with a stunning brace as PETTIKADA FC extended their lead at the top of Super League Season 08.',
    content: 'In a commanding display at Pettikada Arena, PETTIKADA FC put on a masterclass to dismantle AL MOTHALZ FC 3-1 in Matchday 10. Arjun Faize opened the scoring with a blistering volley in the 18th minute, before Rafi Pettikada\'s incisive through-ball led to a brilliant second. Siraj Junior pulled one back for the visitors late in the second half, but Faize sealed the three points with a clinical finish. Manager Faize praised his side\'s discipline and hunger.',
    category: 'MATCH_REPORT',
    author: 'SLS Media',
    coverImage: '/news/n1.jpg',
    publishedAt: '2026-06-07T22:30:00Z',
    featured: true,
    tags: ['PKD', 'ALM', 'Matchday 10'],
  },
  {
    id: 'n2',
    title: 'Targaryens FC Battle to Crucial 2-2 Draw with Luca Soccer',
    slug: 'targaryens-luca-2-2-draw',
    excerpt: 'A dramatic late equaliser from Luca Soccer FC denied Targaryens a vital win in a feisty Matchday 10 encounter.',
    content: 'Dragon\'s Den witnessed a pulsating encounter as TARGARYENS FC and LUCA SOCCER FC shared the spoils in a 2-2 draw. Niyas Dragon gave the home side the lead in the first half, before Masheesh Star levelled for Luca. Aslam Fire restored the lead but Subijith Luca\'s sumptuous free-kick earned a point for the visitors. Co-managers Niyas and Aslam were left frustrated by a late defensive lapse.',
    category: 'MATCH_REPORT',
    author: 'SLS Media',
    coverImage: '/news/n2.jpg',
    publishedAt: '2026-06-07T21:00:00Z',
    featured: false,
    tags: ['TGR', 'LSF', 'Matchday 10'],
  },
  {
    id: 'n3',
    title: 'Season 08 Title Race: Can Anyone Stop Pettikada FC?',
    slug: 'season-08-title-race-pettikada-fc',
    excerpt: 'With 10 matchdays gone, Pettikada FC look unstoppable. But AL Mothalz and Targaryens are closing in.',
    content: 'After 10 matchdays of Super League Season 08, PETTIKADA FC sit three points clear of AL MOTHALZ FC with a game in hand. Manager Faize\'s side have been electric in attack, with Arjun Faize leading the top-scorers chart with 14 goals. AL Mothalz, guided by the astute Siraj Zain, have been the closest challengers — their next encounter is a must-win for the title. Meanwhile TARGARYENS FC, under the dynamic duo of Niyas and Aslam, lurk just five points back and cannot be ruled out.',
    category: 'FEATURE',
    author: 'SLS Analysis',
    coverImage: '/news/n3.jpg',
    publishedAt: '2026-06-09T10:00:00Z',
    featured: false,
    tags: ['PKD', 'ALM', 'TGR', 'Season 08'],
  },
  {
    id: 'n4',
    title: 'Lions FC Seek First Win Under Shuhaib',
    slug: 'lions-fc-first-win-shuhaib',
    excerpt: 'LIONS FC have struggled with consistency but Shuhaib promises a turnaround as Matchday 11 approaches.',
    content: 'At the foot of the table, LIONS FC have found the going tough in Season 08, picking up just 8 points from 10 games. But manager Shuhaib is defiant. "We have the quality to turn this around. The boys believe in each other," he told SLS Media. Their Matchday 11 clash against KP MONJANZ FC represents a golden opportunity to climb the table. Expect a physical, passionate encounter.',
    category: 'FEATURE',
    author: 'SLS Media',
    coverImage: '/news/n4.jpg',
    publishedAt: '2026-06-10T11:00:00Z',
    featured: false,
    tags: ['LFC', 'Shuhaib', 'Season 08'],
  },
  {
    id: 'n5',
    title: 'Super League Season 08 Matchday 11 Preview',
    slug: 'season-08-matchday-11-preview',
    excerpt: 'Three crucial fixtures this weekend as the title race heats up. All you need to know about Matchday 11.',
    content: 'Super League Season 08 Matchday 11 promises to be a defining weekend. The headline tie sees AL MOTHALZ FC host league leaders PETTIKADA FC in a potential title decider at Mothalz Ground. Siraj Zain\'s men will be fired up to close the gap. Meanwhile LUCA SOCCER FC take on TARGARYENS FC in a top-four showdown, and LIONS FC host KP MONJANZ FC in a basement battle.',
    category: 'PREVIEW',
    author: 'TSL Media',
    coverImage: '/news/n5.jpg',
    publishedAt: '2026-06-11T09:00:00Z',
    featured: false,
    tags: ['Matchday 11', 'Preview', 'Season 08'],
  },
  {
    id: 'n6',
    title: 'Arjun Faize: "We Play for Every Fan of Pettikada"',
    slug: 'arjun-faize-interview',
    excerpt: 'The Season 08\'s top scorer speaks exclusively to TSL Media ahead of the massive Matchday 11 clash.',
    content: '"Every time we step on the pitch, we play for the people of Pettikada. That drives us." Arjun Faize, the Season 08 golden boot leader with 14 goals, sat down with SLS Media ahead of the eagerly anticipated Matchday 11 trip to AL MOTHALZ. "It will be a tough game — Siraj Zain has built a great team. But we are ready. We go there to win, nothing less."',
    category: 'FEATURE',
    author: 'TSL Media',
    coverImage: '/news/n6.jpg',
    publishedAt: '2026-06-11T16:00:00Z',
    featured: false,
    tags: ['PKD', 'Arjun Faize', 'Interview'],
  },
];

export const galleryImages: GalleryImage[] = [
  { id: 'g1', url: '/gallery/g1.jpg', caption: 'Arjun Faize celebrates his brace against AL Mothalz FC', matchId: 'f1', tags: ['PKD', 'Matchday 10'], width: 1200, height: 800 },
  { id: 'g2', url: '/gallery/g2.jpg', caption: 'Pettikada Arena packed to the rafters for the top-of-table clash', matchId: 'f1', tags: ['PKD', 'Stadium'], width: 1600, height: 900 },
  { id: 'g3', url: '/gallery/g3.jpg', caption: 'Rafi Pettikada orchestrates play from the heart of midfield', tags: ['PKD', 'Rafi'], width: 800, height: 1000 },
  { id: 'g4', url: '/gallery/g4.jpg', caption: "Targaryens FC celebrate after their goal in Dragon's Den", matchId: 'f2', tags: ['TGR', 'Matchday 10'], width: 1200, height: 800 },
  { id: 'g5', url: '/gallery/g5.jpg', caption: 'Subijith Luca scores a stunning late free kick', matchId: 'f2', tags: ['LSF', 'Matchday 10'], width: 1600, height: 900 },
  { id: 'g6', url: '/gallery/g6.jpg', caption: 'Lions FC fans roar in support at Lions Den', tags: ['LFC', 'Fans'], width: 900, height: 1200 },
  { id: 'g7', url: '/gallery/g7.jpg', caption: 'KP Monjanz FC secure a 2-0 victory over Lions FC', matchId: 'f3', tags: ['KPM', 'LFC', 'Matchday 10'], width: 1200, height: 800 },
  { id: 'g8', url: '/gallery/g8.jpg', caption: 'The Season 08 Super League trophy on display', tags: ['Trophy', 'Season 08'], width: 1600, height: 900 },
  { id: 'g9', url: '/gallery/g9.jpg', caption: 'AL Mothalz FC train ahead of their crucial home game', tags: ['ALM', 'Training'], width: 800, height: 1000 },
];

export const sponsors: Sponsor[] = [
  { id: 's1', name: 'KeralaBank', logo: '/sponsors/s1.svg', url: '#', tier: 'TITLE' },
  { id: 's2', name: 'Gulf Air', logo: '/sponsors/s2.svg', url: '#', tier: 'GOLD' },
  { id: 's3', name: 'Malabar Gold', logo: '/sponsors/s3.svg', url: '#', tier: 'GOLD' },
  { id: 's4', name: 'KSRTC', logo: '/sponsors/s4.svg', url: '#', tier: 'SILVER' },
  { id: 's5', name: 'Milma Dairy', logo: '/sponsors/s5.svg', url: '#', tier: 'SILVER' },
  { id: 's6', name: 'Mathrubhumi', logo: '/sponsors/s6.svg', url: '#', tier: 'SILVER' },
];
