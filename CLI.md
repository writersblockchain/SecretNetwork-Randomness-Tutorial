```rust
secretcli query compute query secret14jrkgzfa9ugdphrg5q0pze4s9k2ynt0z694t03 '{"get_flip": {}}'

secretcli tx compute execute secret14jrkgzfa9ugdphrg5q0pze4s9k2ynt0z694t03 '{"flip": {}}' --from myWallet

secretcli query compute list-contract-by-code 1

secretcli tx compute instantiate 1 '{"count": 1, "flip": 1}' --from secret185v62t0a2uc4lycpyd40cte940657x53pxemw8 --label flipContract

secretcli query compute list-code

secretcli tx compute store contract.wasm.gz --gas 5000000 --from secret185v62t0a2uc4lycpyd40cte940657x53pxemw8 --chain-id secretdev-1

secretcli query bank balances secret185v62t0a2uc4lycpyd40cte940657x53pxemw8

curl http://localhost:5000/faucet\?address\=secret185v62t0a2uc4lycpyd40cte940657x53pxemw8

secretcli keys add myWallet

secretcli config node http://localhost:26657
secretcli config chain-id secretdev-1
secretcli config keyring-backend test
secretcli config output json

docker run -it --rm -p 26657:26657 -p 26656:26656 -p 1317:1317 -p 5000:5000 --name localsecret ghcr.io/scrtlabs/localsecret:v1.9.0-beta.1-random
```
