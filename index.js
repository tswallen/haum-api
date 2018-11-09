/* Imports */
const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')

/* Definitions */
const Property = mongoose.model('Property', { name: String, price: String, location: String, bathrooms: Number, bedrooms: Number, parking: Number, tags: Array, images: Array });
let range = 1;

/* Initialisation */
mongoose.connect('mongodb://localhost:27017/properties');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    next();
});

range = range + 1;

/* App */
app.get('/properties',
    (req, res) => {
        let $query = {};

        Object.keys(req.query).forEach(query => {
           if (query === 'location' | 'price') {
                $query[query] = req.query[query]
                return;
            }
            $query[query] = {
                $lt: parseInt(req.query[query]) + range,
                $gt: parseInt(req.query[query]) - range
            }
        });

        Property
            .find($query)
            .sort({
                price: 1,
                bedrooms: -1,
                parking: -1,
                bathrooms: -1
            })
            .limit(10)
            .exec((err, $res) => {
                const $$res = [];

                $res.forEach(property => {
                    $$res.push(
                        {
                            id: property._id,
                            name: property.name,

                            price: property.price,

                            bathrooms: property.bathrooms,
                            bedrooms: property.bedrooms,
                            parking: property.parking,

                            location: property.location,
                            tags: property.tags,

                            images: property.images
                        }
                    )
                })

                res.json($$res);
            })
    }
);

app.get('/properties/:id',
    (req, res) => Property.findById(req.params.id)
        .exec((err, $res) => {
            let $$res;

            $$res = {
                id: $res._id,
                name: $res.name,

                price: $res.price,

                bathrooms: $res.bathrooms,
                bedrooms: $res.bedrooms,
                parking: $res.parking,

                location: $res.location,
                tags: $res.tags,

                images: $res.images
            }

            res.json($$res);
        })
);

/* Listen */
app.listen(port, () => console.log(`HAUM API listening on port ${port}!`));
