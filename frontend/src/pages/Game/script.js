import * as THREE from './lib/three.js-master/build/three.module.js'
import { OrbitControls } from './lib/three.js-master/examples/jsm/controls/OrbitControls.js'
// import { EffectComposer } from './lib/three.js-master/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from './lib/three.js-master/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from './lib/three.js-master/examples/jsm/postprocessing/ShaderPass.js';
// import { HorizontalBlurShader } from './lib/three.js-master/examples/jsm/shaders/HorizontalBlurShader.js';
// import { VerticalBlurShader } from './lib/three.js-master/examples/jsm/shaders/VerticalBlurShader.js';
// import * as dat from 'lil-gui'
import Ball from './src/Ball.js'
import Paddle from './src/Paddle.js'
import { AmbientLight, DirectionalLight } from './lib/three.js-master/build/three.module.js'
import { RoundedBoxGeometry } from './lib/three.js-master/examples/jsm/geometries/RoundedBoxGeometry.js'
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
// import AIControls from './src/AIControls'
import lights from './src/Lighting.js'


let gameRunning = false;
let composer, hBlurPass, vBlurPass;


export function gameActions(data) {

    console.log(data);

    gameRunning = true;
    let countDownStarted = false;
    let gamePaused = false;

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
// composer = new EffectComposer(renderer);
// const renderPass = new RenderPass(scene, camera);
// composer.addPass(renderPass);

// hBlurPass = new ShaderPass(HorizontalBlurShader);
// hBlurPass.uniforms['h'].value = 1 / window.innerWidth;
// composer.addPass(hBlurPass);

// vBlurPass = new ShaderPass(VerticalBlurShader);
// vBlurPass.uniforms['v'].value = 1 / window.innerHeight;
// composer.addPass(vBlurPass);

/**
 * Meshes
 */

const playerPaddle = new Paddle(scene, new THREE.Vector3(0, 0, 15), boundaries);
const player2Paddle = new Paddle(scene, new THREE.Vector3(0, 0, -15), boundaries);
const ball = new Ball(scene, boundaries, [playerPaddle, player2Paddle], data);

ball.addEventListener('ongoal', (e) => {
    console.log('goal', e.message)

    if (data.player1 === e.message) {
        score['player1'] += 1;
    }
    else if (data.player2 === e.message) {
        score['player2'] += 1;
    }
    // console.log(e.message);
    if (score['player1'] >= 3 || score['player2'] >= 3) {
        // hBlurPass.uniforms['h'].value = 50 / window.innerWidth; // Adjust the blur intensity as needed
        // vBlurPass.uniforms['v'].value = 5 / window.innerHeight; // Adjust the blur intensity as needed
        // composer.render();

        document.querySelector('canvas').classList.add('blur');
        let gameFinalResult = document.createElement('div');
        gameFinalResult.classList.add('gameFinalResult');  
        gameFinalResult.innerHTML = `<h1>Game Over</h1>`
        document.querySelector('#root').appendChild(gameFinalResult);

        gamePaused = true;
        let postData = {
            "nickname": data.player1,
            "opponent": data.player2,
            "user_score": score['player1'],
            "opponent_score": score['player2']
        }

        fetch('api/game-history/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    updateScore();
    // console.log(score);
});


// document.body.appendChild(renderer.domElement)
document.querySelector('#root').innerHTML = `<div class="gameInterface">
			                                 <div id="score-player1" class="score">0</div>
			                                 <div id="score-player2" class="score">0</div>
			                                 <a href="#home">
			                                 	<button id="Home-button" class="btn-main">Back to Home</button>
			                                 </a>
                                             <div id="countdown" class="countdown"></div>
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

function startCountdown() {
    if (countDownStarted) {
        return;
    }
    gamePaused = true;
    countDownStarted = true;
    const countdownElement = document.getElementById('countdown');
    let countdown = 3;

    countdownElement.style.display = 'block';
    countdownElement.innerText = countdown;

    const interval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownElement.innerText = countdown;
        } else if (countdown === 0) {
            countdownElement.innerText = 'GO!';
        } else {
            countdownElement.style.display = 'none';
            // Start the game here
            gamePaused = false;
            console.log("IN ELSE STATEMENT");
            clearInterval(interval);
        }
    }, 1000);
}


/**
 * frame loop
*/
    startCountdown();

function tic() {
    if (!gameRunning) {
        return;
    }
    // console.log(gameRunning + "\n" + gamePaused);
    if (!gamePaused)
    {
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

    }
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