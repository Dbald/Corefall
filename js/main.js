import * as THREE from 'three';
import { WeaponSystem, WEAPON_ORDER, WEAPON_DEFS } from './weapons.js';
import { EnemyManager, ENEMY_TYPES } from './enemies.js';
import { PickupManager } from './pickups.js';
import { LEVELS, buildLevel, INTRO_TEXT, LEVEL_TRANSITIONS, VICTORY_TEXT, DEFEAT_TEXT } from './levels.js';
import * as Audio from './audio.js';

// =========== GAME STATE ===========
const state = {
    screen: 'menu', // menu, controls, scores, intro, transition, playing, gameover
    currentLevel: 0,
    health: 100,
    maxHealth: 100,
    score: 0,
    kills: 0,
    combo: 0,
    comboTimer: 0,
    lastDamageTime: 0,
    gameStartTime: 0,
    levelStartTime: 0,
    sectorsCleared: 0,
    paused: false,
    powerup: null,
    powerupTimer: 0,
    isSprinting: false,
    mouseDown: false
};

// =========== THREE.JS SETUP ===========
const canvas = document.getElementById('game-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 200);

const weapons = new WeaponSystem();
let enemyManager = new EnemyManager(scene);
let pickupManager = new PickupManager(scene);

let levelGroup = null;
let exitPosition = null;
let playerVelocity = new THREE.Vector3();
const GRAVITY = 0;
const MOVE_SPEED = 8;
const SPRINT_MULTIPLIER = 1.6;
const MOUSE_SENSITIVITY = 0.002;
const PLAYER_RADIUS = 0.5;

// Input
const keys = {};
let yaw = 0;
let pitch = 0;

// =========== HUD ELEMENTS ===========
const healthBar = document.getElementById('health-bar');
const healthText = document.getElementById('health-text');
const ammoText = document.getElementById('ammo-text');
const scoreText = document.getElementById('score-text');
const sectorText = document.getElementById('sector-text');
const comboDisplay = document.getElementById('combo-display');
const messageDisplay = document.getElementById('message-display');
const damageFlash = document.getElementById('damage-flash');
const hitMarker = document.getElementById('hit-marker');
const weaponSlots = document.querySelectorAll('.weapon-slot');

// =========== SCREEN MANAGEMENT ===========
function showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const gameContainer = document.getElementById('game-container');

    if (name === 'playing') {
        gameContainer.classList.add('active');
        state.screen = 'playing';
        return;
    }

    gameContainer.classList.remove('active');
    const screen = document.getElementById(`${name}-screen`);
    if (screen) screen.classList.add('active');
    state.screen = name;
}

// =========== MENU SETUP ===========
document.getElementById('btn-play').addEventListener('click', () => {
    Audio.resumeAudio();
    Audio.playMenuSelect();
    showIntro();
});

document.getElementById('btn-controls').addEventListener('click', () => {
    Audio.playMenuSelect();
    showScreen('controls');
});

document.getElementById('btn-scores').addEventListener('click', () => {
    Audio.playMenuSelect();
    loadHighScores();
    showScreen('scores');
});

document.getElementById('btn-back-controls').addEventListener('click', () => {
    Audio.playMenuSelect();
    showScreen('menu');
});

document.getElementById('btn-back-scores').addEventListener('click', () => {
    Audio.playMenuSelect();
    showScreen('menu');
});

document.getElementById('btn-restart').addEventListener('click', () => {
    Audio.playMenuSelect();
    showIntro();
});

document.getElementById('btn-menu').addEventListener('click', () => {
    Audio.playMenuSelect();
    Audio.stopMusic();
    showScreen('menu');
});

function loadHighScores() {
    const scores = getHighScores();
    const list = document.getElementById('scores-list');
    if (scores.length === 0) {
        list.innerHTML = '<p style="color:#446">No scores yet. Play to set a record!</p>';
    } else {
        list.innerHTML = scores.map((s, i) =>
            `<div class="score-entry"><span>#${i + 1}</span><span>${s.score.toLocaleString()} pts — Sector ${s.sectors}</span></div>`
        ).join('');
    }
}

