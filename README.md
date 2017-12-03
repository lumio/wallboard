wallboard
=========

**Whoups! You are a little early. This is going to be an npm package. So
hold tight** 🙃

Example `config.json` file

```
{
  "ci": {
    "type": "jenkins",
    "url": "https://jenkins",
    "options": {
      "whitelist": "keyword1|keyword2",
      "filter": "keyword1|keyword2"
    }
  }
}
```

---

Build the package with `yarn build`, add `config.json`
and start server with `yarn server`
