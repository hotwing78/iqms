var app = angular.module('app', ['ngRoute', 'ngSanitize', 'ngMaterial', 'ngDragDrop', 'googlechart']);

//Angular routes
app.config(function ($routeProvider) {
    $routeProvider
            .when('/', {
                templateUrl: '../views/welcome.html'
            })

            .when('/ci', {
                templateUrl: '../views/createInterview.html'
            })

            .when('/ie', {
                templateUrl: '../views/createInterview.html'
            })

            .when('/li', {
                templateUrl: '../views/listInterviews.html'
            })

            .when('/plan/:id', {
                templateUrl: '../views/planInterview.html'
            })

            .when('/cq', {
                templateUrl: '../views/createQuestion.html'
            })

            .when('/ce', {
                templateUrl: '../views/createQuestion.html'
            })

            .when('/lp', {
                templateUrl: '../views/listPositions.html'
            })

            .when('/qm', {
                templateUrl: '../views/questionManager.html'
            })

            .when('/conaction/:id/', {
                templateUrl: '../views/conductInterviewAction.html'
            })

            .when('/view/:id', {
                templateUrl: '../views/interpretInterview.html'
            })

            .when('/users', {
                templateUrl: '../views/manageUsers.html'
            })

            .when('/login', {
                templateUrl: '../views/login.html'
            })

            .when('/loading', {
                templateUrl: '../views/loading.html'
            })

            .otherwise({redirectTo: '/'});

});

app.controller("create_interview_controller", create_interview_controller);
app.controller("conduct_interview_controller", conduct_interview_controller);
app.controller("list_interview_controller", list_interview_controller);
app.controller("create_question_controller", create_question_controller);
app.controller("question_manager_controller", question_manager_controller);
app.controller("tag_auto_complete_controller", tag_auto_complete_controller);
app.controller("index_controller", index_controller);
app.controller("login_controller", login_controller);
app.controller("slider_controller", slider_controller);
app.controller("question_flagger_controller", question_flagger_controller);
app.controller("filter_menu_controller", filter_menu_controller);
app.controller("interpret_interview_controller", interpret_interview_controller);
app.controller("plan_interview_controller", plan_interview_controller);
app.controller("manage_user_controller", manage_user_controller);
app.controller("list_positions_controller", list_positions_controller);
app.controller("create_position_controller", create_position_controller);

app.service('authService', [authService]);
app.service("taggingService", ['$http', '$rootScope', 'authService', taggingService]);
app.service("popupService", ['$mdDialog', '$mdMedia', '$rootScope', popupService]);
app.service('flaggingService', ['$http', '$rootScope', 'authService', flaggingService]);
app.service('filterService', ['$rootScope', filterService]);
app.service('userService', ['$rootScope', '$http', '$route', 'authService', userService]);

app.factory('socket', ['$http', function($http) {
    var socket;

    // $http.get('../../config/config.json').success(function(config) {
    //     socket = io.connect(config.development.webSocketUrl);
    // });

    return {
        on: function(eventName, callback){
            socket.on(eventName, callback);
        },
        emit: function(eventName, data) {
            socket.emit(eventName, data);
        }
    };
}]);

app.factory('toast', function() {
    return {
        info: function(text) {
            toastr.info(text);
        }
    }
});

app.directive("tag", function() {
    return {
                restrict: "E",
                templateUrl: 'directives/tag.html'
            };
});

app.filter('orderTechnicalQuestions', function() {
    return function(items, order, tags, reverse) {
        var filtered = [];
        if (order[0] == "tags") {
            tags.forEach(function(tag, index) {
                var temp = [];
                 for (var i = 0; i < items.length; i++) {
                    if (items[i].tags[tag.label]) {
                        temp.push(items[i]);
                        items.splice(i, 1);
                        i--;
                    }
                 }
                temp.sort(function (a, b) {
                    return (a["difficulty"] > b["difficulty"] ? 1 : -1);
                });
                filtered = $.merge(filtered, temp);
            });

        } else if (order[0] == "difficulty") {
            var jun = [];
            var mid = [];
            var sen = [];

            tags.forEach(function(tag, index) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].tags[tag.label]) {
                        if (items[i].difficulty <= 3) {
                            jun.push(items[i]);
                        } else if (items[i].difficulty > 3 && items[i].difficulty <= 6) {
                            mid.push(items[i]);
                        } else {
                            sen.push(items[i]);
                        }
                    }
                }
            });

            filtered = $.merge(jun, mid);
            filtered = $.merge(filtered, sen);
        }

        if(reverse) filtered.reverse();
        return filtered;
    };
});
