import * as THREE from 'three';

export const ENEMY_TYPES = {
    drone: {
        name: 'Drone',
        health: 30,
        speed: 4,
        damage: 8,
        attackRange: 2.5,
        attackRate: 800,
        color: 0x44ff44,
        emissive: 0x115511,
        size: 0.6,
        score: 100,
        behavior: 'melee'
    },
    spitter: {
        name: 'Spitter',
        health: 40,
        speed: 2,
        damage: 12,
        attackRange: 25,
        attackRate: 1500,
        color: 0xaa44ff,
        emissive: 0x331155,
        size: 0.7,
        score: 200,
        behavior: 'ranged',
        projectileSpeed: 15,
        projectileColor: 0xaa44ff
    },
    charger: {
        name: 'Charger',
        health: 50,
        speed: 8,
        damage: 20,
        attackRange: 2,
        attackRate: 2000,
        color: 0xff4444,
        emissive: 0x551111,
        size: 0.8,
        score: 250,
        behavior: 'charge',
        chargeSpeed: 16
    },
    heavy: {
        name: 'Heavy Husk',
        health: 120,
        speed: 1.5,
        damage: 25,
        attackRange: 20,
        attackRate: 2000,
        color: 0xff8800,
        emissive: 0x553300,
        size: 1.1,
        score: 400,
        behavior: 'ranged',
        projectileSpeed: 10,
        projectileColor: 0xff8800
    },
    boss: {
        name: 'Core Guardian',
        health: 800,
        speed: 2.5,
        damage: 30,
        attackRange: 30,
        attackRate: 1200,
        color: 0xff0044,
        emissive: 0x660011,
        size: 2.5,
        score: 5000,
        behavior: 'boss',
        projectileSpeed: 12,
        projectileColor: 0xff0044
    }
};

export class Enemy {
    constructor(type, position, scene) {
        this.type = type;
        this.def = ENEMY_TYPES[type];
        this.health = this.def.health;
        this.maxHealth = this.def.health;
        this.alive = true;
        this.lastAttackTime = 0;
        this.state = 'idle'; // idle, chase, attack, charge, dead
        this.stateTimer = 0;
        this.chargeDir = null;
        this.activated = false;
        this.activationRange = 25;
        this.hitFlashTime = 0;

        // Create mesh
        this.mesh = this.createMesh();
        this.mesh.position.copy(position);
        this.mesh.position.y = this.def.size * 0.5;
        scene.add(this.mesh);

        // Health bar
        this.healthBarBg = this.createHealthBar(0x330000);
        this.healthBar = this.createHealthBar(0xff0000);
        this.healthBarBg.position.y = this.def.size + 0.3;
        this.healthBar.position.y = this.def.size + 0.3;
        this.mesh.add(this.healthBarBg);
        this.mesh.add(this.healthBar);
    }

