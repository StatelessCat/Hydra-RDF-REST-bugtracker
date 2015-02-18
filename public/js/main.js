/*eslint-env amd, browser*/

require.config({
    paths: {
        rdfrestjs: "../components/rdfrestjs/browserified/rdfrest-bundle"
    }
});

define(["rdfrestjs"], function(rdfrestjs) {
    "use strict";

    var getCore = rdfrestjs.coreFactory.getCore;
    var iri = rdfrestjs.rdfNode.iri;
    var namespace = rdfrestjs.rdfNode.namespace;
    var nt = rdfrestjs.serializerNTriples.nt;

    var me = iri("http://champin.net");
    var ns = namespace("http://ex.co/vocab#");

    var ressource = getCore("http://localhost:8080/api/user/54da8d9d0f7c387641739640");

    ressource.getState().then(function(g) {

        // 'cause we cannot use console.log as a function in a browser
        //noinspection Eslint
        return nt(g, console.info.bind(console));

    }).then(function() {

        // then we edit the graph
        return ressource.edit(function(g) {
            return g.addTriple(me, ns("type"), ns("Person"));
        });
    }).then(function() {
        return ressource.edit(function(g2) {
            return g2.addTriple(me, ns("label"), "Pierre-Antoine Champin");
        });
    }).then(function(g) {
        //noinspection Eslint
        console.log("----\n");
        //noinspection Eslint
        return nt(g, console.info.bind(console));
    });
});
