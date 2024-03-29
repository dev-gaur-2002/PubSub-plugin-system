const winston = require("winston");

const dateFormat = () => {
    return new Date(Date.now()).toUTCString;
};

class EventLogger {
    constructor() {
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: "application.log",
                }),
            ],
            format: winston.format.printf((event) => {
                let loggedMessage = `${dateFormat()} | ${event.level.toUpperCase()} | ${
                    event.message
                }`;
                loggedMessage = event.obj
                    ? loggedMessage + ` data: ${JSON.stringify(event.obj)} |`
                    : message;
                return loggedMessage;
            }),
        });
    }

    async info(message) {
        this.logger.log("info", message);
    }

    async info(message, obj) {
        this.logger.log("info", message, {
            obj,
        });
    }

    async debug(message) {
        this.logger.log("debug", message);
    }

    async debug(message, obj) {
        this.logger.log("debug", message, {
            obj,
        });
    }

    async error(message) {
        this.logger.log("error", message);
    }

    async error(message, obj) {
        this.logger.log("error", message, {
            obj,
        });
    }
}

module.exports = {
    EventLogger,
};
