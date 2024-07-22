import { Snowflake } from "discord.js";
import { createChunkedMessage, disableCodeBlocks } from "knub/helpers";
import { commandTypeHelpers as ct } from "../../../commandTypes";
import { MAX_NICKNAME_ENTRIES_PER_USER } from "../../../data/GuildNicknameHistory";
import { MAX_USERNAME_ENTRIES_PER_USER } from "../../../data/UsernameHistory";
import { NICKNAME_RETENTION_PERIOD } from "../../../data/cleanup/nicknames";
import { USERNAME_RETENTION_PERIOD } from "../../../data/cleanup/usernames";
import { sendErrorMessage } from "../../../pluginUtils";
import { DAYS, renderUsername } from "../../../utils";
import { nameHistoryCmd } from "../types";

interface NameEntry {
  timestamp: string;
  name: string | null;
}

/* de-duplicate consecutive entries with the same name, keeping the oldest one */
function dedupeConsecutive(entries: NameEntry[]): NameEntry[] {
  return entries.filter((item, index) => index === entries.length - 1 || item.name !== entries[index + 1].name);
}

function formatHistoryEntry(entry: NameEntry): string {
  return `\`[${entry.timestamp}]\` ${entry.name ? `**${disableCodeBlocks(entry.name)}**` : "*None*"}`;
}

export const NamesCmd = nameHistoryCmd({
  trigger: "names",
  permission: "can_view",

  signature: {
    userId: ct.userId(),
  },

  async run({ message: msg, args, pluginData }) {
    const nicknames = await pluginData.state.nicknameHistory.getByUserId(args.userId);
    const usernames = await pluginData.state.usernameHistory.getByUserId(args.userId);

    if (nicknames.length === 0 && usernames.length === 0) {
      sendErrorMessage(pluginData, msg.channel, "No name history found");
      return;
    }

    const nicknameRows = nicknames.map((r) => ({ timestamp: r.timestamp, name: r.nickname })).map(formatHistoryEntry);

    const globalNameRows = dedupeConsecutive(
      usernames.map((r) => ({ timestamp: r.timestamp, name: r.global_name })),
    ).map(formatHistoryEntry);
    const usernameRows = dedupeConsecutive(usernames.map((r) => ({ timestamp: r.timestamp, name: r.username }))).map(
      formatHistoryEntry,
    );

    const user = await pluginData.client.users.fetch(args.userId as Snowflake).catch(() => null);
    const currentUsername = user ? renderUsername(user) : args.userId;

    const nicknameDays = Math.round(NICKNAME_RETENTION_PERIOD / DAYS);
    const usernameDays = Math.round(USERNAME_RETENTION_PERIOD / DAYS);

    let message = `Name history for **${currentUsername}**:`;
    if (nicknameRows.length) {
      message += `\n\n__Last ${MAX_NICKNAME_ENTRIES_PER_USER} nicknames within ${nicknameDays} days:__\n${nicknameRows.join(
        "\n",
      )}`;
    }
    if (globalNameRows.length) {
      message += `\n\n__Last ${MAX_USERNAME_ENTRIES_PER_USER} display names within ${usernameDays} days:__\n${globalNameRows.join(
        "\n",
      )}`;
    }
    if (usernameRows.length) {
      message += `\n\n__Last ${MAX_USERNAME_ENTRIES_PER_USER} usernames within ${usernameDays} days:__\n${usernameRows.join(
        "\n",
      )}`;
    }

    createChunkedMessage(msg.channel, message);
  },
});
