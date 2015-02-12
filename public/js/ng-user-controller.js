/*eslint-env browser, node*/
/*global coreFactory:false, serializerFactory:false, parserFactory:false */
/*global graph:false */
/*global angular:false */

//noinspection Eslint
function UserController($scope) {
    "use strict";
    $scope.triples = []; // Here it's a JSON-LD

    $scope.submit = function() {
        if (($scope.newSubject) && ($scope.newPredicate) && ($scope.newObject)) {
            console.log($scope.newSubject);
            console.log($scope.newPredicate);
            console.log($scope.newObject);

            var ressource = coreFactory.getCore("http://localhost:8080/api/user/54da8d9d0f7c387641739640");
            ressource.edit(function(graph) {
                var ns = rdfNode.namespace("http://ex.co/vocab#");
                return graph.addTriple( rdfNode.iri('http://champin.net/#pa'), ns($scope.newPredicate), ns($scope.newObject));
            }).then(function(g) {
                console.log("----\n");
                return serializerNTriples.nt(g, console.log);
            }).catch(function(reason){
                console.log(reason);
            });
        }
    };

    var bc = coreFactory.getCore("http://localhost:8080/api/user/54da8d9d0f7c387641739640");

    bc.getState()
        .then(function(g) {
            // Here we have an in-memory graph representation
            var strJson = "";

            // Creating an instance of the serialiser from the factory
            var serialiser = serializerFactory.getSerializer({
                contentType: "application/ld+json",
                graph: g
            });

            // Serialising the Graph to JSON-LD
            return serialiser(function(line) {
                strJson += line; // Chunks of JSON-LD here !
            }).then(function() {

                console.log("JSONLD REPRESENTATION:");

                // strJson contains the full JSON-LD
                // we hope it's the same as the original one
                console.log(strJson);
                angular.fromJson(strJson).forEach(function(e) {
                    var json = {};
                    json.subject = e["@id"];
                    for (var key in e) {
                        if (e.hasOwnProperty(key) && key !== "@id") {
                            json.predicate = key;
                            if (e[key]["@value"]) {
                                json.object = e[key]["@value"];
                            } else {
                                json.object = e[key]["@id"];
                            }
                        }
                    }
                    $scope.triples.push(json);
                });

                $scope.$apply(); // ugly

            // OPTIONAL, juste because i want ntriples
            // We can use the g that you have before,
            // but we can do a round trip:
            // the new JSON-LD -> GRAPH -> NTRIPLES

                var parser = parserFactory.getParser({
                    contentType: "application/ld+json", // it take Json-LD
                    graph: graph.graph()               // to construct a graph()
                });

                parser.addChunk(strJson); // Fill it with the whole Json-LD
                return parser.finalize();

            }).then(function(parsedGraph) {

                // Creating an instance of the serialiser from the factory
                var nTriplesSerialiser = serializerFactory.getSerializer({
                    contentType: "application/n-triples",
                    graph: parsedGraph
                });

                console.log("NTRIPLE REPRESENTATION:");

                return nTriplesSerialiser(function(line) {
                    console.log(line);
                });
            });
        }).catch(function(reason) {
            console.log(reason);
        });
}