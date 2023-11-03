ARG WORK_DIR="/app"

# Stage 1 - the client build
FROM node:12 as base-client

ARG WORK_DIR
WORKDIR ${WORK_DIR}

COPY package.json yarn.lock config-overrides.js ./
RUN yarn install --frozen-lockfile

COPY public ./public
COPY src ./src

COPY tsconfig.json ./

RUN npm run build:client

# Stage 2 - the server build
FROM node:12 as base-server

ARG WORK_DIR
WORKDIR ${WORK_DIR}

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY server ./server

COPY tsconfig.json ./

RUN npm run build:server

# Stage 3 - the production environment
FROM node:12-slim as deploy

ARG WORK_DIR
WORKDIR ${WORK_DIR}

COPY --from=base-client ${WORK_DIR}/build ./build
COPY --from=base-server ${WORK_DIR}/server/dist .

RUN yarn install

COPY init.sh .
RUN chmod +x init.sh

ENTRYPOINT ["./init.sh"]
