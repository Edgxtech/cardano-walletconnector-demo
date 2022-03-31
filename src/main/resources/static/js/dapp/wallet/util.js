export const ERROR = {
  insufficientFunds: 'Insufficient Funds',
  invalidInput: 'Invalid Input',
  invalidTransaction: 'Invalid Transaction'
};

export const NETWORK = ['Testnet','Mainnet'];

function str2ab(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function hex2str(hex) {
    return hex.split(/(\w\w)/g)
       .filter(p => !!p)
       .map(c => String.fromCharCode(parseInt(c, 16)))
       .join("");
}

/*
 * @param {String} hex
 */
export const hex2Bytes = (hex) => {
    /* Wallet Api Ref indicates "hex encoded bytes", Convert from hex, then convert to ArrayBuffer-using Usigned 8-bit Integers */
    return new Uint8Array(str2ab(hex2str(hex)));
};

/*
 * IMPORTANT; Wallet Api Ref indicates 'hex encoded cbor string', the input must be 'hex encoded cbor number'
 * @param {ArrayBuffer} buffer
 */
export const buf2Hex = (buffer) => {
  return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}

function genericHttpRequest(endpoint, headers, body) {
  return new Promise(async (res, rej) => {
    const result = await fetch(endpoint, {
      headers: {
        ...headers,
        'Cache-Control': 'no-cache',
      },
      method: body ? 'POST' : 'GET',
      body,
    }).then((res) => res.json());
    if (result.status_code === 500) {
      const interval = setInterval(async () => {
        const result = await fetch(endpoint, {
          headers: {
            ...headers,
          },
          method: body ? 'POST' : 'GET',
          body,
        }).then((res) => res.json());
        if (result.status_code !== 500) {
          clearInterval(interval);
          return res(result);
        }
      }, 100);
    } else {
      res(result);
    }
  });
};

/* Get params from backend source or canned data
   @param {Int} network
   @param {Boolean} cannedData */
export const getProtocolParameters = (network,cannedData) => {
   if (typeof network == 'undefined') {
        throw ERROR.invalidInput;
   }
   if (network === 0 && cannedData===true) {
      console.log("Used canned protocol params");
      return new Promise(async (res, rej) => {
          let protocolParams = {
               min_fee_a: 44,
               min_fee_b: 155381,
               min_utxo: 34482,
               pool_deposit: 500000000,
               key_deposit: 2000000,
               max_val_size: 5000,
               max_tx_size: 16384,
               price_mem: 0.0577,
               price_step: 0.0000721,
               coins_per_utxo_word: 34482
          }
          console.log(protocolParams);
          return res(protocolParams);
      });
   }
   else {
       const data = new URLSearchParams();
       data.append("network", network);
       return genericHttpRequest('/dappconn/protocolparameters',null,data);
   }
};

/*
* Simple selection that aggregates UTXOs until amount covers the costs
* @param {TransactionOutputs} outputs
* @param {[TransactionUnspentOutput]} utxos
*/
export const selectUtxo = (outputs, utxos) => {
   var cost_total=200000; // 0.2 ADA, fees ~0.18
   for (let i = 0; i < outputs.len(); i++) {
        cost_total += Number(outputs.get(i).amount().coin().to_str());
   }
   var selected_utxo = [];
   var selected_utxo_sum = 0;
   let sufficient_funds=false;
   for (let j = 0; j < utxos.length; j++) {
        const utxo = utxos[j];
        selected_utxo.push(utxo);
        selected_utxo_sum += Number(utxo.output().amount().coin().to_str());
        if (selected_utxo_sum > cost_total) {
            sufficient_funds = true;
            break;
        }
   }
   if (!sufficient_funds) {
        throw ERROR.insufficientFunds;
   }
   return selected_utxo;
};

export const reportError = (error) => {
   console.error(error)
   if (typeof error.info !== 'undefined') {
      $("textarea#console").append('Error: '+error.info+'\n'+error.message+'\n');
   }
   else{
      $("textarea#console").append('Error: '+error+'\n');
   }
   if (error.code === -1) {
      $("textarea#console").append('Error: make sure wallet connection is synched after network or account changes and the "receiving" address corresponds to network (main or testnet)\n');
   }
};