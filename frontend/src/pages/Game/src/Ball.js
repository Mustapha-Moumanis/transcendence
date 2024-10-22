import { MeshStandardMaterial, SphereGeometry, Mesh, Vector3, Raycaster, MeshBasicMaterial,  BufferGeometry, EventDispatcher, Line, LineBasicMaterial} from "../lib/three.js-master/build/three.module.js";

export default class Ball extends EventDispatcher{

    speed = 25;
    velocity = new Vector3(1, 0, 0.5);

    constructor(scene, boundaries, paddles) {        
    
        super()
        this.isPaused = false;
        this.scene = scene
        this.boundaries = boundaries;
        this.paddles = paddles;
        this.radius = 0.5
        this.geometry = new SphereGeometry(this.radius)
        this.material = new MeshStandardMaterial({color: 0xe51284})
        this.mesh = new Mesh(this.geometry, this.material)
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.velocity.multiplyScalar(this.speed);

        this.scene.add(this.mesh)

        this.raycaster = new Raycaster();
        this.raycaster.near = 0;
        this.raycaster.far = this.boundaries.y * 2.5;

        // const lineGeometry = new BufferGeometry().setFromPoints([new Vector3(), new Vector3()]);
        // const lineMaterial = new LineBasicMaterial({ color: 0xff0000 });
        // this.rayLine = new Line(lineGeometry, lineMaterial);
        // this.scene.add(this.rayLine);

        // this.collisionPoint = new Mesh(new SphereGeometry(0.1), new MeshBasicMaterial({color: 'red'}));
        
        // this.scene.add(this.collisionPoint);
    }

    resetBallVelocity () {
        this.speed = 25;
        this.velocity.z *= -1
        
        // Calculate a random angle between -22.5 and 22a.5 degrees
        const angle = (Math.random() * Math.PI) / 4 - Math.PI / 8;
        const speed = 0.5; // Adjust the speed as needed

        // Set the new velocity with the random angle
        this.velocity.set(Math.sin(angle) * speed, 0, Math.sign(this.velocity.z) * Math.cos(angle) * speed);

        this.velocity.normalize().multiplyScalar(this.speed);
    }

    update(dt) {
        if (this.isPaused) return;
        const direction = this.velocity.clone().normalize()
        this.raycaster.set(this.mesh.position, direction);

        const s = this.velocity.clone().multiplyScalar(dt);
        const tPos = this.mesh.position.clone().add(s);

        const rayEnd = this.mesh.position.clone().add(direction.multiplyScalar(this.raycaster.far));
        // this.rayLine.geometry.setFromPoints([this.mesh.position, rayEnd]);

        /* check collision */
        const dx =  (this.boundaries.x - this.radius) - Math.abs(this.mesh.position.x);
        const dz =  (this.boundaries.y - this.radius) - Math.abs(this.mesh.position.z);
        if (dx <= 0) {
            tPos.x = (this.boundaries.x - this.radius + dx) * Math.sign(this.mesh.position.x)
            this.velocity.x *= -1;
            this.speed += 2.05;
            this.velocity.normalize().multiplyScalar(this.speed);
        }

        /* goal scored here */
        if (dz < 0){
            const z = this.mesh.position.z
            const message = z > 0 ? 'player2' : 'player1'
            this.dispatchEvent({type: 'ongoal', message: message})
            tPos.set(0, 0, 0)
            this.resetBallVelocity();

            // Pause the ball for one second
            this.isPaused = true;
            setTimeout(() => {
                this.isPaused = false;
            }, 1000);
         }

         /* collision with padd;e */
         const paddle = this.paddles.find((paddle) => {
            return Math.sign(paddle.mesh.position.z) === Math.sign(this.velocity.z);
         })
        //  console.log(paddle);

        const [intersection] = this.raycaster.intersectObjects(paddle.mesh.children)
        
        if (intersection){
            // this.collisionPoint.position.copy(intersection.point);
            
            if (intersection.distance < s.length()) {
                console.log('collision with paddle');

                const normal = intersection.normal;
                normal.y = 0;
                normal.normalize();
                tPos.copy(intersection.point);
                const d = s.length() - intersection.distance;
                this.velocity.reflect(normal);
                

                const dS = this.velocity.clone().normalize().multiplyScalar(d);
                tPos.add(dS);

                this.speed += 1.05;
                this.velocity.normalize().multiplyScalar(this.speed);
            }
        }
        else {
            // this.collisionPoint.position.set(0, 0, 0);
        }

        this.mesh.position.copy(tPos)
    }




}