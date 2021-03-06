/**
 * Created by ouyangcharles on 2016/12/07.
 */

import winston from 'winston';

import {OAuth} from 'meteor/oauth';
import {ServiceConfiguration} from 'meteor/service-configuration';
import {HTTP} from 'meteor/http';

import {OAuth2Service, checkConfig} from '../imports/common';
import './singleSignOut';

OAuth.registerService(OAuth2Service.name, 2, null, function (query) {
  winston.info(query);

  const config = ServiceConfiguration.configurations.findOne({
    service: OAuth2Service.name
  });
  checkConfig(config);

  const response = getTokenResponse(query, config);
  const accessToken = response.accessToken;
  const userInfo = JSON.parse(getIdentity(accessToken, config));

  const serviceData = {
    id: userInfo[config.idProp || 'id'],
    accessToken: accessToken,
    _OAuthCustom: true,
    expiresAt: (+new Date) + (1000 * response.expiresIn),
    identity: userInfo,
  };

  console.log(serviceData);

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
      config.tokenUrl,
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
    throw new Error(`Failed to complete OAuth handshake ${err.message}`);
  }

  if (!isJSON(responseContent)) {
    throw new Error(`Failed to complete OAuth handshake ${responseContent}`);
  }

  const parsedResponse = JSON.parse(responseContent);
  const accessToken = parsedResponse.access_token;
  const expiresIn = parsedResponse.expires_in;

  if (!accessToken) {
    throw new Error(`Failed to complete OAuth handshake did not receive an oauth token. ${responseContent}`);
  }

  return {
    accessToken: accessToken,
    expiresIn: expiresIn
  };
}

function getIdentity(accessToken, config) {
  try {
    const identity = HTTP.get(
      config.infoUrl,
      {
        params: {
          access_token: accessToken
        }
      }
    );
    return identity.content;
  } catch (err) {
    throw new Error(`Failed to fetch identity from ${config.infoUrl}. ${err.message}`);
  }
}

OAuth2Service.retrieveCredential = function (credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};

export const configOAuth2 = (config, serviceName) => {
  serviceName = serviceName || OAuth2Service.name;
  ServiceConfiguration.configurations.remove({
    service: serviceName,
  });

  ServiceConfiguration.configurations.insert(Object.assign({
    service: serviceName,
  }, config));
};