    createMesh() {
        const group = new THREE.Group();
        const size = this.def.size;

        if (this.type === 'drone') {
            const body = new THREE.Mesh(
                new THREE.OctahedronGeometry(size * 0.5, 0),
                new THREE.MeshPhongMaterial({ color: this.def.color, emissive: this.def.emissive })
            );
            group.add(body);
            // Eyes
            const eyeGeo = new THREE.SphereGeometry(size * 0.12, 4, 4);
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const eye1 = new THREE.Mesh(eyeGeo, eyeMat);
            const eye2 = new THREE.Mesh(eyeGeo, eyeMat);
            eye1.position.set(-size * 0.2, size * 0.1, -size * 0.35);
            eye2.position.set(size * 0.2, size * 0.1, -size * 0.35);
            group.add(eye1, eye2);
        } else if (this.type === 'spitter') {
            const body = new THREE.Mesh(
                new THREE.ConeGeometry(size * 0.4, size, 5),
                new THREE.MeshPhongMaterial({ color: this.def.color, emissive: this.def.emissive })
            );
            body.position.y = size * 0.3;
            group.add(body);
            const head = new THREE.Mesh(
                new THREE.SphereGeometry(size * 0.3, 6, 6),
                new THREE.MeshPhongMaterial({ color: this.def.color, emissive: this.def.emissive })
            );
            head.position.y = size * 0.8;
            group.add(head);
        } else if (this.type === 'charger') {
            const body = new THREE.Mesh(
                new THREE.BoxGeometry(size * 0.8, size * 0.6, size),
                new THREE.MeshPhongMaterial({ color: this.def.color, emissive: this.def.emissive })
            );
            body.position.y = size * 0.1;
            group.add(body);
            // Horns
            const hornGeo = new THREE.ConeGeometry(size * 0.1, size * 0.5, 4);
            const hornMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
            const horn1 = new THREE.Mesh(hornGeo, hornMat);
            const horn2 = new THREE.Mesh(hornGeo, hornMat);
            horn1.position.set(-size * 0.3, size * 0.4, -size * 0.3);
            horn1.rotation.x = -0.5;
            horn2.position.set(size * 0.3, size * 0.4, -size * 0.3);
            horn2.rotation.x = -0.5;
            group.add(horn1, horn2);
        } else if (this.type === 'heavy') {
            const body = new THREE.Mesh(
                new THREE.BoxGeometry(size, size * 1.2, size * 0.8),
                new THREE.MeshPhongMaterial({ color: this.def.color, emissive: this.def.emissive })
            );
            group.add(body);
            // Cannon
            const cannon = new THREE.Mesh(
                new THREE.CylinderGeometry(size * 0.12, size * 0.15, size * 0.6, 6),
                new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 })
            );
            cannon.rotation.x = Math.PI / 2;
            cannon.position.set(0, 0, -size * 0.6);
            group.add(cannon);
        } else if (this.type === 'boss') {
            const body = new THREE.Mesh(
                new THREE.DodecahedronGeometry(size * 0.6, 0),
                new THREE.MeshPhongMaterial({ color: this.def.color, emissive: this.def.emissive })
            );
            group.add(body);
            // Spikes
            for (let i = 0; i < 6; i++) {
                const spike = new THREE.Mesh(
                    new THREE.ConeGeometry(size * 0.15, size * 0.8, 4),
                    new THREE.MeshPhongMaterial({ color: 0xff4444, emissive: 0x440000 })
                );
                const angle = (i / 6) * Math.PI * 2;
                spike.position.set(Math.cos(angle) * size * 0.7, 0, Math.sin(angle) * size * 0.7);
                spike.lookAt(new THREE.Vector3(
                    Math.cos(angle) * size * 2, 0, Math.sin(angle) * size * 2
                ));
                group.add(spike);
            }
            // Core eye
            const eye = new THREE.Mesh(
                new THREE.SphereGeometry(size * 0.2, 8, 8),
                new THREE.MeshBasicMaterial({ color: 0xffffff })
            );
            eye.position.z = -size * 0.5;
            group.add(eye);
        }

        return group;
    }

    createHealthBar(color) {
        const geo = new THREE.PlaneGeometry(1, 0.08);
        const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
        return new THREE.Mesh(geo, mat);
    }

    takeDamage(amount, knockbackDir = null) {
        if (!this.alive) return false;
        this.health -= amount;
        this.hitFlashTime = performance.now();
        this.activated = true;

        // Flash white on hit
        this.mesh.traverse(child => {
            if (child.isMesh && child.material.emissive) {
                child.material.emissive.set(0xffffff);
            }
        });

        if (knockbackDir) {
            this.mesh.position.add(knockbackDir.multiplyScalar(0.3));
        }

        if (this.health <= 0) {
            this.health = 0;
            this.die();
            return true; // killed
        }
        return false; // survived
    }

    die() {
        this.alive = false;
        this.state = 'dead';
        this.deathTime = performance.now();
    }

    update(dt, playerPos, scene, projectiles, wallBoxes) {
        if (!this.alive) {
            // Death animation
            const elapsed = performance.now() - this.deathTime;
            if (elapsed < 500) {
                const t = elapsed / 500;
                this.mesh.scale.set(1 - t, 1 - t, 1 - t);
                this.mesh.rotation.y += dt * 10;
                this.mesh.position.y -= dt * 2;
            } else {
                scene.remove(this.mesh);
                return false; // remove from list
            }
            return true;
        }

        // Hit flash recovery
        if (performance.now() - this.hitFlashTime > 80) {
            this.mesh.traverse(child => {
                if (child.isMesh && child.material.emissive) {
                    child.material.emissive.set(this.def.emissive);
                }
            });
        }

        // Health bar
        const healthPct = this.health / this.maxHealth;
        this.healthBar.scale.x = healthPct;
        this.healthBar.position.x = -(1 - healthPct) * 0.5;
        this.healthBarBg.visible = healthPct < 1;
        this.healthBar.visible = healthPct < 1;
        // Billboard health bar
        this.healthBar.lookAt(playerPos);
        this.healthBarBg.lookAt(playerPos);

        const toPlayer = new THREE.Vector3().subVectors(playerPos, this.mesh.position);
        const distToPlayer = toPlayer.length();
        toPlayer.y = 0;
        const flatDist = toPlayer.length();
        toPlayer.normalize();

        // Activation
        if (!this.activated && distToPlayer < this.activationRange) {
            this.activated = true;
        }
        if (!this.activated) return true;

        // Face player
        const targetAngle = Math.atan2(toPlayer.x, toPlayer.z);
        this.mesh.rotation.y = targetAngle;

        // Bob animation
        this.mesh.position.y = this.def.size * 0.5 + Math.sin(performance.now() * 0.003) * 0.1;

        const now = performance.now();

        switch (this.def.behavior) {
            case 'melee':
                if (flatDist > this.def.attackRange) {
                    this.moveToward(toPlayer, dt, this.def.speed, wallBoxes);
                } else if (now - this.lastAttackTime > this.def.attackRate) {
                    this.lastAttackTime = now;
                    return { attack: true, damage: this.def.damage, type: 'melee' };
                }
                break;

            case 'ranged':
                // Keep distance, strafe, shoot
                if (flatDist > this.def.attackRange * 0.8) {
                    this.moveToward(toPlayer, dt, this.def.speed, wallBoxes);
                } else if (flatDist < this.def.attackRange * 0.3) {
                    this.moveToward(toPlayer, dt, -this.def.speed, wallBoxes);
                } else {
                    // Strafe
                    const strafe = new THREE.Vector3(-toPlayer.z, 0, toPlayer.x);
                    const strafeDir = Math.sin(now * 0.001 + this.mesh.id) > 0 ? 1 : -1;
                    this.moveToward(strafe, dt, this.def.speed * 0.5 * strafeDir, wallBoxes);
                }
                if (now - this.lastAttackTime > this.def.attackRate && flatDist < this.def.attackRange) {
                    this.lastAttackTime = now;
                    this.fireProjectile(scene, toPlayer, projectiles);
                }
                break;

            case 'charge':
                if (this.state !== 'charging') {
                    if (flatDist < this.def.attackRange * 5 && flatDist > this.def.attackRange) {
                        if (now - this.lastAttackTime > this.def.attackRate) {
                            this.state = 'charging';
                            this.chargeDir = toPlayer.clone();
                            this.stateTimer = now;
                            this.lastAttackTime = now;
                        }
                    }
                    this.moveToward(toPlayer, dt, this.def.speed, wallBoxes);
                } else {
                    this.moveToward(this.chargeDir, dt, this.def.chargeSpeed, wallBoxes);
                    if (now - this.stateTimer > 600) {
                        this.state = 'chase';
                    }
                    if (flatDist < this.def.attackRange) {
                        this.state = 'chase';
                        return { attack: true, damage: this.def.damage, type: 'melee' };
                    }
                }
                break;

            case 'boss':
                // Multi-attack boss
                if (flatDist > 8) {
                    this.moveToward(toPlayer, dt, this.def.speed, wallBoxes);
                } else {
                    const strafe = new THREE.Vector3(-toPlayer.z, 0, toPlayer.x);
                    const strafeDir = Math.sin(now * 0.0008) > 0 ? 1 : -1;
                    this.moveToward(strafe, dt, this.def.speed * strafeDir, wallBoxes);
                }
                if (now - this.lastAttackTime > this.def.attackRate) {
                    this.lastAttackTime = now;
                    // Fire spread of projectiles
                    for (let i = -2; i <= 2; i++) {
                        const dir = toPlayer.clone();
                        const angle = i * 0.15;
                        const rotated = new THREE.Vector3(
                            dir.x * Math.cos(angle) - dir.z * Math.sin(angle),
                            0,
                            dir.x * Math.sin(angle) + dir.z * Math.cos(angle)
                        );
                        this.fireProjectile(scene, rotated, projectiles);
                    }
                }
                // Spin animation for boss
                this.mesh.children.forEach((child, i) => {
                    if (i > 0 && i < 7) {
                        child.rotation.z = Math.sin(now * 0.002 + i) * 0.3;
                    }
                });
                break;
        }

        return true;
    }

    moveToward(dir, dt, speed, wallBoxes) {
        const move = dir.clone().normalize().multiplyScalar(speed * dt);
        this.mesh.position.add(move);
        // Push out of walls
        if (wallBoxes) {
            const pos = this.mesh.position;
            const radius = this.def.size * 0.5;
            for (const box of wallBoxes) {
                const closest = new THREE.Vector3(
                    Math.max(box.min.x, Math.min(pos.x, box.max.x)),
                    pos.y,
                    Math.max(box.min.z, Math.min(pos.z, box.max.z))
                );
                const dist = pos.distanceTo(closest);
                if (dist < radius) {
                    const pushDir = new THREE.Vector3().subVectors(pos, closest).normalize();
                    pos.add(pushDir.multiplyScalar(radius - dist));
                }
            }
        }
    }

    fireProjectile(scene, direction, projectiles) {
        const projGeo = new THREE.SphereGeometry(0.15, 4, 4);
        const projMat = new THREE.MeshBasicMaterial({
            color: this.def.projectileColor || 0xff0000,
        });
        const proj = new THREE.Mesh(projGeo, projMat);
        proj.position.copy(this.mesh.position);
        proj.position.y = this.def.size * 0.5;

        // Point light for projectile glow
        const light = new THREE.PointLight(this.def.projectileColor || 0xff0000, 1, 5);
        proj.add(light);

        scene.add(proj);
        projectiles.push({
            mesh: proj,
            velocity: direction.clone().normalize().multiplyScalar(this.def.projectileSpeed || 10),
            damage: this.def.damage,
            time: performance.now()
        });
    }
}

