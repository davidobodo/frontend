import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";
import { particleConfig } from "./config";
const Particle = () => {
	const particlesInit = useCallback(async (engine) => {
		await loadFull(engine);
	}, []);

	const particlesLoaded = useCallback(async (container) => {}, []);

	return (
		<>
			<Particles init={particlesInit} loaded={particlesLoaded} options={particleConfig} />
		</>
	);
};

export default Particle;
