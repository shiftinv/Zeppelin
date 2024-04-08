import { GuildPluginData } from "knub";
import { getEmojiInString, getRoleMentions, getUrlsInString, getUserMentions } from "../../../utils";
import { RecentActionType } from "../constants";
import { AutomodContext, AutomodPluginType } from "../types";

// "real link" = a link that Discord highlights
// taken from matchLinks trigger
function isRealLink(link: string): boolean {
  return /^https?:\/\/|\bdiscord\.(gg|com)\//i.test(link);
}

export function addRecentActionsFromMessage(pluginData: GuildPluginData<AutomodPluginType>, context: AutomodContext) {
  const message = context.message!;
  const globalIdentifier = message.user_id;
  const perChannelIdentifier = `${message.channel_id}-${message.user_id}`;

  pluginData.state.recentActions.push({
    context,
    type: RecentActionType.Message,
    identifier: globalIdentifier,
    count: 1,
  });

  pluginData.state.recentActions.push({
    context,
    type: RecentActionType.Message,
    identifier: perChannelIdentifier,
    count: 1,
  });

  const mentionCount =
    getUserMentions(message.data.content || "").length + getRoleMentions(message.data.content || "").length;
  if (mentionCount) {
    pluginData.state.recentActions.push({
      context,
      type: RecentActionType.Mention,
      identifier: globalIdentifier,
      count: mentionCount,
    });

    pluginData.state.recentActions.push({
      context,
      type: RecentActionType.Mention,
      identifier: perChannelIdentifier,
      count: mentionCount,
    });
  }

  let links = getUrlsInString(message.data.content || "", false, true).filter((u) => isRealLink(u.input));

  // this is totally hacked in and not clean code, but actually making this work on a per-rule level would require a huge amount of work, so I'm just not doing that c:
  const excludedDomains = pluginData.config.get().exclude_link_spam_domains?.map((s) => s.toLowerCase());
  if (excludedDomains?.length) {
    links = links.filter((u) => !excludedDomains.includes(u.hostname.toLowerCase().replace(/^www\./, "")));
  }

  const linkCount = links.length;
  if (linkCount) {
    pluginData.state.recentActions.push({
      context,
      type: RecentActionType.Link,
      identifier: globalIdentifier,
      count: linkCount,
    });

    pluginData.state.recentActions.push({
      context,
      type: RecentActionType.Link,
      identifier: perChannelIdentifier,
      count: linkCount,
    });
  }

  const attachmentCount = message.data.attachments && message.data.attachments.length;
  if (attachmentCount) {
    pluginData.state.recentActions.push({
      context,
      type: RecentActionType.Attachment,
      identifier: globalIdentifier,
      count: attachmentCount,
    });

    pluginData.state.recentActions.push({
      context,
      type: RecentActionType.Attachment,
      identifier: perChannelIdentifier,
      count: attachmentCount,
    });
  }

  const emojiCount = getEmojiInString(message.data.content || "").length;
  if (emojiCount) {
    pluginData.state.recentActions.push({
      context,
      type: RecentActionType.Emoji,
      identifier: globalIdentifier,
      count: emojiCount,
    });

    pluginData.state.recentActions.push({
      context,
      type: RecentActionType.Emoji,
      identifier: perChannelIdentifier,
      count: emojiCount,
    });
  }

  // + 1 is for the first line of the message (which doesn't have a line break)
  const lineCount = message.data.content ? (message.data.content.match(/\n/g) || []).length + 1 : 0;
  if (lineCount) {
    pluginData.state.recentActions.push({
      context,
      type: RecentActionType.Line,
      identifier: globalIdentifier,
      count: lineCount,
    });

    pluginData.state.recentActions.push({
      context,
      type: RecentActionType.Line,
      identifier: perChannelIdentifier,
      count: lineCount,
    });
  }

  const characterCount = [...(message.data.content || "")].length;
  if (characterCount) {
    pluginData.state.recentActions.push({
      context,
      type: RecentActionType.Character,
      identifier: globalIdentifier,
      count: characterCount,
    });

    pluginData.state.recentActions.push({
      context,
      type: RecentActionType.Character,
      identifier: perChannelIdentifier,
      count: characterCount,
    });
  }

  const stickerCount = (message.data.stickers || []).length;
  if (stickerCount) {
    pluginData.state.recentActions.push({
      context,
      type: RecentActionType.Sticker,
      identifier: globalIdentifier,
      count: stickerCount,
    });

    pluginData.state.recentActions.push({
      context,
      type: RecentActionType.Sticker,
      identifier: perChannelIdentifier,
      count: stickerCount,
    });
  }

  if (message.data.hasPoll) {
    pluginData.state.recentActions.push({
      context,
      type: RecentActionType.Poll,
      identifier: globalIdentifier,
      count: 1,
    });

    pluginData.state.recentActions.push({
      context,
      type: RecentActionType.Poll,
      identifier: perChannelIdentifier,
      count: 1,
    });
  }
}
