function UserController($scope, $http, $window){
    $scope.users = [];

    var ns = rdfNode.namespace('http://ex.co/vocab#');

    var bc = coreFactory.getCore("http://localhost:8080/api/user/54d357ea2f6af8e974000001");

    bc.getState().then(function(g) {
        serializerJsonLd.jsonld(g).then(function(jsonldDoc) {
            console.log(jsonldDoc);
            $scope.users.push(jsonldDoc);
            $scope.$apply();
        }, function(err) {console.log(err);}).done();
    }).done();

}