var fs = require('fs');
var util = require('util');

var Colors = {
	cyan: "\x1b[36m",
	debug: "\x1b[2m",
	reset: "\x1b[0m",

	black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
}
function Console()
{

}
Console.prototype = {

	opened: false,
	stream: false,

	open: function(path)
	{
		this.opened = true;
		this.filepath = __dirname + "/" + path;

		this.log("Log file opened on [" + path + "]");
	},
	write: function(line)
	{
		if(!this.opened)
			return false;

		fs.appendFile(this.filepath,util.format(line),function (err)
		{  
			if(err)
			{
				this.opened = false;
				this.error("Logger encountered an error:");
				this.error(err);
			}
		});
	},
	log: function(obj,color)
	{
		var r = this.colors.reset;

		if(!color)
			color = r;

		process.stdout.write(color + util.format(obj) + r + "\n");
		this.write(color + util.format(obj) + r + "\n");
	},

	debug: function(obj)
	{
		this.log(obj,Colors.yellow);	
	},
	error: function(obj)
	{
		this.log(obj,Colors.red);
	},
	colors: Colors
}
module.exports = {
	Console: new Console()
}