# HealthBlock

## Setup

1. `git clone https://github.com/varunalla/HealthBlock.git`
2. run the following command inside root and client
   `yarn install`
   `npm install pnpm -g`
3. install and start ganache
4. run the truffle migrate from inside the project root.
   `truffle migrate`
5. run the type check to generate types for react.
   `yarn typecheck`
6. create .env.development and .env.production in the client directory with the following content and replace value with deployed healthblock contract address.
   `REACT_APP_HEALTHBLOCK_ADDRESS=value`
   `REACT_APP_PROVIDER_ADDRESS=value`
7. create .env in the root directory with the following content 
 `AWS_ACCESS_KEY_ID=your-key`
`AWS_SECRET_ACCESS_KEY=your-secret`
`AWS_REGION=value`
`REACT_APP_AWS_ACCESS_KEY_ID=your-key`
`REACT_APP_AWS_SECRET_ACCESS_KEY=your-secret`
`REACT_APP_AWS_REGION=your-region`
`REACT_APP_BUCKET_NAME=your-region`
`REACT_APP_BUCKET_KEYS=your-bucket`
`REACT_APP_BUCKET_ENCRYPT=your -bucket`
`REACT_APP_BUCKET_REENCRYPT=your-bucket`
`REACT_APP_BUCKET_RECORDS=your-bucket`
`REACT_APP_BUCKET_RECORDS_DOCTOR=your-bucket`
`PYTHON_HOST=value`
`AWS_ACCESS_KEY_ID_FOR_SES=your-key`
`AWS_SECRET_ACCESS_KEY_FOR_SES=your-secret`
8. build the client using
   `yarn build`
   or
   `REACT_APP_HEALTHBLOCK_ADDRESS=VALUE1 REACT_APP_PROVIDER_ADDRESS=VALUE2 yarn build `
9. run the server with below command by replacing value with deployed healthblock contract address.
   `npm install -g pino-pretty`
   `HEALTHBLOCK_ADDRESS=value node server.js | pino-pretty`

10. Python Backend : pip/pip3 and python/python3
   `pip install -r requirements.txt`
   `python server.py`

## Known Issues:

1. for apple arm versions
   `arch -x86_64 zsh`
   then install the nvm
   use nvm 16.15
