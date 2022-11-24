// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
//https://ethereum.stackexchange.com/questions/8615/child-contract-vs-struct?newreg=9940955131d740a1a85cef648b771ef3
contract HealthBlock {

  address private owner;

  constructor(){
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
  event NPatient(address indexed _from, string indexed _name);
  uint counter=0;
  mapping (address => patient) public patients;
  mapping (uint=>string) public patientemails;
  struct patient {
        string name;
        uint8 age;
        string email;
        address id;
  }

  modifier checkPatient(address id) {
        patient memory p = patients[id];
        require(p.id > address(0x0));//check if patient exist
        _;
  }

  function getPatientInfo() public view checkPatient(msg.sender) returns(string memory, uint8,string memory) {
        patient memory p = patients[msg.sender];
        return (p.name, p.age, p.email);
  }

  function getPatientInfoNo() public view checkPatient(msg.sender) returns(string memory) {
        patient memory p = patients[msg.sender];
        if( p.id < address(0x0)) {   // if else statement
         return "no";
        } else  
        return "yes";
  }
function getPatientInfoByNo(uint8 num) public view returns(string memory) {
        return patientemails[num];
  }


  function registerPatient(string memory _name, uint8 _age,string memory _email) public {
        //patient storage p = patients[msg.sender];
        require(keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked("")));
        require(keccak256(abi.encodePacked(_email)) != keccak256(abi.encodePacked("")));
        require((_age > 0) && (_age < 100));
        counter+=1;
        patientemails[counter]=_email;
        //require(p.id == address(0x0));
        patients[msg.sender] = patient({name:_name,age:_age,id:msg.sender,email:_email});
        emit NPatient(msg.sender, _name);
  }
  
}
