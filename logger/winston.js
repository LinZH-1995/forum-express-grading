const winston = require('winston')
const path = require('path')
const fs = require('fs')
require('winston-daily-rotate-file')

// if @/logger/logs directory don't exist, create it, and put logs inside
if (!fs.existsSync('./logger/logs')) fs.mkdirSync('./logger/logs')

const transport = new winston.transports.DailyRotateFile({
  level: 'info',
  filename: path.join('./logger/logs', 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD-HH', // for %DATE% in application-%DATE%.log
  maxSize: '20m',
  maxFiles: '10d'
})

// const myPrintf = winston.format.prettyPrint(({ level, message, label, timestamp, ...data }) => {
//   return `${timestamp} [${label}] ${level} (${message}):
// request: {
//   headers: ${data.request.headers},
//   host: ${data.request.host},
//   baseUrl: ${data.request.baseUrl},
//   url: ${data.request.url},
//   method: ${data.request.method},
//   params: ${data.request.params},
//   query: ${data.request.params},
//   body: ${data.request.body},
//   clientIp: ${data.request.clientIp}
// },
// response: {
//   statusCode: ${data.response.statusCode},
//   headers: ${data.response.statusCode},
//   body: ${data.response.body}
// }`
// })

const logger = winston.createLogger({
  level: 'info',

  // log data = 'YYYY-MM-DD HH:mm:ss' [My Format] 'level' 'message'
  format: winston.format.combine(
    winston.format.label({ label: 'My Format' }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.prettyPrint({ depth: 2 })
  ),
  transports: [
    transport
  ]
})

function formatHTTPLoggerResponse (err, req, res, responseBody) {
  if (err) {
    return {
      request: {
        headers: req.headers,
        host: req.headers.host,
        baseUrl: req.baseUrl,
        url: req.url,
        method: req.method,
        params: req?.params,
        query: req?.query,
        body: req.body,
        clientIp: req?.headers['x-forwarded-for'] ?? req?.socket.remoteAddress
      },
      response: {
        statusCode: res?.statusCode,
        headers: res?.getHeaders(),
        body: err
      }
    }
  } else if (err === null && res === null) {
    return {
      request: {
        headers: req.headers,
        host: req.headers.host,
        baseUrl: req.baseUrl,
        url: req.url,
        method: req.method,
        params: req?.params,
        query: req?.query,
        body: req.body,
        clientIp: req?.headers['x-forwarded-for'] ?? req?.socket.remoteAddress
      }
    }
  } else if (err === null && req === null) {
    return {
      response: {
        statusCode: res?.statusCode,
        headers: res?.getHeaders(),
        body: responseBody
      }
    }
  }
}

function requestLoggerHandler (req, _res, next) {
  const data = formatHTTPLoggerResponse(null, req, null, null)
  logger.info('Request Data', data)
  next()
}

function responseLoggerHandler (_req, res, responseBody, next) {
  const data = formatHTTPLoggerResponse(null, null, res, responseBody)
  logger.info('Request Data', data)
  next()
}

transport.on('error', error => {
  logger.error(error.message)
})

module.exports = {
  requestLoggerHandler,
  responseLoggerHandler,
  formatHTTPLoggerResponse,
  logger
}
