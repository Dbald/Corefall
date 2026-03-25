import * as THREE from 'three';

export const PICKUP_TYPES = {
    health: {
        color: 0x00ff44,
        emissive: 0x004411,
        size: 0.35,
        bobSpeed: 2,
        spinSpeed: 1.5,
        shape: 'cross'
    },
    ammo: {
        color: 0x4488ff,
        emissive: 0x112244,
        size: 0.3,
        bobSpeed: 2.2,
        spinSpeed: 2,
        shape: 'box'
    },
    score: {
        color: 0xffaa00,
        emissive: 0x443300,
        size: 0.25,
        bobSpeed: 3,
        spinSpeed: 3,
        shape: 'diamond'
    },
    weapon: {
        color: 0xff44ff,
        emissive: 0x441144,
        size: 0.4,
        bobSpeed: 1.5,
        spinSpeed: 1,
        shape: 'star'
    },
    powerup: {
        color: 0xff0000,
        emissive: 0x440000,
        size: 0.35,
        bobSpeed: 2.5,
        spinSpeed: 2.5,
        shape: 'sphere'
    }
};

export class Pickup {
    constructor(type, position, scene, data = {}) {
        this.type = type;
        this.def = PICKUP_TYPES[type];
        this.data = data; // e.g. { weapon: 'scatter' } or { amount: 25 }
        this.collected = false;
        this.baseY = 0.5;

        this.mesh = this.createMesh();
        this.mesh.position.set(position.x, this.baseY, position.z);
        scene.add(this.mesh);

        // Glow light
        this.light = new THREE.PointLight(this.def.color, 0.5, 4);
        this.mesh.add(this.light);
    }

    createMesh() {
        const mat = new THREE.MeshPhongMaterial({
            color: this.def.color,
            emissive: this.def.emissive,
            transparent: true,
            opacity: 0.9
        });
        const s = this.def.size;
        let geo;

        switch (this.def.shape) {
            case 'cross':
                // Approximate cross with a box
                const group = new THREE.Group();
                const hBar = new THREE.Mesh(new THREE.BoxGeometry(s * 2, s * 0.5, s * 0.5), mat);
                const vBar = new THREE.Mesh(new THREE.BoxGeometry(s * 0.5, s * 2, s * 0.5), mat);
                group.add(hBar, vBar);
                return group;
            case 'box':
                geo = new THREE.BoxGeometry(s, s, s);
                break;
            case 'diamond':
                geo = new THREE.OctahedronGeometry(s, 0);
                break;
            case 'star':
                geo = new THREE.DodecahedronGeometry(s, 0);
                break;
            case 'sphere':
                geo = new THREE.SphereGeometry(s, 8, 8);
                break;
            default:
                geo = new THREE.BoxGeometry(s, s, s);
        }

        return new THREE.Mesh(geo, mat);
    }

    update(dt, playerPos) {
        if (this.collected) return false;

        const t = performance.now() * 0.001;
        this.mesh.position.y = this.baseY + Math.sin(t * this.def.bobSpeed) * 0.15;
        this.mesh.rotation.y += dt * this.def.spinSpeed;

        // Check collection
        const dist = this.mesh.position.distanceTo(playerPos);
        if (dist < 1.5) {
            this.collected = true;
            return { type: this.type, data: this.data };
        }

        return null;
    }

    remove(scene) {
        scene.remove(this.mesh);
        this.mesh.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
    }
}

export class PickupManager {
    constructor(scene) {
        this.scene = scene;
        this.pickups = [];
    }

    spawn(type, position, data = {}) {
        const pickup = new Pickup(type, position, this.scene, data);
        this.pickups.push(pickup);
    }

    clear() {
        this.pickups.forEach(p => p.remove(this.scene));
        this.pickups = [];
    }

    update(dt, playerPos) {
        const collected = [];
        this.pickups = this.pickups.filter(pickup => {
            const result = pickup.update(dt, playerPos);
            if (result) {
                collected.push(result);
                pickup.remove(this.scene);
                return false;
            }
            if (pickup.collected) {
                pickup.remove(this.scene);
                return false;
            }
            return true;
        });
        return collected;
    }
}
