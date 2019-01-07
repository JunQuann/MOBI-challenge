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

    enum chargeStatus { pending, rejected, reserved, paid }

    struct Charges {
        uint chargeId;
        chargeStatus status;
        address guest;
        Charger charger;
        uint value;
        uint64 startDatetime;
        uint64 endDatetime;
    }

    mapping(address => uint8[]) public guestChargesId;
    mapping(address => uint8[]) public hostChargesId;
    mapping(uint8 => Charges) public allCharges;
    uint8 public chargesCount;

    mapping(address => uint256) walletBalance;

    // Every address can only register one charger
    mapping(uint => Charger) public chargers;
    mapping(address => uint) public chargersId;
    uint public chargersCount;

    function requestCharge (
        address owner, uint chargerId, uint64 startDatetime, uint64 endDatetime
    ) public payable {
        chargesCount++;
        allCharges[chargesCount] = Charges(
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

    // function updateChargeStatus (
    //     uint8 chargerId, string memory status
    // ) public {

    // }

    // function withdraw() public {

    // }

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
        requestCharge(address(0xaC0A4266B7a2B6D4AF8721b51B9D1FDaF8173E38), 1, 1546903257, 1546904123);
    }
}