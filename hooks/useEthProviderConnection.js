import detectEthereumProvider from "@metamask/detect-provider";
import { useState, useEffect } from "react";
export function useEthProviderConnection() {
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
	};
}
