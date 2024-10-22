import * as THREE from './lib/three.js-master/build/three.module.js'
import { OrbitControls } from './lib/three.js-master/examples/jsm/controls/OrbitControls.js'
// import * as dat from 'lil-gui'
import Ball from './src/Ball.js'
import Paddle from './src/Paddle.js'
import { AmbientLight, DirectionalLight } from './lib/three.js-master/build/three.module.js'
import { RoundedBoxGeometry } from './lib/three.js-master/examples/jsm/geometries/RoundedBoxGeometry.js'
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
// import AIControls from './src/AIControls'
import lights from './src/Lighting.js'


let gameRunning = false;


export function gameActions(data) {
    console.log(data);
    gameRunning = true;

    /*      colors        */
    let rootStyles = getComputedStyle(document.documentElement);
    let baseColor = rootStyles.getPropertyValue('--base').trim(); 
    var baseTintColor = rootStyles.getPropertyValue('--base-tint').trim();
    var baseShadeColor = rootStyles.getPropertyValue('--base-shade').trim();
    var baseHoverColor = rootStyles.getPropertyValue('--base-hover').trim();
    var primaryColor = rootStyles.getPropertyValue('--primary-color').trim();
    var titleColor = rootStyles.getPropertyValue('--title-color').trim();
    var subColor = rootStyles.getPropertyValue('--sub-color').trim();

    /**
 * Debug
 */
// const gui = new dat.GUI()

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

let moveLeft = false;
let moveRight = false;
let moveLeft2 = false;
let moveRight2 = false;

/**
 * Scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color(primaryColor);
scene.fog = new THREE.Fog(primaryColor, 90, 120);

scene.add(...lights);
// scene.background = new THREE.Color(0xdedede)
const clock = new THREE.Clock();

/**
 * BOX
 */
// const material = new THREE.MeshNormalMaterial()
const material = new THREE.MeshStandardMaterial({ color: 'coral' })
const geometry = new THREE.BoxGeometry(1, 1, 1)

/**
 * Plane
 */
// const groundMaterial = new THREE.MeshStandardMaterial({ color: 'lightgray' })
// const groundGeometry = new THREE.PlaneGeometry(10, 10)
// groundGeometry.rotateX(-Math.PI * 0.5)
// const ground = new THREE.Mesh(groundGeometry, groundMaterial);


// scene.add(ground)

const boundaries = new THREE.Vector2(20, 20);

const planeGeometry = new THREE.PlaneGeometry(boundaries.x * 20, boundaries.y * 20, boundaries.x * 20, boundaries.y * 20);
planeGeometry.rotateX(-Math.PI * 0.5)
const planeMaterial = new THREE.MeshStandardMaterial({
    color: baseColor
    // wireframe: true,
	// transparent: true,
	// opacity: 0.4
});


const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.y = -1.5;
plane.receiveShadow = true;
scene.add(plane);

const boundGeo = new RoundedBoxGeometry(1, 2, boundaries.x * 2, 5, 0.5)
const boundMat = new THREE.MeshStandardMaterial({ color: primaryColor });
const leftBound = new THREE.Mesh(boundGeo, boundMat)
leftBound.position.x = -boundaries.x - 0.5;
leftBound.castShadow = true;
leftBound.receiveShadow = true;
const rightBound = leftBound.clone();
rightBound.castShadow = true;
rightBound.position.x *= -1;

scene.add(leftBound, rightBound)

/**
 * Meshes
 */

const playerPaddle = new Paddle(scene, new THREE.Vector3(0, 0, 15), boundaries);
const player2Paddle = new Paddle(scene, new THREE.Vector3(0, 0, -15), boundaries);
const ball = new Ball(scene, boundaries, [playerPaddle, player2Paddle]);

ball.addEventListener('ongoal', (e) => {
    // console.log('goal', e.message)

    score[e.message] += 1;
    updateScore();
    // console.log(score);
});

/**
 * render sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}
/**
 * Camera
 */
const fov = 60
let camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)
camera.position.set(0, 25, 30)
camera.lookAt(new THREE.Vector3(0, 2.5, 0))

