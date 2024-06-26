import { commandTypeHelpers as ct } from "../../../commandTypes";
import { clearUpcomingReminder } from "../../../data/loops/upcomingRemindersLoop";
import { sendErrorMessage, sendSuccessMessage } from "../../../pluginUtils";
import { sorter } from "../../../utils";
import { remindersCmd } from "../types";

export const RemindersDeleteCmd = remindersCmd({
  trigger: ["reminders delete", "reminders d", "bonks delete", "bonks d"],
  permission: "can_use",

  signature: {
    num: ct.number(),
  },

  async run({ message: msg, args, pluginData }) {
    const reminders = await pluginData.state.reminders.getRemindersByUserId(msg.author.id);
    reminders.sort(sorter("remind_at"));

    if (args.num > reminders.length || args.num <= 0) {
      sendErrorMessage(pluginData, msg.channel, "Unknown reminder");
      return;
    }

    const toDelete = reminders[args.num - 1];
    clearUpcomingReminder(toDelete);
    await pluginData.state.reminders.delete(toDelete.id);

    sendSuccessMessage(pluginData, msg.channel, "Reminder deleted");
  },
});
