#
# The builder image.
#
FROM node:18.14-alpine as builder

#
# Set the working directory for the entire project.
#
WORKDIR /usr/src

#
# Copy microservices and library code.
# In a bigger project this copies more than is needed, but at least it's simple.
#
COPY ./ ./

# 
# Set the working directory for the particular microservice.

# Install dependencies
RUN yarn install

# Build application including libraries.
RUN yarn workspace @internal/common build
RUN yarn workspace public-service build

# Create yaml config file for the docker container 
RUN node scripts/create-config-file-dkr.js public-service docker

# Need to only copy the prod dependencies
RUN rm -r node_modules


ENV NODE_ENV=production
# install prod dependencies
RUN yarn install --production=true

#
# The prod image.
#
FROM node:18.14-alpine

WORKDIR /app

# Copy the bundle from the builder image.
COPY --from=builder /usr/src/node_modules ./node_modules
COPY --from=builder /usr/src/packages/common/dist ./packages/common/dist/
COPY --from=builder /usr/src/packages/common/package.json ./packages/common/
COPY --from=builder /usr/src/packages/public-service/dist ./dist/
COPY --from=builder /usr/src/packages/public-service/package.json .
COPY --from=builder /usr/src/packages/public-service/swagger.json .
COPY --from=builder /usr/src/packages/public-service/config/docker-config.yml ./config/docker-config.yml

ENV NODE_ENV=docker
ENV DEPLOY_SHA1=$DEPLOY_SHA1

EXPOSE 3003

CMD [ "yarn", "run", "start:docker" ]