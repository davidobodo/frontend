import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { abi, PHIT_NFTS_CONTRACT_ADDRESS } from "../constants";
import { useNftContractHelpers } from "../hooks/useNftContractHelpers";
import { useEthProviderConnection } from "../hooks/useEthProviderConnection";
import { CallToAction } from "../components";
const styles = {};

export default function Home() {
	const {
		isUsersWalletConnected,
		hasMetamask,
		isCheckingProvider,
		checkIfUserHasProvider,
		connectedWallets,
		getProviderOrSigner,
		instantiateContract,
		web3ModalRef,
	} = useEthProviderConnection();

	console.log(isCheckingProvider, " IS CHECKING PROVIDER");

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
	} = useNftContractHelpers({ instantiateContract, getProviderOrSigner });

	const connectWallet = async () => {
		try {
			await getProviderOrSigner();
		} catch (err) {
			console.log(err, "THE ERROR WHEN CONNECTING TO WALLET");
		}
	};

	const onConnectWallet = async () => {
		if (!hasMetamask) {
			alert("Error: Please install metamask and try again");
			return;
		}

		connectWallet();
	};

	//----------------------------------------
	//INITIALIZE APP
	//----------------------------------------

	useEffect(() => {
		if (!isUsersWalletConnected) {
			web3ModalRef.current = new Web3Modal({
				network: "rinkeby",
				providerOptions: {},
				disableInjectedProvider: false,
			});

			const initApp = async () => {
				try {
					const provider = await checkIfUserHasProvider();
					if (provider) {
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
				} catch (err) {
					console.log(err);
				}
			};
			initApp();
		}
	}, [isUsersWalletConnected]);

	console.log(isOwner, "IS OWNER");

	const generateLinkFromTokenId = (id) => {
		return `https://testnets.opensea.io/assets/rinkeby/${PHIT_NFTS_CONTRACT_ADDRESS}/${id}`;
	};

	return (
		<div className="bg-black min-h-screen relative">
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
					<CallToAction
						isUsersWalletConnected={isUsersWalletConnected}
						connectWallet={connectWallet}
						loading={loading}
						presaleStarted={presaleStarted}
						presaleEnded={presaleEnded}
						isOwner={isOwner}
						startPresale={startPresale}
						presaleMint={presaleMint}
						publicMint={publicMint}
					/>

					{/* <p>
						See your NFT{" "}
						<a href={generateLinkFromTokenId("1")} target="_blank">
							here
						</a>
					</p> */}

					<section>
						<h2>Connected wallets</h2>
						<ul>
							{connectedWallets.map((item) => {
								return <li key={item}>{item}</li>;
							})}
						</ul>
					</section>
				</div>
			</div>
		</div>
	);
}
