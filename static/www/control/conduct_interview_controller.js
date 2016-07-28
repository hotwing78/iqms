/**
 * Created by nick on 4/12/16.
 */


function conduct_interview_controller ($scope,$location,$http,$window,$routeParams,$filter, $interval, socket, filterService) {
    var interviewId = $routeParams.id;
    $scope.interview = {};
    $scope.questionList = {};
    $scope.questionsByID = {};
    $scope.currentTag = "";
    
    $scope.previousQuestions = [];
    $scope.lastQuestion = null;
    $scope.currentQuestion = {};
    $scope.queuedQuestions = [];
    
    $scope.interviewerName = "User";

    $scope.difficulties = [{
        label: "Junior",
        checked: true
    }, {
        label: "Mid",
        checked: true
    }, {
        label: "Senior",
        checked: true
    }];
    
    filterService.setDifficulties($scope.difficulties);
    
    $scope.tags = [];
    
    $scope.collapseQuestion = function(id) {
        console.log(id);
        $('.collapse-prev').collapse('hide');
        $('#collapse' + id).collapse('toggle');
    }
    
    $http.get('/interview/' + interviewId).success(function (data) {
        $scope.interview = data.interview;
        $http.get('/interview/' + interviewId +'/tags/').success(function(result) {
            result.tags.forEach(function(tag, index) {
                $scope.tags.push({
                   label: tag.name,
                   checked: true
                });
                filterService.setTags($scope.tags);
                $scope.questionList[tag.name] = [];
                $http.get('/tag/' + tag.name + '/questions/').success(function(result) {
                   $scope.questionList[tag.name] = result.questions;
                   $scope.currentTag = "Technical";
                   $scope.questionList[tag.name].forEach(function(q, index) {
                    if (!$scope.questionsByID[q.id]) {
                        $scope.questionsByID[q.id] = q;
                        $scope.questionsByID[q.id].queued = false;
                    }
                    
                   });
                   
                    var qsId = $.map($scope.questionsByID, function(value, index) {
                        return value;
                    });
                    $scope.queuedQuestions = $filter('filter')(qsId, function(question){
                        return  question.difficulty === 0 && !question.queued;
                    });
                    if ($scope.queuedQuestions.length > 6) {
                        $scope.queuedQuestions.length = 6;
                    }
                    $scope.queuedQuestions.forEach(function(q, index) {
                       $scope.questionsByID[q.id].queued = true;
                    });
                    $scope.currentQuestion = $scope.queuedQuestions.shift();
                });
            });
        });
    });

    $scope.respond = function(id, value) {
        if ($scope.currentQuestion.id == id) {
            socket.emit('question-feedback', {interviewId: interviewId});
            $scope.currentQuestion.response = value;
            var feedback = {
                user: $scope.interviewerName,
                rating: value,
                note: $scope.currentQuestion.note,
                question_id: id
            };
            $http.post('/feedback', feedback).then(function(created) {
                $http.post('/interview/' + interviewId + '/feedback/' + created.data.feedback.id).then(function(added) {
                });
            });
        } else if($scope.lastQuestion.id == id) {
            $scope.lastQuestion.response = value;
            var feedback = {
                user: $scope.interviewerName,
                rating: value,
                note: $scope.lastQuestion.note,
                question_id: id
            };
            $http.get('/interview/' + interviewId + '/feedback/' + id).then(function(feedbacks) {
               $http.put('/feedback/' + feedbacks.data.feedbacks[0].id, feedback).then(function(update) {
               });
            });
        } else {
            var index;
            for(var i = 0; i < $scope.previousQuestions.length; i++) {
                if ($scope.previousQuestions[i].id == id) {
                    $scope.previousQuestions[i].response = value;
                    index = i;
                    i = $scope.previousQuestions.length;
                }
            }
            
            var feedback = {
                user: $scope.interviewerName,
                rating: value,
                note: $scope.previousQuestions[index].note,
                question_id: id
            };
            $http.get('/interview/' + interviewId + '/feedback/' + id).then(function(feedbacks) {
               $http.put('/feedback/' + feedbacks.data.feedbacks[0].id, feedback).then(function(update) {
               });
            });
        }
    }
    
    $scope.saveNote = function(id) {
        if ($scope.currentQuestion.id == id) {
            var feedback = {
                user: $scope.interviewerName,
                note: $scope.currentQuestion.note,
                question_id: id
            };
            $http.post('/feedback', feedback).then(function(created) {
                $http.post('/interview/' + interviewId + '/feedback/' + created.data.feedback.id).then(function(added) {
                });
            });
        } else if($scope.lastQuestion.id == id) {
            var feedback = {
                user: $scope.interviewerName,
                note: $scope.lastQuestion.note,
                question_id: id
            };
            $http.get('/interview/' + interviewId + '/feedback/' + id).then(function(feedbacks) {
               $http.put('/feedback/' + feedbacks.data.feedbacks[0].id, feedback).then(function(update) {
               });
            });
        } else {
            var index;
            for(var i = 0; i < $scope.previousQuestions.length; i++) {
                if ($scope.previousQuestions[i].id == id) {
                    index = i;
                    i = $scope.previousQuestions.length;
                }
            }
            
            var feedback = {
                user: $scope.interviewerName,
                note: $scope.previousQuestions[index].note,
                question_id: id
            };
            $http.get('/interview/' + interviewId + '/feedback/' + id).then(function(feedbacks) {
               $http.put('/feedback/' + feedbacks.data.feedbacks[0].id, feedback).then(function(update) {
               });
            });
        }
    }
    
    $scope.skip = function(id) {
        socket.emit('question-skip', {id: id, interviewId: interviewId});
        if ($scope.currentQuestion.id == id) {
            socket.emit('question-feedback', {interviewId: interviewId});
            $scope.currentQuestion.response = -1;
        } else if($scope.lastQuestion.id == id) {
            $scope.lastQuestion.response = -1;
        } else {
            var index;
            for(var i = 0; i < $scope.previousQuestions.length; i++) {
                if ($scope.previousQuestions[i].id == id) {
                    $scope.previousQuestions[i].response = -1;
                    i = $scope.previousQuestions.length;
                }
            }
        }
    }
    
    $scope.pullQuestion = function() {
        var qsId = $.map($scope.questionsByID, function(value, index) {
            return value;
        });
        qsId = $filter('filter')(qsId, function(question){
            return  question.difficulty === 0 && !question.queued;
        });
        if (qsId.length > 0) {
            $scope.queuedQuestions.push(qsId[0]);
        }
    }
    
    socket.on('notify-question-feedback' + interviewId, function(data) {
        $scope.$apply(function() {
            if ($scope.lastQuestion) {
                $scope.previousQuestions.push($scope.lastQuestion);
            }
            $scope.lastQuestion = $scope.currentQuestion;
            if ($scope.queuedQuestions.length >= 1) {
                $scope.currentQuestion = $scope.queuedQuestions.shift();
                $scope.currentQuestion.response = null;  
            } else {
                $scope.currentQuestion = null;   
            }
        }); 
    });
    
    socket.on('notify-question-skip' + interviewId, function(data) {
       $scope.$apply(function() {
            if ($scope.currentQuestion.id == data.id) {
                $scope.currentQuestion.skipped = true;
            } else if($scope.lastQuestion.id == data.id) {
                $scope.lastQuestion.skipped = true;
            } else {
                var index;
                for(var i = 0; i < $scope.previousQuestions.length; i++) {
                    if ($scope.previousQuestions[i].id == data.id) {
                        $scope.previousQuestions[i].skipped = true;
                        i = $scope.previousQuestions.length;
                    }
                }
            }
       });
    });
    
    $scope.sendQuestionOrder = function() {
        socket.emit('question-reorder', {queue: $scope.queuedQuestions, interviewId: interviewId});
    }
    
    socket.on('notify-question-reorder' + interviewId, function(data) {
       $scope.$apply(function() {
        $scope.queuedQuestions = data.queue;
       });
    });
}