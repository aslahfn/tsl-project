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

export interface TeamDto {
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

export interface PlayerDto {
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

export interface FixtureDto {
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

export interface StandingDto {
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

export interface NewsArticleDto {
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

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthResponseDto {
  user: UserDto;
  tokens: AuthTokensDto;
}

export interface RealtimeEventDto {
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
