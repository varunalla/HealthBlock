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

    struct hcprovider {
        string name;
        string email;
        string providerAddress;
        string phone;
        address id;
    }

    struct doctor {
        string name;
        uint8 age;
        string email;
        string specialization;
        address id;
    }

    
    enum RequestStatus {PENDING, APPROVED, REJECTED}

    struct medicalRecordRequest{
        address doctorAddress;
        address patientAddress;
        RequestStatus status;
    }

    mapping(address => mapping(address => medicalRecordRequest[])) public recordRequests;
    event RequestCreated(address indexed doctorAddress, address indexed patientAddress);
    event RequestApproved(address indexed doctorAddress, address indexed patientAddress);
    event RequestRejected(address indexed doctorAddress, address indexed patientAddress);

    function requestMedicalRecord(address patientAddress) public {
        medicalRecordRequest storage request = recordRequests[msg.sender][patientAddress];

        require(request.doctorAddress == address(0), "Request already exists");
        require(request.patientAddress == address(0), "Request already exists");

        request.doctorAddress = msg.sender;
        request.patientAddress = patientAddress;
        request.status = RequestStatus.PENDING;

        emit RequestCreated(msg.sender, patientAddress);
    }

    function approveMedicalRecordsRequest(address doctorAddress) public {        
        medicalRecordRequest storage request = recordRequests[doctorAddress][msg.sender];

        require(request.doctorAddress != address(0), "Request does not exist");
        require(request.patientAddress != address(0), "Request does not exist");
        require(request.status == RequestStatus.PENDING, "Request is not in pending status");

        request.status = RequestStatus.APPROVED;

        emit RequestApproved(doctorAddress, msg.sender);
    }

    function rejectMedicalRecordsRequest(address doctorAddress) public {
        medicalRecordRequest storage request = recordRequests[doctorAddress][msg.sender];
        require(doctorAddress != address(0), "Invalid doctor address");
        require(request.doctorAddress != address(0), "Request does not exist");
        require(request.patientAddress != address(0), "Request does not exist");
        require(request.status == RequestStatus.PENDING, "Request is not in pending status");

        request.status = RequestStatus.REJECTED;

        emit RequestRejected(doctorAddress, msg.sender);
    }

    event DoctorRequestRaised(address indexed doctor, string indexed doctorName, string credentialsHash);
    event RequestApproved(address indexed doctor, address indexed provider, uint256 indexed requestId);
    event RequestRejected(address indexed doctor, address indexed provider, uint256 indexed requestId);

    struct Request {
        address doctor;
        string doctorName;
        string credentialsHash;
        bool approved;
    }
    mapping(address => Request[]) private doctorRequests;

   /*
    * @dev Set contract deployer as owner
    */
    constructor() {
        owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function raiseRequest(string memory doctorName, string memory credentialsHash) public {
        Request memory request = Request({
            doctor: msg.sender,
            doctorName: doctorName,
            credentialsHash: credentialsHash,
            approved: false
        });
        doctorRequests[owner].push(request);
        emit DoctorRequestRaised(msg.sender, doctorName, credentialsHash);
    }

    function getRequests() public view returns(Request[] memory) {
        require(msg.sender == owner, "Only owner can call this function");
        return doctorRequests[owner];
    }

    function approveRequest(uint256 requestId) public {
        require(msg.sender == owner, "Only owner can call this function");
        Request storage request = doctorRequests[owner][requestId];
        require(!request.approved, "Request is already approved");
        request.approved = true;
        emit RequestApproved(request.doctor, owner, requestId);
    }

    function rejectRequest(uint256 requestId) public {
        require(msg.sender == owner, "Only owner can call this function");
        Request storage request = doctorRequests[owner][requestId];
        require(!request.approved, "Request is already rejected");
        request.approved = false;
        emit RequestRejected(request.doctor, owner, requestId);
    }

    // event for EVM logging
    event NPatient(address indexed _from, string indexed _name);
    event NDoctor(address indexed _from, string indexed _name);
    event NHCProvider(address indexed _from, string indexed _name);
    mapping (address => patient) public patients;
    mapping (address => doctor) internal doctors;
    mapping (address => hcprovider) internal hcproviders;

    modifier checkHealthCareProvider(address id) {
            hcprovider storage h = hcproviders[id];
            require(h.id > address(0x0));//check if HealthCare Provider exists
            _;
    }

    modifier checkDoctor(address id) {
        doctor storage d = doctors[id];
        require(d.id > address(0x0));//check if doctor exists
        _;
    }
    
    modifier checkPatient(address id) {
        patient storage p = patients[id];
        require(p.id > address(0x0));//check if patient exist
        _;
    }
    
    modifier checkRequests(address id) {
        patient storage p = patients[id];
        require(p.id > address(0x0));//check if patient exist
        _;
    }

    function getPatientInfo() public view checkPatient(msg.sender) returns(string memory, uint8, string memory) {
        patient storage p = patients[msg.sender];
        return (p.name, p.age, p.email);
    }  
    function getPatientInfoAll(address _address) public view returns(string memory, uint8, string memory) {
        patient storage p = patients[_address];
        return (p.name, p.age, p.email);
    }
    function registerPatient(string memory _name, uint8 _age,string memory _email) public {
        //patient storage p = patients[msg.sender];
        require(keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked("")));
        require(keccak256(abi.encodePacked(_email)) != keccak256(abi.encodePacked("")));
        require((_age > 0) && (_age < 100));
        patients[msg.sender] = patient({name:_name,age:_age,id:msg.sender,email:_email});
        emit NPatient(msg.sender, _name);
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
    function getHCProviderInfo() public view checkHealthCareProvider(msg.sender) returns(string memory, string memory, string memory,  string memory) {
            hcprovider storage h = hcproviders[msg.sender];
            return (h.name, h.email, h.providerAddress, h.phone);
    }
    function getHCProviderInfoAll(address _address) public view returns(string memory, string memory, string memory, string memory) {
        hcprovider storage h = hcproviders[_address];
        return (h.name, h.email, h.providerAddress, h.phone);
    }
    function registerHCProvider(string memory _name, string memory _email, string memory _address, string memory _phone) public {
            hcprovider storage h = hcproviders[msg.sender];
            require(keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked("")));
            require(keccak256(abi.encodePacked(_email)) != keccak256(abi.encodePacked("")));
            require(keccak256(abi.encodePacked(_address)) != keccak256(abi.encodePacked("")));
            require(keccak256(abi.encodePacked(_phone)) != keccak256(abi.encodePacked("")));
            require(!(h.id > address(0x0)));
            hcproviders[msg.sender] = hcprovider({name:_name, email:_email, providerAddress:_address, phone:_phone, id:msg.sender});
    } 
}
