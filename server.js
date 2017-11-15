'use strict';

require('dotenv').config();

const express = require('express');
const request = require('request');

const app = express();

const footballAPI = {
    baseUrl: 'http://www.football-data.org/v1',
    apiKey: process.env.FOOTBALL_DATA_API_KEY
};

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {

    res.render('index');
});

app.get('/leagues', (req, res, next) => {

    const options = {
        url: `${footballAPI.baseUrl}/competitions`,
        headers: {
            'X-Auth-Token': footballAPI.apiKey
        }
    }

    request(options, (err, response, body) => {

        if (err)
            return next(err);

        let leagues = JSON.parse(body);

        if (leagues.error)
            return next();

        leagues = leagues
            .filter(l => l.numberOfMatchdays > l.numberOfTeams)
            .map(l => {

                return {
                    id: l.id,
                    caption: l.caption,
                    league: l.league,
                    year: l.year
                };
            });

        return res.json(leagues);

    });
    
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${listener.address().port}`);
});
