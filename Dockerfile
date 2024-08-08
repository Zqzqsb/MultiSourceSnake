FROM node:18-slim as builder

WORKDIR /app

COPY package.json yarn.lock ./

COPY tsconfig.json ./

COPY packages packages

RUN apt-get update && apt-get install -y python3

RUN apt-get update && apt-get install -y \
    pkg-config \
    libpixman-1-dev


RUN export YARN_CACHE_FOLDER="$(mktemp -d)" \
    && yarn install --frozen-lockfile \
    && rm -r "$YARN_CACHE_FOLDER"

RUN yarn build:action

FROM node:18-slim

WORKDIR /action-release

RUN export YARN_CACHE_FOLDER="$(mktemp -d)" \
    && yarn add canvas@2.11.2 gifsicle@5.3.0 --no-lockfile \
    && rm -r "$YARN_CACHE_FOLDER"

COPY --from=builder /app/packages/action/dist/ /action-release/

CMD ["node", "/action-release/index.js"]

