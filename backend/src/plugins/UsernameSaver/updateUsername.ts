import { User } from "discord.js";
import { GlobalPluginData } from "vety";
import { renderUsername } from "../../utils.js";
import { UsernameSaverPluginType } from "./types.js";

export async function updateUsername(pluginData: GlobalPluginData<UsernameSaverPluginType>, user: User) {
  if (!user) return;

  const newUsername = renderUsername(user);
  const latestEntry = await pluginData.state.usernameHistory.getLastEntry(user.id);

  if (!latestEntry || newUsername !== latestEntry.username || user.globalName !== latestEntry.global_name) {
    await pluginData.state.usernameHistory.addEntry(user.id, newUsername, user.globalName);
  }
}
