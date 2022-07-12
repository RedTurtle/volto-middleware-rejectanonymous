import jwtDecode from 'jwt-decode';

const applyConfig = (config) => {
  const { prefixPath } = config.settings;

  const loginUrl = prefixPath ? `${prefixPath}/login` : '/login';
  const excludeUrls = prefixPath
    ? `^\\/static|^\\${prefixPath}\\/login`
    : '^/static|^/login';

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

  const enabled = process.env.RAZZLE_REJECT_ANONYMOUS || false;

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
          console.log(
            'mando qui: ',
            `${settings.loginUrl}?came_from=${req.url}`,
          );
          return res.redirect(`${settings.loginUrl}?came_from=${req.url}`);
        }
        if (token && settings?.userHeaderName) {
          const user = req.get(settings.userHeaderName);
          if (user && jwtDecode(token).sub !== user) {
            return res.redirect(`${settings.loginUrl}?came_from=${req.url}`);
          }
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
