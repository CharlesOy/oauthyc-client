/**
 * Created by ouyangcharles on 2016/12/21.
 */

import {Meteor} from 'meteor/meteor';
import {Picker} from 'meteor/meteorhacks:picker';
import {ServiceConfiguration} from 'meteor/service-configuration';
import {HTTP} from 'meteor/http';

import {OAuth2Service} from '../imports/common';

// If the OAuth2 Server is using charlesoy:oauth2-server and
// singleSignOut on both client and server sides are set to true,
// you are able to log out all applications you registered.

const config = ServiceConfiguration.configurations.findOne({
  service: OAuth2Service.name,
});

function logout(token) {
  const result = Meteor.users.update({
    [`services.${OAuth2Service.name}.accessToken`]: token,
  }, {
    $set: {
      'services.resume.loginTokens': [],
    },
  }, {
    multi: true,
  });
  return result + '';
}

Picker.route('/oauthyc/logout/:token', (params, req, res) => {
  res.end(logout(params.token));
});

Meteor.methods({
  'oauthyc.logoutAll'(){
    if (!Meteor.user()) {
      return;
    }
    const {
      services:{
        [OAuth2Service.name]:{
          accessToken
        }
      }
    } = Meteor.user();
    try {
      const logoutServerUrl = config.loginUrl.split('/').slice(0, 3).join('/');
      const logoutAllUrl = [
        `${logoutServerUrl}`,
        '/oauthyc/logout_all/',
        `${accessToken}`,
      ].join('');
      return HTTP.call('GET', logoutAllUrl);
    } catch (e) {
      throw e;
    }
  }
});