import {
 getProtocolParameters,
 buf2Hex,
 hex2Bytes,
 selectUtxo,
 reportError,
 ERROR,
 NETWORK
} from './util.js';
import init from '../@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib.js';
import * as CardanoSerialisationWasm from '../@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib.js';

async function run() {
    console.log("CardanoSerialisationWasm injected");
}

init('/js/dapp/@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib_bg.wasm').then(run);

let accessGranted = false
let walletConnection = {};
let protocolParams;
let ttl_gap = 3600*2;
let $form
let cardanoAPI = undefined;

function initDapp(walletName){
    const enableDappconnPromise = new Promise((resolve, reject) => {
        let wallet = undefined;
        if (walletName === "nami") {
            console.log("Connecting nami");
            wallet = window.cardano.nami;
        } else if (walletName === "eternl") {
            console.log("Connecting eternl");
            wallet = window.cardano.ccvault;
        }
        wallet.enable().then(function(api) {
            if(!api){
                reject(api);
            } else {
                accessGranted = true
                cardanoAPI = api;
                resolve(api);
            }
        }).catch(error => {
              reportError(error);
              if (error.code===-3) {
                  $("textarea#console").append('Could not connect, rejected\n');
              }
              else {
                  $("textarea#console").append('Could not connect, have you enabled a dApp account?\n');
              }
        });

    });
    return enableDappconnPromise;
}

async function synchWalletInfo() {
    const [rewardAddresses, encoded_balance, addresses, changeAddress, hex_utxos, network_id] = await Promise.all(
        [cardanoAPI.getRewardAddresses(),
         cardanoAPI.getBalance(),
         cardanoAPI.getUsedAddresses(),
         cardanoAPI.getChangeAddress(),
         cardanoAPI.getUtxos(),
         cardanoAPI.getNetworkId()
        ]);

    console.log(rewardAddresses);
    console.log(encoded_balance);
    console.log(addresses);
    console.log(changeAddress);
    console.log(hex_utxos);
    console.log(network_id);

    // DECODE reward_addr
    var stake_addr = CardanoSerialisationWasm.Address.from_bytes(
       hex2Bytes(rewardAddresses[0])
    )
    var stake_addr_b32 = stake_addr.to_bech32();
    walletConnection.stake_addr=stake_addr_b32;

    //DECODE Balance
    var balance = CBOR.decode(hex2Bytes(encoded_balance).buffer);
    if (typeof balance[0] == 'undefined'){
        walletConnection.balance=balance;
    } else {
        walletConnection.balance=balance[0];
    }

    //DECODE USED Addresses
    var payment_addr = CardanoSerialisationWasm.Address.from_bytes(
       hex2Bytes(addresses[0])
    )
    var payment_addr_b32 = payment_addr.to_bech32();
    walletConnection.payment_addr=payment_addr_b32;

    //DECODE Change Address
    var change_addr = CardanoSerialisationWasm.Address.from_bytes(
       hex2Bytes(changeAddress)
    )
    var change_addr_b32 = change_addr.to_bech32();
    walletConnection.change_addr=change_addr_b32;

    //DECODE UTXOs
    var utxos = [];
    for (let i=0; i<hex_utxos.length; i++) {
        utxos.push(CardanoSerialisationWasm.TransactionUnspentOutput.from_bytes(hex2Bytes(hex_utxos[i])))
    }
    walletConnection.utxos = utxos;

    var network = network_id;
    walletConnection.network=network_id;

    console.log("Synched wallet on network: "+network);
    $('#balance').html(walletConnection.balance+' [Lovelace]'+" / "+walletConnection.balance/1000000+' [ADA]');
    $('#payment_addr').html(walletConnection.payment_addr);
    $('#stake_addr').html(walletConnection.payment_addr);
    $('#utxos').html(walletConnection.utxos.length);
    $('#network').html(NETWORK[walletConnection.network]);
}

$(document).on("submit","form.connect", function(e) {
    e.preventDefault();
    console.log($(this));
    let walletName = $(this).find("select[name=walletName]").val();
    console.log("wallet name: " +walletName);
    initDapp(walletName).then(function(api) {
        console.log(api);
        if (api) {
            synchWalletInfo().then(function() {
                $("#submit_connect").css("background","green");
            })
        }
        else {
            console.log("Access was not granted to wallet");
        }
    })
})

