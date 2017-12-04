wallboard
=========

**Hello there 😊 you are a little early. This README is not finished yet, as
this package is still in beta.**

---

What is **wallboard**? This is a simple build status server, showing builds from
a specified Jenkins server.

Currently only Jenkins is supported. If you wish to have support for a specific
CI/CD, you can vote for it [here](https://github.com/lumio/wallboard/issues/1).

---

Install `wallboard` globally using

```
yarn global add wallboard
# or
npm i -g wallboard
```

Run it using

```
wallboard -c config.json
```

---

Example `config.json` file

```
{
  "ci": "https://jenkins",
  "whitelist": [ "pattern1", "pattern2" ],
  "filter": [ "pattern2" ]
}
```

