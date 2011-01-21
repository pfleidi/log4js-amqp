/*!
 * AMQP enabled log appender for log4js
 *
 * MIT licensed
 *
 * @author pfleidi
 */

/*
 * module dependencies
 */

var Amqp = require('amqp');
var Sys = require('sys');


/**
 * factory method to create appender
 *
 * @param {Object} options
 */
exports.createAppender = function createAppender(options) {
  var connection;
  var exchange;
  var log = logQueue;
  var queue = [];

  function logObj(logEvent) {
    return {
      level: logEvent.level.level,
      levelStr: logEvent.level.levelStr,
      message: logEvent.message
    };
  }

  function logQueue(logEvent) {
    queue.push(logEvent);
  }

  function logAmqp(logEvent) {
    exchange.publish('log', logEvent);
  }

  function publishQueue() {
    queue.forEach(function (entry) {
        logAmqp(entry);
      });
    queue = [];
  }

  (function connect() {
      connection = Amqp.createConnection({
          host: options.host,
          login: options.login,
          password: options.password
        });

      connection.on('ready', function () {
          Sys.puts('ready');
          exchange = connection.exchange(options.exchange, {
              type: 'fanout'
            });
          publishQueue();
          log = logAmqp;
        });

      connection.on('error', function (err) {
          Sys.puts('error: ' + err);
          log = logQueue; 
        });

    }());


  return function (loggingEvent) {
    log(logObj(loggingEvent));
  };  

};
