import detectEthereumProvider from "@metamask/detect-provider";
import { useState, useEffect, useRef } from "react";
import { Contract, providers, utils } from "ethers";
import { abi, PHIT_NFTS_CONTRACT_ADDRESS } from "../constants";

export function useEthProviderConnection() {
	const web3ModalRef = useRef();

	const [currentChainId, setCurrentChainId] = useState();
	const [isUsersWalletConnected, setIsUsersWalletConnected] = useState(false);
	const [connectedWallets, setConnectedWallets] = useState([]);

	const [hasMetamask, setHasMetaMask] = useState(false);
	const [isCheckingProvider, setIsCheckingProvider] = useState(true);

	const checkIfUserHasProvider = async () => {
		setIsCheckingProvider(true);

		try {
			const provider = await detectEthereumProvider();

			if (provider) {
				setIsUsersWalletConnected(true);

				if (provider.selectedAddress) {
					setConnectedWallets([provider.selectedAddress]);
				}
				setHasMetaMask(true);
			} else {
				setHasMetaMask(false);
			}
			setIsCheckingProvider(false);
			return provider;
		} catch (err) {
			console.log(err, "THE ERROR WHEN CHECKING FOR USER PROVIDER");
			throw err;
		}
	};

	const onSetChainId = (networkId) => {
		setCurrentChainId(parseInt(networkId));
		// window.location.reload()
	};

	const onAccountChange = (accounts) => {
		if (accounts.length === 0) {
			setIsUsersWalletConnected(false);
			window.location.reload();
		} else {
			setIsUsersWalletConnected(true);
			setConnectedWallets(accounts);
		}
	};

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

	const instantiateContract = async (needSigner = false) => {
		const signer = await getProviderOrSigner(needSigner);
		const contract = new Contract(PHIT_NFTS_CONTRACT_ADDRESS, abi, signer);

		return {
			signer,
			contract,
		};
	};

	useEffect(() => {
		//Chcek if user has metamask
		checkIfUserHasProvider();
		if (typeof window !== "undefined") {
			if (window.ethereum) {
				window.ethereum.on("networkChanged", onSetChainId);
				window.ethereum.on("accountsChanged", onAccountChange);
			}
		}
	}, []);

	return {
		currentChainId,
		isUsersWalletConnected,
		hasMetamask,
		isCheckingProvider,
		checkIfUserHasProvider,
		connectedWallets,
		getProviderOrSigner,
		instantiateContract,
		web3ModalRef,
	};
}
