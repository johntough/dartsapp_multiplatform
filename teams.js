const db = require("./database");

module.exports = function(app){
    app.get('/teams', function(req, res) {
        console.log("GET /teams");

        db.connection().query('SELECT * FROM team', (err,rows) => {
            if(err) throw err;

            var team_array = [];

            rows.forEach( (row) => {
                team_array.push({"name": row.name});
                console.log({"name": row.name});
            });

            res.render("teams", {
                title: "Teams",
                teamnames: team_array,
            });
        });
    });
};