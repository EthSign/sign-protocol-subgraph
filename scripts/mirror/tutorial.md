# Mirror Tutorial

This is a tutorial on how to use goldsky mirror.

## Get a goldsky API key

Use an exists API Key or create a new api key at [goldsky website setting page](https://app.goldsky.com/dashboard/settings)

## Install goldsky cli and login in

**install goldsky cli command**

```bash
curl -fsSL https://cli.goldsky.com/install | bash
```

**Login in**

```bash
goldsky login
```

## Create or use an exists schema for goldsky mirror

## Create a secret to connect to the postgresql database

**example command:**

```bash
goldsky secret create --name <SECRETE_NAME> --value '{
  "type": "jdbc",
  "protocol": "postgresql",
  "host": "<host>",
  "port": <port>,
  "databaseName": "<databaseName>",
  "user": "<username>",
  "password": "<password>"
}'
```

## Add `.env` file to the root of the project, content is as follows:
**example command:**
```
MIRROR_DB_SECRET_NAME='<SECRETE_NAME>'
MIRROR_DB_SCHEMA='<schemaName>'
```

## Build mirror pipeline config file

- **for testnet**
  ```bash
  pnpm mirror:build:testnet
  ```
- **or for mainnet**
  ```bash
  pnpm mirror:build:mainnet
  ```

## Publish mirror pipeline config file

- **for testnet**
  ```bash
  pnpm mirror:apply:testnet
  ```
- **or for mainnet**
  ```bash
  pnpm mirror:apply:mainnet
  ```

## Start pipeline

- **for testnet**
  ```bash
  goldsky pipeline start sp-mirror-testnet
  ```
- **or for mainnet**
  ```bash
  goldsky pipeline start sp-mirror-mainnet
  ```

