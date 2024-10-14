import { AmbientLight, DirectionalLight } from "../lib/three.js-master/build/three.module.js";

const ambientLight = new AmbientLight(0xffffff, 0.6)
const dirLight = new DirectionalLight(0xffffff, 0.7)

dirLight.position.set(20, 20, 20)
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(1024, 1024)
dirLight.shadow.camera.top = 30
dirLight.shadow.camera.bottom = -30
dirLight.shadow.camera.right = -30
dirLight.shadow.camera.left = 30
dirLight.shadow.blurSamples = 40;

const lights = [dirLight, ambientLight]

export default lights