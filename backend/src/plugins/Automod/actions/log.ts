import z from "zod";
import { isTruthy, unique } from "../../../utils";
import { LogsPlugin } from "../../Logs/LogsPlugin";
import { automodAction, formatTakenActions } from "../helpers";

export const LogAction = automodAction({
  configSchema: z.boolean().default(true),

  async apply({ pluginData, contexts, ruleName, matchResult }) {
    const users = unique(contexts.map((c) => c.user)).filter(isTruthy);
    const user = users[0];
    const actionsTaken = formatTakenActions(pluginData, ruleName);

    pluginData.getPlugin(LogsPlugin).logAutomodAction({
      rule: ruleName,
      user,
      users,
      actionsTaken,
      matchSummary: matchResult.summary ?? "",
    });
  },
});
