const db = require("./database");
const querystring = require('querystring');

const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

module.exports = function(app){
    app.get('/fixtures_selection', function(req, res) {
        console.log("GET /fixtures_selection");

        db.connection().query('SELECT * FROM season', (err,rows) => {
            if(err) throw err;

            var season_array = [];

            rows.forEach( (row) => {
                var season_cadence = (row.is_summer_league===1 ? "Summer" : "Winter");
                season_array.push({"id": row.id, "season_year": row.season_year, "season_cadence": season_cadence});
                console.log({"season": row.season_year + " " + season_cadence});
            });

            res.render("fixtures_selection", {
                title: "Fixtures",
                seasons: season_array,
            });
        });
    });

    app.get("/load_fixtures" , function(req, res){

        const season_id = req.query.season_id;
        console.log("GET /load_fixtures. season_id: " + season_id);

        var fixture_sql = 'select season.season_year, season.is_summer_league, fixture_date, home_team.name AS home_team, away_team.name AS away_team ' +
            'FROM fixture ' +
            'INNER JOIN team home_team ' +
            'ON fixture.home_team_id = home_team.id ' +
            'INNER JOIN team away_team ' +
            'ON fixture.away_team_id = away_team.id ' +
            'INNER JOIN season season ' +
            'ON fixture.season_id=season.id ' +
            'WHERE season_id = ? ' +
            'ORDER BY fixture_date;';

        var season_sql = 'SELECT * FROM season';

        db.connection().query(fixture_sql + season_sql, [season_id], (err,results) => {

            if(err) throw err;

            var season_array = [];
            var fixture_array = [];
            var selected_season = "";

            results[0].forEach( (row) => {
                const fixture_date = row.fixture_date;

                const day_of_week = days[fixture_date.getDay()];
                const day_of_month = fixture_date.getDate();
                const month = months[fixture_date.getMonth()];
                const year = fixture_date.getFullYear();

                const formatted_date = day_of_week + ' ' + day_of_month + ' ' + month + ' ' + year;

                var season_cadence = (row.is_summer_league===1 ? "Summer" : "Winter");
                selected_season = row.season_year + " " + season_cadence;

                fixture_array.push({ "fixture_date": formatted_date, "home_team": row.home_team, "away_team": row.away_team});
                console.log("season: " + selected_season + " fixture_date: " + formatted_date + " " + " home_team: " + row.home_team + " away_team: " + row.away_team);
            });

            results[1].forEach( (row) => {
                var season_cadence = (row.is_summer_league===1 ? "Summer" : "Winter");
                season_array.push({"id": row.id, "season_year": row.season_year, "season_cadence": season_cadence});
            });

            res.render("fixtures_selection", {
                title: "Fixtures",
                fixtures: fixture_array,
                seasons: season_array,
                selected_season: "for " + selected_season
            });
        });
    })
};