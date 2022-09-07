export default function handler(req, res) {
	const tokenId = req.query.tokenId;

	// const NFT_IMAGE_URLS = [
	// 	"https://asset.cloudinary.com/phitgeek/b0b9684ff47e9adaa2abceecfbbd64de",
	// 	"https://asset.cloudinary.com/phitgeek/63e6346513f6dbe7114fa6cd86a6db8d",
	// 	"https://asset.cloudinary.com/phitgeek/2d5abcc4d0e57368f13bfad9e91a452e",
	// 	"https://asset.cloudinary.com/phitgeek/e7ad1f006aeadaa03f217dc6fd7f84c5",
	// 	"https://asset.cloudinary.com/phitgeek/449045280c72c4d3a4a4635c0022059b",
	// ];

	const NFT_IMAGE_URLS = [
		"https://res.cloudinary.com/phitgeek/image/upload/v1662368535/phit-nft/1.png",
		"https://res.cloudinary.com/phitgeek/image/upload/v1662368535/phit-nft/2.png",
		"https://res.cloudinary.com/phitgeek/image/upload/v1662368534/phit-nft/3.png",
		"https://res.cloudinary.com/phitgeek/image/upload/v1662368534/phit-nft/4.png",
		"https://res.cloudinary.com/phitgeek/image/upload/v1662368534/phit-nft/5.png",
	];

	res.status(200).json({
		name: "Phit NFT #" + tokenId,
		description: `Phit NFT is a clone of LEARN WEB3 Nft project. This is number ${tokenId} with image url ${
			NFT_IMAGE_URLS[parseInt(tokenId) + 1]
		}`,
		image: NFT_IMAGE_URLS[parseInt(tokenId) + 1],
	});
}
