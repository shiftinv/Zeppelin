import moment from "moment-timezone";
import { createChunkedMessage, sorter } from "../../../utils.js";
import { remindersCmd } from "../types.js";

export const RemindersCmd = remindersCmd({
  trigger: "reminders",
  permission: "can_use",

  async run({ message: msg, pluginData }) {
    const reminders = await pluginData.state.reminders.getRemindersByUserId(msg.author.id);
    if (reminders.length === 0) {
      void pluginData.state.common.sendErrorMessage(msg, "No reminders");
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
