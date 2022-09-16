import { Button } from "../.";

export default function CallToAction({
	isUsersWalletConnected,
	connectWallet,
	loading,
	presaleStarted,
	presaleEnded,
	isOwner,
	startPresale,
	presaleMint,
	publicMint,
}) {
	if (!isUsersWalletConnected) {
		return <Button onClick={connectWallet}>Connect your wallet</Button>;
	}

	if (loading) {
		return <Button>Loading...</Button>;
	}

	if (isOwner && !presaleStarted) {
		return <Button onClick={startPresale}>Start Presale !</Button>;
	}

	if (!presaleStarted) {
		return (
			<div>
				<div>Presale hasnt started!</div>
			</div>
		);
	}

	if (presaleStarted && !presaleEnded) {
		return (
			<div>
				<div>Presale has started!!! If your address is whitelisted, Mint a PHIT NFT 🥳</div>
				<Button onClick={presaleMint}>Presale Mint 🚀</Button>
			</div>
		);
	}

	if (presaleStarted && presaleEnded) {
		return <Button onClick={publicMint}>Public Mint 🚀</Button>;
	}

	//If you have minted an nft show link to the minted nft, cause users should only be able to mint just one nft for now
}
