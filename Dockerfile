FROM node:10.15.3-alpine

ENV NODE_ENV=production \
    NPM_CONFIG_PRODUCTION=true

WORKDIR /usr/src/app

RUN addgroup nodemailer && \
    adduser -S nodemailer nodemailer && \
    chown -R nodemailer:nodemailer /usr/src/app

USER nodemailer:nodemailer

COPY --chown=nodemailer:nodemailer package.json package-lock.json /usr/src/app/

RUN npm ci

COPY --chown=nodemailer:nodemailer . /usr/src/app/

ENTRYPOINT [ "/usr/src/app/index.js" ]
