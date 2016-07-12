/**
 * Created by nick on 4/5/16.
 */

function question_manager_controller($scope, $http, taggingService) {
    $scope.sortType     = 'id'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchQuestion   = '';     // set the default search/filter term

    $http.get('/question').success(function (data) {
        $scope._question = data.questions;
    });

    $scope.loadQuestion = function(index) {
        window.location.href = "#ce#" + index;
    }

    $scope.DeleteQuestion = function (index, question) {
        
        taggingService.deleteQuestionTags(question.tags);
        
        $http.delete('/question/' + question.id).success(function() {
            $http.get('/question').success(function(data){
                    $scope._question = data.questions;
            })
        })
        
    };

};

