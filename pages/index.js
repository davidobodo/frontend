import Head from "next/head";
import Web3Modal from "web3modal";
import { useEffect } from "react";
import { PHIT_NFTS_CONTRACT_ADDRESS } from "../constants";
import { useNftContractHelpers } from "../hooks/useNftContractHelpers";
import { useEthProviderConnection } from "../hooks/useEthProviderConnection";
import { CallToAction, Loader, Particles } from "../components";

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
		isStartingPresale,
		isMintingNft,
		getUsersTokenIdMinted,
		usersTokenId,
	} = useNftContractHelpers({ instantiateContract, getProviderOrSigner, connectedWallets });

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
					}
				} catch (err) {
					console.log(err);
				}
			};
			initApp();
		} else {
			getUsersTokenIdMinted();
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

	const generateLinkFromTokenId = (id) => {
		const url = `https://testnets.opensea.io/assets/rinkeby/${PHIT_NFTS_CONTRACT_ADDRESS}/${id}`;

		const win = window.open(`${url}`, "_blank");
		win.focus();
	};

	return (
		<div className="bg-black min-h-screen relative text-white">
			<Head>
				<title>PHIT NFTS</title>
				<meta name="description" content="Phit Nfts" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Particles />
			<div className="relative z-10 h-screen flex flex-col items-center justify-center text-center">
				<FullLoader
					isCheckingProvider={isCheckingProvider}
					isStartingPresale={isStartingPresale}
					isMintingNft={isMintingNft}
				/>
				<h1 className="text-[12vw] font-druk leading-[0.8em] mb-6">Phit NFTS</h1>
				<div className="text-base md:text-[1.5vw] mb-6">
					An NFT collection of{" "}
					<a href="https://www.davidobodo.com/" target="_blank" className="underline">
						David Obodo
					</a>
				</div>
				{isUsersWalletConnected && (
					<div className="text-base md:text-[1.5vw] mb-6">{tokenIdsMinted}/5 have been minted</div>
				)}
				<CallToAction
					isUsersWalletConnected={isUsersWalletConnected}
					connectWallet={onConnectWallet}
					loading={loading}
					presaleStarted={presaleStarted}
					presaleEnded={presaleEnded}
					isOwner={isOwner}
					startPresale={startPresale}
					presaleMint={presaleMint}
					publicMint={publicMint}
					usersTokenId={usersTokenId}
					generateLinkFromTokenId={generateLinkFromTokenId}
				/>

				{connectedWallets.length > 0 && (
					<p className="absolute top-[10px] translate-x-[-50%] left-[50%] ">Connected Wallet: {connectedWallets[0]}</p>
				)}

				<p className="text-white text-base absolute bottom-[10px] px-4">
					NOTE: This project is a &quot;modified clone&quot; of &nbsp;
					<a href="https://github.com/LearnWeb3DAO/Whitelist-Dapp" target="_blank" className="underline">
						LearnWeb3 Whitelist Dapp
					</a>
					,&nbsp; as one of the best ways to ensure knowledge sticks is to modify a tutorial. <br /> 5000 thumbs up 👍🏾
					to{" "}
					<a href="https://learnweb3.io/" target="_blank" className="underline">
						LearnWeb3
					</a>{" "}
					for making learning web3 easy
				</p>
			</div>
		</div>
	);
}

function FullLoader({ isCheckingProvider, isStartingPresale, isMintingNft }) {
	const show = isCheckingProvider || isStartingPresale || isMintingNft;

	if (!show) return null;

	let message = "";

	if (isCheckingProvider) {
		message = "Checking Eth Provider...";
	}

	if (isStartingPresale) {
		message = "Starting Presale...";
	}

	if (isMintingNft) {
		message = "Minting Nft...";
	}

	return <Loader text={message} />;
}
