var http = require('http');
var request = require("request");
var cheerio = require("cheerio");
var async = require("async");
var db_init = require('./../db/db_init');

module.exports.getcontents = function (callback) {
    var url = "http://www.todayhumor.co.kr";
    options = {
        url: 'http://www.todayhumor.co.kr/board/list.php?table=bestofbest',
        port: 80,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
        }
    };
    request.get(options, function (error, response, body) {
        if (error) throw error;
        $ = cheerio.load(body);
        var list = [];
        $('table.table_list tbody tr').each(function () {
            var notice_id = $(this).find("td.no").text();
            var subject = $(this).find("td.subject a").text();
            subject = subject.replace(/'/g,"");
            var link = $(this).find("td.subject a").attr("href");
            if (link != undefined) {
                link = link.slice(0, link.indexOf('page') - 1);
                console.log(notice_id);
                console.log(subject);
                console.log(url + link);
                console.log("================================");
                var info = {};
                info.id = notice_id;
                info.subject = subject;
                info.url = url + link;
                list.push(info);
            }
        });
        callback(list);
    });
};
module.exports.getcontents(function (list) {
    db_init.reserve(function (connObj) {
        var conn = connObj.conn;
        var result = null;
        conn.createStatement(function (err, statement) {
            if (err) {
                console.log(err);
            } else {
                var count = 0;
                async.whilst(
                    function () {
                        return count < list.length;
                    },
                    function (cb) {
                        var query = "INSERT INTO BOARD VALUES (board_seq.nextval, 2, '"
                            + list[count].id + "', '"
                            + list[count].subject + "', '"
                            + list[count].url + "')";
                        console.log(query);

                        statement.executeUpdate(query,
                            function (err, c) {
                                if (err) {
                                    console.log(err);
                                    cb(err)
                                } else {
                                    count++;
                                    cb();
                                }
                            });
                    },
                    function (err) {
                        db_init.release(connObj, function (err) {
                            console.log("success!!");
                        });
                    }
                );
            }
        });
    });
});
