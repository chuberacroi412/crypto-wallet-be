const EC = require('elliptic').ec
const ec = new EC('secp256k1')
const crypto = require('crypto')

const CreateWallet = function() {
    
    const keyPair = ec.genKeyPair()
    const publicKey = keyPair.getPublic('hex')
    const privateKey = keyPair.getPrivate('hex')

    return {
        privateKey,
        publicKey
    }
}

const GetAccountBalance = function(chain, userPublicKey) {
    let balance = 0

    if(chain) {
        chain.forEach(block => {
            if(block.data.to == userPublicKey) {
                balance += +block.data.amount
            }
        });
    }
    

    return balance
}

const GetTransactionHistory = function(chain, userPublicKey) {

    let history = []

    if(chain) {
        chain.forEach(block => {
            if(block.data.from === userPublicKey || block.data.to === userPublicKey) {
                history.push(block.data)
            }
        })
    }
    

    return history
}

const IsKeyExisted = function(chain, userPublicKey) {

    if(chain) {
        chain.forEach(block => {
            if(block.data.from === userPublicKey || block.data.to === userPublicKey)
                return true
        })
    }

    return false
}

function SHA256(input) {
    return crypto.createHash('sha256').update(input).digest('hex')
}

function HashData(data, timeStamp, prevHash, nonce) {
    return SHA256(JSON.stringify(data) + timeStamp + prevHash + nonce)
}

function mine(difficulty, data, timeStamp, prevHash) {
    let nonce = 0
    let hash = HashData(data, timeStamp, prevHash, nonce)

    while(!hash.startsWith(Array(difficulty + 1).join('0'))) {
        nonce++;
        hash = HashData(data, timeStamp, prevHash, nonce)
    }

    return {
        nonce, hash
    }
}

function CreateBlock(difficulty, timeStamp, data, prevHash) {

    const mineResult = mine(difficulty, data, timeStamp, prevHash)

    return {
        timeStamp: timeStamp,
        data: data,
        hash: mineResult.hash,
        prevHash: prevHash,
        nonce: mineResult.nonce
    }
}

function GetLastBlock(chain) {
    
    if(chain && chain.length > 0) {
        return chain[chain.length - 1]
    }

    return null
}

const AddBlock = function (blockChain, data) {
    const lastBlock = GetLastBlock(blockChain.chain)
    let prevHash = null

    if(lastBlock)
        prevHash = lastBlock.hash
    
    let newBlock = CreateBlock(blockChain.difficulty, Date.now().toString(), data, prevHash)

    blockChain.chain.push(newBlock)

    if(blockChain.difficulty >= 5) {
        blockChain.difficulty = 1
    }
    else if(lastBlock) {
        blockChain.difficulty += Date.now() - parseInt(GetLastBlock(blockChain.chain).timeStamp) < blockChain.blockTime ? 1 : -1
    }
}

const RegisterGift = function(blockChain, server, userPublicKey) {
    let data = {
        from: server.wallet.publicKey,
        to: userPublicKey,
        amount: 10
    }

    AddBlock(blockChain, data)
}

module.exports = {CreateWallet, GetAccountBalance, GetTransactionHistory, IsKeyExisted, AddBlock, RegisterGift}