pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

contract P2Pcharging {

    struct Charger {
        uint chargerId;
        address owner;
        string chargerAddress;
        string chargerType;
        uint chargerAmps;
        uint chargerVoltage;
    }

    enum chargeStatus { pending, rejected, reserved, completed }

    struct Charge {
        uint chargeId;
        chargeStatus status;
        address guest;
        Charger charger;
        uint value;
        uint64 startDatetime;
        uint64 endDatetime;
    }

    mapping(address => uint[]) public guestChargesId;
    mapping(address => uint[]) public hostChargesId;
    mapping(uint => Charge) public allCharges;
    uint public chargesCount;

    mapping(address => uint) public walletBalance;

    // Every address can only register one charger
    mapping(uint => Charger) public chargers;
    mapping(address => uint) public chargersId;
    uint public chargersCount;

    function requestCharge (
        address owner, uint chargerId, uint64 startDatetime, uint64 endDatetime
    ) public payable {
        chargesCount++;
        allCharges[chargesCount] = Charge(
            chargesCount,
            chargeStatus.pending,
            msg.sender,
            chargers[chargerId],
            msg.value,
            startDatetime,
            endDatetime
        );
        guestChargesId[msg.sender].push(chargesCount);
        hostChargesId[owner].push(chargesCount);
    }

    function hashCompareWithLengthCheck(string memory a, string memory b) internal pure returns (bool) {
        if(bytes(a).length != bytes(b).length) {
            return false;
        } else {
            return keccak256(bytes(a)) == keccak256(bytes(b));
        }
    }

    function updateChargeStatus (
        uint8 chargeId, string memory status
    ) public {
        require(allCharges[chargeId].status != chargeStatus.rejected);
        require(allCharges[chargeId].status != chargeStatus.completed);
        if(hashCompareWithLengthCheck(status, "1") && allCharges[chargeId].status == chargeStatus.pending) {
            rejectChargeRequest(chargeId);
        } else if(hashCompareWithLengthCheck(status, "2") && allCharges[chargeId].status == chargeStatus.pending) {
            approveChargeRequest(chargeId);
        } else if(hashCompareWithLengthCheck(status, "3") && allCharges[chargeId].status == chargeStatus.reserved) {
            completeChargeRequest(chargeId);
        }
    }

    function approveChargeRequest(uint chargeId) internal {
        allCharges[chargeId].status = chargeStatus.reserved;
    }

    function rejectChargeRequest(uint chargeId) internal {
        allCharges[chargeId].status = chargeStatus.rejected;
        address guest = allCharges[chargeId].guest;
        uint value = allCharges[chargeId].value;
        walletBalance[guest] = value;
    }

    function completeChargeRequest(uint chargeId) internal {
        allCharges[chargeId].status = chargeStatus.completed;
        address owner = allCharges[chargeId].charger.owner;
        uint value = allCharges[chargeId].value;
        walletBalance[owner] = value;
    }

    function withdraw() public returns (bool) {
        msg.sender.transfer(walletBalance[msg.sender]);
        walletBalance[msg.sender] = 0;
        return true;
    }

    function registerCharger(
        string memory chargerAddress, string memory chargerType, uint chargerAmps, uint chargerVoltage
        ) public {
        require(chargersId[msg.sender] == 0);
        chargersCount++;
        chargersId[msg.sender] = chargersCount;
        chargers[chargersCount] = Charger(
            chargersCount, 
            msg.sender, 
            chargerAddress, 
            chargerType, 
            chargerAmps, 
            chargerVoltage 
        );
    }

    function getGuestChargesId() public view returns (uint[] memory) {
        uint numGuestCharges = guestChargesId[msg.sender].length;
        uint[] memory chargesId = new uint[](numGuestCharges);
        for(uint i = 0; i < numGuestCharges; i++) {
            chargesId[i] = guestChargesId[msg.sender][i];
        }
        return chargesId;
    }

    function getHostChargesId() public view returns (uint[] memory) {
        uint numHostCharges = hostChargesId[msg.sender].length;
        uint[] memory chargesId = new uint[](numHostCharges);
        for(uint i = 0; i < numHostCharges; i++) {
            chargesId[i] = hostChargesId[msg.sender][i];
        }
        return chargesId;
    }

    // Get charger based on the address of the owner
    function getCharger(uint chargerId) public view returns (Charger memory) {
        require(chargerId != 0);
        Charger memory charger = chargers[chargerId];
        return charger;
    }


    // Initialized with 1 Charger for testing purposes
    constructor() public {
        registerCharger("68 Willow Rd, Menlo Park, CA 94025, USA", "CHAdeMO", 30, 240);
        // Initialized 1 charge for testing purposes
        requestCharge(address(0xaC0A4266B7a2B6D4AF8721b51B9D1FDaF8173E38), 1, 1546903257, 1546907844);
    }
}