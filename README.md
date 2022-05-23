# volto-middleware-rejectanonymous

[Volto](https://github.com/plone/volto) add-on

## Features

[rejectanonymous](https://rejectanonymousjs.github.io/) middleware

Demo GIF

## Getting started

### Try volto-addon-template with Docker

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

### Add volto-addon-template to your Volto project

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

## Release

See [RELEASE.md](https://github.com/collcetive/volto-middleware-rejectanonymous/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/collcetive/volto-middleware-rejectanonymous/blob/master/DEVELOP.md).

## Copyright and license

See [LICENSE.md](https://github.com/collcetive/volto-middleware-rejectanonymous/blob/master/LICENSE.md) for details.
