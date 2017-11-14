'use strict';

const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {

    res.render('index');
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${listener.address().port}`);
});
