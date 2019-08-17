let {ethers, utils} = require('ethers')
let BENZIN = require('../contracts/Benzin.json')

class BenzinFunc {
    constructor(){
        this.provider =""
        this.contractAddress=""
        this.contract=""
    }

    async tip (ipfsHash, address, amount) {
        console.log(`
            Tip function trigered :
            video-ipfs-hash : ${ipfsHash}
            receiver : ${address} 
            tipAmount : ${amount}
        `)
        let tx = await this.contract.tip(address,address, {
            value : utils.parseUnits(amount, 'gwei')
        } )
        return tx
    }
    
    async getVideos () {
        let videoCounter = await this.contract.getVideoCounter()
        console.log(videoCounter)
    }

    async initialized() {
        let benzinAbi = BENZIN.abiDefinition;

         this.provider = new ethers.providers.Web3Provider(window.web3.currentProvider);

        this.contractAddress = "0x39e03ef8499530d201c471f8578666aad8ccf813"

        this.contract = new ethers.Contract(this.contractAddress, benzinAbi, this.provider.getSigner())

    }
}

export default BenzinFunc






