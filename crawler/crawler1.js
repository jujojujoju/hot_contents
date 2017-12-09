var http = require('http');
var request = require("request");
var cheerio = require("cheerio");
var async = require("async");
var db_init = require('./../db/db_init');

module.exports.getcontents = function (callback) {
    var url = "http://www.dcinside.com";
    options = {
        url: 'http://gall.dcinside.com/board/lists/?id=hit&page=1',
        port: 80,
        method: 'GET',
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
        }
    };
    request.get(options, function (error, response, body) {
        if (error) throw error;
        url = 'http://gall.dcinside.com';
        $ = cheerio.load(body);
        var list = [];
        $('tbody.list_tbody tr').each(function () {
            var notice_id = $(this).find("td.t_notice").text();
            var subject = $(this).find("td.t_subject > a:nth-child(1)").text();
            subject = subject.replace(/'/g,"");
            var link = $(this).find("td.t_subject a").attr("href");
            link = link.slice(0, link.indexOf('page') - 1);
            if (link != undefined && notice_id != "공지") {
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
        conn.createStatement(function (err, statement) {
            if (err) {
                console.log(err);
            } else {
                var query = "DELETE FROM BOARD";
                statement.executeUpdate(query,
                    function (err, c1) {
                        if (err) {
                            console.log(err);
                        } else {
                            var count = 0;
                            async.whilst(
                                function () {
                                    return count < list.length;
                                },
                                function (cb) {
                                    query = "INSERT INTO BOARD VALUES (board_seq.nextval, 1, '"
                                        + list[count].id + "', '"
                                        + list[count].subject + "', '"
                                        + list[count].url + "', sysdate)";
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
                    }
                );
            }
        });
    });
});

