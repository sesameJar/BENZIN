const Benzin = artifacts.require('./Benzin.sol')

contract('Benzin', accounts => {
    let contract;
    let video;
    beforeEach(async () => {
        contract = await Benzin.new()
        video = {
            ipfsHash : 'QmVtYjNij3KeyGmcgg7yVXWskLaBtov3UYL9pgcGK3MCWu',
            title : 'This is the title',
            timestamp : 0,
            size : 0,
            tipjar : 0,
            views : 0,
            publisher : accounts[0]
        }
    })
    
    it('initiates contract', async () => {
        assert.ok(contract.address)
    })

    // AddVideo tests
    it('Add a new Video', async () => {
        video.timestamp = Date.now()
        console.log(video.timestamp)
        video.size = 2
        await contract.addVideo(
            video.ipfsHash,
            video.title,
            video.timestamp,
            video.size,
            video.publisher)
        let getVideo = await contract.getVideo(video.ipfsHash)
        
        assert.equal(getVideo.ipfsHash, video.ipfsHash)
    })

    it("should not be able to add new video with size 0", async () => {
        video.size = 0
        try {
            await contract.addVideo(
                video.ipfsHash,
                video.title,
                video.timestamp,
                video.size,
                video.publisher)
        }
        catch(err) {
            assert.ok(err.message.includes("size err"))
        }
    })

    it("publisher must be the same as sender", async () => {
        video.publisher = accounts[2]
        try {
            await contract.addVideo(
                video.ipfsHash,
                video.title,
                video.timestamp,
                video.size,
                video.publisher, {
                    from : accounts[0]
                })
        }
        catch(err) {
            assert.ok(err.message.includes("you must send the video using your own address"))
        } 
    })

    //getVideo tests
    it("video must exist", async () => {
        video.ipfsHash = "asdasdasd"
        try {
            await contract.getVideo(video.ipfsHash)
        }
        catch(err) {
            assert.ok(err.message.includes("Videos does not exist"))
        }
    })

    it("must return a full video object", async () => {
        video.size = 1 
        await contract.addVideo(
            video.ipfsHash,
            video.title,
            video.timestamp,
            video.size,
            video.publisher)

        let getVideo = await contract.getVideo(video.ipfsHash)
        assert.equal(getVideo.ipfsHash,video.ipfsHash) 
        assert.equal(getVideo.title , video.title)
        assert.equal(getVideo.publisher , video.publisher ) 
        
    })

    //Tip tests
    it("tip can only be made on videos exist", async () => {
        try {
            await contract.tip(video.ipfsHash, video.publisher, {
                from : accounts[2],
                value : 10000000
            })
        }
        catch(err) {
          assert.ok(err.message.includes("Videos does not exist"))  
        }
    })

    it("Tip amount must be more than 0", async () => {
        video.size = 1 
        await contract.addVideo(
            video.ipfsHash,
            video.title,
            video.timestamp,
            video.size,
            video.publisher)
            
        try {
            await contract.tip(video.ipfsHash, video.publisher, {
                value : 0
            })
        }
        catch(err) {
            assert.ok(err.message.includes("0-tip err."))
        }
    })

    it("Tip must successfully be made", async () => {
        video.size = 1 
        await contract.addVideo(
            video.ipfsHash,
            video.title,
            video.timestamp,
            video.size,
            video.publisher)

        await contract.tip(video.ipfsHash, video.publisher, {
            value : 10
        })

        let getVideo = await contract.getVideo(video.ipfsHash)
        console.log(getVideo)
        let tipAmount = getVideo.tipjar
        console.log(tipAmount)
        assert.equal(tipAmount, 10)
    })
})