function getHighScores() {
    try {
        return JSON.parse(localStorage.getItem('corefall_scores') || '[]');
    } catch { return []; }
}

function saveHighScore(score, kills, sectors) {
    const scores = getHighScores();
    scores.push({ score, kills, sectors, date: Date.now() });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem('corefall_scores', JSON.stringify(scores.slice(0, 10)));
}

// =========== INTRO / TRANSITIONS ===========
function showIntro() {
    showScreen('intro');
    const textEl = document.getElementById('intro-text');
    textEl.textContent = INTRO_TEXT;
}

document.getElementById('intro-screen').addEventListener('click', () => {
    startGame();
});

document.getElementById('transition-screen').addEventListener('click', () => {
    startLevel(state.currentLevel);
});

function showTransition(levelIndex) {
    showScreen('transition');
    document.getElementById('transition-title').textContent = LEVELS[levelIndex].name;
    document.getElementById('transition-text').textContent =
        LEVEL_TRANSITIONS[levelIndex - 1] || 'Descending deeper...';
}

// =========== GAME START / LEVEL LOADING ===========
function startGame() {
    state.health = 100;
    state.score = 0;
    state.kills = 0;
    state.combo = 0;
    state.comboTimer = 0;
    state.currentLevel = 0;
    state.sectorsCleared = 0;
    state.powerup = null;
    state.powerupTimer = 0;
    state.gameStartTime = performance.now();
    weapons.reset();
    startLevel(0);
}

function startLevel(levelIndex) {
    state.currentLevel = levelIndex;
    state.levelStartTime = performance.now();

    // Clear scene
    clearScene();

    // Build level
    const result = buildLevel(levelIndex, scene);
    levelGroup = result.group;
    exitPosition = result.exitPosition;

    // Spawn enemies
    const level = LEVELS[levelIndex];
    level.rooms.forEach(room => {
        if (room.enemies) {
            room.enemies.forEach(e => {
                enemyManager.spawn(e.type, new THREE.Vector3(e.x, 0, e.z));
            });
        }
        if (room.pickups) {
            room.pickups.forEach(p => {
                pickupManager.spawn(p.type, new THREE.Vector3(p.x, 0, p.z), p.data || {});
            });
        }
    });

    // Set player position
    camera.position.copy(result.playerStart);
    yaw = Math.PI; // Face forward (into the level)
    pitch = 0;
    playerVelocity.set(0, 0, 0);

    // Show game
    showScreen('playing');

    // Lock pointer
    canvas.requestPointerLock();

    Audio.startMusic(1 + levelIndex * 0.15);
    showMessage(level.name, 2000);

    if (level.rooms.some(r => r.isBossRoom)) {
        setTimeout(() => Audio.playBossWarning(), 1000);
    }
}

function clearScene() {
    while (scene.children.length > 0) {
        const obj = scene.children[0];
        scene.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
            if (Array.isArray(obj.material)) {
                obj.material.forEach(m => m.dispose());
            } else {
                obj.material.dispose();
            }
        }
    }
    enemyManager = new EnemyManager(scene);
    pickupManager = new PickupManager(scene);
    levelGroup = null;

    // Player-attached light — bright enough to always see surroundings
    const playerLight = new THREE.PointLight(0xccddff, 1.5, 25);
    playerLight.position.set(0, 0, 0);
    camera.add(playerLight);
    // Forward-facing spotlight for extra visibility
    const flashlight = new THREE.SpotLight(0xffffff, 1.0, 40, Math.PI / 4, 0.5);
    flashlight.position.set(0, 0, 0);
    flashlight.target.position.set(0, 0, -1);
    camera.add(flashlight);
    camera.add(flashlight.target);
    scene.add(camera);
}

// =========== INPUT ===========
document.addEventListener('keydown', e => {
    keys[e.code] = true;
    // Weapon switching
    if (e.code === 'Digit1') weapons.switchTo(0);
    if (e.code === 'Digit2') weapons.switchTo(1);
    if (e.code === 'Digit3') weapons.switchTo(2);
});

document.addEventListener('keyup', e => {
    keys[e.code] = false;
});

