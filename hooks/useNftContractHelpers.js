import { useState } from "react";
import { utils } from "ethers";
export function useNftContractHelpers({ instantiateContract, getProviderOrSigner }) {
	const [presaleStarted, setPresaleStarted] = useState(false);
	const [presaleEnded, setPresaleEnded] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	const [tokenIdsMinted, setTokenIdsMinted] = useState(0);

	const [isStartingPresale, setIsStartingPresale] = useState(false);

	const [isMintingNft, setIsMintingNft] = useState(false);

	const presaleMint = async () => {
		setIsMintingNft(true);
		try {
			const { signer, contract: whitelistContract } = await instantiateContract(true);

			const tx = await whitelistContract.presaleMint({
				//Cost of one phitnft is 0.01eth
				value: utils.parseEther("0.01"),
			});
			await tx.wait();

			setIsMintingNft(false);
			window.alert("You successfully minted a Phit NFT");
		} catch (err) {
			console.error(err);
		}
	};

	const publicMint = async () => {
		try {
			const { signer, contract: whitelistContract } = await instantiateContract(true);

			const tx = await whitelistContract.mint({
				value: utils.parseEther("0.01"),
			});
			setLoading(true);
			// wait for the transaction to get mined
			await tx.wait();
			setLoading(false);
			window.alert("You successfully minted a Phit NFT");
		} catch (err) {
			console.error(err);
		}
	};

	const startPresale = async () => {
		setIsStartingPresale(true);
		try {
			const { contract: whitelistContract } = await instantiateContract(true);

			const tx = await whitelistContract.startPresale();
			// wait for the transaction to get mined
			await tx.wait();
			setIsStartingPresale(false);

			// await checkIfPresaleStarted();
		} catch (err) {
			console.error(err);
		}
	};

	const checkIfPresaleStarted = async () => {
		try {
			//Since we are just reading
			const { signer, contract: whitelistContract } = await instantiateContract();

			const _presaleStarted = await whitelistContract.presaleStarted();
			// const mintedAddresses = await whitelistContract.listOfAddressesThatHaveMinted(1);
			// const _mintedAddresses = await whitelistContract.listOfAddressesThatHaveMintedLUT("");

			// console.log(mintedAddresses, "TEH MINTED ADDRESS");
			// console.log(_mintedAddresses, "TEH MINTED ADDRESS");
			if (!_presaleStarted) {
				await getOwner();
			}

			setPresaleStarted(_presaleStarted);
			return _presaleStarted;
		} catch (err) {
			console.error(err);
			return false;
		}
	};

	const checkIfPresaleEnded = async () => {
		try {
			const { contract: whitelistContract } = await instantiateContract();

			const _presaleEnded = await whitelistContract.presaleEnded();
			const hasEnded = _presaleEnded.lt(Math.floor(Date.now() / 1000));
			if (hasEnded) {
				setPresaleEnded(true);
			} else {
				setPresaleEnded(false);
			}
			return hasEnded;
		} catch (err) {
			console.error(err);
			return false;
		}
	};

	const getTokenIdsMinted = async () => {
		try {
			const { contract: whitelistContract } = await instantiateContract();

			const _tokenIds = await whitelistContract.tokenIds();

			setTokenIdsMinted(_tokenIds.toString());
		} catch (err) {
			console.error(err);
		}
	};

	const getOwner = async () => {
		try {
			const { contract: whitelistContract } = await instantiateContract();

			const _owner = await whitelistContract.owner();
			const signer = await getProviderOrSigner(true);

			const address = await signer.getAddress();
			if (address.toLowerCase() === _owner.toLowerCase()) {
				setIsOwner(true);
			}
		} catch (err) {
			console.error(err.message);
		}
	};

	return {
		presaleMint,
		publicMint,
		startPresale,
		checkIfPresaleEnded,
		getTokenIdsMinted,
		checkIfPresaleStarted,
		presaleEnded,
		presaleStarted,
		loading,
		isOwner,
		tokenIdsMinted,
		isStartingPresale,
		isMintingNft,
	};
}
