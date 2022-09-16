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
		return <button onClick={connectWallet}>Connect your wallet</button>;
	}

	if (loading) {
		return <button>Loading...</button>;
	}

	if (isOwner && !presaleStarted) {
		return <button onClick={startPresale}>Start Presale !</button>;
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
				<button onClick={presaleMint}>Presale Mint 🚀</button>
			</div>
		);
	}

	if (presaleStarted && presaleEnded) {
		return <button onClick={publicMint}>Public Mint 🚀</button>;
	}
}
