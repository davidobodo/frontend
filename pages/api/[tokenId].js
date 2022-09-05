export default function handler(req, res) {
	const tokenId = req.query.tokenId;

	const image_url =
		"https://images.unsplash.com/photo-1662315317572-f797a4325b57?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60";

	res.status(200).json({
		name: "Phit NFT #" + tokenId,
		description: "Phit NFT is a clone of LEARN WEB3 Nft project",
		image: image_url,
	});
}
