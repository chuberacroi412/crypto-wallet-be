const EC = require('elliptic').ec
const ec = new EC('secp256k1')

const CreateWallet = function() {
    
    const keyPair = ec.genKeyPair()
    const publicKey = keyPair.getPublic('hex')
    const privateKey = keyPair.getPrivate('hex')

    return {
        privateKey,
        publicKey
    }
}

module.exports = {CreateWallet}