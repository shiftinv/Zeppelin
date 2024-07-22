import { Queue } from "../../Queue";
import { UsernameHistory } from "../../data/UsernameHistory";
import { zeppelinGlobalPlugin } from "../ZeppelinPluginBlueprint";
import {
  MemberUpdateUpdateUsernameEvt,
  MessageCreateUpdateUsernameEvt,
  VoiceChannelJoinUpdateUsernameEvt,
} from "./events/UpdateUsernameEvts";
import { UsernameSaverPluginType, zUsernameSaverConfig } from "./types";

export const UsernameSaverPlugin = zeppelinGlobalPlugin<UsernameSaverPluginType>()({
  name: "username_saver",
  showInDocs: false,

  configParser: (input) => zUsernameSaverConfig.parse(input),

  // prettier-ignore
  events: [
    MessageCreateUpdateUsernameEvt,
    MemberUpdateUpdateUsernameEvt,
    VoiceChannelJoinUpdateUsernameEvt,
  ],

  beforeLoad(pluginData) {
    const { state } = pluginData;

    state.usernameHistory = new UsernameHistory();
    state.updateQueue = new Queue();
  },
});
