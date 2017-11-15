'use strict';

require('dotenv').config();

const express = require('express');
const request = require('request');
const morgan = require('morgan');

const app = express();

const footballAPI = {
    baseUrl: 'http://www.football-data.org/v1',
    apiKey: process.env.FOOTBALL_DATA_API_KEY
};

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(morgan('combined'))

app.get('/', (req, res) => {

    res.render('index');
});

app.get('/leagues', (req, res, next) => {

    const options = {
        url: `${footballAPI.baseUrl}/competitions`,
        headers: {
            'X-Auth-Token': footballAPI.apiKey
        }
    };

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

app.get('/league/:id/table', (req, res, next) => {

    if (!parseInt(req.params.id))
        return next();

    const options = {
        url: `${footballAPI.baseUrl}/competitions/${req.params.id}/leagueTable`,
        headers: {
            'X-Auth-Token': footballAPI.apiKey
        },
        qs: {
            matchday: req.query.matchday
        }
    };

    request(options, (err, response, body) => {

        if (err)
            return next(err);

        body = JSON.parse(body);

        if (body.error)
            return next();

        const leagueTable = {
            leagueCaption: body.leagueCaption,
            matchday: body.matchday,
            standing: body.standing,
        };

        return res.json(leagueTable);

    });
    
});

// ERROR HANDLERS
app.use((req, res, next) => {
    res.status(404).render('errors/404');
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).render('errors/500');
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${listener.address().port}`);
});
