import { SecretNetworkClient, Wallet } from "secretjs";
import * as fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const wallet = new Wallet(process.env.MNEMONIC);

const contract_wasm = fs.readFileSync("../contract.wasm.gz");
// const codeId = 22569;
// const contractCodeHash =
//   "328af17aa2bad04c20cb4d1b3aa81978685597b59fcc9be22bb5190f36290d68";
// const contractAddress = "secret1gydnetx0rzcnuenw2tq3zwltgn23tmv67r0320";

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-2",
  url: "https://api.pulsar.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});

let upload_contract = async () => {
  let tx = await secretjs.tx.compute.storeCode(
    {
      sender: wallet.address,
      wasm_byte_code: contract_wasm,
      source: "",
      builder: "",
    },
    {
      gasLimit: 4_000_000,
    }
  );

  const codeId = Number(
    tx.arrayLog.find((log) => log.type === "message" && log.key === "code_id")
      .value
  );

  console.log("codeId: ", codeId);

  const contractCodeHash = (
    await secretjs.query.compute.codeHashByCodeId({ code_id: codeId })
  ).code_hash;
  console.log(`Contract hash: ${contractCodeHash}`);
};

// upload_contract();

let instantiate_contract = async () => {
  const initMsg = { flip: 4 };
  let tx = await secretjs.tx.compute.instantiateContract(
    {
      code_id: codeId,
      sender: wallet.address,
      code_hash: contractCodeHash,
      init_msg: initMsg,
      label: "rng tutorial" + Math.ceil(Math.random() * 10000),
    },
    {
      gasLimit: 400_000,
    }
  );

  //Find the contract_address in the logs
  const contractAddress = tx.arrayLog.find(
    (log) => log.type === "message" && log.key === "contract_address"
  ).value;

  console.log(contractAddress);
};

// instantiate_contract();

let try_flip = async () => {
  const flip_tx = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      msg: {
        flip: {},
      },
      code_hash: contractCodeHash,
    },
    { gasLimit: 100_000 }
  );

  console.log(flip_tx);
};
// try_flip();

let query_flip = async () => {
  let flip_tx = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    code_hash: contractCodeHash,
    query: {
      get_flip: {},
    },
  });
  console.log(flip_tx);
};

query_flip();