/* Send simple transaction of ADA/tADA */
$(document).on("submit","form.sendFunds", function(e) {
    e.preventDefault();
    $form = $(this);

    if (!cardanoAPI) {
       $("textarea#console").append('Error: Not Connected\n');
       return
    }
    if (typeof walletConnection.utxos == 'undefined') {
        $("textarea#console").append('Error: Wallet not synched, re-connect to synch.\n');
        return
    }
    cardanoAPI.getUtxos().then(function(hex_utxos) {
       var utxos = [];
       for (let i=0; i<hex_utxos.length; i++) {
           utxos.push(CardanoSerialisationWasm.TransactionUnspentOutput.from_bytes(hex2Bytes(hex_utxos[i])))
       }
       getProtocolParameters(walletConnection.network,true).then(function(protocol_params) {
            protocolParams = protocol_params;
            if (protocolParams.min_fee_a==null) {
                $("textarea#console").append('Error: Trouble getting protocol params. Check blockfrost integration props\n');
                return
            }
            var AMOUNT_TO_SEND = $form.find('input[name=amount]').val();
            var SEND_TO_ADDRESS = $form.find('input[name=receive_address]').val()

            var txBuilder = CardanoSerialisationWasm.TransactionBuilder.new(
                CardanoSerialisationWasm.TransactionBuilderConfigBuilder.new()
                    .fee_algo(CardanoSerialisationWasm.LinearFee.new(CardanoSerialisationWasm.BigNum.from_str(protocolParams.min_fee_a.toString()), CardanoSerialisationWasm.BigNum.from_str(protocolParams.min_fee_b.toString())))
                    .pool_deposit(CardanoSerialisationWasm.BigNum.from_str(protocolParams.pool_deposit.toString()))
                    .key_deposit(CardanoSerialisationWasm.BigNum.from_str(protocolParams.key_deposit.toString()))
                    .coins_per_utxo_word(CardanoSerialisationWasm.BigNum.from_str(protocolParams.coins_per_utxo_word.toString()))
                    .max_value_size(protocolParams.max_val_size)
                    .max_tx_size(protocolParams.max_tx_size)
                    .prefer_pure_change(true)
                    .build()
            );

            // Array of UTXO outputs
            var outputs = CardanoSerialisationWasm.TransactionOutputs.new();
            var sendToAddress = CardanoSerialisationWasm.Address.from_bech32(SEND_TO_ADDRESS)
            outputs.add(
                CardanoSerialisationWasm.TransactionOutput.new(
                  sendToAddress,
                  CardanoSerialisationWasm.Value.new(CardanoSerialisationWasm.BigNum.from_str(AMOUNT_TO_SEND))
                )
            );

            // Select suitable set of UTXO
            var selected_utxo = selectUtxo(outputs, utxos);

            // Add the selected UTXO inputs
            for (let k = 0; k < selected_utxo.length; k++) {
                var utxo = selected_utxo[k];
                txBuilder.add_input(
                     utxo.output().address(),
                     utxo.input(),
                     utxo.output().amount()
                );
            }

            // Add the spending outputs
            for (let j=0; j<outputs.len(); j++) {
                txBuilder.add_output(outputs.get(j));
            }

            //txBuilder.set_ttl(protocolParams.latest_slot + ttl_gap);
            if (protocolParams.latest_slot!=null) {
                 txBuilder.set_ttl(protocolParams.latest_slot + ttl_gap);
            }

            // calculate the min fee required and send any change back to my address
            txBuilder.add_change_if_needed(CardanoSerialisationWasm.Address.from_bech32(walletConnection.change_addr)); // change_addr_b32
//            try {
//                 txBuilder.add_change_if_needed(CardanoSerialisationWasm.Address.from_bech32(walletConnection.change_addr)); // change_addr_b32
//            } catch (err) {
//                // Not enough ADA leftover to include non-ADA assets in a change address
//                $("textarea#console").append('Invalid Transaction, something is wrong such as using mainnet and sending to testnet address\n');
//                reportError(err);
//                throw ERROR.invalidTransaction;
//            }

            var txBody = txBuilder.build();

            // Create Transaction using an empty witness set
            var txDraft = CardanoSerialisationWasm.Transaction.new(
                  txBody,
                  CardanoSerialisationWasm.TransactionWitnessSet.new()
            );

            // Create a transactionHex for signing. According to the doco (hex encoded CBOR string), should be like: txHexDraft = buf2Hex(CBOR.encode(ab2str(txDraft.to_bytes()))); Mistake in doco TBC
            var txHexDraft = buf2Hex(txDraft.to_bytes().buffer);

            cardanoAPI.signTx(txHexDraft, false).then(witnessSetHex => {
                var witnessSet = CardanoSerialisationWasm.TransactionWitnessSet.from_bytes(
                  hex2Bytes(witnessSetHex)
                )
                var tx = CardanoSerialisationWasm.Transaction.new(
                  txBody,
                  witnessSet,
                  undefined,
                )
                var txHex = buf2Hex(tx.to_bytes());
                cardanoAPI.submitTx(txHex, false).then(txHash => {
                    console.log(`Tx submitted, hash: ${txHash}`);
                    $("textarea#console").append('Sent ok, transaction hash: '+txHash+'\n');
                }).catch(error => {
                    reportError(error);
                });
            }).catch(error => {
                reportError(error);
            });
      }).catch(error => {
          reportError(error);
      });
  }).catch(error => {
      reportError(error);
  });
});

if (typeof window.cardano.nami === "undefined") {
    console.log("Nami Api not found");
} else {
    console.log("Nami Api injected");
}

if (typeof window.cardano.ccvault === "undefined") {
    console.log("eternl/ccvault Api not found");
} else {
    console.log("eternl/ccvault Api injected");
}