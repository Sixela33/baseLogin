const winston = require('winston')

const logsFolder = process.env.LOGS_FOLDER || 'logs/'

const logsFormatter = (data) => {
    const { timestamp, level, message} = data;
  
    const logMessage = `[${timestamp}] [${level}]: ${message}`;
    return logMessage;
}

let messageLogger = winston.createLogger({
    level:'info',
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            maxsize: 50 * 1024 * 1024,
            maxFiles: 10,
            filename: `${logsFolder}messageLogs.log`,
            level: "info"
        })
    ].filter(Boolean),
    format: winston.format.combine(
        winston.format.simple(),
        winston.format.timestamp(),
        winston.format.printf(logsFormatter)
    ),
    statusLevels: true,
    meta: true
})

export default messageLogger