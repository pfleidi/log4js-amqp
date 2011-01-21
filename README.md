log4js-amqp
===========

log4js-amqp is a log4js log appender to push log messages into [AMQP](http://en.wikipedia.org/wiki/AMQP) 


Installation
------------

You can install install log4js-amqp via npm:

    npm install log4js-amqp

Usage
-----

    var Log4js = require('log4js')();
    var Log4jsAmqp = require('log4js-amqp');

    Log4js.addAppender(Log4jsAmqp.createAppender({
        host: 'yourhostname',
        login: 'yourlogin',
        password: 'yourpassword',
        exchange: 'yourexchange'
      })
    );
    
    var log = Log4js.getLogger('unittest');

    log.debug('debuglog');
    log.info('infolog');
