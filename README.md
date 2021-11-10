# cardano-walletconnector-demo

# Description
Minimal Spring Java application that demonstrates integration with the Nami Cardano Wallet. Connects to wallet, builds transaction and seeks user signing to authorise transaction.

# Quick Start
1. Navigate to project root
2. mvn clean install
3. mvn spring-boot:run
4. 'Connect' -> Approve connection in Nami Wallet

# Prereqs
1. Install Nami Wallet (https://namiwallet.io)
2. Create a Cardano wallet and deposit ADA (mainnet) or testADA (testnet)
3. Add a file 'encrypted.properties' to classpath (src/main/resources/)
```
blockfrost.cardano.testnet.project.id=<insert output of EncryptionUtil.encrypt("Blockfrost testnet project_id")>
blockfrost.cardano.mainnet.project.id=<insert output of EncryptionUtil.encrypt("Blockfrost testnet project_id")>
```

# Simple Funds Transfer Form - Inputs
```
Receiver Address: A Cardano Testnet or Mainnet address [Bech 32 Format]
Amount: Amount of ADA/tADA to transfer
```

# Simple Funds Transfer Form - Outputs
```
Transaction Hash for successful transactions
```
