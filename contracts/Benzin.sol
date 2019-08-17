pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Station {
    
    struct Video {
        string ipfsHash;
        string title;
        uint256 timeStamp;
        uint256 size;
        uint256 tipjar;
        uint256 views;
        address payable publisher;
    }
    
    struct UserVideoList {
        uint256 length; // total videos
        uint256 tipjar;
        mapping(string => Video) videos; // IPFS hash
    }
    
    //mapping(address => uint256) jarShelf; // having track of how many tips received by the publisher
    //The jarShelf mapping was removed because I think it should be about videos. Later we can get all the videos.
    
    mapping(address => UserVideoList) public publishers; // listing all videos of each publisher
    
    mapping(string => Video) videos; // IPFS HASH
    mapping(uint256 => Video) videosList;
    uint256 public videoCounter;
    
    modifier videoExists(string memory _ipfsHash) {
        require(videos[_ipfsHash].size >0 , "Videos does not exist");
        _;
    }

    modifier videoNotExists(string memory _ipfsHash) {
        require(videos[_ipfsHash].size == 0 , "Videos does not exist");
        _;
    }
    
    function DB_insert(
        string memory _ipfsHash,
        string memory _title,
        uint256 _timestamp,
        uint256 _size,
        uint256 _tipjar,
        uint256 _views,
        address payable _publisher
    ) public videoNotExists(_ipfsHash) {
        Video memory video = Video( _ipfsHash, _title, _timestamp, _size, _tipjar, _views, _publisher);
        videos[_ipfsHash] = video;
        //increasing the length of videos
        videoCounter++;
        videosList[videoCounter] = video;
        publishers[_publisher].length++;
        publishers[_publisher].videos[_ipfsHash] = video;
    }
    
    function DB_update(
        string memory _ipfsHash,
        string memory _title,
        uint256 _timestamp,
        uint256 _size,
        uint256 _tipjar,
        uint256 _views,
        address payable _publisher) public videoExists(_ipfsHash)
    {
        
        Video memory video = Video( _ipfsHash, _title, _timestamp, _size, _tipjar, _views, _publisher);
        videos[_ipfsHash] = video;
        publishers[_publisher].videos[_ipfsHash] = video;
    }
    
    function DB_get(string memory _ipfsHash) public view videoExists(_ipfsHash) returns(Video memory) 
    {
        Video storage video = videos[_ipfsHash];
        return video;
    }

    function DB_get_id(uint256 _id) public view returns(Video memory) {
        Video storage video = videosList[_id];
        return video;
    }
    
    function DB_delete(string memory _ipfsHash, address _publisher) public videoExists(_ipfsHash)
    {
        
        delete videos[_ipfsHash];
        delete publishers[_publisher];
    }
    
    function DB_tipMade(
        uint256 _amount,
        string memory _ipfsHash,
        address payable _publisher) public videoExists(_ipfsHash) 
    {
        require(_amount > 0, "DB_err : 0 tip");
        require(videos[_ipfsHash].publisher != address(0) , "Videos does not exist");
        
        videos[_ipfsHash].tipjar += _amount;
        publishers[_publisher].videos[_ipfsHash].tipjar ++;
        publishers[_publisher].tipjar ++;
    }
}



contract Benzin is Station {
    address private owner;
    
    event newVideo(string ipfsHash, string message);
    event tipMade(uint256 amount, string ipfsHash, address sender);
    
    constructor() public{
        owner = msg.sender;
    }
    
    modifier isOwner {
        require(msg.sender == owner);
       _; 
    }
    
    function tip(string memory _ipfsHash, address payable _publisher) public payable videoExists(_ipfsHash) {
        require(msg.value > 0, '0-tip err.');
        require(_publisher != address(0), 'invalid address');
        DB_tipMade(msg.value, _ipfsHash, _publisher);
        
        emit tipMade(msg.value, _ipfsHash, msg.sender);
    }
    
    function addVideo(
        string memory _ipfsHash,
        string memory _title,
        uint256 _timestamp,
        uint256 _size,
        address payable _publisher)
        public
    {
        require(msg.sender == _publisher, 'you must send the video using your own address');
        require(_size > 0, "size err");
        DB_insert(_ipfsHash, _title, _timestamp, _size, 0, 0, _publisher);
        emit newVideo(_ipfsHash, "Video added successfully");
    }
    
    function getVideo(string memory _ipfsHash) public view videoExists(_ipfsHash) returns(Video memory) {
        return DB_get(_ipfsHash);
    }

    function getVideoByID(uint256 _videoId) public view returns(Video memory) {
        return DB_get_id(_videoId);
    }

    function getVideoCounter() public view returns(uint256) {
        return videoCounter;
    }
    
    // function editVide() {}
    // function deleteVideo(){}
    
}
