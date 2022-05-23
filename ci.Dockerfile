FROM plone/volto-addon-ci
USER root
COPY . /opt/frontend/my-volto-project/src/addons/volto-middleware-rejectanonymous
RUN mkdir /opt/frontend/my-volto-project/src/addons/volto-middleware-rejectanonymous/node_modules && \
     chown node:node /opt/frontend/my-volto-project/src/addons/volto-middleware-rejectanonymous/node_modules
USER node
