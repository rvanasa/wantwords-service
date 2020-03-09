var winston = require('winston');

module.exports = () => {

    var transports = [
        new winston.transports.Console({
            level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
            stderrLevels: ['warn', 'error'],
        }),
    ];

    if(config.logPath) {
        require('winston-daily-rotate-file');

        transports.push(new winston.transports.DailyRotateFile({
            filename: `${process.env.LOG_PATH}/server-%DATE%.log`,
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }));
    }

    return winston.createLogger({
        format: winston.format.json(),
        transports,
    });
};