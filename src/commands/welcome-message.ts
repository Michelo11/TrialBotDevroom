import type { CommandInteraction, TextChannel } from "discord.js";
import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { prisma } from "../main.js";

@Discord()
export class WelcomeMessage {
  @Slash({
    description: "Welcome message",
    name: "welcome",
    defaultMemberPermissions: [PermissionFlagsBits.Administrator],
  })
  async welcome(
    @SlashOption({
      description: "Message to send",
      name: "message",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    message: string,
    @SlashOption({
      description: "Channel to send the message",
      name: "channel",
      required: true,
      type: ApplicationCommandOptionType.Channel,
    })
    channel: TextChannel,
    interaction: CommandInteraction
  ): Promise<void> {
    await prisma.guild.upsert({
      where: {
        id: interaction.guildId!,
      },
      update: {
        welcomeMessage: message,
        welcomeChannel: channel.id,
      },
      create: {
        id: interaction.guildId!,
        welcomeMessage: message,
        welcomeChannel: channel.id,
      },
    });

    await interaction.reply(
      `Welcome message set to \`${message}\` in <#${channel.id}>`
    );
  }
}
