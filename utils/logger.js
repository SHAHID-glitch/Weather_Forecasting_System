const winston = require('winston');
const path = require('path');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = timestamp + ' [' + level + ']: ' + message;
    if (Object.keys(meta).length > 0) {
      msg += ' ' + JSON.stringify(meta);
    }
    return msg;
  })
);

const isServerless = process.env.VERCEL === '1' || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

const transports = [
  new winston.transports.Console({ format: consoleFormat }),
];

const loggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports,
};

if (!isServerless) {
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880,
      maxFiles: 5,
    })
  );

  loggerOptions.exceptionHandlers = [
    new winston.transports.File({ filename: path.join('logs', 'exceptions.log') }),
  ];
  loggerOptions.rejectionHandlers = [
    new winston.transports.File({ filename: path.join('logs', 'rejections.log') }),
  ];
}

const logger = winston.createLogger(loggerOptions);
module.exports = logger;
