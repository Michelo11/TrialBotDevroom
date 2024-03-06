import { Client } from "discord.js";
import { Discord, On, ArgsOf } from "discordx";
import { prisma } from "../main.js";

@Discord()
export class Message {
  @On()
  async messageCreate(
    [message]: ArgsOf<"messageCreate">,
    client: Client
  ): Promise<void> {
    if (message.author.bot) {
      return;
    }
    
    await prisma.user.upsert({
      where: {
        id_guildId: {
          id: message.author.id,
          guildId: message.guild!.id,
        },
      },
      update: {
        messages: {
          increment: 1,
        },
      },
      create: {
        id: message.author.id,
        guildId: message.guild!.id,
        messages: 1,
      },
    });
  }
}
