# OAuthyc Client

### Description

A OAuth2 client implementation Meteor package which allows user to configure the details.

**Note that this package doesn't support scope configuration for now**.

### Documentation

#### Installation

Install the package.

```bash
$ meteor add charlesoy:oauthyc-client
```

Use [service-configuration][1] package to do the configuration.

There is no need to add package service-configuration explicitly for it has already been added in charlesoy:oauthyc-client.

#### Configuration

Configure on your oauth2 server, **note that redirect_uri path must be 'http<span></span>://.../_oauth/OAuthService'**.

```bash
http://your.domain/_oauth/OAuthService
```

configure the details in some server file on your oauth2 client side(eg. accounts.js).

```javascript
import {ServiceConfiguration} from 'meteor/service-configuration';
import OAuthService from 'meteor/charlesoy:oauthyc-client';

ServiceConfiguration.configurations.remove({
  service: OAuthService.name,
});

ServiceConfiguration.configurations.insert({
  service: OAuthService.name,
  clientId: 'auth2 id string',
  scope: [], // oauth2 scopes you ask.
  secret: 'oauth2 secret string',
  loginUrl: 'http://your/oauth2/authentication/URL',
  tokenUrl: 'http://where/the/oauth2/client/gets/token',
  infoUrl: 'http://where/the/oauth2/client/gets/user/information',
  loginStyle: 'redirect', // can only be 'redirect' or 'popup', by default, it is 'redirect'
  idProp: 'id', // by default, 'id' will be used
});
```

#### Usage

Put these code into some client file, if you are not logged in, it will force you going to your oauth2 server for authentication. 

```javascript
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import 'meteor/charlesoy:oauthyc-client';

// ...

if (Accounts.loginServicesConfigured() && !Meteor.user()) {
  const loginWithService = Meteor[`loginWith${Accounts.oauth.serviceNames()[0]}`];
  loginWithService({}, function (err) {
    // handle the error
  });
}
```

### Licence

MIT

[1]: https://atmospherejs.com/meteor/service-configuration