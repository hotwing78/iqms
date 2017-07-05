function create_position_controller ($scope, $rootScope, $location, $http, taggingService, authService,userService,popupService) {

    $scope.positionData = {
       tags:[],
       selectedTags: {},
       text: ' ',
    }

    $scope.positions = {};
    $scope.selectedPosition = null;
    $scope.positionText = "";
    $scope.userRole = userService.getUserRole();

    $scope.cancel = function() {
        $location.path('/lp');
    };

    $scope.addPosition = function(position) {
        if (position && !$scope.positions[position]) {
            $scope.positions[position] = {name: position, description: ""};
            popupService.init("Description", "Add job description for " + position, "" ,"");
            popupService.showPrompt(this, function() {
                $scope.positions[position].description = popupService.getResult();
                $scope.selectedPosition = position;
                savePosition(position);
            });
        }
    };

    $rootScope.$on("tagNotification", function() {
        refreshTags();
    });


    var loadScreen = function() {
        authService.getUserToken(function(idToken) {
            taggingService.resetTags();
            loadPositions(idToken);
        });
    };

    var loadPositions = function(idToken) {
        $http.get('../../position?idToken=' + idToken).success(function(data) {
            data.positions.forEach(function(position, index) {
                var fullName = position.name + getPositionID({type: "Internal", info: position});
                taggingService.loadSavedTags(position.id, idToken,'position');
                refreshTags();
                $scope.positions[fullName] = position;
                $scope.positions[fullName].name = fullName;
            });
        });
    };

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

    var refreshTags = function() {
        $scope.positionData.tags = taggingService.getTags();
        $scope.positionData.selectedTags = taggingService.getSelectedTags();
    };

    loadScreen();
}
