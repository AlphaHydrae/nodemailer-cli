#!/usr/bin/env node
const chalk = require('chalk');
const { isInteger, pick } = require('lodash');
const nodemailer = require('nodemailer');
const yargs = require('yargs');

let transporter;

const cli = yargs
  .scriptName('nodemailer')
  .usage('$0 [options]')
  .option('from', {
    alias: 'f',
    default: process.env.MAIL_FROM,
    demandOption: true,
    describe: 'Email of the sender'
  })
  .option('subject', {
    alias: 's',
    default: process.env.MAIL_SUBJECT || 'Nodemailer',
    describe: 'Subject of the email'
  })
  .option('text', {
    alias: 'x',
    default: process.env.MAIL_TEXT,
    demandOption: true,
    describe: 'Body of the email'
  })
  .option('to', {
    alias: 't',
    default: process.env.MAIL_TO,
    demandOption: true,
    describe: 'Email(s) of the recipient(s), comma-separated if there is more than one'
  })
  .option('smtp-auth-user', {
    alias: 'U',
    default: process.env.SMTP_AUTH_USER,
    describe: 'Username'
  })
  .option('smtp-auth-password', {
    alias: 'P',
    default: process.env.SMTP_AUTH_PASSWORD,
    describe: 'Password'
  })
  .option('smtp-host', {
    alias: 'h',
    default: process.env.SMTP_HOST,
    demandOption: true,
    describe: 'SMTP host address'
  })
  .option('smtp-ignore-tls', {
    coerce: coerceBoolean,
    default: parseConfigBoolean(process.env.SMTP_IGNORE_TLS),
    describe: 'If this is true and smtp-secure is false then TLS is not used even if the server supports STARTTLS extension'
  })
  .option('smtp-port', {
    alias: 'p',
    coerce: coerceInteger,
    default: parseConfigInt(process.env.SMTP_PORT),
    describe: 'SMTP port (defaults to 587 if is secure is false or 465 if true)',
    type: 'number'
  })
  .option('smtp-proxy', {
    default: process.env.SMTP_PROXY,
    describe: 'TCP proxy address'
  })
  .option('smtp-require-tls', {
    coerce: coerceBoolean,
    default: parseConfigBoolean(process.env.SMTP_REQUIRE_TLS),
    describe: 'If this is true and secure is false then Nodemailer tries to use STARTTLS even if the server does not advertise support for it (if the connection can not be encrypted then message is not sent)'
  })
  .option('smtp-secure', {
    coerce: coerceBoolean,
    default: parseConfigBoolean(process.env.SMTP_SECURE),
    describe: 'If true the connection will use TLS when connecting to server, if false (the default) then TLS is used if server supports the STARTTLS extension (in most cases set this value to true if you are connecting to port 465; keep it false for port 587 or 25)'
  })
  .help()
  .parse();

// Mail settings
const mailConfig = pick(cli, 'from', 'subject', 'text', 'to');

// SMTP settings
const smtpConfig = {
  host: cli.smtpHost,
  ignoreTLS: cli.smtpIgnoreTls,
  port: cli.smtpPort,
  proxy: cli.smtpProxy,
  requireTLS: cli.smtpRequireTls,
  secure: cli.smtpSecure
};

// SMTP authentication settings
const auth = {
  user: process.env.SMTP_AUTH_USER,
  pass: process.env.SMTP_AUTH_PASS
};

if (auth.user || auth.pass) {
  smtpConfig.auth = auth;
}

Promise
  .resolve()
  .then(createTransporter)
  .then(() => sendMail(mailConfig))
  .then(info => {
    console.log(chalk.green('Mail sent successfully'));
    console.log();
    console.log(JSON.stringify(info, undefined, 2));
  })
  .catch(err => console.error(chalk.red(err.stack)));

function coerceBoolean(value) {
  if (value !== undefined && String(value).match(/^(?:1|y|yes|t|true)$/i)) {
    return true;
  } else if (value !== undefined && String(value).match(/^(?:0|n|no|f|false)$/)) {
    return false;
  } else {
    throw new Error(`Value "${value}" is not a boolean (use 1/0, yes/no or true/false)`);
  }
}

function coerceInteger(value) {
  if (value === undefined) {
    return;
  }

  const coerced = parseInt(String(value), 10);
  if (value !== undefined && !isInteger(coerced)) {
    throw new Error(`Value "${value}" is not an integer`);
  }

  return coerced;
}

function createTransporter() {
  transporter = nodemailer.createTransport(smtpConfig);
}

function parseConfigBoolean(value, defaultValue = false) {
  return value !== undefined ? !!String(value).match(/^(?:1|y|yes|t|true)$/i) : defaultValue;
}

function parseConfigInt(value, defaultValue) {
  if (value === undefined) {
    return defaultValue;
  }

  const parsed = parseInt(String(value), 10);
  if (isNaN(parsed)) {
    throw new Error(`Value "${value}" is not a number`);
  }

  return parsed;
}

function sendMail(data) {
  return new Promise((resolve, reject) => transporter.sendMail(data, (err, info) => err ? reject(err) : resolve(info)));
}
