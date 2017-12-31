# wallboard

![wallboard screenshot](https://github.com/lumio/wallboard/blob/develop/media/wallboard.png?raw=true)

This is a simple build status monitor server, allowing you to see the current
build status of your Jenkins instance.

Currently only Jenkins is supported, but if you wish to have support for other
CIs/CDs, feel free to vote [here](https://github.com/lumio/wallboard/issues/1).

## Install

Install `wallboard` globally using

```
yarn global add wallboard
# or
npm i -g wallboard
```

## Run

Run it using

```
wallboard -c config.json
```

**You might want to use [pm2](https://www.npmjs.com/package/pm2) to run it as a
daemon in the background though.**

## Config file

Example `config.json` file

```
{
  // Set the URL to your Jenkins instance
  "ci": "https://jenkins",

  // Either use whitelist to only show jobs with a certain
  // substring in their name
  "whitelist": [ "pattern1", "pattern2" ],

  // or use blacklist to filter out certain jobs
  "blacklist": [ "pattern1", "pattern2" ],

  // Events allow you to run certain commands or call any
  // API when a job is starting or finishes.
  // These two events are called build-start and build-finish.
  "events": {
    "build-finish": {
      "all": "command or url that always runs when build finished",
      "successful": "command or url on a successful build",
      "failed": "command or url when job failed"
    },

    "build-start": {
      "all": "command or url"
    },

    // Adding :<job-name> to the event will override the
    // default event
    "build-finish:job-name": {
      "successful": "command or url on success"
    }

  }
}
```
