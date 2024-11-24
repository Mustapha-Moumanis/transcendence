import * as THREE from './lib/three.js-master/build/three.module.js'
import {OrbitControls} from './lib/three.js-master/examples/jsm/controls/OrbitControls.js'
import Ball from './src/Ball.js'
import Paddle from './src/Paddle.js'
import Tournament from './src/Tournament.js'
import {AmbientLight,DirectionalLight} from './lib/three.js-master/build/three.module.js'
import {RoundedBoxGeometry} from './lib/three.js-master/examples/jsm/geometries/RoundedBoxGeometry.js'
import lights from './src/Lighting.js'
import Match from './src/Match.js'
import { displayFieldError, showAlert } from '../../utils/js/auth.js'


let gameRunning = false;

function reset_game(camera, playerPaddle, player2Paddle, ball, gameData, player1Name, player2Name) {
    let player1Element = document.getElementById('player1');
    let player2Element = document.getElementById('player2');

    player1Element.innerHTML = player1Name;
    player2Element.innerHTML = player2Name;
    if (gameData.camPos == 2) {
        camera.position.set(0, 40, 0);
    }
    else{
        camera.position.set(0, 25, 30);
    }
    camera.lookAt(new THREE.Vector3(0, 2.5, 0));
    playerPaddle.mesh.position.set(0, 0, 15);
    player2Paddle.mesh.position.set(0, 0, -15);
    //pause the ball in the middle
    // ball.mesh.position.set(0, 0, 0);
    // ball.velocity.set(0, 0, 0);
    ball.isPaused = true;setTimeout(() => {
        ball.isPaused = false;
    }, 1000);
    ball.resetBallVelocity();
}

