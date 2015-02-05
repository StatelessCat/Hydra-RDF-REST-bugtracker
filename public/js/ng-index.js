
function UserController($scope, $http){
    $scope.users = [];

    $http.get('http://localhost:8080/api/user')
        .success(function(data, status, headers, config) {
            $scope.users = data;
        })
        .error(function(data, status, headers, config) {
        });
}