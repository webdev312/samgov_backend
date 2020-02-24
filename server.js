(function () {
    var express = require('express');
    var http = require('http');
    var mysql = require('mysql');
    var bodyParser = require('body-parser');
    var cors = require('cors');
    var fs = require('fs');
    var app = express();

    app.set('port', process.env.PORT || 8080);
    app.use(express.static(__dirname));
    app.use(bodyParser.json());
    app.use(cors());

    var env = process.env.NODE_ENV || 'development';
    if ('development' == env) {
        console.log('Using development settings.');
        var pool = mysql.createPool({
            host: '',
            user: '',
            port: '',
            password: '',
            multipleStatements: true
        });
    }
    pool.getConnection(function (err, connection) {
        if (err) {
            process.env['msg'] = 'unable to connect to RDS -' + err;
            return;
        };

        // get returns from MySQL database
        app.get('/ret', function (req, res) {
            var sqlLine = "SELECT * FROM codelist.naics";
            connection.query(sqlLine, function(err, rows){
                if (err) throw err;
                if (rows.length > 0){
                    res.json(rows);
                }
            });
        });

        // connection and express server
        console.log('Connection established');
        connection.release();
        http.createServer(app).listen(app.get('port'), function () {
            console.log("Express server listening on port " + app.get('port'));
        });
    });

}).call(this);
