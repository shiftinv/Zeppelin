import {
  escapeCodeBlock,
  escapeInlineCode,
  GuildChannel,
  GuildMember,
  GuildTextBasedChannel,
  Snowflake,
  User,
} from "discord.js";
import {
  baseCommandParameterTypeHelpers,
  CommandContext,
  messageCommandBaseTypeConverters,
  TypeConversionError,
} from "knub";
import { createTypeHelper } from "knub-command-manager";
import {
  channelMentionRegex,
  convertDelayStringToMS,
  inputPatternToRegExp,
  isValidSnowflake,
  resolveMember,
  resolveUser,
  resolveUserId,
  roleMentionRegex,
  UnknownUser,
} from "./utils";
import { isValidTimezone } from "./utils/isValidTimezone";
import { MessageTarget, resolveMessageTarget } from "./utils/resolveMessageTarget";

export const commandTypes = {
  ...messageCommandBaseTypeConverters,

  delay(value) {
    const result = convertDelayStringToMS(value);
    if (result == null) {
      throw new TypeConversionError(`Could not convert ${value} to a delay`);
    }

    return result;
  },

  delaySec(value) {
    const result = convertDelayStringToMS(value, "s");
    if (result == null) {
      throw new TypeConversionError(`Could not convert ${value} to a delay`);
    }

    return result;
  },

  async resolvedUser(value, context: CommandContext<any>) {
    const result = await resolveUser(context.pluginData.client, value);
    if (result == null || result instanceof UnknownUser) {
      throw new TypeConversionError(`User \`${escapeCodeBlock(value)}\` was not found`);
    }
    return result;
  },

  async resolvedUserLoose(value, context: CommandContext<any>) {
    const result = await resolveUser(context.pluginData.client, value);
    if (result == null) {
      throw new TypeConversionError(`Invalid user: \`${escapeCodeBlock(value)}\``);
    }
    return result;
  },

  async resolvedMember(value, context: CommandContext<any>) {
    if (!(context.message.channel instanceof GuildChannel)) {
      throw new TypeConversionError(`Cannot resolve member for non-guild channels`);
    }

    const result = await resolveMember(context.pluginData.client, context.message.channel.guild, value);
    if (result == null) {
      throw new TypeConversionError(`Member \`${escapeCodeBlock(value)}\` was not found or they have left the server`);
    }
    return result;
  },

  async messageTarget(value: string, context: CommandContext<any>) {
    value = String(value).trim();

    const result = await resolveMessageTarget(context.pluginData, value);
    if (!result) {
      throw new TypeConversionError(`Unknown message \`${escapeInlineCode(value)}\``);
    }

    return result;
  },

  async anyId(value: string, context: CommandContext<any>) {
    const userId = resolveUserId(context.pluginData.client, value);
    if (userId) return userId as Snowflake;

    const channelIdMatch = value.match(channelMentionRegex);
    if (channelIdMatch) return channelIdMatch[1] as Snowflake;

    const roleIdMatch = value.match(roleMentionRegex);
    if (roleIdMatch) return roleIdMatch[1] as Snowflake;

    if (isValidSnowflake(value)) {
      return value as Snowflake;
    }

    throw new TypeConversionError(`Could not parse ID: \`${escapeInlineCode(value)}\``);
  },

  regex(value: string): RegExp {
    try {
      return inputPatternToRegExp(value);
    } catch (e) {
      throw new TypeConversionError(`Could not parse RegExp: \`${escapeInlineCode(e.message)}\``);
    }
  },

  timezone(value: string) {
    if (!isValidTimezone(value)) {
      throw new TypeConversionError(`Invalid timezone: ${escapeInlineCode(value)}`);
    }

    return value;
  },

  guildTextBasedChannel(value: string, context: CommandContext<any>) {
    return messageCommandBaseTypeConverters.textChannel(value, context);
  },
};

export const commandTypeHelpers = {
  ...baseCommandParameterTypeHelpers,

  delay: createTypeHelper<number>(commandTypes.delay),
  delaySec: createTypeHelper<number>(commandTypes.delaySec),
  resolvedUser: createTypeHelper<Promise<User>>(commandTypes.resolvedUser),
  resolvedUserLoose: createTypeHelper<Promise<User | UnknownUser>>(commandTypes.resolvedUserLoose),
  resolvedMember: createTypeHelper<Promise<GuildMember>>(commandTypes.resolvedMember),
  messageTarget: createTypeHelper<Promise<MessageTarget>>(commandTypes.messageTarget),
  anyId: createTypeHelper<Promise<Snowflake>>(commandTypes.anyId),
  regex: createTypeHelper<RegExp>(commandTypes.regex),
  timezone: createTypeHelper<string>(commandTypes.timezone),
  guildTextBasedChannel: createTypeHelper<GuildTextBasedChannel>(commandTypes.guildTextBasedChannel),
};
