import fs from 'fs';
import util from 'util';
import path from "path";

interface LoggerOptions {
	log_colors: boolean;
}

export class Logger {
	private filepath: string;

	opened = false;
	stream = false
	colors = {
		cyan: "\x1b[36m",
		debug: "\x1b[2m",
		reset: "\x1b[0m",

		black: "\x1b[30m",
		red: "\x1b[31m",
		green: "\x1b[32m",
		yellow: "\x1b[33m",
		blue: "\x1b[34m",
		magenta: "\x1b[35m",
		white: "\x1b[37m",
	}

	options: LoggerOptions = {
		log_colors: true
	};

	open = (filename, options) => {
		for (var prop in options)
			this.options[prop] = options[prop];

		this.opened = true;
		this.filepath = filename;

		var dir = path.dirname(this.filepath);
		if (!fs.existsSync(dir)) fs.mkdirSync(dir);

		this.log("Log file opened on [" + this.filepath + "]");
	};

	write = (line) => {
		if (!this.opened)
			return false;

		fs.appendFile(this.filepath, util.format(line), (err) => {
			if (err) {
				this.opened = false;
				this.error("Logger encountered an error:");
				this.error(err);
			}
		});
	};

	log = (obj, color = null) => {
		var r = this.colors.reset;

		if (typeof(color) === 'undefined' || !color || color == null)
			color = r;

		console.log(color + util.format(obj) + r);
		this.write((this.options.log_colors ? color : ``) + util.format(obj) + r + "\n");
	};

	debug = (obj) => {
		this.log(obj, this.colors.yellow);
	};

	error = (obj) => {
		this.log(obj, this.colors.red);
	};
}
export default Logger;