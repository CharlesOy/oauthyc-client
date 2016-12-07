# OAuthyc Client

### Description

A OAuth2 client implementation package which allows user to configure the details.

### Documentation

#### Usage

Configure on your oauth2 server, note that redirect_url must be.

```bash
http://your.domain/_oauth/OAuthService
```

Install the package.

```bash
$ meteor add charlesoy:oauthyc-client
```

Use [service-configuration][1] package to do the configuration.

```bash
$ meteor add service-configuration
```

configure the details in some server file (eg. accounts.js).

```javascript
ServiceConfiguration.configurations.remove({
  service: OAuthService.name,
});

ServiceConfiguration.configurations.insert({
  service: OAuthService.name,
  clientId: '${your oauth2 id}',
  scope: [], // oauth2 scopes you ask.
  secret: '${your oauth2 secret}',
  loginUrl: '${your oauth2 authentication URL}',
  tokenUrl: '${where the oauth2 client gets token}',
  infoUrl: '${where the oauth2 client gets user information}',
  loginStyle: 'redirect', // can only be 'redirect' or 'popup'
  idProp: 'id', // by default, 'id' will be used
});
```

Usage in client code, if you are not logged in, code below will force you going to your oauth2 server for authentication. 

```javascript
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import 'meteor/charlesoy:oauthyc-client';

// ...

if (Accounts.loginServicesConfigured() || !Meteor.user()) {
  const loginWithService = Meteor[`loginWith${Accounts.oauth.serviceNames()[0]}`];
  loginWithService({}, function (err) {
    // deal with the error
  });
}
```

### Licence

MIT

[1]: https://atmospherejs.com/meteor/service-configuration