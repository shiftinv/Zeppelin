import z from "zod";
import { isDiscordAPIError } from "../../../utils";
import { LogsPlugin } from "../../Logs/LogsPlugin";
import { automodAction } from "../helpers";

export const ReactAction = automodAction({
  configSchema: z.union([z.string(), z.array(z.string())]).default(""),

  async apply({ pluginData, contexts, actionConfig }) {
    const emojis = Array.isArray(actionConfig) ? actionConfig : [actionConfig];

    const logs = pluginData.getPlugin(LogsPlugin);

    for (const c of contexts) {
      if (!c.message) continue;

      const channel = pluginData.guild.channels.cache.get(c.message.channel_id);
      if (!channel?.isTextBased()) continue;

      for (const emoji of emojis) {
        try {
          await channel.messages.react(c.message.id, emoji);
        } catch (e) {
          if (isDiscordAPIError(e)) {
            if (e.code === 10014) {
              logs.logBotAlert({
                body: `Could not add unknown emoji ${emoji} to message ${channel.id}/${c.message.id}`,
              });
              continue;
            } else if (e.code === 50013) {
              logs.logBotAlert({
                body: `Error ${e.code} while applying reactions to ${channel.id}/${c.message.id}: ${e.message}`,
              });
              break;
            }
          }

          throw e;
        }
      }
    }
  },
});
