const HealthBlockTest = artifacts.require("HealthBlock");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("HealthBlockTest", function (/* accounts */) {
  it("should assert true", async function () {
    const inst = await HealthBlockTest.deployed();
    await inst.registerPatient("varun", 32, "varun.alla@gmail.com");
    t = await inst.registerPatient();
    console.log(t)
    return assert.isTrue(true);
  });
});
