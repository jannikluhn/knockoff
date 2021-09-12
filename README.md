# Interface

In the `interface/` subdirectory:

- Run `npm install`
- Run `npm run serve`

In the `corsproxy/` subdirectory:

- Run `npm install`
- Run `npm start`

Now, the dapp interface is served at [http://localhost:8080/]().

# Contracts

The contracts are in the `contracts/` subdirectory. Run `npm install`
to install the dependencies. To deploy the contracts, first create a
`.env` file containing your Infura project ID as well as the private
keys used for deployment as illustrated in `.env.example`. Then, run
`npx hardhat deploy --network <network>`. Available networks are
configured in `hardhat.config.js`. The resulting contract addresses
should be recorded in `interface/src/chains.js` as well as
`subgraphs/subgraphs.json`. When the contract interface is changed,
the ABI should be copied to `interface/src/assets/` and
`subgraphs/abis/`.

The subgraph definitions are stitched together based on templates to
simplify deployment on many chains. The base files are

- `subgraphs/subgraphs.json`
- `subgraphs/schema.graphql`
- `subgraphs/src/mapping.ts`
- everything in `subgraphs/templates`

To build and deploy everything on all chains, run `make deploy`.
