import jwtDecode from 'jwt-decode';

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');

const applyConfig = (config) => {
  const redirectUrl =
    process.env.RAZZLE_REJECT_ANONYMOUS_REDIRECT_URL || '/login';
  const _logoutUrl =
    process.env.RAZZLE_REJECT_ANONYMOUS_LOGOUT_URL || '/logout';
  const enabled = process.env.RAZZLE_REJECT_ANONYMOUS || false;

  const normalizedRedirectUrl = redirectUrl.startsWith('/')
    ? redirectUrl
    : `/${redirectUrl}`;

  const normalizedLogoutUrl = _logoutUrl.startsWith('/')
    ? _logoutUrl
    : `/${_logoutUrl}`;

  const defaults = {
    rejectanonymousSettings: {
      userHeaderName: 'REMOTE_USER',
      loginUrl: normalizedRedirectUrl,
      logoutUrl: normalizedLogoutUrl,
    },
  };
  config.settings = {
    ...config.settings,
    ...defaults,
  };

  if (__SERVER__ && enabled) {
    const express = require('express');
    const middleware = express.Router();
    middleware.id = 'rejectanonymous-middleware';
    middleware.all('*', (req, res, next) => {
      // prefixPath is an old implementation of the new subpathPrefix setting
      // left here for backwards compatibility
      const { prefixPath, subpathPrefix } = config.settings;
      const prefix = prefixPath || subpathPrefix;
      const settings = config.settings.rejectanonymousSettings;
      const { loginUrl, logoutUrl, excludeUrls } = settings;

      // Normalize prefix: strip trailing slash(es) to avoid double slashes
      let normalizedPrefix = prefix || '';
      while (normalizedPrefix.endsWith('/')) {
        normalizedPrefix = normalizedPrefix.slice(0, -1);
      }

      const prefixedLoginUrl = normalizedPrefix
        ? `${normalizedPrefix}${loginUrl}`
        : loginUrl;

      const prefixedLogoutUrl = normalizedPrefix
        ? `${normalizedPrefix}${logoutUrl}`
        : logoutUrl;

      const defaultExcludeUrls = `^\\/static|^${escapeRegExp(prefixedLoginUrl)}|^${escapeRegExp(prefixedLogoutUrl)}`;

      const regExp =
        excludeUrls instanceof RegExp
          ? excludeUrls
          : new RegExp(excludeUrls || defaultExcludeUrls);

      if (!req.url.match(regExp)) {
        const token = req.universalCookies.get('auth_token');
        // TODO: anzichè redirect potrebbe essere settato un nuovo cookie di
        // autenticazione con un token valido per l'utente
        if (!token) {
          return res.redirect(`${prefixedLoginUrl}${prefixedLoginUrl.includes('?') ? '&' : '?'}came_from=${encodeURIComponent(req.originalUrl || req.url)}`);
        }
        if (token && settings?.userHeaderName) {
          const user = req.get(settings.userHeaderName);
          // require auth if:
          // - header user is different from token user
          // - token has no expiration
          // - token is expired
          if (
            (user && jwtDecode(token).sub !== user) ||
            !jwtDecode(token).exp ||
            jwtDecode(token).exp < Date.now() / 1000
          ) {
            // TODO: eventually add base_url to a relative settings.loginUrl
            return res.redirect(`${prefixedLoginUrl}${prefixedLoginUrl.includes('?') ? '&' : '?'}came_from=${encodeURIComponent(req.originalUrl || req.url)}`);
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
