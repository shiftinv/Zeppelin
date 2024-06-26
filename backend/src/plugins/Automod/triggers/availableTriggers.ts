import { AutomodTriggerBlueprint } from "../helpers";
import { AntiraidLevelTrigger } from "./antiraidLevel";
import { AnyMessageTrigger } from "./anyMessage";
import { AttachmentSpamTrigger } from "./attachmentSpam";
import { BanTrigger } from "./ban";
import { CharacterSpamTrigger } from "./characterSpam";
import { CounterTrigger } from "./counterTrigger";
import { EmojiSpamTrigger } from "./emojiSpam";
import { KickTrigger } from "./kick";
import { LineSpamTrigger } from "./lineSpam";
import { LinkSpamTrigger } from "./linkSpam";
import { MatchAttachmentTypeTrigger } from "./matchAttachmentType";
import { MatchInvitesTrigger } from "./matchInvites";
import { MatchLinksTrigger } from "./matchLinks";
import { MatchMimeTypeTrigger } from "./matchMimeType";
import { MatchRegexTrigger } from "./matchRegex";
import { MatchWordsTrigger } from "./matchWords";
import { MemberJoinTrigger } from "./memberJoin";
import { MemberJoinSpamTrigger } from "./memberJoinSpam";
import { MemberLeaveTrigger } from "./memberLeave";
import { MentionSpamTrigger } from "./mentionSpam";
import { MessageSpamTrigger } from "./messageSpam";
import { MuteTrigger } from "./mute";
import { NoteTrigger } from "./note";
import { PollSpamTrigger } from "./pollSpam";
import { RoleAddedTrigger } from "./roleAdded";
import { RoleRemovedTrigger } from "./roleRemoved";
import { StickerSpamTrigger } from "./stickerSpam";
import { ThreadArchiveTrigger } from "./threadArchive";
import { ThreadCreateTrigger } from "./threadCreate";
import { ThreadCreateSpamTrigger } from "./threadCreateSpam";
import { ThreadDeleteTrigger } from "./threadDelete";
import { ThreadUnarchiveTrigger } from "./threadUnarchive";
import { UnbanTrigger } from "./unban";
import { UnmuteTrigger } from "./unmute";
import { WarnTrigger } from "./warn";

export const availableTriggers: Record<string, AutomodTriggerBlueprint<any, any>> = {
  any_message: AnyMessageTrigger,

  match_words: MatchWordsTrigger,
  match_regex: MatchRegexTrigger,
  match_invites: MatchInvitesTrigger,
  match_links: MatchLinksTrigger,
  match_attachment_type: MatchAttachmentTypeTrigger,
  match_mime_type: MatchMimeTypeTrigger,
  member_join: MemberJoinTrigger,
  member_leave: MemberLeaveTrigger,
  role_added: RoleAddedTrigger,
  role_removed: RoleRemovedTrigger,

  message_spam: MessageSpamTrigger,
  mention_spam: MentionSpamTrigger,
  link_spam: LinkSpamTrigger,
  attachment_spam: AttachmentSpamTrigger,
  emoji_spam: EmojiSpamTrigger,
  line_spam: LineSpamTrigger,
  character_spam: CharacterSpamTrigger,
  member_join_spam: MemberJoinSpamTrigger,
  sticker_spam: StickerSpamTrigger,
  thread_create_spam: ThreadCreateSpamTrigger,
  poll_spam: PollSpamTrigger,

  counter_trigger: CounterTrigger,

  note: NoteTrigger,
  warn: WarnTrigger,
  mute: MuteTrigger,
  unmute: UnmuteTrigger,
  kick: KickTrigger,
  ban: BanTrigger,
  unban: UnbanTrigger,

  antiraid_level: AntiraidLevelTrigger,

  thread_create: ThreadCreateTrigger,
  thread_delete: ThreadDeleteTrigger,
  thread_archive: ThreadArchiveTrigger,
  thread_unarchive: ThreadUnarchiveTrigger,
};
