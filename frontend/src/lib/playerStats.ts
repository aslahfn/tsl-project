import { prisma } from "@/lib/prisma";

export async function recalculatePlayerStats(playerId?: string) {
  try {
    // If no playerId, recalc all players
    const players = playerId
      ? await prisma.player.findMany({ where: { id: playerId } })
      : await prisma.player.findMany();

    for (const player of players) {
      const events = await prisma.matchEvent.findMany({
        where: { playerId: player.id },
      });

      const goals = events.filter((e: any) => e.type === "GOAL").length;
      const yellowCards = events.filter((e: any) => e.type === "YELLOW_CARD").length;
      const redCards = events.filter((e: any) => e.type === "RED_CARD").length;
      await prisma.player.update({
        where: { id: player.id },
        data: {
          goals,
          yellowCards,
          redCards,
        },
      });
    }

    return true;
  } catch (err) {
    console.error("Player stats error:", err);
    return false;
  }
}