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
7. build the client using
   `yarn build`
8. run the server with below command by replacing value with deployed healthblock contract address.
   `HEALTHBLOCK_ADDRESS=value node server.js`
9. Create .env file and update AWS credentials.
   AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
   AWS_SECRET_ACCESS_KEY=YOUR SECRET_KEY
   AWS_REGION=YOUR_REGION

## Known Issues:

1. for apple arm versions
   `arch -x86_64 zsh`
   then install the nvm
   use nvm 16.15