function loadLogic(data, mode, tournament, tournamentKey) {
    // console.log("tournament key: ", tournamentKey);
    gameRunning = true;
    let gameData = JSON.parse(localStorage.getItem("gameData"));
    // console.log(gameData);
    if (!gameData) gameData = { "camPos": 0, "FOV": 1, "ballSpeed": 1};
    let fovARR = [80, 90, 100];
    let camPosARR = [20, 25, 30];
    let ballSpeedARR = [20, 25, 30];
    let countDownStarted = false;
    let gamePaused = false;
    let player1Name = data.player1;
    let player2Name = data.player2;
    let round = 1;
    
    /*      colors        */
    let rootStyles = getComputedStyle(document.documentElement);
    let baseColor = rootStyles.getPropertyValue('--base').trim();
    var baseTintColor = rootStyles.getPropertyValue('--base-tint').trim();
    var baseShadeColor = rootStyles.getPropertyValue('--base-shade').trim();
    var baseHoverColor = rootStyles.getPropertyValue('--base-hover').trim();
    var primaryColor = rootStyles.getPropertyValue('--primary-color').trim();
    var titleColor = rootStyles.getPropertyValue('--title-color').trim();
    var subColor = rootStyles.getPropertyValue('--sub-color').trim();
    
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    
    let moveLeft = false;
    let moveRight = false;
    let moveLeft2 = false;
    let moveRight2 = false;
    
    
    /* Scene */
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(primaryColor);
    scene.fog = new THREE.Fog(primaryColor, 90, 120);
    
    scene.add(...lights);
    const clock = new THREE.Clock();
    
    /* BOX */
    const material = new THREE.MeshStandardMaterial({
        color: 'coral'
    })
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    
    /* Plane */
    const boundaries = new THREE.Vector2(20, 20);
    
    const planeGeometry = new THREE.PlaneGeometry(boundaries.x * 20, boundaries.y * 20, boundaries.x * 20, boundaries.y * 20);
    planeGeometry.rotateX(-Math.PI * 0.5)
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: baseColor
    });
    
    
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -1.5;
    plane.receiveShadow = true;
    scene.add(plane);
    
    const boundGeo = new RoundedBoxGeometry(1, 2, boundaries.x * 2, 5, 0.5)
    const boundMat = new THREE.MeshStandardMaterial({
        color: primaryColor
    });
    const leftBound = new THREE.Mesh(boundGeo, boundMat)
    leftBound.position.x = -boundaries.x - 0.5;
    leftBound.castShadow = true;
    leftBound.receiveShadow = true;
    const rightBound = leftBound.clone();
    rightBound.castShadow = true;
    rightBound.position.x *= -1;
    
    scene.add(leftBound, rightBound)
    
    /* render sizes */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    }
    /* Camera */
    let fov;
    if (fovARR[gameData.FOV] && (fovARR[gameData.FOV] <= 100 && fovARR[gameData.FOV] >= 80)) {
        fov = fovARR[gameData.FOV];
    }
    else {
        fov = 90
    }
    console.log("FOV set to: ", fov);
    let camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)

    /* renderer */
    const renderer = new THREE.WebGLRenderer()
    
    /* OrbitControls */
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    if (gameData.camPos == 2) {
        camera.position.set(0, 40, 0)
        camera.rotation.z += Math.PI/2
        camera.updateProjectionMatrix();
        controls.update();
    

        // camera.lookAt(new THREE.Vector3(0, -2.5, 0))
        
    }
    else{
        camera.position.set(0, 25, 30)
        camera.lookAt(new THREE.Vector3(0, 2.5, 0))
    }
    
    /* Meshes */
    const playerPaddle = new Paddle(scene, new THREE.Vector3(0, 0, 15), boundaries);
    const player2Paddle = new Paddle(scene, new THREE.Vector3(0, 0, -15), boundaries);
    const ball = new Ball(scene, boundaries, [playerPaddle, player2Paddle], data);
    if (ballSpeedARR[gameData.ballSpeed]  && (ballSpeedARR[gameData.ballSpeed] <= 30 && ballSpeedARR[gameData.ballSpeed] >= 20)) {
        ball.set_ball_speed(ballSpeedARR[gameData.ballSpeed]);
        console.log("Ball speed set to: ", ballSpeedARR[gameData.ballSpeed]);
    }
    
    
    document.querySelector('#root').innerHTML = `<div class="gameInterface">
                                                    <div id="player1info" class="playerinfo">
                                                        <div id="player1" class="player">${player1Name}</div>
                                                        <div id="score-player1" class="score">0</div>
                                                        <div id="WASD" class="keys">
                                                            <div class="up arr" id="Wkey">W</div>
                                                            <br />
                                                            <div class="left arr">A</div>  
                                                            <div class="down arr">S</div>
                                                            <div class="right arr">D</div>
                                                        </div>
                                                    </div>
                                                    <div id="player2info" class="playerinfo">
                                                        <div id="player2" class="player">${player2Name}</div>
                                                        <div id="score-player2" class="score">0</div>
                                                        <div id="ARROWKEYS" class="keys">
                                                            <div class="up arr"><i class="fa fa-arrow-up"></i></div>
                                                            <br />
                                                            <div class="left arr"><i class="fa fa-arrow-left"></i></div>  
                                                            <div class="down arr"><i class="fa fa-arrow-down"></i></div>
                                                            <div class="right arr"><i class="fa fa-arrow-right"></i></div>
                                                        </div>
                                                    </div>
                                                    <a href="#home">
                                                        <button id="Home-button" class="btn-main">Back to Home</button>
                                                    </a>
                                                    <div id="countdown" class="countdown"></div>
                                                 </div>
                                                 <link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">`;
    document.querySelector('#root').appendChild(renderer.domElement);
    handleResize()
    const HomeButton = document.getElementById('Home-button');
    
    HomeButton.addEventListener('click', () => {
        cleanupScene();
        setTimeout(() => {
            window.location.hash = '#home';
        }, 200);
    });
    
    ball.addEventListener('ongoal', (e) => {
        // console.log('goal', e.message)
    
        if (data.player1 === e.message) {
            score['player1'] += 1;
        } else if (data.player2 === e.message) {
            score['player2'] += 1;
        }
        if ((score['player1'] >= 5 || score['player2'] >= 5) && mode === 'single') {
            let finalResultText;
    
            if (score['player1'] > score['player2']) {
                finalResultText = `<finaltext id="finalText" class="finalText">${player1Name} WINS!</finaltext><button id="end-game" class="btn-game">Back to Home</button>`;
            } else {
                finalResultText = `<finaltext id="finalText" class="finalText">${player2Name} WINS!</finaltext><button id="end-game" class="btn-game">Back to Home</button>`;
            }
            document.querySelector('canvas').classList.add('blur');
            let gameFinalResult = document.createElement('div');
            gameFinalResult.classList.add('gameFinalResult');
            gameFinalResult.innerHTML = finalResultText;
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
            let endGameButton = document.getElementById('end-game');
            endGameButton.addEventListener('click', () => {
                cleanupScene();
                setTimeout(() => {
                    window.location.hash = '#home';
                }, 200);
            });
        }
        else if ((score['player1'] >= 5 || score['player2'] >= 5) && mode === 'tournament') {
            //end tourney
            let finalResultText;
            let buttonText;
            let player1Score = score['player1'];
            let player2Score = score['player2'];

            ball.isPaused = true;
            gamePaused = true;
            score['player1'] = 0;
            score['player2'] = 0;
            if (round === 3){
                buttonText = 'Back to Home';
            }
            else {
                buttonText = 'Next Game';
            }
            if (player1Score > player2Score) {
                finalResultText = `<finaltext id="finalText" class="finalText">${player1Name} WINS!</finaltext><button id="end-game" class="btn-game">${buttonText}</button>`;
            } else {
                finalResultText = `<finaltext id="finalText" class="finalText">${player2Name} WINS!</finaltext><button id="end-game" class="btn-game">${buttonText}</button>`;
            }
            document.querySelector('canvas').classList.add('blur');
            let gameFinalResult = document.createElement('div');
            gameFinalResult.classList.add('gameFinalResult');
            gameFinalResult.innerHTML = finalResultText;
            document.querySelector('#root').appendChild(gameFinalResult);
            let endGameButton = document.getElementById('end-game');
            endGameButton.addEventListener('click', () => {
                let winner;

                if (round === 1) {
                    console.log('FIRST ROUND');
                    player1Name = data.player3;
                    player2Name = data.player4;
                    if (player1Score > player2Score) {
                        winner = data.player1;
                    } else {
                        winner = data.player2;
                    }
                    
                    tournament.Match1.player1_score = player1Score;
                    tournament.Match1.player2_score = player2Score;
                    tournament.Match1.winner_name = winner;
                    round += 1;
                }
                else if (round === 2) {
                    console.log('SECOND ROUND');
                    if (player1Score > player2Score) {
                        winner = data.player3;
                    } else {
                        winner = data.player4;
                    }
                    tournament.Match2.player1_score = player1Score;
                    tournament.Match2.player2_score = player2Score;
                    tournament.Match2.winner_name = winner;
                    player1Name = tournament.Match1.winner_name;
                    player2Name = winner;
                    tournament.final = new Match(tournament.getPlayerByName(tournament.Match1.winner_name), tournament.getPlayerByName(tournament.Match2.winner_name));
                    // console.log(tournament);
                    round += 1;
                }
                else if (round === 3) {
                    console.log('FINAL ROUND');
                    if (player1Score > player2Score) {
                        winner = player1Name;
                    } else {
                        winner = player2Name;
                    }
                    tournament.final.player1_score = player1Score;
                    tournament.final.player2_score = player2Score;
                    tournament.final.winner_name = winner;
                    document.querySelector('#root').appendChild(gameFinalResult);
                    // let endGameButton = document.getElementById('end-game');
                    //post here
                    let postData = {
                        "key": tournamentKey,
                        "bracket01": {
                            "player1": tournament.Match1.player1.nameGetter(),
                            "player2": tournament.Match1.player2.nameGetter(),
                            "player1_score": tournament.Match1.player1_score,
                            "player2_score": tournament.Match1.player2_score,
                        },
                        "bracket02": {
                            "player1": tournament.Match2.player1.nameGetter(),
                            "player2": tournament.Match2.player2.nameGetter(),
                            "player1_score": tournament.Match2.player1_score,
                            "player2_score": tournament.Match2.player2_score,
                        },
                        "bracketFinal": {
                            "player1": tournament.final.player1.nameGetter(),
                            "player2": tournament.final.player2.nameGetter(),
                            "player1_score": tournament.final.player1_score,
                            "player2_score": tournament.final.player2_score,
                        }
                    }
            
                    fetch('api/tournament/events/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(postData)
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Success:', data);
                            console.log(tournament)
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                    cleanupScene();
                    setTimeout(() => {
                    window.location.hash = '#home';
                    }, 200);
                    return ;
                }
                reset_game(camera, playerPaddle, player2Paddle, ball, gameData, player1Name, player2Name);
                document.querySelector('canvas').classList.remove('blur');
                document.querySelector('.gameFinalResult').remove();
                gamePaused = false;
                updateScore();
                console.log(tournament);
            });
        }
        // console.log("UPDATING SCORE");
        updateScore();
    });
    
    function cleanupScene() {
        // Dispose of all objects in the scene
        gameRunning = false;
        if (tic) {
            cancelAnimationFrame(tic);
        }
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
        
        // Dispose of animation loop
    
    }
    
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.type = THREE.VSMShadowMap;

    
    /* Lights */
    const ambientLight = new AmbientLight(0xffffff, 1.5)
    const directionalLight = new DirectionalLight(0xffffff, 2.5)
    directionalLight.position.set(3, 10, 7)
    scene.add(ambientLight, directionalLight)
    
    /* Score */
    
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

    let arrowKeyUp = document.querySelector('#ARROWKEYS .up');
    let arrowKeyDown = document.querySelector('#ARROWKEYS .down');
    let arrowKeyLeft = document.querySelector('#ARROWKEYS .left');
    let arrowKeyRight = document.querySelector('#ARROWKEYS .right');
    let wasdUp = document.querySelector('#WASD .up');
    let wasdDown = document.querySelector('#WASD .down');
    let wasdLeft = document.querySelector('#WASD .left');
    let wasdRight = document.querySelector('#WASD .right');

    // console.log(arrowkeyUp);

    wasdUp.addEventListener('touchstart', (e) => {
        console.log("PRESSED");
        moveLeft = true;
    });
    wasdUp.addEventListener('touchend', (e) => {
        moveLeft = false;
    });

    wasdDown.addEventListener('touchstart', (e) => {
        console.log("PRESSED");
        moveRight = true;
    });
    wasdDown.addEventListener('touchend', (e) => {
        moveRight = false;
    });

    wasdLeft.addEventListener('touchstart', (e) => {
        console.log("PRESSED");
        moveLeft = true;
    });
    wasdLeft.addEventListener('touchend', (e) => {
        moveLeft = false;
    });

    wasdRight.addEventListener('touchstart', (e) => {
        console.log("PRESSED");
        moveRight = true;
    });
    wasdRight.addEventListener('touchend', (e) => {
        moveRight = false;
    });

     wasdUp.addEventListener('touchstart', (e) => {
        console.log("PRESSED");
        moveLeft = true;
    });
    wasdUp.addEventListener('touchend', (e) => {
        moveLeft = false;
    });

    wasdDown.addEventListener('touchstart', (e) => {
        console.log("PRESSED");
        moveRight = true;
    });
    wasdDown.addEventListener('touchend', (e) => {
        moveRight = false;
    });

    wasdLeft.addEventListener('touchstart', (e) => {
        console.log("PRESSED");
        moveLeft = true;
    });
    wasdLeft.addEventListener('touchend', (e) => {
        moveLeft = false;
    });

    wasdRight.addEventListener('touchstart', (e) => {
        console.log("PRESSED");
        moveRight = true;
    });
    wasdRight.addEventListener('touchend', (e) => {
        moveRight = false;
    });




    arrowKeyUp.addEventListener('touchstart', (e) => {
        console.log("PRESSED");
        moveLeft2 = true;
    });
    arrowKeyUp.addEventListener('touchend', (e) => {
        moveLeft2 = false;
    });

    arrowKeyDown.addEventListener('touchstart', (e) => {
        console.log("PRESSED");
        moveRight2 = true;
    });
    arrowKeyDown.addEventListener('touchend', (e) => {
        moveRight2 = false;
    });

    arrowKeyLeft.addEventListener('touchstart', (e) => {
        console.log("PRESSED");
        moveLeft2 = true;
    });
    arrowKeyLeft.addEventListener('touchend', (e) => {
        moveLeft2 = false;
    });

    arrowKeyRight.addEventListener('touchstart', (e) => {
        console.log("PRESSED");
        moveRight2 = true;
    });
    arrowKeyRight.addEventListener('touchend', (e) => {
        moveRight2 = false;
    });


    
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
            case 'ArrowLeft':
            case 'ArrowUp':
                moveLeft2 = true;
                break;
            case 'ArrowRight':
            case 'ArrowDown':
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
            case 'ArrowLeft':
            case 'ArrowUp':
                moveLeft2 = false;
                break;
            case 'ArrowRight':
            case 'ArrowDown':
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
                // console.log("IN ELSE STATEMENT");
                clearInterval(interval);
            }
        }, 1000);
    }
    
    
    /* frame loop */
    startCountdown();
    
    function tic() {
        // console.log("x is: ", camera.position.x, "y is: ", camera.position.y, "z is: ", camera.position.z, "looking at: ");
        if (!gameRunning) {
            return;
        }
        if (!gamePaused) {
            const deltaTime = clock.getDelta()
    
            const dt = deltaTime / 10;
    
            for (let i = 0; i < 10; i++) {
    
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
        camera.fov = THREE.MathUtils.clamp(fov * (sizes.height / sizes.width), 30, 130)
        camera.updateProjectionMatrix()
    
        renderer.setSize(sizes.width, sizes.height)
    
    }
    
    function handleHashChange() {
        window.removeEventListener('resize', handleResize);
        // console.log("Resize event listener removed on hash change");
    }
}

function gameStart(data, mode) {
    if (mode === 'single') {
        loadLogic(data, mode);
    }
    else if (mode === 'tournament') {
        let names = [data.player1, data.player2, data.player3, data.player4];
        let player1Tname = document.getElementById('Tplayer1');
        let player2Tname = document.getElementById('Tplayer2');
        let player3Tname = document.getElementById('Tplayer3');
        let player4Tname = document.getElementById('Tplayer4');
        let tournamentcontent = document.getElementById('tournament-nick');
        let postData = {
            player1: player1Tname.value,
            player2: player2Tname.value,
            player3: player3Tname.value,
            player4: player4Tname.value
        }
        console.log(postData);
        // create here
        fetch('api/tournament/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
        // .then(response => response.json())
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.log(errorData);
                    if (errorData.player1) displayFieldError(player1Tname.parentElement, errorData.player1);
                    if (errorData.player2) displayFieldError(player2Tname.parentElement, errorData.player2);
                    if (errorData.player3) displayFieldError(player3Tname.parentElement, errorData.player3);
                    if (errorData.player4) displayFieldError(player4Tname.parentElement, errorData.player4);
                    if (errorData.detail) throw new Error(errorData.detail);
                    throw new Error("Failed to create tournament");
                });
            }
            return response.json();
        })
        .then(successData => {
            console.log('Success:', successData);
            const tournamentKey = successData.key;
            let tournament = new Tournament(successData);
            console.log(tournament);
            loadLogic(data, 'tournament', tournament, tournamentKey);
            tournamentcontent.classList.add('d-none');
        })
        .catch(error => showAlert('error', error));
    }
}

