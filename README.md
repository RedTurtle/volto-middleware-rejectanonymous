# volto-middleware-rejectanonymous

[Volto](https://github.com/plone/volto) add-on that reject unconditionnally anonymous users from a Volto site.

They should be redirected to a login form (customizable).

When login management is outside Plone, the first SSR page load is without login headers, so you have to refresh the page to have the proper tokens.

With this middleware, you can force SSR to make a fake call to a Plone view that simply make a redirect (and returns the auth tokens).

## Getting started

### Try volto-middleware-rejectanonymous with Docker

1. Get the latest Docker images

   ```
   docker pull plone
   docker pull plone/volto
   ```

1. Start Plone backend
   ```
   docker run -d --name plone -p 8080:8080 -e SITE=Plone -e PROFILES="profile-plone.restapi:blocks" plone
   ```

1. Start Volto frontend

   ```
   docker run -it --rm -p 3000:3000 --link plone -e ADDONS="volto-middleware-rejectanonymous" plone/volto
   ```

1. Go to http://localhost:3000

### Add volto-middleware-rejectanonymous to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "volto-middleware-rejectanonymous"
   ],

   "dependencies": {
       "volto-middleware-rejectanonymous": "^1.0.0"
   }
   ```

* If not, create one:

   ```
   npm install -g yo @plone/generator-volto
   yo @plone/volto my-volto-project --addon volto-middleware-rejectanonymous
   cd my-volto-project
   ```

1. Install new add-ons and restart Volto:

   ```
   yarn
   yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

### Configuration

This add-on can be enabled with an environment variable `RAZZLE_REJECT_ANONYMOUS`. It is disabled by default.

Default redirect url is `/login` but you can override it with `RAZZLE_REJECT_ANONYMOUS_REDIRECT_URL` environment variable.

## Release

See [RELEASE.md](https://github.com/RedTurtle/volto-middleware-rejectanonymous/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/RedTurtle/volto-middleware-rejectanonymous/blob/master/DEVELOP.md).

## Copyright and license

See [LICENSE.md](https://github.com/RedTurtle/volto-middleware-rejectanonymous/blob/master/LICENSE.md) for details.
