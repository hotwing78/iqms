function index_controller($scope, $rootScope, $window, $location, $route, userService, $mdMedia) {

    $scope.interviewScreen = false;
    $scope.name = null;
    $scope.loginTime = null;
    $scope.userRole = userService.getUserRole();

    var loc = "";

    $scope.logout = function() {
        firebase.auth().signOut().then(function() {
            userService.setUserName(null);
            $scope.loginTime = null;
            window.location.href = '#/login';
          }, function(error) {
            // An error happened.
          });
    };

    $scope.goHome = function() {
        $scope.interviewScreen = false;
        $location.path('/');
    };

    $scope.$on('$routeChangeStart', function() {
        var currentPath = $location.path();
        $scope.userRole = userService.getUserRole();
        if($scope.name) {
            if($location.path() == '/loading')
                    $location.path('/');

            /*if($location.path() == '/conaction') {
                $scope.interviewScreen = true;
            }
            loc = "" + window.location;
            loc = loc.substr(loc.lastIndexOf('#') + 2);
            $scope.interviewScreen = loc.startsWith("conaction");*/
            $scope.interviewScreen = $location.path().startsWith('/conaction');

            $scope.checkScreenSize();

        } else if(!$scope.name && $location.path() != '/login') {
            $location.path("/loading");
            try {
                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        userService.setUserName(user.email);
                        if(currentPath != '/loading') {
                            $route.reload();
                            currentPath = currentPath.startsWith('/conaction') ? '/' : currentPath;
                            $location.path(currentPath);
                            $scope.userRole = userService.getUserRole();
                        }
                    } else {
                        $location.path("/login");
                    }
                });
            } catch(error) {
                switch(error.message) {
                    default:
                        $window.alert('Something went wrong :/');
                        break;
                    case("No Firebase App '[DEFAULT]' has been created - call Firebase App.initializeApp()."):
                        $window.alert('Looks like you tried to refresh! Please use Ctrl + Shift + R (Cmd + Shift + R on Mac) to refresh the page.');
                        break;
                }
            }
        }
    });

    $rootScope.$on('updateName', function() {
       $scope.name = userService.getUserName();
       if ($scope.name) {
            $scope.loginTime = Date.now();
            $scope.$apply();
       }
    });

    $scope.hide_side = function () {
        angular.element('#hidethis').css('visibility', 'hidden');
    };
    $scope.show_side = function () {
        angular.element('#hidethis').css('visibility', 'visible');
    };

    $scope.checkScreenSize = function() {
        var big = $mdMedia('gt-sm');
        if(big) {
            $('.sidebar-collapse').collapse('show');
        } else {
            $('.sidebar-collapse').collapse('hide');
        }
    };

    $scope.$watch(function() {
        return $mdMedia('gt-sm');
    }, $scope.checkScreenSize);
}
