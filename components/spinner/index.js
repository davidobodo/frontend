const delays = ["-0.45s", "-0.3s", "-0.15s"];
export default function Spinner() {
	return (
		<div className="relative inline-block w-[60px] h-[60px]">
			{[1, 2, 3, 4].map((item, i) => {
				return <Arc i={i} key={i} />;
			})}
		</div>
	);
}

function Arc({ i }) {
	return (
		<div
			className="absolute w-[48px] h-[48px] m-[8px] border-solid border-4 rounded-full border-t-white border-x-transparent border-b-transparent animate-spin"
			style={{
				animationDelay: delays[i] ? delays[i] : "0s",
			}}
		></div>
	);
}
