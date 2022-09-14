import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Contract, providers, utils } from "ethers";
import { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { abi, PHIT_NFTS_CONTRACT_ADDRESS } from "../constants";
import { useNftContractHelpers } from "../hooks/useNftContractHelpers";

export default function Home() {
	const [isUsersWalletConnected, setIsUsersWalletConnected] = useState(false);

	const web3ModalRef = useRef();

	const instantiateContract = async (needSigner = false) => {
		const signer = await getProviderOrSigner(needSigner);
		const contract = new Contract(PHIT_NFTS_CONTRACT_ADDRESS, abi, signer);

		return {
			signer,
			contract,
		};
	};

	const {
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
	} = useNftContractHelpers({ instantiateContract });

	const getProviderOrSigner = async (needSigner = false) => {
		// Connect to Metamask
		// Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
		const provider = await web3ModalRef.current.connect();
		const web3Provider = new providers.Web3Provider(provider);

		// If user is not connected to the Rinkeby network, let them know and throw an error
		const { chainId } = await web3Provider.getNetwork();
		if (chainId !== 4) {
			window.alert("Change the network to Rinkeby");
			throw new Error("Change network to Rinkeby");
		}

		if (needSigner) {
			const signer = web3Provider.getSigner();
			return signer;
		}
		return web3Provider;
	};

	const connectWallet = async () => {
		try {
			await getProviderOrSigner();
			setIsUsersWalletConnected(true);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		if (!isUsersWalletConnected) {
			web3ModalRef.current = new Web3Modal({
				network: "rinkeby",
				providerOptions: {},
				disableInjectedProvider: false,
			});
			connectWallet();

			const _presaleStarted = checkIfPresaleStarted();
			if (_presaleStarted) {
				checkIfPresaleEnded();
			}

			getTokenIdsMinted();

			const presaleEndedInterval = setInterval(async function () {
				const _presaleStarted = await checkIfPresaleStarted();
				if (_presaleStarted) {
					const _presaleEnded = await checkIfPresaleEnded();
					if (_presaleEnded) {
						clearInterval(presaleEndedInterval);
					}
				}
			}, 5 * 1000);

			setInterval(async function () {
				await getTokenIdsMinted();
			}, 5 * 1000);
		}
	}, [isUsersWalletConnected]);

	const renderButton = () => {
		if (!isUsersWalletConnected) {
			return (
				<button onClick={connectWallet} className={styles.button}>
					Connect your wallet
				</button>
			);
		}

		if (loading) {
			return <button className={styles.button}>Loading...</button>;
		}

		if (isOwner && !presaleStarted) {
			return (
				<button className={styles.button} onClick={startPresale}>
					Start Presale !
				</button>
			);
		}

		if (!presaleStarted) {
			return (
				<div>
					<div className={styles.description}>Presale hasnt started!</div>
				</div>
			);
		}

		if (presaleStarted && !presaleEnded) {
			return (
				<div>
					<div className={styles.description}>
						Presale has started!!! If your address is whitelisted, Mint a PHIT NFT 🥳
					</div>
					<button className={styles.button} onClick={presaleMint}>
						Presale Mint 🚀
					</button>
				</div>
			);
		}

		if (presaleStarted && presaleEnded) {
			return (
				<button className={styles.button} onClick={publicMint}>
					Public Mint 🚀
				</button>
			);
		}
	};

	const generateLinkFromTokenId = (id) => {
		return `https://testnets.opensea.io/assets/rinkeby/${PHIT_NFTS_CONTRACT_ADDRESS}/${id}`;
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>PHIT NFTS</title>
				<meta name="description" content="Phit Nfts" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className={styles.main}>
				<div>
					<h1 className={styles.title}>Welcome to Phit Nfts!</h1>
					<div className={styles.description}>Its an NFT collection.</div>
					<div className={styles.description}>{tokenIdsMinted}/20 have been minted</div>
					{renderButton()}

					<p>
						See your NFT{" "}
						<a href={generateLinkFromTokenId("1")} target="_blank">
							here
						</a>
					</p>

					<p>Connected wallet: </p>
				</div>
				<div>{/* <img className={styles.image} src="./cryptodevs/0.svg" /> */}</div>
			</div>

			<footer className={styles.footer}>Made with &#10084; by Crypto Devs</footer>
		</div>
	);
}
