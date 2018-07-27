import Utils from "../utils/utils";
import winston = require("winston");

export default class Logger {

    constructor(){
    }


    getWinstonLogger() {
        let logger = new winston.Logger({
            transports: [
                new winston.transports.File({
                    level: "info",
                    filename: "./access.log",
                    maxsize: 1048576,
                    maxFiles: 1,
                    colorize: true
                })
            ]
        });
        return logger;
    }
}


console.warn('Version: ' + process.version);
console.warn('PID: ' + process.pid);
Utils.logger('Memory use', process.memoryUsage());
Utils.logger('Arch', process.arch);
