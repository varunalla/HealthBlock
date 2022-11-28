// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

//https://ethereum.stackexchange.com/questions/8615/child-contract-vs-struct?newreg=9940955131d740a1a85cef648b771ef3
contract HealthBlock {
    address private owner;
    struct patient {
        string name;
        uint8 age;
        string email;
        address id;
    }
    // event for EVM logging
    event NPatient(address indexed _from, string indexed _name);
    event NDoctor(address indexed _from, string indexed _name);
    mapping (address => patient) public patients;
    mapping (address => doctor) internal doctors;

    struct doctor {
        string name;
        uint8 age;
        string email;
        string specialization;
        address id;
    }

    modifier checkDoctor(address id) {
        doctor storage d = doctors[id];
        require(d.id > address(0x0));//check if doctor exists
        _;
    }

    /**
     * @dev Set contract deployer as owner
     */
    constructor() {
        owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
    }
    modifier checkPatient(address id) {
        patient storage p = patients[id];
        require(p.id > address(0x0));//check if patient exist
        _;
    }
    function registerPatient(string memory _name, uint8 _age,string memory _email) public {
        //patient storage p = patients[msg.sender];
        require(keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked("")));
        require(keccak256(abi.encodePacked(_email)) != keccak256(abi.encodePacked("")));
        require((_age > 0) && (_age < 100));
        patients[msg.sender] = patient({name:_name,age:_age,id:msg.sender,email:_email});
        emit NPatient(msg.sender, _name);
    }
    function getPatientInfo() public view checkPatient(msg.sender) returns(string memory, uint8, string memory) {
        patient storage p = patients[msg.sender];
        return (p.name, p.age, p.email);
    }  
    function getPatientInfoAll(address _address) public view returns(string memory, uint8, string memory) {
        patient storage p = patients[_address];
        return (p.name, p.age, p.email);
    }
    function getDoctorInfo() public view checkDoctor(msg.sender) returns(string memory, uint8,string memory, string memory) {
        doctor storage d = doctors[msg.sender];
        return (d.name, d.age, d.email, d.specialization);
    }
    function getDoctorInfoAll(address _address) public view returns(string memory, uint8,string memory, string memory) {
        doctor storage d = doctors[_address];
        return (d.name, d.age, d.email, d.specialization);
    }
    function registerDoctor(string memory _name, uint8 _age,string memory _email, string memory _specialization) public {
        doctor storage d = doctors[msg.sender];
        require(keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked("")));
        require(keccak256(abi.encodePacked(_email)) != keccak256(abi.encodePacked("")));
        require(keccak256(abi.encodePacked(_specialization)) != keccak256(abi.encodePacked("")));
        require((_age > 0) && (_age < 100));
        require(!(d.id > address(0x0)));
        doctors[msg.sender] = doctor({name:_name,age:_age,id:msg.sender,email:_email, specialization:_specialization});
        emit NPatient(msg.sender, _name);
    }  
}
