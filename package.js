Package.describe({
  name: 'charlesoy:oauthyc-client',
  version: '0.0.1',
  summary: 'A OAuth2 client implementation Meteor package which allows user to configure the details.',
  git: 'https://github.com/CharlesOy/oauthyc-client',
  documentation: 'README.md'
});

Npm.depends({
  lodash: '4.17.2',
  winston: '2.3.0',
});

Package.onUse(function (api) {
  api.versionsFrom('1.4.2.3');
  api.use('ecmascript');

  api.use([
    'meteor-base',
    'accounts-base',
    'accounts-oauth',
    'oauth',
    'oauth2',
    'http',
    'meteorhacks:picker',
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
