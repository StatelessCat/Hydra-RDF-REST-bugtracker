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

    // inform the Core factory of a ressource
    var BasicCore = rdfrestjs.coreBasic.BasicCore;
    var graph = rdfrestjs.graph.graph;
    var makeIri = rdfrestjs.rdfNode.iri;
    rdfrestjs.coreFactory.register("http://champin.net", function(iri) {
        var g = graph();
        g.addTriple(makeIri(iri),
            makeIri("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
            makeIri("http://www.w3.org/1999/02/22-rdf-syntax-ns#Resource")
        );
        return new BasicCore(iri, g);
    });

    var me = iri("http://champin.net");
    var ns = namespace("http://ex.co/vocab#");
    var ressource = getCore(me);

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
