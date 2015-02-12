/*eslint-env node*/

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    "givenName": String,
    "familyName": String
});

module.exports = mongoose.model("User", UserSchema);