export function gameActions(html) {
    

    document.getElementById('home-content').innerHTML = html;

	try {
        //start animation here
        // loadAnimation();
        //add buttons
        let nickContent = document.getElementById('player-nick');
        let startButton = document.getElementById('start');
        let closeNickContent = document.getElementById('close-player-nick');
        let player1Name = document.getElementById('player1');
        let player2Name = document.getElementById('player2');
        let nameData;
        let startGame = document.getElementById('start-game');
    
        let tournamentButton = document.getElementById('tournament');
        let tournamentcontent = document.getElementById('tournament-nick');
        let tournamentClose = document.getElementById('close-tournament-nick');
        let startTournament = document.getElementById('start-tournament');
        let player1Tname = document.getElementById('Tplayer1');
        let player2Tname = document.getElementById('Tplayer2');
        let player3Tname = document.getElementById('Tplayer3');
        let player4Tname = document.getElementById('Tplayer4');
        startButton.addEventListener('click', () => {
          startButton.style.display = 'none';
        //   console.log('Game started')
          nickContent.classList.remove('d-none');
        });
    
        closeNickContent.addEventListener('click', () => {
          nickContent.classList.add('d-none');
          startButton.style.display = 'block';
        });
    
        tournamentButton.addEventListener('click', () => {
          tournamentButton.style.display = 'none';
        //   console.log('Tournament started')
          tournamentcontent.classList.remove('d-none');
        });
    
        tournamentClose.addEventListener('click', () => {
          tournamentcontent.classList.add('d-none');
          tournamentButton.style.display = 'block';
        });
    
        startTournament.addEventListener('click', () => {
            nameData = {
                player1: player1Tname.value,
                player2: player2Tname.value,
                player3: player3Tname.value,
                player4: player4Tname.value
            }
            // console.log(nameData);
            gameStart(nameData, 'tournament');
        });

        startGame.addEventListener('click', () => {
            nameData = {
                player1: player1Name.value,
                player2: player2Name.value
            }
            
        const pattern = /^[a-zA-Z][a-zA-Z_-]{0,19}$/;
        if (nameData.player1 === '') {
            displayFieldError(player1Name.parentElement, 'Please fill the player 1 field');
        }
        else if(nameData.player2 === '') {
            displayFieldError(player2Name.parentElement, 'Please fill the player 2 field');
        }
        else if (nameData.player1 === nameData.player2) {
          showAlert('error', 'Player names must be different');
        }
        else if (!pattern.test(nameData.player1)) {
            displayFieldError(player1Name.parentElement, 'Player 1 name must start with a letter and can only contain letters, numbers, underscores and hyphens');
        }
        else if (!pattern.test(nameData.player2)) {
            displayFieldError(player2Name.parentElement, 'Player 2 name must start with a letter and can only contain letters, numbers, underscores and hyphens');
        }
        else{
            // console.log(nameData);
            nickContent.classList.add('d-none');
            gameStart(nameData, 'single');
        }
        });
      } catch (error) {} 
    

}