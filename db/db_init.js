//db connection library
var JDBC = require('jdbc');
var jinst = require('jdbc/lib/jinst');
var asyncjs = require('async');

if (!jinst.isJvmCreated()) {
    jinst.addOption("-Xrs");
    //convert between version
    // jinst.setupClasspath(['./drivers/ojdbc8.jar']);

    //*******************tibero version
    //jinst.setupClasspath(['./drivers/tibero6-jdbc.jar']);

    jinst.setupClasspath(['./drivers/ojdbc7.jar']);
}

// var db_config = require('./db_config.json');
var db_config = {
    // Required
    url: 'jdbc:tibero:thin:@localhost:8629:tibero',

    // Optional
    drivername: 'com.tmax.tibero.jdbc.TbDriver',
    minpoolsize: 10,
    maxpoolsize: 100,

    properties: {user: "HR", password: "tibero"}
};
var db = new JDBC(db_config);

var db_init = {
    init: function (callback) {

        db.initialize(function (err) {
            console.log("디비 연결 성공");
            callback(err);
        });
    },
    reserve: function (callback) {
        console.log('connectioned');
        db.reserve(function (err, connObj) {
            if (!connObj) {
                console.log(err)
            } else {
                console.log("Using connection: " + connObj.uuid);
                connObj.conn.setSchema("DBPRO", function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("change schema success");
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