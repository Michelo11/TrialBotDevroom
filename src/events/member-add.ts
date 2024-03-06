import { EmbedBuilder } from "discord.js";
import type { ArgsOf, Client } from "discordx";
import { Discord, On } from "discordx";
import { prisma } from "../main.js";

@Discord()
export class MemberAdd {
  @On()
  async guildMemberAdd(
    [member]: ArgsOf<"guildMemberAdd">,
    client: Client
  ): Promise<void> {
    const guild = await prisma.guild.findUnique({
      where: {
        id: member.guild.id,
      },
    });

    if (!guild || !guild.welcomeChannel || !guild.welcomeMessage) {
      return;
    }

    const welcomeMessage = new EmbedBuilder()
      .setDescription(
        guild.welcomeMessage.replace("{user}", member.user.toString())
      )
      .setColor("Blue")
      .setTimestamp();

    const channel = await client.channels.fetch(guild.welcomeChannel);

    if (!channel || !channel.isTextBased()) {
      return;
    }

    await channel.send({
      embeds: [welcomeMessage],
    });
  }
}
