import React, { Component } from 'react'
import ipfs from '../utils/ipfs'


class AddVideoForm extends Component {
    state = {
        buffer : null,
        accounts : null,
        ipfsHash : '',
        loading : false,
        video : {
            ipfsHash : '',
            title : null,
            timestamp : 0,
            size : 0,
            tipjar : 0,
            views : 0,
            publisher : ''
        }
    }

    componentDidMount = async () => {
        try {
          const web3 = this.props.web3;
          const accounts = this.props.accounts;
          const contract = this.props.contract
          this.setState({ web3, accounts, contract });
        } catch (error) {
          console.error(error);
        }
    };

    captureTitle = event => {
        event.preventDefault();
        let video = this.state.video
        video.title = event.target.value
        this.setState({video})
    }

    captureFile = event =>{
        event.preventDefault();
        
        const file = event.target.files[0]
        console.log(file)
        if(file.type !== "video/mp4") {
            console.error("File type not supported")
            document.getElementById("file").value = null
            return
        }
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend =() => {
          this.setState({
            buffer : Buffer(reader.result)
          })
          console.log("buffer : ", this.state.buffer)
        }
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({loading : true})
        try {
            const results = await ipfs.add(this.state.buffer)
            let video = this.state.video
            video.ipfsHash = results[0].hash
            video.size = results[0].size
            video.timestamp = Date.now()
            console.log(results[0])
            this.setState({video,ipfsHash : results[0].hash, loading : false})
            this.addVideoToContract()
        }
        catch(err) {
            console.error(err)
            this.setState({loading : false})
            return false
        }
    };

    addVideoToContract = async () => {
        const {accounts, contract,video} = this.state;
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
    let submitBtn
    if(!this.state.loading) {
         submitBtn = <button>Submit</button>
    }
    else {
         submitBtn = 'loading'
    }
    if (!window.web3) {
      return (
        <div>Metamask is required to post videos and send tips.</div>
      )
    } else {
     
      return (
        <form onSubmit={this.onSubmit}>
          <input type="text" name="title" id="title" placeholder="Video title" onChange={this.captureTitle} />
          <input type="file" name="file" id="file" onChange={this.captureFile} />
          {submitBtn}
        </form>
      )
    }
  }
}

export default AddVideoForm;