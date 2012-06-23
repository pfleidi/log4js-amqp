/*!  * unit test to for log4js-amqp
 *
 * MIT licensed
 *
 * @author pfleidi
 */

var Log4js = require('log4js')();
var Log4jsAmqp = require('../index');
var Amqp = require('amqp');
var Fs = require('fs');
var testCase = require('nodeunit').testCase;
var Sys = require('util');

var connection;
var queue;
var log;

module.exports = testCase({

    setUp: function (callback) {
      Sys.puts('setUp');
      var config = JSON.parse(Fs.readFileSync(__dirname + '/config.json', 'utf-8'));
      Log4js.addAppender(Log4jsAmqp.createAppender(config));
      log = Log4js.getLogger('unittest');

      connection = Amqp.createConnection({
          host: config.host,
          login: config.login,
          password: config.password
        });

      connection.on('ready', function () {
          queue = connection.queue('', { 'autoDelete': false });
          var exchange = connection.exchange(config.exchange, {
              type: 'fanout'
            });
          queue.bind(exchange, '');
          setTimeout(callback, 100);
        });

    },

    tearDown: function (callback) {
      Sys.puts('tearDown');
      queue.destroy();
      connection.end();

      connection.on('close', function (has_error) {
          callback();
        });
    },

    debug: function (test) {
      Sys.puts('test');
      var logstr = 'debuglog jdlsakjfdl;saj;l';
      test.expect(4);

      queue.subscribe(function (message) {
          test.ok(message);
          test.strictEqual(message.level, 10000);
          test.strictEqual(message.levelStr, 'DEBUG');
          test.strictEqual(message.message, logstr);

          test.done();
        });
      
      log.debug(logstr);

      setTimeout(function () {
          test.done()
        }, 5000);
    }

  });
