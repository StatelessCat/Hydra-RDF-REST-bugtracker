function UserController($scope, $http, $window){
    $scope.users = [{}];

    var parser = parserFactory.getParser({
        contentType:'application/ld+json',
        graph: graph.graph()
    });

    var doc = {
        "@context": "http://json-ld.org/contexts/person.jsonld",
        "@id": "http://dbpedia.org/resource/John_Lennon",
        "name": "John Lennon",
        "born": "1940-10-09",
        "spouse": "http://dbpedia.org/resource/Cynthia_Lennon"
    };

    parser.addChunk(JSON.stringify(doc));

    var aPromise = parser.finalize();

    aPromise.then(function (graph) {
        graph.forEachTriple(null, null, null, console.info.bind(console));
        graph.forEachTriple(null, null, null, function(s, p, o) {
            if (! $scope.users[0]) {
                $scope.users[0] = {};
                $scope.$apply(); // ugly
            } else {
                if ((o['@type']) && (o['@type'].match("^.*string.*$"))) {
                    $scope.users[0][p['@id']] = o['@value'];
                } else {
                    $scope.users[0][p['@id']] = o['@id'];
                }

                $scope.$apply(); // ugly
            }
        });
    });
}