document.addEventListener('mousemove', e => {
    if (state.screen !== 'playing') return;
    if (document.pointerLockElement !== canvas) return;
    yaw -= e.movementX * MOUSE_SENSITIVITY;
    pitch -= e.movementY * MOUSE_SENSITIVITY;
    pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, pitch));
});

document.addEventListener('mousedown', e => {
    if (state.screen !== 'playing') return;
    if (e.button === 0) {
        state.mouseDown = true;
        if (document.pointerLockElement !== canvas) {
            canvas.requestPointerLock();
        }
    }
});

document.addEventListener('mouseup', e => {
    if (e.button === 0) state.mouseDown = false;
});

document.addEventListener('wheel', e => {
    if (state.screen !== 'playing') return;
    weapons.scrollWeapon(e.deltaY > 0 ? 1 : -1);
});

canvas.addEventListener('click', () => {
    if (state.screen === 'playing' && document.pointerLockElement !== canvas) {
        canvas.requestPointerLock();
    }
});

// =========== COLLISION DETECTION ===========
function checkWallCollision(position, radius) {
    const walls = [];
    if (levelGroup) {
        levelGroup.traverse(child => {
            if (child.userData && child.userData.isWall) {
                walls.push(child);
            }
        });
    }

    for (const wall of walls) {
        const box = new THREE.Box3().setFromObject(wall);
        const closest = new THREE.Vector3(
            Math.max(box.min.x, Math.min(position.x, box.max.x)),
            position.y,
            Math.max(box.min.z, Math.min(position.z, box.max.z))
        );

        const dist = position.distanceTo(closest);
        if (dist < radius) {
            const pushDir = new THREE.Vector3().subVectors(position, closest).normalize();
            position.add(pushDir.multiplyScalar(radius - dist));
        }
    }
}

// =========== COMBAT ===========
function handleShooting(now) {
    if (!state.mouseDown) return;

    const results = weapons.fire(now, camera, scene, enemyManager.enemies);
    if (!results) return;

    const def = weapons.currentDef;
    Audio.playShoot(weapons.current);

    // Camera kick
    pitch += 0.02 + Math.random() * 0.01;

    let hitSomething = false;
    for (const result of results) {
        if (result.enemy) {
            hitSomething = true;
            const dmg = state.powerup === 'damage' ? result.damage * 2 : result.damage;
            const knockDir = result.point ?
                new THREE.Vector3().subVectors(result.point, camera.position).normalize() :
                null;
            const killed = result.enemy.takeDamage(dmg, knockDir);

            Audio.playEnemyHit();

            if (killed) {
                Audio.playEnemyDeath();
                const enemy = result.enemy;
                state.kills++;
                state.combo++;
                state.comboTimer = performance.now();

                // Score
                let scoreGain = enemy.def.score;
                if (state.combo > 1) {
                    scoreGain = Math.floor(scoreGain * (1 + state.combo * 0.25));
                }
                state.score += scoreGain;
                showMessage(`+${scoreGain}`, 500);
            }
        }
    }

    if (hitSomething) {
        hitMarker.classList.add('show');
        setTimeout(() => hitMarker.classList.remove('show'), 100);
    }
}

function handleDamage(attacks) {
    for (const attack of attacks) {
        state.health -= attack.damage;
        state.lastDamageTime = performance.now();
        Audio.playPlayerHit();

        // Damage flash
        damageFlash.classList.add('show');
        setTimeout(() => damageFlash.classList.remove('show'), 200);

        // Camera shake
        pitch += (Math.random() - 0.5) * 0.05;
        yaw += (Math.random() - 0.5) * 0.03;

        if (state.health <= 0) {
            state.health = 0;
            gameOver(false);
            return;
        }
    }
}

