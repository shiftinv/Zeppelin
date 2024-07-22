import { usernameSaverEvt } from "../types";
import { updateUsername } from "../updateUsername";

export const MemberUpdateUpdateUsernameEvt = usernameSaverEvt({
  event: "userUpdate",

  async listener(meta) {
    meta.pluginData.state.updateQueue.add(() => updateUsername(meta.pluginData, meta.args.newUser));
  },
});

// keep these other two events around, in case we miss updates during downtime

export const MessageCreateUpdateUsernameEvt = usernameSaverEvt({
  event: "messageCreate",

  async listener(meta) {
    if (meta.args.message.author.bot) return;
    meta.pluginData.state.updateQueue.add(() => updateUsername(meta.pluginData, meta.args.message.author));
  },
});

export const VoiceChannelJoinUpdateUsernameEvt = usernameSaverEvt({
  event: "voiceStateUpdate",

  async listener(meta) {
    if (meta.args.newState.member?.user.bot) return;
    meta.pluginData.state.updateQueue.add(() => updateUsername(meta.pluginData, meta.args.newState.member!.user));
  },
});
