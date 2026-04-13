import * as THREE from 'three';

export const WEAPON_DEFS = {
    blaster: {
        name: 'BLASTER',
        damage: 15,
        fireRate: 250,       // ms between shots
        ammoPerShot: 1,
        maxAmmo: Infinity,   // unlimited for default weapon
        spread: 0,
        pellets: 1,
        range: 100,
        type: 'hitscan',
        color: 0x00ffaa,
        muzzleSize: 0.15,
        knockback: 0
    },
    scatter: {
        name: 'SCATTER',
        damage: 8,
        fireRate: 600,
        ammoPerShot: 1,
        maxAmmo: 40,
        spread: 0.12,
        pellets: 7,
        range: 30,
        type: 'hitscan',
        color: 0xffaa00,
        muzzleSize: 0.3,
        knockback: 2
    },
    pulse: {
        name: 'PULSE',
        damage: 25,
        fireRate: 150,
        ammoPerShot: 1,
        maxAmmo: 80,
        spread: 0.02,
        pellets: 1,
        range: 120,
        type: 'hitscan',
        color: 0x4488ff,
        muzzleSize: 0.2,
        knockback: 0.5
    }
};

export const WEAPON_ORDER = ['blaster', 'scatter', 'pulse'];

export class WeaponSystem {
    constructor() {
        this.currentIndex = 0;
        this.ammo = {
            blaster: Infinity,
            scatter: 0,
            pulse: 0
        };
        this.unlocked = {
            blaster: true,
            scatter: false,
            pulse: false
        };
        this.lastFireTime = 0;
        this.muzzleFlashes = [];
        this.tracers = [];
    }

    get current() {
        return WEAPON_ORDER[this.currentIndex];
    }

    get currentDef() {
        return WEAPON_DEFS[this.current];
    }

    reset() {
        this.currentIndex = 0;
        this.ammo = { blaster: Infinity, scatter: 0, pulse: 0 };
        this.unlocked = { blaster: true, scatter: false, pulse: false };
        this.lastFireTime = 0;
    }

    unlock(weapon) {
        this.unlocked[weapon] = true;
        this.ammo[weapon] = WEAPON_DEFS[weapon].maxAmmo;
    }

    addAmmo(weapon, amount) {
        if (!this.unlocked[weapon]) return;
        if (this.ammo[weapon] === Infinity) return;
        this.ammo[weapon] = Math.min(this.ammo[weapon] + amount, WEAPON_DEFS[weapon].maxAmmo);
    }

    switchTo(index) {
        if (index >= 0 && index < WEAPON_ORDER.length && this.unlocked[WEAPON_ORDER[index]]) {
            this.currentIndex = index;
            return true;
        }
        return false;
    }

    scrollWeapon(direction) {
        let next = this.currentIndex;
        for (let i = 0; i < WEAPON_ORDER.length; i++) {
            next = (next + direction + WEAPON_ORDER.length) % WEAPON_ORDER.length;
            if (this.unlocked[WEAPON_ORDER[next]]) {
                this.currentIndex = next;
                return true;
            }
        }
        return false;
    }

    canFire(now) {
        const def = this.currentDef;
        if (now - this.lastFireTime < def.fireRate) return false;
        if (this.ammo[this.current] < def.ammoPerShot) return false;
        return true;
    }

    fire(now, camera, scene, enemies) {
        if (!this.canFire(now)) return null;
        const def = this.currentDef;
        this.lastFireTime = now;

        if (this.ammo[this.current] !== Infinity) {
            this.ammo[this.current] -= def.ammoPerShot;
        }

        const results = [];
        const raycaster = new THREE.Raycaster();
        raycaster.far = def.range;

        for (let i = 0; i < def.pellets; i++) {
            const dir = new THREE.Vector3(0, 0, -1);
            dir.x += (Math.random() - 0.5) * def.spread * 2;
            dir.y += (Math.random() - 0.5) * def.spread * 2;
            dir.normalize();
            dir.applyQuaternion(camera.quaternion);

            raycaster.set(camera.position, dir);

            // Check enemy hits
            const enemyMeshes = enemies.filter(e => e.alive).map(e => e.mesh);
            const hits = raycaster.intersectObjects(enemyMeshes, true);

            // Check wall hits
            const wallMeshes = scene.children.filter(c =>
                c.userData && c.userData.isWall
            );
            const wallHits = raycaster.intersectObjects(wallMeshes, true);

            let hitPoint = null;
            let hitEnemy = null;

            if (hits.length > 0) {
                const wallDist = wallHits.length > 0 ? wallHits[0].distance : Infinity;
                if (hits[0].distance < wallDist) {
                    hitEnemy = enemies.find(e =>
                        e.alive && (e.mesh === hits[0].object || e.mesh === hits[0].object.parent)
                    );
                    hitPoint = hits[0].point.clone();
                } else {
                    hitPoint = wallHits[0].point.clone();
                }
            } else if (wallHits.length > 0) {
                hitPoint = wallHits[0].point.clone();
            }

            // Create tracer
            if (hitPoint) {
                this.createTracer(scene, camera.position, hitPoint, def.color);
            } else {
                const end = camera.position.clone().add(dir.multiplyScalar(def.range));
                this.createTracer(scene, camera.position, end, def.color);
            }

            results.push({ enemy: hitEnemy, point: hitPoint, damage: def.damage });
        }

        // Muzzle flash
        this.createMuzzleFlash(scene, camera, def);

        return results;
    }

    createTracer(scene, start, end, color) {
        const points = [start.clone(), end.clone()];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.6
        });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        this.tracers.push({ mesh: line, time: performance.now() });
    }

    createMuzzleFlash(scene, camera, def) {
        const flashGeo = new THREE.SphereGeometry(def.muzzleSize, 6, 6);
        const flashMat = new THREE.MeshBasicMaterial({
            color: def.color,
            transparent: true,
            opacity: 0.8
        });
        const flash = new THREE.Mesh(flashGeo, flashMat);
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        flash.position.copy(camera.position).add(forward.multiplyScalar(1));
        flash.position.y -= 0.2;
        scene.add(flash);
        this.muzzleFlashes.push({ mesh: flash, time: performance.now() });
    }

    update(scene) {
        const now = performance.now();
        // Clean up tracers
        this.tracers = this.tracers.filter(t => {
            if (now - t.time > 50) {
                scene.remove(t.mesh);
                t.mesh.geometry.dispose();
                t.mesh.material.dispose();
                return false;
            }
            t.mesh.material.opacity = Math.max(0, 0.6 - (now - t.time) / 50 * 0.6);
            return true;
        });
        // Clean up muzzle flashes
        this.muzzleFlashes = this.muzzleFlashes.filter(f => {
            if (now - f.time > 60) {
                scene.remove(f.mesh);
                f.mesh.geometry.dispose();
                f.mesh.material.dispose();
                return false;
            }
            f.mesh.material.opacity = Math.max(0, 0.8 - (now - f.time) / 60 * 0.8);
            return true;
        });
    }
}