// =========== PICKUPS ===========
function handlePickups(collected) {
    for (const item of collected) {
        switch (item.type) {
            case 'health':
                const healAmount = item.data.amount || 25;
                state.health = Math.min(state.maxHealth, state.health + healAmount);
                Audio.playPickup('health');
                showMessage('+HEALTH', 800);
                break;

            case 'ammo':
                // Add ammo to all unlocked weapons
                WEAPON_ORDER.forEach(w => {
                    if (weapons.unlocked[w] && weapons.ammo[w] !== Infinity) {
                        weapons.addAmmo(w, item.data.amount || 15);
                    }
                });
                Audio.playPickup('ammo');
                showMessage('+AMMO', 800);
                break;

            case 'score':
                const scoreVal = item.data.amount || 500;
                state.score += scoreVal;
                Audio.playPickup('score');
                showMessage(`+${scoreVal}`, 800);
                break;

            case 'weapon':
                if (item.data.weapon) {
                    weapons.unlock(item.data.weapon);
                    const idx = WEAPON_ORDER.indexOf(item.data.weapon);
                    weapons.switchTo(idx);
                    Audio.playPickup('weapon');
                    showMessage(`${WEAPON_DEFS[item.data.weapon].name} ACQUIRED`, 1500);
                }
                break;

            case 'powerup':
                state.powerup = item.data.type || 'damage';
                state.powerupTimer = performance.now();
                Audio.playPickup('score');
                showMessage('DAMAGE BOOST!', 1500);
                break;
        }
    }
}

// =========== EXIT CHECK ===========
function checkExit() {
    if (!exitPosition) return;
    if (enemyManager.aliveCount > 0) return; // Must kill all enemies first

    const dist = camera.position.distanceTo(new THREE.Vector3(exitPosition.x, camera.position.y, exitPosition.z));
    if (dist < 2) {
        completeLevel();
    }
}

function completeLevel() {
    // Score bonuses
    const timeBonus = Math.max(0, Math.floor(3000 - (performance.now() - state.levelStartTime) / 100));
    const healthBonus = state.health * 10;
    state.score += timeBonus + healthBonus;
    state.sectorsCleared++;

    Audio.playLevelComplete();

    if (state.currentLevel >= LEVELS.length - 1) {
        // Game won!
        gameOver(true);
    } else {
        // Next level
        Audio.stopMusic();
        showTransition(state.currentLevel + 1);
    }
}

function checkBossDefeated() {
    const level = LEVELS[state.currentLevel];
    if (!level.rooms.some(r => r.isBossRoom)) return;
    if (enemyManager.aliveCount === 0) {
        gameOver(true);
    }
}

// =========== GAME OVER ===========
function gameOver(victory) {
    Audio.stopMusic();
    document.exitPointerLock();

    if (victory) {
        Audio.playLevelComplete();
        document.getElementById('gameover-title').textContent = 'MISSION COMPLETE';
        document.getElementById('gameover-text').textContent = VICTORY_TEXT;
    } else {
        Audio.playGameOver();
        document.getElementById('gameover-title').textContent = 'MISSION FAILED';
        document.getElementById('gameover-text').textContent = DEFEAT_TEXT;
    }

    document.getElementById('final-score').textContent = state.score.toLocaleString();
    document.getElementById('final-kills').textContent = state.kills;
    document.getElementById('final-sectors').textContent = state.sectorsCleared;

    saveHighScore(state.score, state.kills, state.sectorsCleared);
    const best = getHighScores()[0];
    document.getElementById('best-score').textContent = best ? best.score.toLocaleString() : '0';

    showScreen('gameover');
}

// =========== HUD UPDATE ===========
function updateHUD() {
    healthText.textContent = Math.ceil(state.health);
    healthBar.style.width = `${state.health}%`;
    if (state.health <= 25) {
        healthBar.classList.add('low');
    } else {
        healthBar.classList.remove('low');
    }

    const ammo = weapons.ammo[weapons.current];
    ammoText.textContent = ammo === Infinity ? '---' : ammo;

    scoreText.textContent = state.score.toLocaleString();
    sectorText.textContent = `${state.currentLevel + 1}/${LEVELS.length}`;

    // Weapon slots
    weaponSlots.forEach((slot, i) => {
        const wName = WEAPON_ORDER[i];
        if (weapons.unlocked[wName]) {
            slot.classList.toggle('active', i === weapons.currentIndex);
            slot.style.opacity = '1';
        } else {
            slot.classList.remove('active');
            slot.style.opacity = '0.3';
        }
    });

    // Combo
    const now = performance.now();
    if (state.combo > 1 && now - state.comboTimer < 2000) {
        comboDisplay.textContent = `${state.combo}x COMBO`;
        comboDisplay.classList.add('show');
    } else {
        comboDisplay.classList.remove('show');
        if (now - state.comboTimer > 2000) state.combo = 0;
    }

    // Powerup timer
    if (state.powerup && now - state.powerupTimer > 8000) {
        state.powerup = null;
    }
}