export class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = [];
        this.projectiles = [];
    }

    spawn(type, position) {
        const enemy = new Enemy(type, position, this.scene);
        this.enemies.push(enemy);
        return enemy;
    }

    clear() {
        this.enemies.forEach(e => {
            this.scene.remove(e.mesh);
        });
        this.enemies = [];
        this.projectiles.forEach(p => {
            this.scene.remove(p.mesh);
            p.mesh.geometry.dispose();
            p.mesh.material.dispose();
        });
        this.projectiles = [];
    }

    get aliveCount() {
        return this.enemies.filter(e => e.alive).length;
    }

    update(dt, playerPos, wallBoxes) {
        const attacks = [];

        this.enemies = this.enemies.filter(enemy => {
            const result = enemy.update(dt, playerPos, this.scene, this.projectiles, wallBoxes || []);
            if (result && result.attack) {
                attacks.push(result);
            }
            return result !== false;
        });

        // Update projectiles
        this.projectiles = this.projectiles.filter(p => {
            p.mesh.position.add(p.velocity.clone().multiplyScalar(dt));
            const age = performance.now() - p.time;
            if (age > 4000) {
                this.scene.remove(p.mesh);
                p.mesh.geometry.dispose();
                p.mesh.material.dispose();
                return false;
            }

            // Check if projectile hit a wall
            if (wallBoxes) {
                const pos = p.mesh.position;
                for (const box of wallBoxes) {
                    if (pos.x >= box.min.x && pos.x <= box.max.x &&
                        pos.y >= box.min.y && pos.y <= box.max.y &&
                        pos.z >= box.min.z && pos.z <= box.max.z) {
                        this.scene.remove(p.mesh);
                        p.mesh.geometry.dispose();
                        p.mesh.material.dispose();
                        return false;
                    }
                }
            }

            // Check if projectile hit player
            const dist = p.mesh.position.distanceTo(playerPos);
            if (dist < 1.2) {
                this.scene.remove(p.mesh);
                p.mesh.geometry.dispose();
                p.mesh.material.dispose();
                attacks.push({ attack: true, damage: p.damage, type: 'projectile' });
                return false;
            }

            return true;
        });

        return attacks;
    }
}
