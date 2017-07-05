function list_position_controller($scope, $http, $location, taggingService, authService) {
    $scope.sortType = 'id'; // set the default sort type
    $scope.sortReverse = false; // set the default sort order
    $scope.searchPositions = ''; // set the default search/filter term
      var mainTags = ['intro', 'skills', 'close', 'inline'];

    $scope.loadPosition = function(index){
       $location.path('/cp')
                .hash(index);
    };

    $scope.deletePosition = function (index, position) {
        authService.getUserToken(function(idToken) {
            $http.delete('../../position/' + position.id + '/tags/?idToken=' + idToken).success(function(){});
            $http.delete('../../position/' + position.id + "?idToken=" + idToken).success(function() {
                loadAllPositions(idToken);
            });
        });
    };

    var loadAllPositions = function(idToken) {
        $http.get('../../position/?idToken=' + idToken).then(function(data) {
            $scope.positions = data.data.positions;
            $scope.positions.forEach(function(p) {
                stringifyTags(p,idToken);
            });
        });
    };

    var stringifyTags = function(position, idToken) {
        position.taglist = "";
        $http.get('../../position/' + position.id + '/tags/?idToken=' + idToken).success(function(data) {
           data.tags.forEach(function(tag) {
                console.log(tag.name);
                position.taglist += tag.name + ", ";
           });
           position.taglist = position.taglist.substring(0, position.taglist.length - 2);
        });
    };

    var loadAllTags = function(idToken) {
        var tags = {};
        $http.get('../../tag?idToken=' + idToken).success(function (data) {
            data.tags.forEach(function(tag) {
                tags[tag.name] = tag;
            });
            addMissingTags(tags);
        });
    };

    var addMissingTags = function(tags) {
        mainTags.forEach(function(tag) {
           if(!tags[tag]) {
               taggingService.createNewTag(tag);
           }
        });
    };


        authService.getUserToken(function(idToken) {
            loadAllPositions(idToken);
            loadAllTags(idToken);
        });

}
