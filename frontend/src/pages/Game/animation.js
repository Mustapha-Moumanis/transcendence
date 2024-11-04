import * as THREE from './lib/three.js-master/build/three.module.js'
import { OrbitControls } from './lib/three.js-master/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from './lib/three.js-master/examples/jsm/loaders/GLTFLoader.js'
import { AmbientLight, DirectionalLight } from './lib/three.js-master/build/three.module.js'
import { DRACOLoader } from './lib/three.js-master/examples/jsm/loaders/DRACOLoader.js'

export function loadAnimation() {

    const loader = new GLTFLoader();
    const scene = new THREE.Scene();
    const ambientLight = new AmbientLight(0xffffff, 10);
    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshNormalMaterial({ color: 0xff0000 })
    );


    scene.add(ambientLight);
    scene.add(cube);
    
    // const dracoLoader = new DRACOLoader();

    const animationURL = new URL('./assets/pong_animation/scene.gltf', import.meta.url);
    
    // dracoLoader.setDecoderPath( './lib/three.js-master/examples/jsm/libs/draco' );
    // loader.setDRACOLoader( dracoLoader );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const controls = new OrbitControls(camera, renderer.domElement);

    loader.load(
        animationURL.href,
        function ( gltf ) {
            console.log(gltf.scene);
            scene.add( gltf.scene );
        },
    );

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
}