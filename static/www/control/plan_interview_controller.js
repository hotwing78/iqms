function plan_interview_controller($scope, $http, $mdDialog, $routeParams, $mdMedia, $window, taggingService, popupService, flaggingService) {

    var interviewID = $routeParams.id;

    $scope.positionText = "";
    $scope.positionDescription = "";
    $scope.candidateText = "";
    $scope.dateText = "";
    $scope.locationText = "";

    $scope.taglist = [];

    $scope.loadScreen = function() {
        flaggingService.clearQuestions();
        flaggingService.loadQuestionList(interviewID);
        $http.get('/interview/' + interviewID).success(function(data) {
            $http.get('/candidatePosition/' + data.interview.candidatePositionCId).success(function(result) {
                $http.get('/candidate/' + result.result.candidateId).success(function(result) {
                    $scope.candidateText = result.candidate.name;
                });
                $http.get('/position/' + result.result.positionId).success(function(result) {
                    $scope.positionText = result.position.name;
                    $scope.positionDescription = result.position.description;
                });
            });
            $http.get('/interview/' + interviewID + '/tags').success(function(data) {
                data.tags.forEach(function(tag, index) {
                    $('#tagbox').tagsinput('add', tag.name);
                });
            })
        });
    }

    $scope.createInterview = function () {
        $scope.saveInterview(interviewID);
    };

    $scope.saveInterview = function(interviewID) {
        flaggingService.persistQuestions(interviewID);
        $window.location.href = './#li';
        $scope.checkFoMainTags(interviewID);
    }

    $scope.showInterviewWithTag = function(ev, tag) {
        taggingService.setClickedTag(tag);
        flaggingService.setSelectedTag(tag);
        if (taggingService.countTag(tag) > 0) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'questionFlagger.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }
    }

    $('#tagbox').on('beforeItemAdd', function(event) {
        event.itemValue = taggingService.countTag(event.item);
        event.itemText = event.item + " (" + event.itemValue + ")";
        $scope.taglist.push(event.item);
    });

    $('#tagbox').on('beforeItemRemove', function(event) {
        $http.delete('/tag/' + event.item
            + '/interview/' + interviewID).success(function(created) {
        });
        if($scope.taglist.indexOf(event.item) > -1) {
            $scope.taglist.splice($scope.taglist.indexOf(event.item), 1);
        }
    });

    $scope.checkForMainTags = function(interviewID) {
        var skillTag = false;
        var introTag = false;
        var closeTag = false;
        $scope.taglist.forEach(function(tag, index) {
            if (taggingService.countTag(tag) > 0) {
                $http.post('/tag/' + tag
                    + '/interview/' + interviewID).success(function(created) {
                });
            }
            if (tag == "Intro") {
                introTag = true;
            } else if (tag == "Skills") {
                skillTag = true;
            } else if (tag == "Close") {
                closeTag = true;
            }
        });
        if (!introTag) {
            $http.post('/tag/' + "Intro"
                + '/interview/' + interviewID).success(function(created) {
            });
        }
        if (!skillTag) {
            $http.post('/tag/' + "Skills"
                + '/interview/' + interviewID).success(function(created) {
            });
        }
        if (!closeTag) {
            $http.post('/tag/' + "Close"
                + '/interview/' + interviewID).success(function(created) {
            });
        }
    }

    taggingService.resetTags();
    $scope.loadScreen();
}

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}