// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by oauthyc-client.js.
import { name as packageName } from "meteor/charlesoy:oauthyc-client";

// Write your tests here!
// Here is an example.
Tinytest.add('oauthyc-client - example', function (test) {
  test.equal(packageName, "oauthyc-client");
});
