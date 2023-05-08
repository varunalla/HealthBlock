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
    struct DoctorToProviderRequest {
        string doctorName;
        address doctorAddr;
        string status;
    }

    event DoctorRequestRaised(address indexed doctor, string indexed doctorName, string credentialsHash);
    event RequestApproved(address indexed doctor, address indexed provider, uint256 indexed requestId);
    event RequestRejected(address indexed doctor, address indexed provider, uint256 indexed requestId);

    struct Request {
        address doctor;
        string doctorName;
        string credentialsHash;
        string status;
    }
    mapping(address => Request[]) private doctorRequests;
    mapping(address => doctor[]) public providerToDoctors;
    mapping(address => DoctorToProviderRequest[]) public providerToDoctorRequests;

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
            status: "pending"
        });
        doctorRequests[owner].push(request);
        emit DoctorRequestRaised(msg.sender, doctorName, credentialsHash);
    }

    function getRequests() public view returns(Request[] memory) {
        require(msg.sender == owner, "Only owner can call this function");
        return doctorRequests[owner];
    }

    function rejectRequest(uint256 requestId) public {
        require(msg.sender == owner, "Only owner can call this function");
        Request storage request = doctorRequests[owner][requestId];
        request.status = "rejected";
        emit RequestRejected(request.doctor, owner, requestId);
    }

    function approveRequest(uint256 requestId) public {
        require(msg.sender == owner, "Only owner can call this function");
        Request storage request = doctorRequests[owner][requestId];
        request.status = "approved";
        emit RequestApproved(request.doctor, owner, requestId);
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

    struct PatientProviderRequests {
        bool exists;
        mapping(address => bool) requestedProviders;
        address[] requestedProvidersList;
        address[] providers;
    }
    
    struct ProviderPatientRequests {
        bool exists;
        mapping(address => bool) requestedPatients;
        address[] requestedPatientsList;
        address[] patients;
    }

    mapping (address => PatientProviderRequests) patientsProviders;
    mapping (address => ProviderPatientRequests) providerPatients;

    function requestProvider(address _provider) public {
        require(keccak256(abi.encodePacked(patients[msg.sender].id)) != keccak256(abi.encodePacked("")));
        require(!patientsProviders[msg.sender].requestedProviders[_provider], "You already have a request for this provider.");
        //TODO: create when registering
        patientsProviders[msg.sender].exists = true;
        patientsProviders[msg.sender].requestedProviders[_provider] = true;
        patientsProviders[msg.sender].requestedProvidersList.push(_provider);
        //create when registering
        providerPatients[_provider].exists = true;
        providerPatients[_provider].requestedPatients[msg.sender] = true;
        providerPatients[_provider].requestedPatientsList.push(msg.sender);
    }

    function approvePatientProviderRequest(address _patient) public checkHealthCareProvider(msg.sender){
        require(providerPatients[msg.sender].requestedPatients[_patient], "You have not received a request from this patient.");
        require(patientsProviders[_patient].requestedProviders[msg.sender], "You have not received a request from this patient.");
        delete patientsProviders[_patient].requestedProviders[msg.sender];
        patientsProviders[_patient].providers.push(msg.sender);
        delete providerPatients[msg.sender].requestedPatients[_patient];
        providerPatients[msg.sender].patients.push(_patient);
    }
     function rejectPatientProviderRequest(address _patient) public checkHealthCareProvider(msg.sender){
        require(providerPatients[msg.sender].requestedPatients[_patient], "You have not received a request from this patient.");
        require(patientsProviders[_patient].requestedProviders[msg.sender], "You have not received a request from this patient.");
        patientsProviders[_patient].requestedProviders[msg.sender] = false;
        providerPatients[msg.sender].requestedPatients[_patient] = false;
    }

    function getPatientRequests() public view returns (address[] memory) {
        require(patientsProviders[msg.sender].exists, "You have not made any requests.");
        address[] memory result = new address[](patientsProviders[msg.sender].requestedProvidersList.length);
        for(uint i = 0; i < patientsProviders[msg.sender].requestedProvidersList.length; i++){
           address temp = patientsProviders[msg.sender].requestedProvidersList[i];
              if(patientsProviders[msg.sender].requestedProviders[temp]){
                result[i] = temp;
              }
        }
        return result;
    }
    
    function getProviderRequests() public view checkHealthCareProvider(msg.sender) returns (address[] memory) {
        require(providerPatients[msg.sender].exists, "You are not a registered provider.");
        address[] memory result = new address[](providerPatients[msg.sender].requestedPatientsList.length);
        for(uint i = 0; i < providerPatients[msg.sender].requestedPatientsList.length; i++){
           address temp = providerPatients[msg.sender].requestedPatientsList[i];
              if(providerPatients[msg.sender].requestedPatients[temp]){
                result[i] = temp;
              }
        }
        return result;
    }

    function getPatientProviders() public view returns (address[] memory) {
        require(patientsProviders[msg.sender].exists, "You have not made any requests.");
        return patientsProviders[msg.sender].providers;
    }

    function getProviderPatients() public view checkHealthCareProvider(msg.sender) returns (address[] memory) {
        require(providerPatients[msg.sender].exists, "You do not have any patients");
        return providerPatients[msg.sender].patients;
    }
    function getAllDoctorsForProvider(address providerAddress) public view returns (doctor[] memory) {
        return providerToDoctors[providerAddress];
    }
     function mapDoctorToProvider(address _providerAddress, address _doctorAddress) public {
        doctor storage d = doctors[_doctorAddress];
        uint8 idx =0;
        for(uint8 i =0;i< providerToDoctorRequests[_providerAddress].length;i++){
            if(providerToDoctorRequests[_providerAddress][i].doctorAddr == _doctorAddress) {
                idx = i;
                break;
            }
        }   
        providerToDoctorRequests[_providerAddress][idx].status = 'confirmed';
        providerToDoctors[_providerAddress].push(doctor({name:d.name,email:d.email,specialization:d.specialization,id:_doctorAddress,age:d.age}));
    }

    function declineDoctorToProviderRequest(address _providerAddress, address _doctorAddress) public{
        
        uint8 idx =0;
        for(uint8 i =0;i< providerToDoctorRequests[_providerAddress].length;i++) {
            if(providerToDoctorRequests[_providerAddress][i].doctorAddr == _doctorAddress) { 
                idx = i;
                break;
                
            }
        }
        providerToDoctorRequests[_providerAddress][idx].status = 'rejected';  
    }
    function raiseDoctorToProviderRequest(address _providerAddress,address _doctorAddress, string memory doctorName)public {
            DoctorToProviderRequest memory request = DoctorToProviderRequest({
                doctorName: doctorName,
                doctorAddr: _doctorAddress,
                status:'pending'
            });
  
            providerToDoctorRequests[_providerAddress].push(request);
    }

    function getAllDoctorToProviderRequests(address _hcaddress) public view returns(DoctorToProviderRequest[] memory) {
            return providerToDoctorRequests[_hcaddress];
    }

}
