import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import axios from "axios";

@Discord()
export class Stock {
  @Slash({
    description: "Get the current stock price",
    name: "stock",
  })
  async stock(
    @SlashOption({
      description: "The stock symbol",
      name: "symbol",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    symbol: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const response = await axios.get(
      `https://api.api-ninjas.com/v1/stockprice?ticker=${encodeURIComponent(symbol)}`,
      {
        headers: {
          "X-Api-Key": process.env.NINJA_API_KEY,
        },
      }
    );

    const stock = response.data;

    if (stock.error) {
      interaction.reply({
        content: "An error occurred while fetching the stock price",
        ephemeral: true,
      });
      return;
    }

    interaction.reply({
      content: `The current price of ${symbol} is $${stock.price}`,
      ephemeral: true,
    });
  }
}
