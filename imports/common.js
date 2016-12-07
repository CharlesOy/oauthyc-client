/**
 * Created by ouyangcharles on 2016/12/07.
 */

import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {ServiceConfiguration} from 'meteor/service-configuration';

const OAuth2Service = {};
OAuth2Service.name = 'OAuth2Service';

Accounts.oauth.registerService(OAuth2Service.name);

if (Meteor.isClient) {
  Meteor['loginWith' + OAuth2Service.name] = function (options, callback) {
    callback = callback || options;
    options = callback === undefined ? null : options;
    const credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    OAuth2Service.requestCredential(options, credentialRequestCompleteCallback);
  };
} else {
  Accounts.addAutopublishFields({
    forLoggedInUser: ['services.' + OAuth2Service.name],
    forOtherUsers: []
  });
}

export default OAuth2Service;