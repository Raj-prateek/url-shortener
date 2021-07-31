# URL-Shortener [![Node.js CI](https://github.com/prateek-raj/url-shortener/actions/workflows/main.yaml/badge.svg)](https://github.com/prateek-raj/url-shortener/actions/workflows/main.yaml)

## Local

### Setup

- [x] Clone the repo on local.
- [x] Run command `npm install` to install all the dependencies.

### Run

- [x] Run command `node .` to run the application.
- [x] Open http://localhost:3000/explorer to open the swagger.

### Test & Lint

- [x] Run command `npm run test` to run the all test & lint checks.


## Docker [prateek9958/url-shortener](https://hub.docker.com/repository/docker/prateek9958/url-shortener/)

### Build

```
 docker build -t url-shortener .
```

### Run

```
 docker run --name url-shortener -p 3000:3000 url-shortener
```

