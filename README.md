zkLoans
==================

<img width="360" src="https://user-images.githubusercontent.com/3684187/187057897-65d5a1d2-612f-48f5-a278-e28fa11fe0dd.png">

zkLoans brings confidential Credit Scores. It proves to a counterparty if you meet threshold requirements for a credit score without revealing the precise value. This is made possible using ZK-SNARKS, and could be used for several kinds of applications including unsecured on-chain loans.

Development
===========

Install all dependencies:

    npm run deps-install


Build and deploy the contract to TestNet with a temporary dev account:

    npm run deploy

Test the contract:

    npm test

Run the frontend:

    npm start


Exploring The Code
==================

|Path|Purpose|
|----|-------|
|  [`circuits`](/circuits) |  Circom ZK circuits   |
|  [`contract`](/contract) |  Near Rust contract  |
|  [`contract/src/lib.rs`](contract/src/lib.rs) |  Contract driver  |
|  [`contract/src/verifier.rs`](contract/src/verifier.rs) |  groth16 ZK-SNARK proof verifier |
|  [`frontend`](frontend) |  App UI exposed to users  |
|  [`prover`](prover) |  groth16 ZK-SNARK proof generator  |
