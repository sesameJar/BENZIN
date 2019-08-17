import React, { Component } from "react";
import BenzinContract from "./contracts/Benzin.json";
import getWeb3 from "./utils/getWeb3";
// import BenzinFunc from "./contractFunctions"
import "./App.css";
// const Benzin = new BenzinFunc()

class App extends Component {
  state = { 
    web3: null,
    accounts: null,
    contract: null,
    videos : [],
    video : {
      ipfsHash : 'QmVtYjNij3KeyGmcgg7yVXWskLaBtov3UYL9pgcGK3MCWu',
      title : 'This is the title',
      timestamp : 0,
      size : 0,
      tipjar : 0,
      views : 0,
      publisher : ''
  }
  };

  componentDidMount = async () => {
    // await Benzin.initialized()
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(BenzinContract.abi, "0xf1f54f42564592a9067ea4447dafacd913e2f08f")
      this.setState({ web3, accounts, contract },await this.getVideos);
      await this.addVideo()
    } catch (error) {
      // Catch any errors for any of the above operations.
      
      console.error(error);
    }
  };
  
  getVideos = async () => {
    const {accounts,contract} = this.state;
    let videoCounter = await contract.methods.getVideoCounter().call();
    let videos = []
    for(let i = 1; i<=videoCounter; i++) {
      let videoArray = await contract.methods.getVideoByID(i).call()
      let video = {
        ipfsHash : videoArray[0],
        title : videoArray[1],
        timestamp : videoArray[2],
        size : videoArray[3],
        tipjar : videoArray[4],
        views : videoArray[5],
        publisher : videoArray[6]
      }
      videos.push(video)
      this.setState({videos})
    }
    console.log(videoCounter)
  }

  addVideo = async () => {
    const {accounts, contract,video} = this.state;
    video.size = 2
    video.timestamp = Date.now()
    video.publisher = accounts[0]
    try {
      await contract.methods.addVideo(
        video.ipfsHash,
        video.title,
        video.timestamp,
        video.size,
        video.publisher).send({from : accounts[0]})
    }
    catch(err) {
      console.log(err)
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        
      </div>
    );
  }
}

export default App;
