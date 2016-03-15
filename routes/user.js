/**
 * Created by nick on 3/15/16.
 */

var models = require('../models');
var Resource = require('../lib/Resource');
var exports = module.exports = {};



exports = module.exports = new Resource('user', '/user', {
        get: (req, res) => {

            //models.sequelize.query('SELECT * FROM "Users";')
            models.user.findAll()
                .then(function(users) {
                    res.status(200).json({
                        users: users
                    });
                })
        },
        post: (req, res) => { // make a new question
            models.user.create({
                //TODO: user fields

            }).then(function(created) {
                res.status(200).json({
                    answer: created.dataValues
                });
            })
        }



    }, [new Resource('get_user_by_id', '/:id', {

        get: (req, res) => { //get answer by id
            console.log("MESSAGE \n\n\n" + req.params.id + "\nMESSAGE \n\n\n");

            models.user.findAll({
                where: {
                    id: req.params.id
                }
            }).then(function(user) {
                res.status(200).json({
                    user: user
                });
            })
        },
        delete: (req, res) => {
            models.user.destroy({
                where: {
                    id: req.params.id
                },
                //truncate: true /* this will ignore where and truncate the table instead */
            }).then(function(destroyed) {
                res.status(200).json({
                    answer: destroyed.dataValues
                });
            });

        }




    }),
        new Resource('user_interviews', '/:id/interviews/', {

                get: (req, res) => { //get answer by id
                    models.userInterview.findAll(
                        //where : {
                        //    //userId : req.params.id
                        //}
                    ).then(function(gotten_interviews) {
                        models.interview.findAll({
                            where: {
                                id : {in : gotten_interviews.dataValues.InterviewID}
                            }
                        }).then(function(ints){
                            res.status(200).json({
                                interviews: ints
                            })
                        });
                    })
                },
                delete: (req, res) => {
                    models.user.destroy({
                        where: {
                            id: req.params.id
                        }
                        //,truncate: true /* this will ignore where and truncate the table instead */
                    }).then(function(destroyed) {
                        res.status(200).json({
                            answer: destroyed.dataValues
                        });
                    });

                }




            }

        )]




);