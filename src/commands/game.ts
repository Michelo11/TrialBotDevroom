import {
  EmbedBuilder,
  type CommandInteraction,
  ButtonInteraction,
  ButtonBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder,
  ActionRowBuilder,
} from "discord.js";
import { ButtonComponent, Discord, Slash } from "discordx";

@Discord()
export class Game {
  @ButtonComponent({ id: /^game_(rock|paper|scissors)$/ })
  gameButton(interaction: ButtonInteraction): void {
    const choices = ["rock", "paper", "scissors"];
    const choice = choices[Math.floor(Math.random() * choices.length)];

    const userChoice = interaction.customId.split("_")[1];

    let result: string;
    if (userChoice === choice) {
      result = "It's a tie!";
    } else if (
      (userChoice === "rock" && choice === "scissors") ||
      (userChoice === "paper" && choice === "rock") ||
      (userChoice === "scissors" && choice === "paper")
    ) {
      result = "You win!";
    } else {
      result = "You lose!";
    }

    interaction.update({
      content: `You chose ${userChoice} and I chose ${choice}. ${result}`,
      components: [],
      embeds: [],
    });
  }

  @Slash({
    description: "Rock Paper Scissors",
    name: "game",
  })
  async game(interaction: CommandInteraction): Promise<void> {
    const embed = new EmbedBuilder()
      .setTitle("Rock Paper Scissors")
      .setDescription("Choose your weapon")
      .setColor("Blue")
      .setTimestamp();

    const message = await interaction.reply({ embeds: [embed] });

    const rock = new ButtonBuilder()
      .setEmoji("🪨")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("game_rock");

    const paper = new ButtonBuilder()
      .setEmoji("🧻")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("game_paper");

    const scissors = new ButtonBuilder()
      .setEmoji("✂️")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("game_scissors");

    const buttonRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        rock,
        paper,
        scissors
      );

    await message.edit({ components: [buttonRow] });
  }
}
