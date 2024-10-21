import * as THREE from './lib/three.js-master/build/three.module.js'
import { OrbitControls } from './lib/three.js-master/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from './lib/three.js-master/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from './lib/three.js-master/examples/jsm/loaders/DRACOLoader.js'

export function loadAnimation() {

    const loader = new GLTFLoader();
    
    const dracoLoader = new DRACOLoader();

    const animationURL = new URL('./assets/pong_animation/scene.gltf', import.meta.url);
    
    dracoLoader.setDecoderPath( './lib/three.js-master/examples/jsm/libs/draco' );
    loader.setDRACOLoader( dracoLoader );
    
    loader.load(
        animationURL.href,
        function ( gltf ) {
            scene.add( gltf.scene );
        },
    );
}