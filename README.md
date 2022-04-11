# cardano-walletconnector-demo

# Description
Minimal Spring Java application that demonstrates integration with the Nami & Eternl Cardano Wallet(s). Connects to wallet, builds transaction and seeks user signing to authorise transaction.

# Quick Start
1. Navigate to project root
2. mvn clean install
3. mvn spring-boot:run
4. 'Connect' -> Approve connection in Nami/Eternl Wallet
5. Use the 'Send ADA' form to sign transactions using connected wallet

# Prereqs
1. Install Eternl (https://ccvault.io) and/or Nami Wallet (https://namiwallet.io)
2. Create a Cardano wallet and deposit ADA (mainnet) or testADA (testnet)
3. Add a file 'encrypted.properties' to classpath (src/main/resources/)
```
blockfrost.cardano.testnet.project.id=<insert output of EncryptionUtil.encrypt("Blockfrost testnet project_id")>
blockfrost.cardano.mainnet.project.id=<insert output of EncryptionUtil.encrypt("Blockfrost mainnet project_id")>
```
(optional) adding blockfrost api keys / project id are if you are using mainnet or wanting to use testnet with your own api key 'instead' of provided defaults

# Simple Funds Transfer Form - Inputs
```
Receiver Address: A Cardano Testnet or Mainnet address [Bech 32 Format]
Amount: Amount of ADA/tADA to transfer
```

# Simple Funds Transfer Form - Outputs
```
Transaction Hash for successful transactions
```
