const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, message TEXT)");
});

module.exports = db;