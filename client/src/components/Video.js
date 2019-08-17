import React, { Component } from 'react'
import Tip from './Tip'


class Player extends Component {
    constructor(props){
        super(props)
        this.state={
            video : {}
        }
    }

    componentDidMount = () => {
        let video = this.props.location.video
        
        console.log(this.props.location)
        this.setState({video})
    }

    render() {
        const link = `https://ipfs.io/ipfs/${this.state.video.ipfsHash}`
        return (
            <div>
                <div className="wrapper">
                    <div className="main videoPlayer">
                        <div className="container">
                            <div className='videoHolder'>
                                <video src={link} controls></video>
                            </div>
                            <div className=''>
                                <h4 className=''>{this.state.video.title}</h4>
                                <Tip video={this.state.video}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Player