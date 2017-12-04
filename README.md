wallboard
=========

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

