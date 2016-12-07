Package.describe({
  name: 'charlesoy:oauthyc-client',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'A OAuth2 client implementation package which allows user to configure the details.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/CharlesOy/oauthyc-client',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  lodash: '4.17.2',
});

Package.onUse(function (api) {
  api.versionsFrom('1.4.2.3');
  api.use('ecmascript');

  api.use([
    'accounts-base',
    'accounts-oauth',
    'oauth',
    'oauth2',
    'http',
    'service-configuration',
  ], [
    'client',
    'server',
  ]);

  api.use('random', 'client');

  api.mainModule('server/main.js', 'server');
  api.mainModule('client/main.js', 'client');

});

Package.onTest(function (api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('charlesoy:oauthyc-client');
  api.mainModule('test/tests.js');
});
