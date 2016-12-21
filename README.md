# OAuthyc Client

### Description

A OAuth2 Client implementation Meteor package with single-sign-on & single-sign-out.

**Single-sign-out** is supported if your OAuth2 Server is using [charlesoy:oauthyc-server][1] and all your OAuth2 Clients are using charlesoy:oauthyc-client.

### Documentation

#### Installation

Install the package.

```bash
$ meteor add charlesoy:oauthyc-client
```

#### Configure OAuth2 Server

Configure on your oauth2 server, **note that redirectUrl path must be 'http<span></span>://.../_oauth/OAuthService'**.

```bash
import {configOAuth2} from 'meteor/charlesoy:oauthyc-server';

configOAuth2({
  service: 'OAuth2Service',
  clientId: 'EFyn3MxgPWJpzgrj4',
  clientSecret: 'D4_coHrw96QJjeMVqNRYA0BzmsOVCNLM6Vp4tdjkJOU',
  redirectUrl: 'http://localhost:3000/_oauth/OAuth2Service',

  // OPTIONAL
  singleSignOut: false, // false by default.
});
```

#### Configure OAuth2 Client

configure the details in some server file on your oauth2 client side(eg. accounts.js).

Here is an example.

```javascript
import {configOAuthyc} from 'meteor/charlesoy:oauthyc-client';

configOAuthyc({
  clientId: 'EFyn3MxgPWJpzgrj4',
  secret: 'D4_coHrw96QJjeMVqNRYA0BzmsOVCNLM6Vp4tdjkJOU',
  loginUrl: 'http://localhost:3100/oauth/authorize',
  tokenUrl: 'http://localhost:3100/oauth/token',
  infoUrl: 'http://localhost:3100/account',

  // OPTIONAL
  loginStyle: 'redirect', // can only be 'redirect' or 'popup', by default, it's 'redirect'.
  idProp: 'id', // by default, 'id' will be used.
});
```

#### Authorization

Put the code below into some client file, and if you are not logged in, it will force you going to your oauth2 server for authentication. 

```javascript
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';

// ...

if (Accounts.loginServicesConfigured() && !Meteor.user()) {
  const loginWithService = Meteor[`loginWith${Accounts.oauth.serviceNames()[0]}`];
  loginWithService({}, function (err) {
    // handle the error
  });
}
```

#### Logout

Call logoutAll() in client code (of OAuth2 Client Application) to sign out all applications registered on OAuth2 server.

```javascript
import {logoutAll} from 'meteor/charlesoy:oauthyc-client'; 

// ...

logoutAll();
```

Or if you don't want to use single-sign-out, just use ```Meteor.logout();```.

### Licence

MIT

[1]: https://atmospherejs.com/charlesoy/oauthyc-server