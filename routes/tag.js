var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};

exports = module.exports = new Resource('tag', '/tag', {
        get: (req, res) => {
                var query = {};
                
                if (req.query.name) {
                    query.name = req.query.name;
                }
                
                if (req.query.type) {
                    query.type = req.query.type;
                }
                
                models.tag.findAll({where: query}).
                        then(function(tags) {
                                res.status(200).json({tags: tags});
                })
        },
        post: (req, res) => {
                if(!req.query.count) {
                        req.query.count = 1;
                }
                
                if (!req.query.name) {
                    req.query.name = 'Blank';
                }
                
                models.tag.create( {
                        count: req.body.count ? req.body.count : null,
                        name: req.body.name ? req.body.name : null
                }).then(function(created) {
                        res.status(201).json({tag: created.dataValues});
                })
        }



});