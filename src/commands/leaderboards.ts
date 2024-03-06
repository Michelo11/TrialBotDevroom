import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { bot, prisma } from "../main.js";

@Discord()
export class Leaderboards {
  @Slash({
    description: "Leaderboards",
    name: "leaderboards",
  })
  async leaderbords(interaction: CommandInteraction): Promise<void> {
    const users = await prisma.user.findMany({
      where: {
        guildId: interaction.guildId!,
      },
      orderBy: {
        messages: "desc",
      },
    });

    let leaderboard = "```";

    users.forEach((userData, index) => {
      const user = bot.users.cache.get(userData.id);
      leaderboard += `${index + 1}. ${user!.username} - ${userData.messages}\n`;
    });

    leaderboard += "```";

    await interaction.reply(leaderboard);
  }
}