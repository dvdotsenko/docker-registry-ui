/*
 * Copyright (C) 2016  Jones Magloire @Joxit
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var registryUI = {}
registryUI.URL_QUERY_PARAM_REGEX = /[&?]url=/;
registryUI.URL_PARAM_REGEX = /^url=/;

registryUI.url = function(byPassQueryParam) {
  if (!registryUI._url) {
    var url = registryUI.getUrlQueryParam();
    if (url) {
      try {
        registryUI._url = registryUI.decodeURI(url);
        return registryUI._url;
      } catch (e) {
        console.log(e);
      }
    }
    registryUI._url = registryUI.getRegistryServer(0);
  }
  return registryUI._url;
}
registryUI.getRegistryServer = function(i) {
  try {
    var res = JSON.parse(localStorage.getItem('registryServer'));
    if (res instanceof Array) {
      return (!isNaN(i)) ? res[i] : res.map(function(url) {
        return url.trim().replace(/\/*$/, '');
      });
    }
  } catch (e) {}
  return (!isNaN(i)) ? '' : [];
}
registryUI.addServer = function(url) {
  var registryServer = registryUI.getRegistryServer();
  url = url.trim().replace(/\/*$/, '');
  var index = registryServer.indexOf(url);
  if (index != -1) {
    return;
  }
  registryServer.push(url);
  if (!registryUI._url) {
    registryUI.updateHistory(url);
  }
  localStorage.setItem('registryServer', JSON.stringify(registryServer));
}
registryUI.changeServer = function(url) {
  var registryServer = registryUI.getRegistryServer();
  url = url.trim().replace(/\/*$/, '');
  var index = registryServer.indexOf(url);
  if (index == -1) {
    return;
  }
  registryServer.splice(index, 1);
  registryServer = [url].concat(registryServer);
  registryUI.updateHistory(url);
  localStorage.setItem('registryServer', JSON.stringify(registryServer));
}
registryUI.removeServer = function(url) {
  var registryServer = registryUI.getRegistryServer();
  url = url.trim().replace(/\/*$/, '');
  var index = registryServer.indexOf(url);
  if (index == -1) {
    return;
  }
  registryServer.splice(index, 1);
  localStorage.setItem('registryServer', JSON.stringify(registryServer));
  if (url == registryUI.url()) {
    registryUI.updateHistory(registryUI.getRegistryServer(0));
    route('');
  }
}

registryUI.updateHistory = function(url) {
  history.pushState(null, '', (url ? '?url=' + registryUI.encodeURI(url) : '?') + window.location.hash);
  registryUI._url = url;
}

registryUI.getUrlQueryParam = function () {
  var search = window.location.search;
  if (registryUI.URL_QUERY_PARAM_REGEX.test(search)) {
    var param = search.split(/^\?|&/).find(function(param) {
      return param && registryUI.URL_PARAM_REGEX.test(param);
    });
    return param ? param.replace(registryUI.URL_PARAM_REGEX, '') : param;
  }
};

registryUI.encodeURI = function(url) {
  return url.indexOf('&') < 0 ? window.encodeURIComponent(url) : btoa(url);
};

registryUI.decodeURI = function(url) {
  return url.startsWith('http') ? window.decodeURIComponent(url) : atob(url);
};

registryUI.isImageRemoveActivated = true;
registryUI.catalog = {};
registryUI.taglist = {};

riot.mount('*');
