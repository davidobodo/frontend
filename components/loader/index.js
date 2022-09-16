import { Spinner } from "../";

export default function Loader({ text }) {
	return (
		<div className="fixed z-20 bg-[rgba(0,0,0,0.9)] h-screen w-screen flex flex-col items-center justify-center">
			<Spinner />
			{text && <span className="text-base mt-2 text-white">{text}</span>}
		</div>
	);
}
