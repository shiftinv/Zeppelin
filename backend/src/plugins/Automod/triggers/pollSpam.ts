import { RecentActionType } from "../constants";
import { createMessageSpamTrigger } from "../functions/createMessageSpamTrigger";

export const PollSpamTrigger = createMessageSpamTrigger(RecentActionType.Poll, "poll");
