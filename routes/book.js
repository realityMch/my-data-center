var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var events = require('events');

/* GET home page. */
router.get('/', function(req, res, next) {

    var books = [];
    res.contentType('application/json;charset=utf-8');
    var sql = 'SELECT * FROM book';
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'mengchao',
        password : '123456',
        database : 'mung'
    });
    connection.connect();

    var eventEmitter = new events.EventEmitter();
    function queryend() {
        connection.end();
        res.jsonp(books);
        // res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000/book');
        // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        // res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.end();
    }

    eventEmitter.on('queryend', queryend);
    connection.query(sql, function(err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }

        for (var i = 0; i < result.length; i++) {
            var book = new Object();
            book.id = result[i].id;
            book.fullName = result[i].full_name;
            book.author = result[i].author;
            book.publisher = result[i].publisher;
            book.price = result[i].price;
            book.introduce = result[i].introduce;
            books[i]= book;
        }
        console.log(books[0].fullName);
        eventEmitter.emit('queryend');
    });
});

module.exports = router;