let messageTimeout = null;
function showMessage(text, duration = 1000) {
    messageDisplay.textContent = text;
    messageDisplay.classList.add('show');
    if (messageTimeout) clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
        messageDisplay.classList.remove('show');
    }, duration);
}

// =========== MINIMAP ===========
const minimapCanvas = document.getElementById('minimap');
const minimapCtx = minimapCanvas.getContext('2d');
const MINIMAP_SIZE = 180;
const MINIMAP_SCALE = 2.2; // pixels per world unit

function drawMinimap() {
    const ctx = minimapCtx;
    const level = LEVELS[state.currentLevel];
    if (!level) return;

    ctx.clearRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);

    // Center map on player
    const px = camera.position.x;
    const pz = camera.position.z;
    const cx = MINIMAP_SIZE / 2;
    const cy = MINIMAP_SIZE / 2;

    function toMapX(worldX) { return cx + (worldX - px) * MINIMAP_SCALE; }
    function toMapY(worldZ) { return cy + (worldZ - pz) * MINIMAP_SCALE; }

    // Draw corridors
    ctx.fillStyle = '#1a2a1a';
    level.corridors.forEach(corr => {
        const fromRoom = level.rooms[corr.from];
        const toRoom = level.rooms[corr.to];
        const dx = toRoom.x - fromRoom.x;
        const dz = toRoom.z - fromRoom.z;
        const w = corr.width * MINIMAP_SCALE;

        if (Math.abs(dx) < 1) {
            // Vertical corridor
            const edgeFrom = dz < 0 ? fromRoom.z - fromRoom.h / 2 : fromRoom.z + fromRoom.h / 2;
            const edgeTo = dz < 0 ? toRoom.z + toRoom.h / 2 : toRoom.z - toRoom.h / 2;
            const minZ = Math.min(edgeFrom, edgeTo);
            const maxZ = Math.max(edgeFrom, edgeTo);
            ctx.fillRect(
                toMapX(fromRoom.x) - w / 2, toMapY(minZ),
                w, (maxZ - minZ) * MINIMAP_SCALE
            );
        } else {
            // L-shaped: horizontal then vertical
            const hEdge = dx > 0 ? fromRoom.x + fromRoom.w / 2 : fromRoom.x - fromRoom.w / 2;
            const hMinX = Math.min(hEdge, toRoom.x);
            const hMaxX = Math.max(hEdge, toRoom.x);
            ctx.fillRect(
                toMapX(hMinX), toMapY(fromRoom.z) - w / 2,
                (hMaxX - hMinX) * MINIMAP_SCALE, w
            );
            const vEdge = dz < 0 ? toRoom.z + toRoom.h / 2 : toRoom.z - toRoom.h / 2;
            const vMinZ = Math.min(fromRoom.z, vEdge);
            const vMaxZ = Math.max(fromRoom.z, vEdge);
            ctx.fillRect(
                toMapX(toRoom.x) - w / 2, toMapY(vMinZ),
                w, (vMaxZ - vMinZ) * MINIMAP_SCALE
            );
            // Corner
            ctx.fillRect(
                toMapX(toRoom.x) - w / 2, toMapY(fromRoom.z) - w / 2,
                w, w
            );
        }
    });

    // Draw rooms
    level.rooms.forEach(room => {
        ctx.fillStyle = '#1a2a1a';
        ctx.fillRect(
            toMapX(room.x - room.w / 2), toMapY(room.z - room.h / 2),
            room.w * MINIMAP_SCALE, room.h * MINIMAP_SCALE
        );
        ctx.strokeStyle = '#00ffaa44';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(
            toMapX(room.x - room.w / 2), toMapY(room.z - room.h / 2),
            room.w * MINIMAP_SCALE, room.h * MINIMAP_SCALE
        );
    });

    // Draw exit
    if (exitPosition && enemyManager.aliveCount === 0) {
        ctx.fillStyle = '#00ffaa';
        ctx.beginPath();
        ctx.arc(toMapX(exitPosition.x), toMapY(exitPosition.z), 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw enemies
    enemyManager.enemies.forEach(e => {
        if (!e.alive) return;
        const ex = toMapX(e.mesh.position.x);
        const ey = toMapY(e.mesh.position.z);
        if (ex < -5 || ex > MINIMAP_SIZE + 5 || ey < -5 || ey > MINIMAP_SIZE + 5) return;
        ctx.fillStyle = e.type === 'boss' ? '#ff0044' : '#ff4444';
        const sz = e.type === 'boss' ? 4 : 2;
        ctx.fillRect(ex - sz, ey - sz, sz * 2, sz * 2);
    });

    // Draw pickups
    pickupManager.pickups.forEach(p => {
        if (p.collected) return;
        const mx = toMapX(p.mesh.position.x);
        const my = toMapY(p.mesh.position.z);
        if (mx < -5 || mx > MINIMAP_SIZE + 5 || my < -5 || my > MINIMAP_SIZE + 5) return;
        ctx.fillStyle = p.type === 'health' ? '#00ff44' :
                        p.type === 'ammo' ? '#4488ff' :
                        p.type === 'weapon' ? '#ff44ff' :
                        '#ffaa00';
        ctx.fillRect(mx - 1.5, my - 1.5, 3, 3);
    });

    // Draw player (arrow showing direction)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-yaw);
    ctx.fillStyle = '#00ffaa';
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(-3, 4);
    ctx.lineTo(3, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// =========== MAIN LOOP ===========
let lastTime = performance.now();

function gameLoop(time) {
    requestAnimationFrame(gameLoop);

    const dt = Math.min((time - lastTime) / 1000, 0.05); // Cap delta time
    lastTime = time;

    if (state.screen !== 'playing') return;

    // Update camera rotation
    const euler = new THREE.Euler(pitch, yaw, 0, 'YXZ');
    camera.quaternion.setFromEuler(euler);

    // Player movement
    const speed = keys['ShiftLeft'] || keys['ShiftRight'] ? MOVE_SPEED * SPRINT_MULTIPLIER : MOVE_SPEED;
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0))
    );
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0))
    );

    const moveDir = new THREE.Vector3();
    if (keys['KeyW']) moveDir.add(forward);
    if (keys['KeyS']) moveDir.sub(forward);
    if (keys['KeyD']) moveDir.add(right);
    if (keys['KeyA']) moveDir.sub(right);

    if (moveDir.length() > 0) {
        moveDir.normalize().multiplyScalar(speed * dt);
        camera.position.add(moveDir);
    }

    // Keep player at fixed height
    camera.position.y = 1.5;

    // Wall collision
    checkWallCollision(camera.position, PLAYER_RADIUS);

    // Shooting
    handleShooting(performance.now());

    // Update weapons
    weapons.update(scene);

    // Update enemies
    const attacks = enemyManager.update(dt, camera.position);
    if (attacks.length > 0) {
        handleDamage(attacks);
    }

    // Update pickups
    const collected = pickupManager.update(dt, camera.position);
    if (collected.length > 0) {
        handlePickups(collected);
    }

    // Check exit / boss
    checkExit();
    checkBossDefeated();

    // Animate boss core
    scene.traverse(obj => {
        if (obj.userData && obj.userData.isBossCore) {
            obj.rotation.y += dt * 0.5;
            obj.rotation.x += dt * 0.3;
            obj.scale.setScalar(1 + Math.sin(time * 0.002) * 0.1);
        }
    });

    // Update HUD
    updateHUD();
    drawMinimap();

    // Render
    renderer.render(scene, camera);
}

// =========== RESIZE ===========
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// =========== START ===========
showScreen('menu');
requestAnimationFrame(gameLoop);
