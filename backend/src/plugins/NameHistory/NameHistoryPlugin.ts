import { PluginOptions } from "knub";
import { Queue } from "../../Queue";
import { GuildNicknameHistory } from "../../data/GuildNicknameHistory";
import { UsernameHistory } from "../../data/UsernameHistory";
import { zeppelinGuildPlugin } from "../ZeppelinPluginBlueprint";
import { NamesCmd } from "./commands/NamesCmd";
import { ChannelJoinEvt, MemberUpdateEvt, MessageCreateEvt } from "./events/UpdateNameEvts";
import { NameHistoryPluginType, zNameHistoryConfig } from "./types";

const defaultOptions: PluginOptions<NameHistoryPluginType> = {
  config: {
    can_view: false,
  },
  overrides: [
    {
      level: ">=50",
      config: {
        can_view: true,
      },
    },
  ],
};

export const NameHistoryPlugin = zeppelinGuildPlugin<NameHistoryPluginType>()({
  name: "name_history",
  showInDocs: true,
  info: {
    prettyName: "Name History",
  },

  configParser: (input) => zNameHistoryConfig.parse(input),
  defaultOptions,

  // prettier-ignore
  messageCommands: [
    NamesCmd,
  ],

  // prettier-ignore
  events: [
    ChannelJoinEvt,
    MemberUpdateEvt,
    MessageCreateEvt,
  ],

  beforeLoad(pluginData) {
    const { state, guild } = pluginData;

    state.nicknameHistory = GuildNicknameHistory.getGuildInstance(guild.id);
    state.usernameHistory = new UsernameHistory();
    state.updateQueue = new Queue();
  },
});
