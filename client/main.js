/**
 * Created by ouyangcharles on 2016/12/07.
 */

import _ from 'lodash';

import {ServiceConfiguration} from 'meteor/service-configuration';
import {OAuth} from 'meteor/oauth';
import {Random} from 'meteor/random';

import OAuth2Service from '../imports/common';

OAuth2Service.requestCredential = function (options, credentialRequestCompleteCallback) {
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  // if Meteor.isClient is true,
  // service config is available only in this function(OAuth2Service.requestCredential)
  const config = ServiceConfiguration.configurations.findOne({
    service: OAuth2Service.name
  });

  if (!config) {
    credentialRequestCompleteCallback
    && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError(OAuth2Service.name));
    return;
  }

  if (!config.baseUrl) {
    credentialRequestCompleteCallback
    && credentialRequestCompleteCallback(
      ServiceConfiguration.ConfigError('Service found but it does not have a baseUrl configured.')
    );
  }

  if (!config.loginUrl) {
    credentialRequestCompleteCallback
    && credentialRequestCompleteCallback(
      ServiceConfiguration.ConfigError('Service found but it does not have a loginUrl configured.')
    );
  }

  const credentialToken = Random.secret();

  let requiredScope = ['email'];
  let scope = [];
  if (options.scope)
    scope = options.scope;
  scope = _.union(scope, requiredScope);


  let loginStyle = OAuth._loginStyle(OAuth2Service.name, config, options);

  const loginUrl = config.loginUrl +
    '?response_type=code' +
    '&client_id=' + config.clientId +
    '&redirect_uri=' + OAuth._redirectUri(OAuth2Service.name, config) +
    '&scope=' + scope.join(' ') +
    '&state=' + OAuth._stateParam(loginStyle, credentialToken);

  OAuth.launchLogin({
    loginService: OAuth2Service.name,
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken,
    popupOptions: {height: 600}
  });
};