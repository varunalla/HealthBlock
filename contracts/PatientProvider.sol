// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

//https://ethereum.stackexchange.com/questions/8615/child-contract-vs-struct?newreg=9940955131d740a1a85cef648b771ef3
contract PatientProvider {
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

    function approvePatientProviderRequest(address _patient) public {
        require(providerPatients[msg.sender].requestedPatients[_patient], "You have not received a request from this patient.");
        require(patientsProviders[_patient].requestedProviders[msg.sender], "You have not received a request from this patient.");
        delete patientsProviders[_patient].requestedProviders[msg.sender];
        patientsProviders[_patient].providers.push(msg.sender);
        delete providerPatients[msg.sender].requestedPatients[_patient];
        providerPatients[msg.sender].patients.push(_patient);
    }
     function rejectPatientProviderRequest(address _patient) public {
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
    
    function getProviderRequests() public view returns (address[] memory) {
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

    function getProviderPatients() public view returns (address[] memory) {
        require(providerPatients[msg.sender].exists, "You do not have any patients");
        return providerPatients[msg.sender].patients;
    }
}
