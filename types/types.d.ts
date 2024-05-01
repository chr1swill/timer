export const enum CommandType {
	START = 0,
	STOP,
	RESET,
}

export type MessageT = {
	command: CommandType;
	options: {};
};

export type StartMsg = MessageT & {
	command: CommandType.START;
	options: {
		minutes: number;
		seconds: number;
	};
};

export type StopMsg = MessageT & {
	command: CommandType.STOP;
	options: {};
};

export type ResetMsg = MessageT & {
	command: CommandType.RESET;
	options: {};
};
