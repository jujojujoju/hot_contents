//db connection library
var JDBC = require('jdbc');
var jinst = require('jdbc/lib/jinst');
var asyncjs = require('async');

if (!jinst.isJvmCreated()) {
    jinst.addOption("-Xrs");
    //convert between version
    // 지누
    jinst.setupClasspath(['./drivers/ojdbc8.jar']);
    // 조주
    // jinst.setupClasspath(['./drivers/ojdbc7.jar']);
}

var db_config = require('./db_config.json');
var db = new JDBC(db_config);

var db_init = {
    init: function (callback) {
        db.initialize(function (err) {
            callback(err);
        });
    },
    reserve: function (callback) {
        console.log('connectioned');
        db.reserve(function (err, connObj) {
            if (!connObj) {
            } else {
                console.log("Using connection: " + connObj.uuid);
                connObj.conn.setSchema("TEST", function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("change scheme success");
                        callback(connObj);
                    }
                });
            }
        });
    },
    release: function (connObj, callback) {
        db.release(connObj, callback);
    }
};

module.exports = db_init;