export interface Team {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  logo: string;
  city: string;
  founded: number;
  manager: string;
  stadium: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  teamLogo: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  number: number;
  nationality: string;
  nationalityFlag: string;
  age: number;
  photo: string;
  goals: number;
  assists: number;
  matches: number;
  yellowCards: number;
  redCards: number;
  cleanSheets?: number;
  rating: number;
}

export interface Fixture {
  id: string;
  homeTeamId: string;
  homeTeamName: string;
  homeTeamLogo: string;
  homeTeamShort: string;
  awayTeamId: string;
  awayTeamName: string;
  awayTeamLogo: string;
  awayTeamShort: string;
  date: string;
  time: string;
  venue: string;
  matchday: number;
  status: 'UPCOMING' | 'LIVE' | 'FINISHED';
  homeScore?: number;
  awayScore?: number;
}

export interface Standing {
  position: number;
  teamId: string;
  teamName: string;
  teamLogo: string;
  teamShort: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
  positionChange: 'UP' | 'DOWN' | 'SAME';
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'MATCH_REPORT' | 'TRANSFER' | 'INJURY' | 'PREVIEW' | 'FEATURE';
  author: string;
  coverImage: string;
  publishedAt: string;
  featured: boolean;
  tags: string[];
  manOfTheMatch?: string | null;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  matchId?: string;
  tags: string[];
  width: number;
  height: number;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  url: string;
  tier: 'TITLE' | 'GOLD' | 'SILVER';
}
