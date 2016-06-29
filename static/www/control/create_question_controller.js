/**
 * Created by nick on 4/6/16.
 */

function create_question_controller ($scope,$location,$http,$window, taggingService, popupService) {
    $scope.qt = $location.search().qt;
   
    $scope.current_topics = [];
    $scope.current_subtopics = [];
    
    $scope.selectedType = 0;
    $scope.selectedTopic = null;
    $scope.types = taggingService.getTypes();

    $scope.answers = [1];
    
    $scope.newSub = '';
    
    $scope.updateSelectedType = function(value) {
        taggingService.updateSelectedType(value.id);
        $("#subtopic-box").css({"visibility": "hidden"});
        $scope.current_subtopics = taggingService.getCurrentSubTopics();
    }

    $scope.CreateQuestion = function () {
        qt = document.getElementById("question_text").value;
        diff = document.getElementById("difficulty").value;

        console.log(qt);
        var par1 = {question_text: qt,difficulty : diff};

        $http.post('/question',par1).success(function(created){
                qid = created.question.id;
                $scope.current_tags.forEach(tag => $http.post('/question/' + qid + '/tags/' + tag.item.id ))
                $window.location.href = './#qm';

            });

    }
    
    $scope.addAnswer = function() {
        $scope.answers.push($scope.answers.length + 1);
    }
    
    $scope.removeAnswer = function() {
        if ($scope.answers.length > 1) {
            $scope.answers.pop();
        }
    }

    $scope.$on("topicNotification", function(event, args) {
        $scope.current_subtopics = taggingService.getCurrentSubTopics();
    });
    
    $scope.showPrompt = function($event) {
        popupService.init('New Subtopic', 'Enter the new subtopic', '', '');
        popupService.showPrompt($event, $scope.getPrompt);
    }
    
    $scope.getPrompt = function() {
        $scope.newSub = popupService.getResult();
        console.log($scope.newSub);
        
        if ($scope.newSub != null) {
            taggingService.createNewSubTopic($scope.newSub);
            $scope.current_subtopics = taggingService.getCurrentSubTopics();
        }
    }
    
}

