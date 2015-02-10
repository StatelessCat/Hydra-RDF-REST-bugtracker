/*eslint-env amd, browser*/
/*eslint no-console:0*/

require.config({
    paths: {
        jsonld: "../components/jsonld/js/jsonld"
    }
});

define(["jsonld"], function(jsonld) {
    "use strict";

    var doc = {
        "http://schema.org/name": "Manu Sporny",
        "http://schema.org/url": {"@id": "http://manu.sporny.org/"},
        "http://schema.org/image": {"@id": "http://manu.sporny.org/images/manu.png"}
    };
    var context = {
        "name": "http://schema.org/name",
        "homepage": {"@id": "http://schema.org/url", "@type": "@id"},
        "image": {"@id": "http://schema.org/image", "@type": "@id"}
    };

    // compact a document according to a particular context
    // see: http://json-ld.org/spec/latest/json-ld/#compacted-document-form
    jsonld.compact(doc, context, function(err, compacted) {
        var para = document.createElement("p");
        var node = document.createTextNode(JSON.stringify(compacted, null, 2));
        para.appendChild(node);
        document.body.appendChild(para);
    });
});