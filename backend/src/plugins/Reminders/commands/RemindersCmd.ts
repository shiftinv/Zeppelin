import moment from "moment-timezone";
import { sendErrorMessage } from "../../../pluginUtils";
import { createChunkedMessage, sorter } from "../../../utils";
import { remindersCmd } from "../types";

export const RemindersCmd = remindersCmd({
  trigger: ["reminders", "bonks"],
  permission: "can_use",

  async run({ message: msg, pluginData }) {
    const reminders = await pluginData.state.reminders.getRemindersByUserId(msg.author.id);
    if (reminders.length === 0) {
      sendErrorMessage(pluginData, msg.channel, "No reminders");
      return;
    }

    reminders.sort(sorter("remind_at"));
    const longestNum = (reminders.length + 1).toString().length;
    const lines = Array.from(reminders.entries()).map(([i, reminder]) => {
      const num = i + 1;
      const paddedNum = num.toString().padStart(longestNum, " ");
      const target = moment.utc(reminder.remind_at, "YYYY-MM-DD HH:mm:ss");
      return `\`${paddedNum}.\` ${target.format("[<t:]X[:f>]")} (${target.format("[<t:]X[:R>]")}) ${reminder.body}`;
    });

    createChunkedMessage(msg.channel, lines.join("\n"));
  },
});
