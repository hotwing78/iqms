"use strict";

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {

            username: DataTypes.STRING,
            first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        pw_hash: DataTypes.STRING

    }


    , {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Interview, {as: 'Interviews'});
            }
        }
    });

    return User;
};