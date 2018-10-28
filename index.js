/* Imports */
const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')

/* Definitions */
const Property = mongoose.model('Property', { name: String, price: String, location: String, tags: Array });

/* Initialisation */
mongoose.connect('mongodb://localhost:27017/properties');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    next();
});

/* App */
app.get('/properties',
    (req, res) => {
        let $query = {};

        Object.keys(req.query).forEach(query => {
            $query[query] = req.query[query]
        });

        Property.find($query)
        .limit(10)
        .exec((err, $res) => res.json($res))
    }
);

app.get('/properties/:id',
    (req, res) => Property.findById(req.params.id)
        .exec((err, $res) => res.json($res))
);

/* Listen */
app.listen(port, () => console.log(`HAUM API listening on port ${port}!`));
