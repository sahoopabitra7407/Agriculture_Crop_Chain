const db = require('./db');

db.query("SELECT * FROM suppliers", (err, results) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(results);
});
