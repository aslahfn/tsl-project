import type {
  FixtureDto,
  FormResult,
  NewsArticleDto,
  PlayerDto,
  PlayerPosition,
  PositionChange,
  StandingDto,
} from '../dto/api.dto';

type TeamRef = {
  id: string;
  name: string;
  shortName: string;
  logo: string;
};

type FixtureWithTeams = {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  time: string;
  venue: string;
  matchday: number;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
  homeTeam: TeamRef;
  awayTeam: TeamRef;
};

type PlayerWithTeam = {
  id: string;
  name: string;
  teamId: string;
  position: string;
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
  cleanSheets: number;
  rating: number;
  team: TeamRef;
};

type StandingWithTeam = {
  position: number;
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string;
  positionChange: string;
  team: TeamRef;
};

type NewsRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  coverImage: string;
  publishedAt: Date;
  featured: boolean;
  tags: string;
};

export function toFixtureDto(fixture: FixtureWithTeams): FixtureDto {
  return {
    id: fixture.id,
    homeTeamId: fixture.homeTeamId,
    homeTeamName: fixture.homeTeam.name,
    homeTeamLogo: fixture.homeTeam.logo,
    homeTeamShort: fixture.homeTeam.shortName,
    awayTeamId: fixture.awayTeamId,
    awayTeamName: fixture.awayTeam.name,
    awayTeamLogo: fixture.awayTeam.logo,
    awayTeamShort: fixture.awayTeam.shortName,
    date: fixture.date,
    time: fixture.time,
    venue: fixture.venue,
    matchday: fixture.matchday,
    status: fixture.status as FixtureDto['status'],
    homeScore: fixture.homeScore ?? undefined,
    awayScore: fixture.awayScore ?? undefined,
  };
}

export function toPlayerDto(player: PlayerWithTeam): PlayerDto {
  return {
    id: player.id,
    name: player.name,
    teamId: player.teamId,
    teamName: player.team.name,
    teamLogo: player.team.logo,
    position: player.position as PlayerPosition,
    number: player.number,
    nationality: player.nationality,
    nationalityFlag: player.nationalityFlag,
    age: player.age,
    photo: player.photo,
    goals: player.goals,
    assists: player.assists,
    matches: player.matches,
    yellowCards: player.yellowCards,
    redCards: player.redCards,
    cleanSheets: player.cleanSheets,
    rating: player.rating,
  };
}

export function toStandingDto(standing: StandingWithTeam): StandingDto {
  return {
    position: standing.position,
    teamId: standing.teamId,
    teamName: standing.team.name,
    teamLogo: standing.team.logo,
    teamShort: standing.team.shortName,
    played: standing.played,
    won: standing.won,
    drawn: standing.drawn,
    lost: standing.lost,
    goalsFor: standing.goalsFor,
    goalsAgainst: standing.goalsAgainst,
    goalDifference: standing.goalDifference,
    points: standing.points,
    form:
      typeof standing.form === 'string'
        ? (standing.form.split(',').filter(Boolean) as FormResult[])
        : [],
    positionChange: standing.positionChange as PositionChange,
  };
}

export function toNewsArticleDto(article: NewsRecord): NewsArticleDto {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category as NewsArticleDto['category'],
    author: article.author,
    coverImage: article.coverImage,
    publishedAt: article.publishedAt.toISOString(),
    featured: article.featured,
    tags:
      typeof article.tags === 'string'
        ? article.tags
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean)
        : [],
  };
}
