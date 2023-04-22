import { AnyThreadChannel, ForumChannel, Snowflake, ThreadChannel } from "discord.js";
import { differenceToString, getScalarDifference } from "../../../utils";
import { filterObject } from "../../../utils/filterObject";
import { logThreadCreate } from "../logFunctions/logThreadCreate";
import { logThreadDelete } from "../logFunctions/logThreadDelete";
import { logThreadUpdate } from "../logFunctions/logThreadUpdate";
import { logsEvt } from "../types";

export const LogsThreadCreateEvt = logsEvt({
  event: "threadCreate",

  async listener(meta) {
    logThreadCreate(meta.pluginData, {
      thread: meta.args.thread,
    });
  },
});

export const LogsThreadDeleteEvt = logsEvt({
  event: "threadDelete",

  async listener(meta) {
    logThreadDelete(meta.pluginData, {
      thread: meta.args.thread,
    });
  },
});

const validThreadDiffProps: Set<keyof ThreadChannel> = new Set([
  "name",
  "autoArchiveDuration",
  "rateLimitPerUser",
  "archived",
  "locked",
  "appliedTags",
]);

function getTagName(thread: AnyThreadChannel | undefined, tagId: Snowflake) {
  let name: string | undefined;
  if (thread?.parent instanceof ForumChannel) {
    name = thread?.parent.availableTags.find((t) => t.id === tagId)?.name;
  }
  return name ?? "<unknown>";
}

export const LogsThreadUpdateEvt = logsEvt({
  event: "threadUpdate",

  async listener(meta) {
    const oldThreadDiffProps = filterObject(meta.args.oldThread || {}, (v, k) => validThreadDiffProps.has(k));
    const newThreadDiffProps = filterObject(meta.args.newThread, (v, k) => validThreadDiffProps.has(k));
    // this is cursed but... meh
    // @ts-ignore
    oldThreadDiffProps.appliedTags = oldThreadDiffProps.appliedTags
      ?.map((tagId) => getTagName(meta.args.oldThread, tagId))
      .join(", ");
    // @ts-ignore
    newThreadDiffProps.appliedTags = newThreadDiffProps.appliedTags
      ?.map((tagId) => getTagName(meta.args.newThread, tagId))
      .join(", ");
    const diff = getScalarDifference(oldThreadDiffProps, newThreadDiffProps);
    const differenceString = differenceToString(diff);

    logThreadUpdate(meta.pluginData, {
      oldThread: meta.args.oldThread,
      newThread: meta.args.newThread,
      differenceString,
    });
  },
});
