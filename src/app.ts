import * as dotenv from "dotenv";

import { openWallet } from "./utils";
import { SendMode, internal } from "ton-core";

dotenv.config();

let successCount = 0;
let failCount = 0;

async function init() {
  try {
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
      sendMode: SendMode.PAY_GAS_SEPARATELY
    }

    console.log('-> transfering...');

    await wallet.contract.sendTransfer(params)
    successCount++;
  } catch (error) {
    console.log('---> skipping error');   
    failCount++;
  }
}

let totalTx = 100;
let i = 1;                  

function myLoop() {         
  setTimeout(function() {   
    console.log(`Tx ${i} sent`);
    init();
    i++;                    
    if (i < totalTx) {           
      myLoop();  
    } else {
      console.log(`Total success: ${successCount}`);
      console.log(`Total fail: ${failCount}`);
    }                       
  }, 39000)
}

myLoop();

