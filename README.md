# Web Measurement Service Demo (Call-in/Callback)

This repo contains a sample application to demonstrate the
call-in / callback functionality of Web Measurement Service
(WMS)

## Web Measurement Service Guide

Please go through the [NuraLogix™ Web Measurement Service Guide](https://docs.deepaffex.ai/wms/about_guide.html) and then come back to this repo.  The guide will help you to effectively use this repo to create useful working web applications with NuraLogix™ Web Measurement Service (WMS).

## Sample App

The sample app consists of a backend component that obtains an authorization
token from DeepAffex API and a frontend component which uses a simple UI to
collect user information, calls in to WMS and displays the returned results
using a simple UI.

## Build and testing the sample app

### Running for Testing & Development

Note: Please use `yarn` to install dependencies as `npm` causes some
dependency issues.

Please edit the `.env` file to reflect the correct configuration values before
running the sample app.

| Property       | Description                                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| PUBLIC_URL     | Populate only if the app will be run from a sub-path, example: `/subpath` otherwise leave blank                        |
| LICENSE_KEY    | DeepAffex API license (obtain from https://dashboard.deepaffex.ai/)                                                    |
| API_URL        | URL of the DeepAffex API (usually https://api.deepaffex.ai/)                                                           |
| APP_NAME       | Application name used for reporting purposes only (e.g., if more than one app will be calling Web Measurement Service) |
| APP_IDENTIFIER | Application ID used for reporting purposes only (e.g., if more than one app will be calling Web Measurement Service)   |
| CONFIG_ID      | As discussed above, an identifier for the your specific app configuration                                              |

### Steps

```bash
# install dependencies
yarn

# build the client
yarn build:client

# build the server
yarn build:server

# run the app
yarn serve:dev
```

## Sample app details

### REST API

The sample app consists of a back-end responsible for serving pre-built static
assets, as well as REST endpoints to save the config ID and generate a
DeepAffex token.

```url
/health
```

Used to check the health of the backend, required for deployment checks

```url
/api/configId
```

Returns the application specific configuration ID, this is a fixed value
provided by Nuralogix.

```url
/api/token
```

Returns a DeepAffex authorization token, this token is then passed to the
front-end which passes it to the WMS for DeepAffex licensing.
