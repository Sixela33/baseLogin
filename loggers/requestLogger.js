const expressWinston = require('express-winston');
const { transports, format } = require('winston');

const logsFolder = process.env.LOGS_FOLDER || 'logs/';

const logsFormatter = (data) => {
    const { timestamp, level, message, meta } = data;
    const { req, res } = meta || {};  
    const logMessage = `[${timestamp}] [${level}]: ${message} - ${req?.method} ${req?.url} ${res?.statusCode}`;
    return logMessage;
};

let requestLogger = expressWinston.logger({
    level: 'info',
    transports: [
        new transports.Console(),
        new transports.File({
            maxsize: 50 * 1024 * 1024,
            maxFiles: 10,
            filename: `${logsFolder}logsWarnings.log`,
            level: 'info'
        })
    ],
    format: format.combine(
        format.simple(),
        format.timestamp(),
        format.printf(logsFormatter)
    ),
    statusLevels: true,
    meta: true
});

console.log('Request Logger Initialized');

module.exports = requestLogger;
