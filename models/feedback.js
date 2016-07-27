"use strict";

module.exports = function(sequelize, DataTypes) {
    var feedback = sequelize.define("Feedback", {
        question_id: DataTypes.INTEGER,
        data: DataTypes.JSON
    }, {
        classMethods: {
            associate: function(models) {
                feedback.belongsToMany(models.interview, {through: "interviewFeedback"});
            }
        }
    });
    
    return feedback;
};