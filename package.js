Package.describe({
  name: 'charlesoy:oauthyc-client',
  version: '1.0.0',
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
    'accounts-oauth@1.1.15',
    'oauth@1.1.12',
    'oauth2@1.1.11',
    'http@1.2.10',
    'meteorhacks:picker@1.0.3',
    'service-configuration@1.0.11',
  ], [
    'client',
    'server',
  ]);

  api.use('random@1.0.10', 'client');

  api.mainModule('server/main.js', 'server');
  api.mainModule('client/main.js', 'client');
});

Package.onTest(function (api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('charlesoy:oauthyc-client');
  api.mainModule('test/tests.js');
});
