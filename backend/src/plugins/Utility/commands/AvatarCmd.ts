import { APIEmbed, GuildMember, ImageFormat, User } from "discord.js";
import { commandTypeHelpers as ct } from "../../../commandTypes";
import { sendErrorMessage } from "../../../pluginUtils";
import { UnknownUser, renderUsername, resolveMember } from "../../../utils";
import { utilityCmd } from "../types";

export const AvatarCmd = utilityCmd({
  trigger: ["avatar", "av"],
  description: "Retrieves a user's profile picture",
  permission: "can_avatar",

  signature: {
    user: ct.resolvedUserLoose({ required: false }),

    guild: ct.switchOption({ def: false, shortcut: "g" }),
  },

  async run({ message: msg, args, pluginData }) {
    const user = args.user ?? msg.author;
    if (!(user instanceof UnknownUser)) {
      let member: GuildMember | User = user;
      if (args.guild) {
        member = (await resolveMember(pluginData.client, pluginData.guild, user.id)) ?? user;
      }

      const embed: APIEmbed = {
        image: {
          url: member.displayAvatarURL({ extension: ImageFormat.PNG, size: 2048 }),
        },
        title: `Avatar of ${renderUsername(member)}:`,
      };
      msg.channel.send({ embeds: [embed] });
    } else {
      sendErrorMessage(pluginData, msg.channel, "Invalid user ID");
    }
  },
});
