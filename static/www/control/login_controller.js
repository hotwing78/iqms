/**
 * Created by nick on 4/12/16.
 */
/**
 * Created by nick on 3/31/16.
 */

function login_controller($scope, $http, userService, authService, $location) {
    $scope.create = false;
    $scope.emailReset = 0;
    
    $scope.user = {
        email: "",
        password: ""
    };
    
    $scope.loginUser = function() {
        firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password)
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            })
            .then(function() {
                $location.path("/");
            });
    }
    
    $scope.createUser = function() {
        firebase.auth().createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            })
            .then(function() {
                var user = {
                    name: $scope.user.email,
                    role: "Interviewer"
                };
                userService.setUserRole(user.role);
                authService.getUserToken(function(idToken) {
                    $http.post('/user/?idToken=' + idToken, user).success(function(data) {
                        console.log(data);
                        $location.path("/");
                    });
                });
            });
    }
    
    $scope.resetPassword = function() {
        firebase.auth().sendPasswordResetEmail($scope.user.email).then(function() {
            $scope.emailReset = 2;
          }, function(error) {
            // An error happened.
          });
    }
}