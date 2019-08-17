import React, { Component } from 'react'



const IPFS = require('ipfs-http-client')

const ipfs = IPFS({
    host:'ipfs.infura.io',
    port : 5001,
    protocol : 'https'
})

class AddVideoForm extends Component {
    state = {
        buffer : null,
        ipfsHash : '',
    }

    captureFile = event =>{
        event.preventDefault();
        
        const file = event.target.files[0]
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
        const results = await ipfs.add(this.state.buffer)
        this.setState({video : {
            ipfsHash : results[0].hash
        }})
        this.setState({ipfsHash : results[0].hash})
      };

  render() {
    if (!window.web3) {
      return (
        <div>Metamask is required to post videos and send tips.</div>
      )
    } else {
      return (
        <form onSubmit={this.onSubmit}>
          <input type="text" name="title" id="title" placeholder="Video title" />
          <input type="file" name="file" id="file" onChange={this.captureFile} />
          <button>Submit</button>
        </form>
      )
    }
  }
}

export default AddVideoForm;