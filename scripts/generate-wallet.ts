import { generatePrivateKey } from 'viem/accounts'
import { privateKeyToAccount } from 'viem/accounts'

const privateKey = generatePrivateKey()
const account = privateKeyToAccount(privateKey)

console.log("🚀 ~ privateKey:", privateKey)
console.log("🚀 ~ account:", account)
