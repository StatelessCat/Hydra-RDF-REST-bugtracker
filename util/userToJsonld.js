exports.toJsonLD = function (usrJson, urlAPI, urlUser) {
    "use strict";

    if (usrJson) {
        usrJson._doc["@context"] = {"@vocab": "http://schema.org/"};
        usrJson._doc["@type"] = "Person";
        usrJson._doc["@id"] = usrJson._doc._id;

        usrJson._doc._id = {}; // we don't need this anymore
        usrJson._doc.__v = {}; // we don't need this

        usrJson._doc["@id"] = urlAPI + urlUser + '/' + usrJson._doc["@id"];

        return usrJson;
    }
}