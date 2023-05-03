const HealthBlock = artifacts.require("./HealthBlock.sol");
contract("HealthBlock", (accounts) => {
  it("create patient ", async () => {
    //ait for the contract
    const healthBlock = await HealthBlock.deployed();

    //set a variable to false and get event listener

    //var event = ()
    //await healthBlock.
    //call the contract function  which sends the ipfs address
    await ipfsInbox.sendIPFS(accounts[1], "sampleAddress", {
      from: accounts[0],
    });
    assert.equal(
      eventEmitted,
      true,
      "sending an IPFS request does not emit an event"
    );
  });
});
