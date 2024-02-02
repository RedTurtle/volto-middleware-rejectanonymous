import jwtDecode from 'jwt-decode';

const applyConfig = (config) => {
  const { prefixPath } = config.settings;
  const redirectUrl =
    process.env.RAZZLE_REJECT_ANONYMOUS_REDIRECT_URL || '/login';
  const enabled = process.env.RAZZLE_REJECT_ANONYMOUS || false;

  const loginUrl = prefixPath
    ? `${prefixPath}${redirectUrl}`
    : `/${redirectUrl}`;
  const excludeUrls = prefixPath
    ? `^\\/static|^\\${prefixPath}\\${redirectUrl}`
    : `^\\/static|^\\${redirectUrl}`;

  const defaults = {
    rejectanonymousSettings: {
      userHeaderName: 'REMOTE_USER',
      loginUrl,
      excludeUrls: new RegExp(excludeUrls),
    },
  };
  config.settings = {
    ...config.settings,
    ...defaults,
  };

  if (__SERVER__ && enabled) {
    const express = require('express');
    const middleware = express.Router();
    const settings = config.settings.rejectanonymousSettings;
    middleware.id = 'rejectanonymous-middleware';
    middleware.all('*', (req, res, next) => {
      if (!req.url.match(settings.excludeUrls)) {
        const token = req.universalCookies.get('auth_token');
        // TODO: anzichè redirect potrebbe essere settato un nuovo cookie di
        // autenticazione con un token valido per l'utente
        if (!token) {
          return res.redirect(`${settings.loginUrl}?came_from=${req.url}`);
        }
        if (token && settings?.userHeaderName) {
          const user = req.get(settings.userHeaderName);
          // require auth if:
          // - header user is different from token user
          // - token has no expiration
          // - token is expired
          console.log(jwtDecode(token));
          console.log("jwtDecode(token).sub !== user => ", jwtDecode(token).sub !== user);
          console.log("!jwtDecode(token).exp => ", !jwtDecode(token).exp);
          console.log("jwtDecode(token).exp < Date.now() / 1000) => ", jwtDecode(token).exp < Date.now() / 1000));
          console.log("espressione finale: ", (jwtDecode(token).sub !== user || !jwtDecode(token).exp || jwtDecode(token).exp < Date.now() / 1000));
          if (user && jwtDecode(token).sub !== user) {
            return res.redirect(`${settings.loginUrl}?came_from=${req.url}`);
          }
          //if (jwtDecode(token).sub !== user || !jwtDecode(token).exp || jwtDecode(token).exp < Date.now() / 1000){
          //  // TODO: eventually add base_url to a relative settings.loginUrl
          //  return res.redirect(`${settings.loginUrl}?came_from=${req.url}`);
          //}

        }
      }
      return next();
    });
    config.settings.expressMiddleware = [
      ...config.settings.expressMiddleware,
      middleware,
    ];
  }
  return config;
};

export default applyConfig;
