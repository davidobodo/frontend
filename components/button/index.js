export default function Button({ children, onClick }) {
	return (
		<button className="bg-blue-700 px-8 py-2 text-base rounded-lg hover:bg-blue-900" onClick={onClick}>
			{children}
		</button>
	);
}
