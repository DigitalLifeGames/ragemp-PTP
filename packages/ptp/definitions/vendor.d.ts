import Logger from '../main/models/Logger';

declare global {
	namespace NodeJS {
		interface Global {
			loggerInstance: Logger;
			fcbn: (name: string) => PlayerMp;
			MessageAll: (message: string) => void;
			Colors: any;
		}
	}
}