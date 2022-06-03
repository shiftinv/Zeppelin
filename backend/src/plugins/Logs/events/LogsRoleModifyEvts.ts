import { Role } from "discord.js";
import { differenceToString, getScalarDifference } from "../../../utils.js";
import { filterObject } from "../../../utils/filterObject.js";
import { logRoleCreate } from "../logFunctions/logRoleCreate.js";
import { logRoleDelete } from "../logFunctions/logRoleDelete.js";
import { logRoleUpdate } from "../logFunctions/logRoleUpdate.js";
import { logsEvt } from "../types.js";

export const LogsRoleCreateEvt = logsEvt({
  event: "roleCreate",

  async listener(meta) {
    logRoleCreate(meta.pluginData, {
      role: meta.args.role,
    });
  },
});

export const LogsRoleDeleteEvt = logsEvt({
  event: "roleDelete",

  async listener(meta) {
    logRoleDelete(meta.pluginData, {
      role: meta.args.role,
    });
  },
});

const validRoleDiffProps: Set<keyof Role> = new Set([
  "name",
  "hoist",
  "color",
  "mentionable",
  "rawPosition",
  "permissions",
  "icon",
  "unicodeEmoji",
]);

export const LogsRoleUpdateEvt = logsEvt({
  event: "roleUpdate",

  async listener(meta) {
    const oldRoleDiffProps = filterObject(meta.args.oldRole || {}, (v, k) => validRoleDiffProps.has(k));
    const newRoleDiffProps = filterObject(meta.args.newRole, (v, k) => validRoleDiffProps.has(k));
    // this is pretty hacky but w/e
    // @ts-ignore
    oldRoleDiffProps.permissions = oldRoleDiffProps.permissions?.bitfield?.toString();
    // @ts-ignore
    newRoleDiffProps.permissions = newRoleDiffProps.permissions?.bitfield?.toString();
    const diff = getScalarDifference(oldRoleDiffProps, newRoleDiffProps);
    const differenceString = differenceToString(diff);

    logRoleUpdate(meta.pluginData, {
      newRole: meta.args.newRole,
      oldRole: meta.args.oldRole,
      differenceString,
    });
  },
});
