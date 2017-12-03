wallboard
=========

Example `config.json` file

```
{
  "screens": [
    {
      "type": "jenkins",
      "url": "https://jenkins",
      "options": {
        "whitelist": "keyword1|keyword2",
        "filter": "keyword1|keyword2"
      }
    },
    {
      "type": "iframe",
      "url": "http://address"
    }
  ]
}
```

---

Build the package with `yarn build`, add `config.json`
and start server with `yarn server`
