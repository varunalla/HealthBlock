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
    struct MedicalRecordRequest{
        string requestId;
        address patientAddress;
        address doctorAddress;
        string docEmail;
        string patientName;
        string patientEmail;
        string status;
    }

    mapping(address => MedicalRecordRequest[]) public recordRequests;
    event MedicalRecordRequestCreated(address indexed doctorAddress, address indexed patientAddress, string requestId);
    event MedicalRecordRequestApproved(address indexed doctorAddress, address indexed patientAddress, string requestId);
    event MedicalRecordRequestRejected(address indexed doctorAddress, address indexed patientAddress, string requestId);


    function requestMedicalRecord(string memory docEmail, address patientAddress, string memory patientName, string memory patientEmail) public {
    string memory requestId = string(abi.encodePacked(docEmail, "_", patientEmail));

       MedicalRecordRequest memory newRequest = MedicalRecordRequest({
            requestId: requestId,
            doctorAddress: msg.sender,
            patientAddress: patientAddress,
            docEmail: docEmail,
            patientName: patientName,
            patientEmail: patientEmail,
            status: "PENDING"
        });

        recordRequests[patientAddress].push(newRequest);
        emit MedicalRecordRequestCreated(msg.sender, patientAddress, requestId);
    }

    function findRequestIndex(string memory requestId, MedicalRecordRequest[] storage requests) private view returns (uint256) {
        for (uint256 i = 0; i < requests.length; i++) {
            if (keccak256(abi.encodePacked(requests[i].requestId)) == keccak256(abi.encodePacked(requestId))) {
                return i;
            }
        }
        return type(uint256).max;
    }

    function approveMedicalRecordsRequest(string memory requestId) public {  
        MedicalRecordRequest[] storage requests = recordRequests[msg.sender];

        uint256 requestIndex = findRequestIndex(requestId, requests);
        requests[requestIndex].status = "APPROVED";
        emit MedicalRecordRequestApproved(requests[requestIndex].doctorAddress, msg.sender, requestId);
    }

    function rejectMedicalRecordsRequest(string memory requestId) public {
        MedicalRecordRequest[] storage requests = recordRequests[msg.sender];

        uint256 requestIndex = findRequestIndex(requestId, requests);
        requests[requestIndex].status = "REJECTED";
        emit MedicalRecordRequestRejected(requests[requestIndex].doctorAddress, msg.sender, requestId);
    }

    function getPatientRequests(address patientAddress) public view returns (MedicalRecordRequest[] memory) {
        return recordRequests[patientAddress];
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
    hcprovider[] public providerList;

   /*
    * @dev Set contract deployer as owner
    */
    constructor() {
        owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner");
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
             providerList.push(hcproviders[msg.sender]);
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
      function getAllProviders() public view returns (hcprovider[] memory) {
        return providerList;
    }
function getAllDoctorsForProvider(address providerAddress) public view returns (doctor[] memory) {
    return providerToDoctors[providerAddress];
}

}
