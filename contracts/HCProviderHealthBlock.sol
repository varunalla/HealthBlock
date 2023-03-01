// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
//https://ethereum.stackexchange.com/questions/8615/child-contract-vs-struct?newreg=9940955131d740a1a85cef648b771ef3

contract HCProviderHealthBlock {

  address private owner;

  constructor(){
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  mapping (address => hcprovider) internal hcproviders;

  struct hcprovider {
        string name;
        string email;
        string providerAddress;
        string phone;
        address id;

  }

  modifier checkHealthCareProvider(address id) {
        hcprovider storage h = hcproviders[id];
        require(h.id > address(0x0));//check if HealthCare Provider exists
        _;
  }

  function getHCProviderInfo() public view checkHealthCareProvider(msg.sender) returns(string memory, string memory, string memory,  string memory) {
        hcprovider storage h = hcproviders[msg.sender];
        return (h.name, h.email, h.providerAddress, h.phone);
  }

  function registerDoctor(string memory _name, string memory _email, string memory _address, string memory _phone) public {
        hcprovider storage h = hcproviders[msg.sender];
        require(keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked("")));
        require(keccak256(abi.encodePacked(_email)) != keccak256(abi.encodePacked("")));
        require(keccak256(abi.encodePacked(_address)) != keccak256(abi.encodePacked("")));
        require(keccak256(abi.encodePacked(_phone)) != keccak256(abi.encodePacked("")));
        require(!(h.id > address(0x0)));
        hcproviders[msg.sender] = hcprovider({name:_name, email:_email, providerAddress:_address, phone:_phone, id:msg.sender});
  }
  
}