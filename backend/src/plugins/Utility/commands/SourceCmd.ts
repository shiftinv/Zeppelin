import { escapeCodeBlock } from "discord.js";
import moment from "moment-timezone";
import { commandTypeHelpers as ct } from "../../../commandTypes.js";
import { getBaseUrl, resolveMessageMember } from "../../../pluginUtils.js";
import { canReadChannel } from "../../../utils/canReadChannel.js";
import { utilityCmd } from "../types.js";

export const SourceCmd = utilityCmd({
  trigger: "source",
  description: "View the message source of the specified message id",
  usage: "!source 534722219696455701",
  permission: "can_source",

  signature: {
    message: ct.messageTarget(),
  },

  async run({ message: cmdMessage, args, pluginData }) {
    const cmdAuthorMember = await resolveMessageMember(cmdMessage);
    if (!canReadChannel(args.message.channel, cmdAuthorMember)) {
      void pluginData.state.common.sendErrorMessage(cmdMessage, "Unknown message");
      return;
    }

    const message = await args.message.channel.messages.fetch(args.message.messageId);
    if (!message) {
      void pluginData.state.common.sendErrorMessage(cmdMessage, "Unknown message");
      return;
    }

    const textSource = message.content || "<no text content>";
    const fullSource = JSON.stringify({
      id: message.id,
      content: message.content,
      attachments: message.attachments,
      embeds: message.embeds,
      stickers: message.stickers,
    });

    const escaped = escapeCodeBlock(fullSource);

    if (escaped.length < 1950) {
      cmdMessage.channel.send("```json\n" + escaped + "\n```");
    } else {
      const archiveId = await pluginData.state.archives.create(
        `${textSource}\n\nSource:\n\n${fullSource}`,
        moment.utc().add(1, "hour"),
      );
      const baseUrl = getBaseUrl(pluginData);
      const url = pluginData.state.archives.getUrl(baseUrl, archiveId);
      cmdMessage.channel.send(`Message source: ${url}`);
    }
  },
});
