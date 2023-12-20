import * as dotenv from "dotenv";

import { openWallet } from "./utils";
import { SendMode, internal } from "ton-core";
import { sleep } from "./delay";

dotenv.config();

async function init() {
  const wallet = await openWallet(process.env.MNEMONIC!.split(" "), false);  
  const seqno = await wallet.contract.getSeqno();

  const payload = internal({
    to: 'UQCzB2xDBA3ngtvUwEsdoEcnLTqX369KK1FvF7mUbv4LWsXc',
    value: '0',
    body: 'data:application/json,{"p":"ton-20","op":"mint","tick":"dedust.io","amt":"1000000000"}'
  })

  const params: any = {
    seqno,
    secretKey: wallet.keyPair.secretKey,
    messages: [
      payload,
      payload,
      payload,
      payload,
    ],
    sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS
  }

  await wallet.contract.sendTransfer(params)
}

let totalTx = 1;
while (totalTx > 0) {
  totalTx--;
  sleep(1000).then(() => {
    init().then(() => { console.log("Remaining tx: " + totalTx) });
  })
}
