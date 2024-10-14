import { MeshNormalMaterial,MeshStandardMaterial, SphereGeometry, Mesh, CapsuleGeometry } from "../lib/three.js-master/build/three.module.js";


export default class Paddle {
    
    constructor(scene, position, boundaries) {
        var rootStyles = getComputedStyle(document.documentElement);
        var color = rootStyles.getPropertyValue('--primary-color').trim(); 
        this.scene = scene
        this.boundaries = boundaries

        // this.geometry = new CapsuleGeometry(0.5, 5, 20, 20);
        this.geometry = new CapsuleGeometry(0.5, 5, 20, 20);
        this.helper_geometry = new CapsuleGeometry(0.5 + 0.5, 5, 20, 8);
        this.geometry.rotateZ(Math.PI * 0.5)
        this.helper_geometry.rotateZ(Math.PI * 0.5)
        this.helper_geometry.rotateX(Math.PI / 8)

        this.material = new MeshStandardMaterial({ color: color });
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.collisionHelper = new Mesh(this.helper_geometry, new MeshNormalMaterial({transparent: true, visible: false}));
        this.mesh.add(this.collisionHelper)

        this.mesh.position.copy(position);
        this.scene.add(this.mesh);
    }

    setX(x) {
        if (x > this.boundaries.x - 3) {
            x = this.boundaries.x - 3
        }
        else if (x < -this.boundaries.x + 3){
            x = -this.boundaries.x + 3;
        }
        this.mesh.position.x = x;
    }
}