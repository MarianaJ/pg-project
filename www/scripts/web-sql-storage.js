var WebSqlDB = function(successCallback, errorCallback) {

    this.initializeDatabase = function (successCallback, errorCallback) {

        // This here refers to this instance of the webSqlDb
        var self = this;

        // Open/create the database
        this.db = window.openDatabase("NOTES", "1.0", "Todo Demo DB", 200000);

        // WebSQL databases are tranaction based so all db querying must be done within a transaction
        this.db.transaction(
            function (tx) {

                self.createTable(tx);
                self.addSampleData(tx);
            },
            function (error) {

                if (errorCallback) errorCallback();
            },
            function () {

                if (successCallback) successCallback();
            }
        )
    }

    this.createTable = function (tx) {

        // This can be added removed/when testing
        //tx.executeSql('DROP TABLE IF EXISTS todo');

        var sql = "CREATE TABLE IF NOT EXISTS todo ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "title, " +
            "description, " +
            "status)";
        tx.executeSql(sql, null,
            function () {            // Success callback
                console.log('Tables created succesfully');
            },
            function (tx, error) {   // Error callback
                alert('Create table error: ' + error.message);
            });
    }

    this.addSampleData = function (tx, todos) {

        // Array of objects
        var todos = [
            { "id": 1, "title": "Skończyć tą aplikacje", "description": "Jeszcze tylko pare linijek", "status": 0 }

        ];

        var l = todos.length;

        var sql = "INSERT OR REPLACE INTO todo " +
            "(id, title, description, status) " +
            "VALUES (?, ?, ?, ?)";
        var t;

        // Loop through sample data array and insert into db
        for (var i = 0; i < l; i++) {
            t = todos[i];
            tx.executeSql(sql, [t.id, t.title, t.description, t.status],
                function () {            // Success callback
                    console.log('Sample data DB insert success');
                },
                function (tx, error) {   // Error callback
                    alert('INSERT error: ' + error.message);
                });
        }

    }

    this.findAll = function (callback) {

        this.db.transaction(
            function (tx) {
                var sql = "SELECT * FROM todo";

                tx.executeSql(sql, [], function (tx, results) {
                    var len = results.rows.length,
                        todos = [],
                        i = 0;

                    // Semicolon at the start is to skip the initialisation of vars as we already initalise i above.
                    for (; i < len; i = i + 1) {
                        todos[i] = results.rows.item(i);
                    }

                    // Passes a array with values back to calling function
                    callback(todos);
                });
            },
            function (error) {
                alert("Transaction Error findAll: " + error.message);
            }
        );
    }

    this.findById = function (id, callback) {

        this.db.transaction(
            function (tx) {

                var sql = "SELECT * FROM todo WHERE id=?";

                tx.executeSql(sql, [id], function (tx, results) {

                    // This callback returns the first results.rows.item if rows.length is 1 or return null
                    callback(results.rows.length === 1 ? results.rows.item(0) : null);
                });
            },
            function (error) {
                alert("Transaction Error: " + error.message);
            }
        );
    }

    this.markCompleted = function (id, callback) {

        this.db.transaction(
            function (tx) {

                var sql = "UPDATE todo SET status=1 WHERE id=?";

                tx.executeSql(sql, [id], function (tx, result) {

                    // If results rows return true
                    callback(result.rowsAffected === 1 ? true : false);
                });
            }
        );
    }

    this.markOutstanding = function (id, callback) {

        this.db.transaction(
            function (tx) {

                var sql = "UPDATE todo SET status=0 WHERE id=?";

                tx.executeSql(sql, [id], function (tx, result) {

                    // If results rows return true
                    callback(result.rowsAffected === 1 ? true : false);
                });
            }
        );
    }

    this.insert = function (json, callback) {

        // Converts a JavaScript Object Notation (JSON) string into an object.
        var parsedJson = JSON.parse(json),
            status = 0;

        // Kept for for debuging
        //console.log("DEBUG - Inserting the following json ");
        //console.log(parsedJson);

        this.db.transaction(
            function (tx) {

                var sql = "INSERT INTO todo (title, description, status) VALUES (?, ?, ?)";

                tx.executeSql(sql, [parsedJson.title, parsedJson.description, status], function (tx, result) {

                    // If results rows
                    callback(result.rowsAffected === 1 ? true : false);
                });
            }
        );
    }

    this.update = function (json, callback) {

        // Converts a JavaScript Object Notation (JSON) string into an object.
        var parsedJson = JSON.parse(json);

        this.db.transaction(
            function (tx) {

                var sql = "UPDATE todo SET title=?, description=? WHERE id=?";

                tx.executeSql(sql, [parsedJson.title, parsedJson.description, parsedJson.id], function (tx, result) {

                    callback(result.rowsAffected === 1 ? true : false);

                });
            }
        );
    }

    this.delete = function (json, callback) {

        // Converts a JavaScript Object Notation (JSON) string into an object.
        var parsedJson = JSON.parse(json);

        this.db.transaction(
            function (tx) {

                var sql = "DELETE FROM todo WHERE id=?";

                tx.executeSql(sql, [parsedJson.id], function (tx, result) {

                    // If results rows
                    callback(result.rowsAffected === 1 ? true : false);
                    //console.log("Rows effected = " + result.rowsAffected);
                });
            }
        );
    }

    this.initializeDatabase(successCallback, errorCallback);
}