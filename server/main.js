/**
 * Created by ouyangcharles on 2016/12/07.
 */

import {OAuth} from 'meteor/oauth';
import {ServiceConfiguration} from 'meteor/service-configuration';
import {HTTP} from 'meteor/http';

import OAuth2Service from '../imports/common';

OAuth.registerService(OAuth2Service.name, 2, null, function (query) {
  const config = ServiceConfiguration.configurations.findOne({
    service: OAuth2Service.name
  });

  if (!config) {
    throw new ServiceConfiguration.ConfigError(OAuth2Service.name);
  }

  if (!config.baseUrl) {
    throw new ServiceConfiguration.ConfigError('Service found but it does not have a baseUrl configured.');
  }

  if (!config.loginUrl) {
    throw new ServiceConfiguration.ConfigError('Service found but it does not have a loginUrl configured.');
  }

  const response = getTokenResponse(query, config);
  const accessToken = response.accessToken;
  const userInfo = JSON.parse(getIdentity(accessToken, config));

  const serviceData = {
    id: userInfo.id,
    accessToken: accessToken,
    expiresAt: (+new Date) + (1000 * response.expiresIn),
    identity: userInfo,
  };

  return {
    serviceData: serviceData,
    options: {
      profile: {
        name: userInfo.name,
        email: userInfo.email,
      }
    }
  };
});

function isJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

function getTokenResponse(query, config) {
  let responseContent;
  try {
    responseContent = HTTP.post(
      config.baseUrl + '/oauth/token',
      {
        params: {
          grant_type: 'authorization_code',
          code: query.code,
          client_id: config.clientId,
          client_secret: OAuth.openSecret(config.secret),
          redirect_uri: OAuth._redirectUri(OAuth2Service.name, config)
        }
      }
    ).content;
  } catch (err) {
    throw new Error('Failed to complete OAuth handshake\n\n' + err.message);
  }

  if (!isJSON(responseContent)) {
    throw new Error('Failed to complete OAuth handshake' + responseContent);
  }

  const parsedResponse = JSON.parse(responseContent);
  const accessToken = parsedResponse.access_token;
  const expiresIn = parsedResponse.expires_in;

  if (!accessToken) {
    throw new Error('Failed to complete OAuth handshake\n\
      did not receive an oauth token.\n' + responseContent
    );
  }

  return {
    accessToken: accessToken,
    expiresIn: expiresIn
  };
}

function getIdentity(accessToken, config) {
  const fetchUrl = config.baseUrl + '/account';
  try {
    const identity = HTTP.get(
      fetchUrl,
      {
        params: {
          access_token: accessToken
        }
      }
    );
    return identity.content;
  } catch (err) {
    throw new Error('Failed to fetch identity from ' + fetchUrl + '. ' + err.message);
  }
}

OAuth2Service.retrieveCredential = function (credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};

export default OAuth2Service;