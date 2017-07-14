function create_position_controller ($scope, $rootScope, $location, $http, taggingService, authService,userService,popupService) {

    $scope.positionData = {
       name: '',
       tags:[],
       selectedTags: {},
       description: '',
    }

    $scope.positions = {};
    $scope.selectedPosition = null;
    $scope.positionText = "";
    $scope.userRole = userService.getUserRole();

    $scope.cancel = function() {
        $location.path('/lp');
    };
   //This function checks the path for an existing position id for edit


    var loadPosition = function() {
        taggingService.resetTags();
        if ($location.hash() !== '') {
            instantiateEditPosition();
        }
    };

    var instantiateEditPosition = function() {
        authService.getUserToken(function(idToken) {
            $http.get('../../position/' + $location.hash() + "?idToken=" + idToken).success(function(data) {
                $scope.positionData.text = data.position.name;
                $scope.positionData.description = data.position.description;
                taggingService.loadSavedTags(data.position.id, idToken,'position');
                refreshTags();
            })
        });
    };

    var refreshTags = function() {
        $scope.positionData.tags = taggingService.getTags();
        $scope.positionData.selectedTags = taggingService.getSelectedTags();
    };

    $scope.addPosition = function(position) {
        if (positionData && !$scope.positions[position]) {
            popupService.init("Description", "Add job description for " + position, "" ,"");
            popupService.showPrompt(this, function() {
                $scope.positionsData.description = popupService.getResult();
                $scope.positionData.name = position;
                savePosition(position);
            });
        }
    };

    $rootScope.$on("tagNotification", function() {
        refreshTags();
    });

    var savePosition = function(position) {
        authService.getUserToken(function(idToken) {
            $http.post('../../position?idToken=' + idToken, $scope.positions[position]).success(function(created) {
                var fullName = position + getPositionID({type: "Internal", info: created.data});
                taggingService.persistTag(created.data.id,'position');
                $scope.positions[fullName] = created.data;
                $scope.positions[fullName].name = fullName;
                $scope.selectedPosition = fullName;
                delete $scope.positions[position];
            });
        });
    };

    var getPositionID = function(options) {
        switch(options.type) {
            default:
            case("Internal"):
                var year = options.info.createdAt.substr(0, 4);
                return formatID(options.info.id, year);
        }
    };

    var formatID = function(id, year) {
        var formatted = " (#" + year + "-";

        if(id < 10) {
            formatted += "000" + id;
        } else if(id < 100) {
            formatted += "00" + id;
        } else if(id < 1000) {
            formatted += "0" + id;
        } else {
            formatted += id;
        }

        formatted += ")";

        return formatted;
    };


    loadPosition();

}
