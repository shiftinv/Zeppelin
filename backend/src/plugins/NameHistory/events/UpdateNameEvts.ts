import { nameHistoryEvt } from "../types";
import { updateNickname } from "../updateNickname";

export const MemberUpdateEvt = nameHistoryEvt({
  event: "guildMemberUpdate",

  async listener(meta) {
    meta.pluginData.state.updateQueue.add(() => updateNickname(meta.pluginData, meta.args.newMember));
  },
});

// keep these other two events around, in case we miss updates during downtime

export const ChannelJoinEvt = nameHistoryEvt({
  event: "voiceStateUpdate",

  async listener(meta) {
    meta.pluginData.state.updateQueue.add(() =>
      updateNickname(meta.pluginData, meta.args.newState.member ?? meta.args.oldState.member!),
    );
  },
});

export const MessageCreateEvt = nameHistoryEvt({
  event: "messageCreate",

  async listener(meta) {
    meta.pluginData.state.updateQueue.add(() => updateNickname(meta.pluginData, meta.args.message.member!));
  },
});
