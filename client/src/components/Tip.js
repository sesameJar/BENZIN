import React, { Component } from "react";
import BenzinContract from "../contracts/Benzin.json";
import getWeb3 from "../utils/getWeb3";


class Tip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3 : null,
      accounts : null,
      contract : null,
      video : {}
    };
  }

  componentDidMount = async () => {
      let video = this.props.video;
      this.setState({video})
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(BenzinContract.abi, "0xf1f54f42564592a9067ea4447dafacd913e2f08f")
      this.setState({ web3, accounts, contract },await this.getVideos);
    } catch (error) {  
      console.error(error);
    }
  };

  sendTip = async (event) => {
    event.preventDefault();
    let amount = event.target.value
    let publisher = this.state.accounts[0]
    let ipfsHash = this.state.video.ipfsHash
    let contract = this.state.contract

    let tx = await contract.methods.tip(ipfsHash,publisher).send({
        form : publisher,
        value : amount
    })
    console.log(tx)
    return tx;
  };

  render() {
      return (
        <form onSubmit={this.sendTip}>
          <input type="text" name="tipAmount" placeholder="in gwei..."/>
          <button>Tip me.</button>
        </form>
      )
    }
}

export default Tip;
