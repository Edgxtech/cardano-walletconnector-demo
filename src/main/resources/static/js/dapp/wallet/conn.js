import {
 getProtocolParameters,
 buf2Hex,
 hex2Bytes,
 selectUtxo,
 reportError,
 ERROR,
 NETWORK
} from './util.js';
import init1 from '../@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib.js';
import * as CardanoSerialisationWasm from '../@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib.js';
import init2 from '../cardano-message-signing/cardano_message_signing.js';
import * as CardanoMessageSigningWasm from '../cardano-message-signing/cardano_message_signing.js';

async function run() {
    console.log("CardanoSerialisationWasm and CardanoMessageSigningWasm injected");
}

init1('/js/dapp/@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib_bg.wasm')
    .then(init2('/js/dapp/cardano-message-signing/cardano_message_signing_bg.wasm'))
    .then(run);

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

/* Sign arb data */
$(document).on("submit","form.signData", function(e) {
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
       //getProtocolParameters(walletConnection.network,true).then(function(protocol_params) {
            //protocolParams = protocol_params;
//            if (protocolParams.min_fee_a==null) {
//                $("textarea#console").append('Error: Trouble getting protocol params. Check blockfrost integration props\n');
//                return
//            }
            console.log(cardanoAPI);

            var MESSAGE_TO_SIGN = $form.find('input[name=message]').val();
            /// TODO UP TO HERE, TRY OTHER ADDRESs FORMATS HERE
            console.log('MSG to sign: ' + MESSAGE_TO_SIGN);
            var MESSAGE_TO_SIGN_HEX = buf2Hex(hex2Bytes(MESSAGE_TO_SIGN));
            console.log('MSG to sign hex: ' + MESSAGE_TO_SIGN_HEX);
            //console.log('MSG to sign hex: ' + he);

            let utf8Encode = new TextEncoder();
            var enc_msg = utf8Encode.encode("abc");
            console.log(enc_msg);

            //var balance = CBOR.decode(hex2Bytes(encoded_balance).buffer);

                var payment_addr = CardanoSerialisationWasm.Address.from_bech32(
                   walletConnection.payment_addr
                )
                var base_addr = CardanoSerialisationWasm.BaseAddress.from_address(
                   payment_addr
                )

            console.log('signing with: ' + walletConnection.payment_addr);
            // doesn't work: payment_addr.to_bytes() - it will say password was wrong
            /// even though CIP says (address: Address, payload: Bytes) are inputs
            /// It looks like (address: Bech32addressString, payload: Hex String      -- FOR ETERNL, Perhaps different for NAMI TBD
            ///  TODO, NOTE wallet API seem to want different things; addr, sigStructure  -- implying I need to create the COSE Sig structure here manually

             // I think I might need to use this: https://github.com/Emurgo/message-signing/
             //   Example (RUST CODE) of signing message here: https://github.com/Emurgo/message-signing/blob/master/examples/rust/src/main.rs
//                 let payload = "message to sign".as_bytes().to_vec();
//                 // 2) Creating a simple signed message
//                 // protected headers are those that are actually signed
//                 let mut protected_headers = ms::HeaderMap::new();
//                 let protected_serialized = ms::ProtectedHeaderMap::new(&protected_headers);
//                 let unprotected = ms::HeaderMap::new();
//                 let headers = ms::Headers::new(&protected_serialized, &unprotected);
//                 // we will use COSESign1Builder to simplify the whole proces and make it less error-prone
//                 // if it is not ued then the appropriate SigStucture must be manually created and
//                 let mut builder = ms::builders::COSESign1Builder::new(&headers, payload, false);
//                 // remember that we sign SigStructure, not the message/headres itself.
//                 let to_sign = builder.make_data_to_sign().to_bytes();
//                 /// FROM HERE, WE JUST ASK THE WALLET BRIDGE API to sign it
////                 // it is important that we sign using Ed25519 keys in accordance to the spec
////                 // make sure your key is not in the X25519 format.
////                 let signed_sig_struct = sk.sign(&to_sign).to_bytes();
////                 // then once we have signed that we can build the final COSESign1 result to be shared
////                 let cose_sign1 = builder.build(signed_sig_struct);

            /// THESE ARE HEADERS REQUIRED
//            HeaderMap protectedHeaderMap = (new HeaderMap()).algorithmId(-8L).keyId(addressBytes).addOtherHeader("address", new ByteString(addressBytes));  ByteString is a CBOR byte[] string
//            Headers headers = (new Headers())._protected(new ProtectedHeaderMap(protectedHeaderMap)).unprotected(new HeaderMap());
//            COSESign1Builder coseSign1Builder = new COSESign1Builder(headers, payload, false);

            // First set algo_id == -8 per the standard
            var protected_headers = CardanoMessageSigningWasm.HeaderMap.new();
            var algo_label = CardanoMessageSigningWasm.Label.from_algorithm_id("EdDSA");
            /* label_enum!(AlgorithmId {
                  /// EdDSA (Pure EdDSA, not HashedEdDSA) - the algorithm used for Cardano addresses
                  EdDSA = -8,
            */
            console.log(algo_label.as_int().as_i32()); // Works, == -8
            protected_headers.set_algorithm_id(algo_label); // -8
            console.log(protected_headers.algorithm_id().as_int().as_i32());

            // Then set keyId as the addr bytes[]
            console.log(payment_addr.to_bytes());
            protected_headers.set_key_id(new Uint8Array (payment_addr.to_bytes())); // Takes: * @param {Uint8Array} key_id  it seems this should be straight bytes[], but otherHeaders should be a CBOR value of it
            console.log(protected_headers.key_id());
            var recoveredKey = CardanoSerialisationWasm.Address.from_bytes(protected_headers.key_id());
            console.log(recoveredKey);
            console.log(recoveredKey.to_bech32()); // seems to work ,same as next line
            console.log(payment_addr.to_bech32()); // seems to work
            console.log(buf2Hex(payment_addr.to_bytes())); // seems to work

            var addr_label = CardanoMessageSigningWasm.Label.new_text("address");
            console.log(addr_label.as_text()); // Works
            //            var addr_cbor = CBOR.encode(payment_addr.to_bytes());
            //            console.log(addr_cbor);
            //            var addr_cbor_hex = buf2Hex(CBOR.encode(walletConnection.payment_addr))
            //            console.log(addr_cbor_hex);
            //            var addr_cbor_b = new Uint8Array (CBOR.encode(payment_addr.to_bytes()));
            //            console.log(addr_cbor_b);
            //var addr_cbor_value = CardanoMessageSigningWasm.CBORValue.from_bytes(addr_cbor); //payment_addr.to_bytes());
            //var addr_cbor_value = CardanoMessageSigningWasm.CBORValue.from_bytes(payment_addr.to_bytes()); //payment_addr.to_bytes());
            //var addr_cbor_value = CardanoMessageSigningWasm.CBORValue.new_bytes(payment_addr.to_bytes()); //payment_addr.to_bytes());
            //var addr_cbor_value = CardanoMessageSigningWasm.CBORValue.from_bytes(base_addr.to_address().to_bytes()); //payment_addr.to_bytes());
            var addr_cbor_value = CardanoMessageSigningWasm.CBORValue.new_bytes(base_addr.to_address().to_bytes()); //payment_addr.to_bytes());

            console.log(addr_cbor_value.as_text());
            console.log(addr_cbor_value.as_bytes());
            var recoveredKeyOH = CardanoSerialisationWasm.Address.from_bytes(addr_cbor_value.as_bytes());
            console.log(recoveredKeyOH.to_bech32()); // seems to work
            //var addr_cbor_value = CardanoMessageSigningWasm.CBORValue.new_text(walletConnection.payment_addr);
            protected_headers.set_header(addr_label,addr_cbor_value);  // this complaining expected {Label}
                        console.log(protected_headers.header(addr_label));
                        var recoveredKeyOHPH = CardanoSerialisationWasm.Address.from_bytes(protected_headers.header(addr_label).as_bytes());
                        console.log(recoveredKeyOHPH);
                        console.log(recoveredKeyOHPH.to_bech32()); //
                        console.log(protected_headers.header(addr_label));
            var protected_serialized = CardanoMessageSigningWasm.ProtectedHeaderMap.new(protected_headers);
                console.log(protected_serialized);
//                var deser_headers = protected_serialized.deserialized_headers();
//                var addr_val_recov = deser_headers.header(addr_label);
//                console.log(protected_serialized.deserialized_headers())
//                console.log(addr_val_recov.as_bytes());
            var unprotected_headers = CardanoMessageSigningWasm.HeaderMap.new();
            var headers = CardanoMessageSigningWasm.Headers.new(protected_serialized, unprotected_headers);
                        var deser_headers = headers.protected().deserialized_headers();
                        var addr_val_recov = deser_headers.header(addr_label); // CBOR Value == ByteString in Java
                        console.log(addr_val_recov.as_bytes());
                        var recoveredOtherHEADERS = CardanoSerialisationWasm.Address.from_bytes(addr_val_recov.as_bytes());
                        console.log(recoveredOtherHEADERS.to_bech32()); // seems to work
             /* @param {Headers} headers
                * @param {Uint8Array} payload
                * @param {boolean} is_payload_external */
            //var payload = new Uint8Array ();
            var string = "Hello World!"
            var payload = Uint8Array.from(string.split("").map(x => x.charCodeAt()))
            var builder = CardanoMessageSigningWasm.COSESign1Builder.new(headers, payload, false); // I tried true for external_aad it didn't seem to work
            console.log(builder);
            var to_sign = builder.make_data_to_sign();
            console.log(to_sign);
            var to_sign_hex = buf2Hex(to_sign.to_bytes().buffer); // Eternl seems to require encoded or it rejects
            console.log(to_sign_hex);
            var to_sign_cbor_hex = buf2Hex(CBOR.encode(to_sign.to_bytes()));
            console.log(to_sign_cbor_hex);

            // ETERNL SEEMS closest with: (walletConnection.payment_addr, to_sign_hex)
            // var payment_addr_hex = buf2Hex(payment_addr.to_bytes());
            // walletConnection.payment_addr  // This is required for eternl to sign correctly
            // base_addr.to_address().to_bech32()   === same as walletConnection.payment_addr  buf2Hex(  .to_bytes()
            /* //The return shall be a DataSignature with signature set to the hex-encoded CBOR bytes of the
               COSE_Sign1 object specified above and key shall be the hex-encoded CBOR bytes of a COSE_Key structure with the following headers set: */

            /* after looking at Nami code:
               It looks like the wallet actually does more work than I thought, I just need to pass these. And the wallet will add all the headers
            //  * @param {string} address - cbor     TODO, UP TO HERE, I think this might be issue need to try all address formats, problem is eternl complains wrong spending p/w, and nami still accepting this format
                * @param {string} payload - hex encoded utf8 string
            */
            var base_addr_cbor_hex = buf2Hex(CBOR.encode(base_addr.to_address().to_bytes()));
            var base_addr_hex = buf2Hex(base_addr.to_address().to_bytes().buffer);  // THIS IS WHAT IS REQUIRED - THE SOLUTION (DO NOT NEED TO CREATE ALL THE HEADERS ABOVE, THE WALLET DOES IT FOR ME)
            var base_addr_cbor = CBOR.encode(base_addr.to_address().to_bytes());
            var addr_cbor_hex = buf2Hex(CBOR.encode(payment_addr.to_bytes()));
            var addr_hex = buf2Hex(payment_addr.to_bytes().buffer);
            var addr_cbor = CBOR.encode(payment_addr.to_bytes());
            cardanoAPI.signData(base_addr_hex, buf2Hex(enc_msg)).then(signed_sig_struct => {

                // NOTE:  This is how the key is is generated. - SHOULDNT BE RELEVANT, THE WALLET SHOULD DO THIS
                // COSEKey coseKey = (new COSEKey()).keyType(1L).keyId(addressBytes).algorithmId(-8L).addOtherHeader(-1L, new UnsignedInteger(6L)).addOtherHeader(-2L, new ByteString(pubKey));

                console.log(signed_sig_struct);
                console.log(signed_sig_struct.signature); // This is the hex encoded CBOR bytes of the COSE_sign1 object

//                var signed_sig_struct_bytes = Uint8Array.from(signed_sig_struct);
//                console.log(signed_sig_struct_bytes);
                var signature = CBOR.decode(hex2Bytes(signed_sig_struct.signature).buffer);
                console.log(signature);

                /// TODO, I think I need to attempt to extract the protected other header from signed sig structure to see if its in there properly

                //     let signed_sig_struct = sk.sign(&to_sign).to_bytes();
                // then once we have signed that we can build the final COSESign1 result to be shared
                //let cose_sign1 = builder.build(signed_sig_struct);
                //var cose_sign1 = builder.build(signed_sig_struct_bytes);
                var cose_sign1 = builder.build(signature);  // Uint8Array.from( or Uint8Array.from(

                console.log(cose_sign1);
                console.log(cose_sign1.signature());
                console.log(buf2Hex(cose_sign1.signature().buffer));

                //console.log(CBOR.decode(cose_sign1.signature().buffer));

                $("textarea#console").append('Signed it');
            }).catch(error => {
                reportError(error);
            });
//      }).catch(error => {
//          reportError(error);
//      });
  }).catch(error => {
      reportError(error);
  });
});

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