const { run } = require("hardhat");

async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
}

async function main() {
  // Verify DonationToken
  await verify(
    process.env.DONATION_TOKEN_ADDRESS,
    []
  );

  // Verify CharityNFT
  await verify(
    process.env.CHARITY_NFT_ADDRESS,
    []
  );

  // Verify CharityPlatform
  await verify(
    process.env.CHARITY_PLATFORM_ADDRESS,
    [
      process.env.CHARITY_NFT_ADDRESS,
      process.env.DONATION_TOKEN_ADDRESS
    ]
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });