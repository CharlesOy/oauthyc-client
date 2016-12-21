/**
 * Created by ouyangcharles on 2016/12/07.
 */

import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {ServiceConfiguration} from 'meteor/service-configuration';

export const OAuth2Service = {};
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

export const checkConfig = (config) => {
  if (!config) {
    throw new ServiceConfiguration.ConfigError(OAuth2Service.name);
  }
  if (!config.loginUrl) {
    throw new Error('Service found but it does not have a loginUrl configured.');
  }
  if (!config.tokenUrl) {
    throw new Error('Service found but it does not have a tokenUrl configured.');
  }
  if (!config.infoUrl) {
    throw new Error('Service found but it does not have a infoUrl configured.');
  }
  config.loginStyle = config.loginStyle || 'redirect';
  if (config.loginStyle !== 'popup' && config.loginStyle !== 'redirect') {
    throw new Error('loginStyle can only be "popup" or "redirect".');
  }
};