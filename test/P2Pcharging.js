const P2Pcharging = artifacts.require("P2Pcharging");


contract("P2Pcharging", accounts => {
    it("initializes with the correct charger", async () => {
        const P2PchargingInstance = await P2Pcharging.deployed();
        const chargerId = await P2PchargingInstance.chargersId(accounts[0])
        assert.equal(chargerId, 1, "1 charger correctly initialized")
        const charger = await P2PchargingInstance.chargers(chargerId);
        assert.equal(charger.owner, accounts[0], "Owner address registered");
        assert.equal(charger.chargerAddress, "68 Willow Rd, Menlo Park, CA 94025, USA", "Charger Address registered");
        assert.equal(charger.chargerType, "CHAdeMO", "Charger Type registered");
        assert.equal(charger.chargerAmps, 30, "Charger Amp registered");
        assert.equal(charger.chargerVoltage, 240, "Charger Voltage registered");
    }),
    it("allows owner to register their chargers", async () => {
        const P2PchargingInstance = await P2Pcharging.deployed();
        await P2PchargingInstance.registerCharger("31 Saw Mill Ct, Mountain View, CA 94043, USA", "CHAdeMO", 30, 240, {
            from: accounts[1]
        });
        const chargersCount = await P2PchargingInstance.chargersCount(); 
        assert.equal(chargersCount, 2, "Charger count correctly added");
        const chargerId = await P2PchargingInstance.chargersId(accounts[1]);
        assert.equal(chargerId, 2, "Charger Id correctly added")
        const charger = await P2PchargingInstance.chargers(chargerId)
        assert.equal(charger.owner, accounts[1], "Owner address registered");
        assert.equal(charger.chargerAddress, "31 Saw Mill Ct, Mountain View, CA 94043, USA", "Charger Address registered");
        assert.equal(charger.chargerType, "CHAdeMO", "Charger Type registered");
        assert.equal(charger.chargerAmps, 30, "Charger Amp registered");
        assert.equal(charger.chargerVoltage, 240, "Charger Voltage registered");
    }),
    it("allows user to request a charger", async () => {
        const P2PchargingInstance = await P2Pcharging.deployed();
        const owner = accounts[0];
        const guest = accounts[1];
        const chargerId = 1;
        await P2PchargingInstance.requestCharge(owner, chargerId, 1546844450, 1546844582, {
            from: guest,
            value: web3.utils.toWei("2", "finney")
        })
        const chargesCount = await P2PchargingInstance.chargesCount();
        assert.equal(chargesCount, 2, "Charge count correct added")
        let guestChargesId = await P2PchargingInstance.getGuestChargesId({
            from: guest
        });
        guestChargesId = guestChargesId.map(BN => BN.toNumber());
        let hostChargesId = await P2PchargingInstance.getHostChargesId({
            from: owner
        });
        hostChargesId = hostChargesId.map(BN => BN.toNumber());
        assert.equal(guestChargesId[0], 2, "first charge correctly registered for guest");
        assert.equal(hostChargesId[1], 2, "second charge correctly registered for host");
        const charge = await P2PchargingInstance.allCharges(2);
        assert.equal(charge.value, web3.utils.toWei("2", "finney"), "Value correctly recorded");
    }),
    it("allows user to reject charge status", async () => {
        const P2PchargingInstance = await P2Pcharging.deployed();
        const owner = accounts[0];
        const guest = accounts[1];
        const chargerId = 1;
        await P2PchargingInstance.requestCharge(owner, chargerId, 1546844450, 1546844582, {
            from: guest,
            value: web3.utils.toWei("2", "finney")
        })
        const chargeId = 1;
        let charge = await P2PchargingInstance.allCharges(chargeId);
        const value = charge.value.toNumber();
        assert.equal(charge.status, "0", "charge initialized with pending state")
        await P2PchargingInstance.updateChargeStatus(chargeId, "1");
        charge = await P2PchargingInstance.allCharges(chargeId);
        let balance = await P2PchargingInstance.walletBalance(guest)
        assert.equal(charge.status, "1", "charge updated with rejected state")
        assert.equal(balance, value, "balance successfully refunded to guest")
    }),
    it("allows user to approve charge status", async () => {
        const P2PchargingInstance = await P2Pcharging.deployed();
        const owner = accounts[0];
        const guest = accounts[1];
        const chargerId = 1;
        await P2PchargingInstance.requestCharge(owner, chargerId, 1546844450, 1546844582, {
            from: guest,
            value: web3.utils.toWei("2", "finney")
        })
        const chargeId = 2;
        let charge = await P2PchargingInstance.allCharges(chargeId);
        assert.equal(charge.status, "0", "charge initialized with pending state")
        await P2PchargingInstance.updateChargeStatus(chargeId, "2");
        charge = await P2PchargingInstance.allCharges(chargeId);
        assert.equal(charge.status, "2", "charge updated with reserved state")
    }),
    it("allows user to complete charge status", async () => {
        const P2PchargingInstance = await P2Pcharging.deployed();
        const owner = accounts[0];
        const guest = accounts[1];
        const chargerId = 1;
        await P2PchargingInstance.requestCharge(owner, chargerId, 1546844450, 1546844582, {
            from: guest,
            value: web3.utils.toWei("2", "finney")
        })
        const chargeId = 3;
        let charge = await P2PchargingInstance.allCharges(chargeId);
        const value = charge.value.toNumber();
        assert.equal(charge.status, "0", "charge initialized with pending state")
        await P2PchargingInstance.updateChargeStatus(chargeId, "2");
        await P2PchargingInstance.updateChargeStatus(chargeId, "3");
        charge = await P2PchargingInstance.allCharges(chargeId);
        balance = await P2PchargingInstance.walletBalance(owner)
        assert.equal(charge.status, "3", "charge updated with completed state")
        assert.equal(balance, value, "balance successfully transferred to owner")
    })
})