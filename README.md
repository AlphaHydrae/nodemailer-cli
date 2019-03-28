# Nodemailer CLI

Send mails from the command line with [Nodemailer][nodemailer].

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Usage](#usage)
- [Options](#options)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Usage

With [npm][npm]:

```bash
npm install -g nodemailer-cli

nodemailer \
  --from bob@example.com --to alice@example.com \
  --text "Hello Alice" --smtp-host smtp.example.com
```

With [npx][npx]:

```bash
npx nodemailer-cli \
  --from bob@example.com --to alice@example.com \
  --text "Hello Alice" --smtp-host smtp.example.com
```

With [Docker][docker]:

```bash
docker run --rm -it alphahydrae/nodemailer \
  --from bob@example.com --to alice@example.com \
  --text "Hello Alice" --smtp-host smtp.example.com
```



## Options

```
nodemailer [options]

Options:
  --version                 Show version number                        [boolean]
  --from, -f                Email of the sender                       [required]
  --subject, -s             Subject of the email         [default: "Nodemailer"]
  --text, -x                Body of the email                         [required]
  --to, -t                  Email(s) of the recipient(s), comma-separated if
                            there is more than one                    [required]
  --smtp-auth-user, -U      Username
  --smtp-auth-password, -P  Password
  --smtp-host, -h           SMTP host address                         [required]
  --smtp-ignore-tls         If this is true and smtp-secure is false then TLS is
                            not used even if the server supports STARTTLS
                            extension                           [default: false]
  --smtp-port, -p           SMTP port (defaults to 587 if is secure is false or
                            465 if true)                                [number]
  --smtp-proxy              TCP proxy address
  --smtp-require-tls        If this is true and secure is false then Nodemailer
                            tries to use STARTTLS even if the server does not
                            advertise support for it (if the connection can not
                            be encrypted then message is not sent)
                                                                [default: false]
  --smtp-secure             If true the connection will use TLS when connecting
                            to server, if false (the default) then TLS is used
                            if server supports the STARTTLS extension (in most
                            cases set this value to true if you are connecting
                            to port 465; keep it false for port 587 or 25)
                                                                [default: false]
  --help                    Show help                                  [boolean]
```




[docker]: https://www.docker.com
[nodemailer]: https://nodemailer.com
[npm]: https://www.npmjs.com
[npx]: https://www.npmjs.com/package/npx