/**
 * Show the axes of coordinates system
//  */
// const axesHelper = new THREE.AxesHelper(3)
// scene.add(axesHelper)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer()
// document.body.appendChild(renderer.domElement)
document.querySelector('#root').innerHTML = `<div class="gameInterface">
			<div id="score-player1" class="score">0</div>
			<div id="score-player2" class="score">0</div>
			<a href="#home">
				<button id="Home-button" class="btn-main">Back to Home</button>
			</a>
		</div>`;
document.querySelector('#root').appendChild(renderer.domElement);
handleResize()
const HomeButton = document.getElementById('Home-button');

HomeButton.addEventListener('click', () => {
    cleanupScene();
    setTimeout(() => {
        window.location.hash = '#home';
    }, 200);
});

function cleanupScene() {
    // Dispose of all objects in the scene
    gameRunning = false;
    while (scene.children.length > 0) {
        const object = scene.children[0];
        scene.remove(object);
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
            } else {
                object.material.dispose();
            }
        }
    }

    // Dispose of renderer
    if (renderer) {
        renderer.dispose();
    }

    // Dispose of controls
    if (controls) {
        controls.dispose();
    }

    // Dispose of camera
    if (camera) {
        camera = null;
    }


}

renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.type = THREE.VSMShadowMap;

/**
 * OrbitControls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true


// const controller = new AIControls(pcPaddle, ball);

/**
 * Lights
 */
const ambientLight = new AmbientLight(0xffffff, 1.5)
const directionalLight = new DirectionalLight(0xffffff, 2.5)
directionalLight.position.set(3, 10, 7)
scene.add(ambientLight, directionalLight)

/**
 * Score
 */
const score = {
    player2: 0,
    player1: 0,
};

function updateScore() {
    var score1 = document.getElementById('score-player1');
    var score2 = document.getElementById('score-player2');
    if (score1 && score2) {
        document.getElementById('score-player1').textContent = score.player1;
        document.getElementById('score-player2').textContent = score.player2;
    }
}

function onKeyDown(event) {
    switch (event.key) {
        case 'a':
        case 'A':
        case 'w':
        case 'W':
            moveLeft = true;
            break;
        case 'd':
        case 'D':
        case 's':
        case 'S':
            moveRight = true;
            break;
        case 'j':
        case 'J':
        case 'i':
        case 'I':
            moveLeft2 = true;
            break;
        case 'l':
        case 'L':
        case 'k':
        case 'K':
            moveRight2 = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.key) {
        case 'a':
        case 'A':
        case 'w':
        case 'W':
            moveLeft = false;
            break;
        case 'd':
        case 'D':
        case 's':
        case 'S':
        moveRight = false;
            break;
        case 'j':
        case 'J':
        case 'i':
        case 'I':
            moveLeft2 = false;
            break;
        case 'l':
        case 'L':
        case 'k':
        case 'K':
            moveRight2 = false;
            break;
    }
}

/**
 * frame loop
 */
function tic() {
    if (!gameRunning) {
        return;
    }
	const deltaTime = clock.getDelta()

    const dt = deltaTime / 10;

    for(let i = 0; i < 10; i++){
        // console.log("looping")
        
        if (moveLeft && playerPaddle.mesh.position.x > -boundaries.x) {
            playerPaddle.setX((playerPaddle.mesh.position.x - 0.045)); // Adjust the value as needed
            controls.update()
        }
        if (moveRight && playerPaddle.mesh.position.x < boundaries.x) {
            playerPaddle.setX((playerPaddle.mesh.position.x + 0.045)); // Adjust the value as needed
            controls.update()
        }
        if (moveLeft2 && player2Paddle.mesh.position.x > -boundaries.x) {
            player2Paddle.setX(player2Paddle.mesh.position.x - 0.045);
            controls.update()
        }
        if (moveRight2 && player2Paddle.mesh.position.x < boundaries.x) {
            player2Paddle.setX(player2Paddle.mesh.position.x + 0.045);
            controls.update()
        }

        ball.update(dt);
        // controller.update(dt);
    }

	controls.update()

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', handleResize)
window.addEventListener('hashchange', handleHashChange);

function handleResize() {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)

    // const pixelRatio = Math.min(window.devicePixelRatio, 2)
    // renderer.setPixelRatio(pixelRatio)
}
function handleHashChange() {
    window.removeEventListener('resize', handleResize);
    console.log("Resize event listener removed on hash change");
}

}