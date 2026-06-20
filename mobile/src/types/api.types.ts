export type FixtureStatus = 'UPCOMING' | 'LIVE' | 'FINISHED';
export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';
export type FormResult = 'W' | 'D' | 'L';
export type PositionChange = 'UP' | 'DOWN' | 'SAME';
export type NewsCategory =
  | 'MATCH_REPORT'
  | 'TRANSFER'
  | 'INJURY'
  | 'PREVIEW'
  | 'FEATURE';

export type RealtimeEventType =
  | 'GOAL_EVENT'
  | 'SCORE_UPDATE'
  | 'STANDINGS_UPDATE'
  | 'KICKOFF_ALERT';

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
  position: PlayerPosition;
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
  status: FixtureStatus;
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
  form: FormResult[];
  positionChange: PositionChange;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  author: string;
  coverImage: string;
  publishedAt: string;
  featured: boolean;
  tags: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RealtimeEvent {
  type: RealtimeEventType;
  timestamp: string;
  fixtureId?: string;
  homeTeamName?: string;
  awayTeamName?: string;
  homeScore?: number;
  awayScore?: number;
  status?: FixtureStatus;
  title?: string;
  message?: string;
  notificationId?: string;
  venue?: string;
  time?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
