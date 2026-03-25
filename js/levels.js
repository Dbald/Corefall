import * as THREE from 'three';

// Level definitions
// Each level has rooms connected by corridors
// Room format: { x, z, w, h, enemies: [...], pickups: [...] }
// Enemies: { type, x, z }
// Pickups: { type, x, z, data }

export const LEVELS = [
    // SECTOR 1: Surface Breach
    {
        name: 'SURFACE BREACH',
        subtitle: 'The entry point. Basic hostiles detected.',
        ambientColor: 0x112211,
        fogColor: 0x0a1a0a,
        fogDensity: 0.03,
        floorColor: 0x333333,
        wallColor: 0x445544,
        ceilingColor: 0x222222,
        rooms: [
            { x: 0, z: 0, w: 12, h: 12, isStart: true },
            { x: 0, z: -18, w: 10, h: 10,
                enemies: [
                    { type: 'drone', x: -2, z: -17 },
                    { type: 'drone', x: 2, z: -19 },
                    { type: 'drone', x: 0, z: -16 }
                ],
                pickups: [{ type: 'health', x: 0, z: -20 }]
            },
            { x: 0, z: -36, w: 14, h: 14,
                enemies: [
                    { type: 'drone', x: -4, z: -34 },
                    { type: 'drone', x: 4, z: -34 },
                    { type: 'drone', x: -3, z: -38 },
                    { type: 'drone', x: 3, z: -38 },
                    { type: 'spitter', x: 0, z: -40 }
                ],
                pickups: [
                    { type: 'ammo', x: -5, z: -36 },
                    { type: 'score', x: 5, z: -36 }
                ]
            },
            { x: 0, z: -54, w: 10, h: 10, isExit: true,
                enemies: [
                    { type: 'drone', x: -2, z: -53 },
                    { type: 'drone', x: 2, z: -53 },
                    { type: 'spitter', x: 0, z: -57 }
                ],
                pickups: [{ type: 'score', x: 0, z: -54 }]
            }
        ],
        corridors: [
            { from: 0, to: 1, width: 4 },
            { from: 1, to: 2, width: 4 },
            { from: 2, to: 3, width: 4 }
        ]
    },

    // SECTOR 2: Fuel Caverns
    {
        name: 'FUEL CAVERNS',
        subtitle: 'Deeper now. The walls hum with unstable energy.',
        ambientColor: 0x221100,
        fogColor: 0x1a0a00,
        fogDensity: 0.035,
        floorColor: 0x332211,
        wallColor: 0x554422,
        ceilingColor: 0x221100,
        rooms: [
            { x: 0, z: 0, w: 10, h: 10, isStart: true },
            { x: -15, z: -12, w: 12, h: 12,
                enemies: [
                    { type: 'drone', x: -14, z: -10 },
                    { type: 'drone', x: -16, z: -14 },
                    { type: 'spitter', x: -18, z: -12 },
                    { type: 'spitter', x: -12, z: -12 }
                ],
                pickups: [
                    { type: 'weapon', x: -15, z: -12, data: { weapon: 'scatter' } },
                    { type: 'ammo', x: -13, z: -10 }
                ]
            },
            { x: 15, z: -12, w: 12, h: 12,
                enemies: [
                    { type: 'drone', x: 14, z: -10 },
                    { type: 'drone', x: 16, z: -14 },
                    { type: 'charger', x: 15, z: -12 }
                ],
                pickups: [
                    { type: 'health', x: 15, z: -14 },
                    { type: 'score', x: 13, z: -11 }
                ]
            },
            { x: 0, z: -30, w: 16, h: 14,
                enemies: [
                    { type: 'spitter', x: -5, z: -28 },
                    { type: 'spitter', x: 5, z: -28 },
                    { type: 'drone', x: -3, z: -32 },
                    { type: 'drone', x: 3, z: -32 },
                    { type: 'charger', x: 0, z: -34 }
                ],
                pickups: [
                    { type: 'health', x: -6, z: -30 },
                    { type: 'ammo', x: 6, z: -30 }
                ]
            },
            { x: 0, z: -50, w: 10, h: 10, isExit: true,
                enemies: [
                    { type: 'spitter', x: -3, z: -48 },
                    { type: 'spitter', x: 3, z: -48 },
                    { type: 'charger', x: 0, z: -52 }
                ],
                pickups: [{ type: 'score', x: 0, z: -50 }]
            }
        ],
        corridors: [
            { from: 0, to: 1, width: 3 },
            { from: 0, to: 2, width: 3 },
            { from: 1, to: 3, width: 4 },
            { from: 2, to: 3, width: 4 },
            { from: 3, to: 4, width: 3 }
        ]
    },

    // SECTOR 3: Swarm Foundry
    {
        name: 'SWARM FOUNDRY',
        subtitle: 'Enemy production lines. High density threats.',
        ambientColor: 0x110022,
        fogColor: 0x0a001a,
        fogDensity: 0.03,
        floorColor: 0x222233,
        wallColor: 0x443366,
        ceilingColor: 0x110022,
        rooms: [
            { x: 0, z: 0, w: 10, h: 10, isStart: true,
                pickups: [{ type: 'ammo', x: 2, z: 2 }]
            },
            { x: 0, z: -16, w: 18, h: 14,
                enemies: [
                    { type: 'drone', x: -6, z: -14 },
                    { type: 'drone', x: -4, z: -18 },
                    { type: 'drone', x: 6, z: -14 },
                    { type: 'drone', x: 4, z: -18 },
                    { type: 'spitter', x: -7, z: -16 },
                    { type: 'spitter', x: 7, z: -16 },
                    { type: 'charger', x: 0, z: -20 }
                ],
                pickups: [
                    { type: 'health', x: 0, z: -14 },
                    { type: 'ammo', x: -6, z: -18 }
                ]
            },
            { x: -20, z: -16, w: 10, h: 10,
                enemies: [
                    { type: 'heavy', x: -20, z: -16 },
                    { type: 'drone', x: -22, z: -14 },
                    { type: 'drone', x: -18, z: -18 }
                ],
                pickups: [
                    { type: 'weapon', x: -20, z: -16, data: { weapon: 'pulse' } }
                ]
            },
            { x: 0, z: -38, w: 20, h: 16,
                enemies: [
                    { type: 'spitter', x: -7, z: -36 },
                    { type: 'spitter', x: 7, z: -36 },
                    { type: 'charger', x: -4, z: -40 },
                    { type: 'charger', x: 4, z: -40 },
                    { type: 'heavy', x: 0, z: -42 },
                    { type: 'drone', x: -8, z: -38 },
                    { type: 'drone', x: 8, z: -38 }
                ],
                pickups: [
                    { type: 'health', x: -8, z: -40 },
                    { type: 'ammo', x: 8, z: -40 },
                    { type: 'score', x: 0, z: -38 }
                ]
            },
            { x: 0, z: -58, w: 10, h: 10, isExit: true,
                enemies: [
                    { type: 'heavy', x: 0, z: -58 },
                    { type: 'spitter', x: -3, z: -56 },
                    { type: 'spitter', x: 3, z: -56 }
                ]
            }
        ],
        corridors: [
            { from: 0, to: 1, width: 4 },
            { from: 1, to: 2, width: 3 },
            { from: 1, to: 3, width: 5 },
            { from: 3, to: 4, width: 4 }
        ]
    },

    // SECTOR 4: Gravemind Shaft
    {
        name: 'GRAVEMIND SHAFT',
        subtitle: 'Vertical pressure. They are faster here.',
        ambientColor: 0x001122,
        fogColor: 0x000a1a,
        fogDensity: 0.025,
        floorColor: 0x223344,
        wallColor: 0x334455,
        ceilingColor: 0x112233,
        rooms: [
            { x: 0, z: 0, w: 12, h: 12, isStart: true,
                pickups: [
                    { type: 'health', x: 3, z: 3 },
                    { type: 'ammo', x: -3, z: 3 }
                ]
            },
            { x: 0, z: -18, w: 14, h: 14,
                enemies: [
                    { type: 'charger', x: -4, z: -16 },
                    { type: 'charger', x: 4, z: -16 },
                    { type: 'charger', x: 0, z: -20 },
                    { type: 'spitter', x: -5, z: -20 },
                    { type: 'spitter', x: 5, z: -20 }
                ],
                pickups: [{ type: 'health', x: 0, z: -18 }]
            },
            { x: 18, z: -18, w: 12, h: 12,
                enemies: [
                    { type: 'heavy', x: 18, z: -18 },
                    { type: 'heavy', x: 20, z: -20 },
                    { type: 'drone', x: 16, z: -16 },
                    { type: 'drone', x: 20, z: -16 }
                ],
                pickups: [
                    { type: 'ammo', x: 18, z: -20 },
                    { type: 'powerup', x: 18, z: -16, data: { type: 'damage' } }
                ]
            },
            { x: 0, z: -40, w: 20, h: 18,
                enemies: [
                    { type: 'charger', x: -6, z: -36 },
                    { type: 'charger', x: 6, z: -36 },
                    { type: 'spitter', x: -8, z: -40 },
                    { type: 'spitter', x: 8, z: -40 },
                    { type: 'heavy', x: 0, z: -44 },
                    { type: 'drone', x: -4, z: -42 },
                    { type: 'drone', x: 4, z: -42 },
                    { type: 'charger', x: 0, z: -38 }
                ],
                pickups: [
                    { type: 'health', x: -8, z: -44 },
                    { type: 'health', x: 8, z: -44 },
                    { type: 'ammo', x: 0, z: -46 },
                    { type: 'score', x: 0, z: -40 }
                ]
            },
            { x: 0, z: -62, w: 10, h: 10, isExit: true,
                enemies: [
                    { type: 'heavy', x: -3, z: -62 },
                    { type: 'heavy', x: 3, z: -62 },
                    { type: 'charger', x: 0, z: -60 },
                    { type: 'spitter', x: 0, z: -64 }
                ]
            }
        ],
        corridors: [
            { from: 0, to: 1, width: 4 },
            { from: 1, to: 2, width: 3 },
            { from: 1, to: 3, width: 5 },
            { from: 3, to: 4, width: 4 }
        ]
    },

    // SECTOR 5: Core Gate
    {
        name: 'CORE GATE',
        subtitle: 'The final barrier. Maximum resistance.',
        ambientColor: 0x220000,
        fogColor: 0x1a0000,
        fogDensity: 0.02,
        floorColor: 0x332222,
        wallColor: 0x553333,
        ceilingColor: 0x220000,
        rooms: [
            { x: 0, z: 0, w: 14, h: 14, isStart: true,
                pickups: [
                    { type: 'health', x: 4, z: 4 },
                    { type: 'ammo', x: -4, z: 4 },
                    { type: 'ammo', x: 0, z: -4 }
                ]
            },
            { x: 0, z: -22, w: 20, h: 16,
                enemies: [
                    { type: 'heavy', x: -7, z: -20 },
                    { type: 'heavy', x: 7, z: -20 },
                    { type: 'charger', x: -3, z: -24 },
                    { type: 'charger', x: 3, z: -24 },
                    { type: 'spitter', x: -8, z: -24 },
                    { type: 'spitter', x: 8, z: -24 },
                    { type: 'drone', x: -5, z: -18 },
                    { type: 'drone', x: 5, z: -18 },
                    { type: 'drone', x: 0, z: -26 }
                ],
                pickups: [
                    { type: 'health', x: -8, z: -22 },
                    { type: 'ammo', x: 8, z: -22 }
                ]
            },
            { x: 0, z: -46, w: 16, h: 16,
                enemies: [
                    { type: 'heavy', x: -5, z: -44 },
                    { type: 'heavy', x: 5, z: -44 },
                    { type: 'charger', x: 0, z: -48 },
                    { type: 'charger', x: -6, z: -48 },
                    { type: 'charger', x: 6, z: -48 },
                    { type: 'spitter', x: -6, z: -42 },
                    { type: 'spitter', x: 6, z: -42 }
                ],
                pickups: [
                    { type: 'health', x: 0, z: -44 },
                    { type: 'health', x: 0, z: -48 },
                    { type: 'ammo', x: -6, z: -46 },
                    { type: 'ammo', x: 6, z: -46 }
                ]
            },
            { x: 0, z: -68, w: 10, h: 10, isExit: true,
                enemies: [
                    { type: 'heavy', x: 0, z: -68 },
                    { type: 'charger', x: -3, z: -66 },
                    { type: 'charger', x: 3, z: -66 },
                    { type: 'spitter', x: -3, z: -70 },
                    { type: 'spitter', x: 3, z: -70 }
                ]
            }
        ],
        corridors: [
            { from: 0, to: 1, width: 5 },
            { from: 1, to: 2, width: 5 },
            { from: 2, to: 3, width: 4 }
        ]
    },

    // SECTOR 6: The Engine Core (Boss)
    {
        name: 'THE ENGINE CORE',
        subtitle: 'Destroy the engine. End this.',
        ambientColor: 0x330000,
        fogColor: 0x220000,
        fogDensity: 0.015,
        floorColor: 0x441111,
        wallColor: 0x662222,
        ceilingColor: 0x330000,
        rooms: [
            { x: 0, z: 0, w: 14, h: 14, isStart: true,
                pickups: [
                    { type: 'health', x: 4, z: 4 },
                    { type: 'health', x: -4, z: 4 },
                    { type: 'ammo', x: 4, z: -4 },
                    { type: 'ammo', x: -4, z: -4 }
                ]
            },
            { x: 0, z: -26, w: 30, h: 30, isBossRoom: true,
                enemies: [
                    { type: 'boss', x: 0, z: -30 }
                ],
                pickups: [
                    { type: 'health', x: -12, z: -20 },
                    { type: 'health', x: 12, z: -20 },
                    { type: 'health', x: -12, z: -36 },
                    { type: 'health', x: 12, z: -36 },
                    { type: 'ammo', x: -10, z: -26 },
                    { type: 'ammo', x: 10, z: -26 }
                ]
            }
        ],
        corridors: [
            { from: 0, to: 1, width: 6 }
        ]
    }
];

export const INTRO_TEXT = `VANTA-9. A rogue planet on collision course with your star system.

Deep within it lies an ancient engine — a weapon capable of collapsing suns.

The Hollow Swarm has awakened to defend it.

You are ROOK-7. Last strike operative. No backup. No extraction.

Descend. Fight. Destroy the engine.

Or everything burns.`;

export const LEVEL_TRANSITIONS = [
    'Surface breach successful. Descending to fuel caverns.',
    'Caverns cleared. Swarm foundry detected below.',
    'Foundry destroyed. Gravity shaft ahead — they know you\'re coming.',
    'Almost there. The core gate is the last barrier.',
    'Gate broken. The engine is exposed. This ends now.'
];

export const VICTORY_TEXT = 'The engine is destroyed. Vanta-9 begins to collapse.\n\nYou did it, Rook-7. The system is safe.\n\nFor now.';
export const DEFEAT_TEXT = 'Signal lost. Operative down.\n\nThe engine continues to feed.';

export function buildLevel(levelIndex, scene) {
    const level = LEVELS[levelIndex];
    const group = new THREE.Group();

    const wallHeight = 4;
    const wallThickness = 0.5;

    const floorMat = new THREE.MeshPhongMaterial({ color: level.floorColor });
    const wallMat = new THREE.MeshPhongMaterial({ color: level.wallColor });
    const ceilMat = new THREE.MeshPhongMaterial({ color: level.ceilingColor });

    let playerStart = new THREE.Vector3(0, 1.5, 0);
    let exitPosition = null;

    // Build rooms
    level.rooms.forEach(room => {
        // Floor
        const floor = new THREE.Mesh(
            new THREE.BoxGeometry(room.w, 0.2, room.h),
            floorMat
        );
        floor.position.set(room.x, -0.1, room.z);
        floor.receiveShadow = true;
        group.add(floor);

        // Ceiling
        const ceil = new THREE.Mesh(
            new THREE.BoxGeometry(room.w, 0.2, room.h),
            ceilMat
        );
        ceil.position.set(room.x, wallHeight, room.z);
        group.add(ceil);

        // Walls
        const halfW = room.w / 2;
        const halfH = room.h / 2;

        // North wall
        addWall(group, wallMat, room.x, room.z - halfH, room.w, wallHeight, wallThickness, 'ns');
        // South wall
        addWall(group, wallMat, room.x, room.z + halfH, room.w, wallHeight, wallThickness, 'ns');
        // East wall
        addWall(group, wallMat, room.x + halfW, room.z, wallThickness, wallHeight, room.h, 'ew');
        // West wall
        addWall(group, wallMat, room.x - halfW, room.z, wallThickness, wallHeight, room.h, 'ew');

        // Room lighting
        const roomLight = new THREE.PointLight(level.wallColor, 0.8, room.w * 1.5);
        roomLight.position.set(room.x, wallHeight - 0.5, room.z);
        group.add(roomLight);

        if (room.isStart) {
            playerStart = new THREE.Vector3(room.x, 1.5, room.z + room.h / 2 - 2);
        }

        if (room.isExit) {
            exitPosition = new THREE.Vector3(room.x, 0, room.z - room.h / 2 + 1);
            // Exit marker
            const exitLight = new THREE.PointLight(0x00ffaa, 2, 6);
            exitLight.position.set(room.x, 1, room.z - room.h / 2 + 1);
            group.add(exitLight);
            // Exit pad
            const exitPad = new THREE.Mesh(
                new THREE.CylinderGeometry(1.5, 1.5, 0.1, 16),
                new THREE.MeshBasicMaterial({ color: 0x00ffaa, transparent: true, opacity: 0.5 })
            );
            exitPad.position.set(room.x, 0.05, room.z - room.h / 2 + 1);
            exitPad.userData.isExit = true;
            group.add(exitPad);
        }

        if (room.isBossRoom) {
            // Add dramatic lighting
            const bossLight = new THREE.PointLight(0xff0044, 2, 30);
            bossLight.position.set(room.x, wallHeight - 1, room.z);
            group.add(bossLight);
            // Pulsing core in center of room
            const coreSphere = new THREE.Mesh(
                new THREE.SphereGeometry(2, 16, 16),
                new THREE.MeshBasicMaterial({
                    color: 0xff0022,
                    transparent: true,
                    opacity: 0.3,
                    wireframe: true
                })
            );
            coreSphere.position.set(room.x, wallHeight / 2, room.z - 4);
            coreSphere.userData.isBossCore = true;
            group.add(coreSphere);
        }
    });

    // Build corridors
    level.corridors.forEach(corr => {
        const fromRoom = level.rooms[corr.from];
        const toRoom = level.rooms[corr.to];

        const fx = fromRoom.x, fz = fromRoom.z;
        const tx = toRoom.x, tz = toRoom.z;

        const dx = tx - fx;
        const dz = tz - fz;

        if (Math.abs(dx) < 1) {
            // Vertical corridor
            const minZ = Math.min(fz + (dz > 0 ? fromRoom.h / 2 : -fromRoom.h / 2),
                                  tz + (dz < 0 ? toRoom.h / 2 : -toRoom.h / 2));
            const maxZ = Math.max(fz + (dz > 0 ? fromRoom.h / 2 : -fromRoom.h / 2),
                                  tz + (dz < 0 ? toRoom.h / 2 : -toRoom.h / 2));
            const len = maxZ - minZ;
            const midZ = (minZ + maxZ) / 2;

            // Floor
            const floor = new THREE.Mesh(
                new THREE.BoxGeometry(corr.width, 0.2, len),
                floorMat
            );
            floor.position.set(fx, -0.1, midZ);
            group.add(floor);

            // Ceiling
            const ceil = new THREE.Mesh(
                new THREE.BoxGeometry(corr.width, 0.2, len),
                ceilMat
            );
            ceil.position.set(fx, wallHeight, midZ);
            group.add(ceil);

            // Side walls
            addWall(group, wallMat, fx - corr.width / 2, midZ, wallThickness, wallHeight, len, 'ew');
            addWall(group, wallMat, fx + corr.width / 2, midZ, wallThickness, wallHeight, len, 'ew');

            // Corridor light
            const cLight = new THREE.PointLight(level.wallColor, 0.4, corr.width * 3);
            cLight.position.set(fx, wallHeight - 0.5, midZ);
            group.add(cLight);
        } else {
            // L-shaped corridor: go horizontal first, then vertical
            const midX = tx;
            const midZ = fz;

            // Horizontal segment
            const hLen = Math.abs(dx);
            const hMidX = (fx + tx) / 2;
            const hFloor = new THREE.Mesh(
                new THREE.BoxGeometry(hLen, 0.2, corr.width),
                floorMat
            );
            hFloor.position.set(hMidX, -0.1, fz);
            group.add(hFloor);

            const hCeil = new THREE.Mesh(
                new THREE.BoxGeometry(hLen, 0.2, corr.width),
                ceilMat
            );
            hCeil.position.set(hMidX, wallHeight, fz);
            group.add(hCeil);

            addWall(group, wallMat, hMidX, fz - corr.width / 2, hLen, wallHeight, wallThickness, 'ns');
            addWall(group, wallMat, hMidX, fz + corr.width / 2, hLen, wallHeight, wallThickness, 'ns');

            // Vertical segment
            const vLen = Math.abs(dz);
            const vMidZ = (fz + tz) / 2;
            const vFloor = new THREE.Mesh(
                new THREE.BoxGeometry(corr.width, 0.2, vLen),
                floorMat
            );
            vFloor.position.set(tx, -0.1, vMidZ);
            group.add(vFloor);

            const vCeil = new THREE.Mesh(
                new THREE.BoxGeometry(corr.width, 0.2, vLen),
                ceilMat
            );
            vCeil.position.set(tx, wallHeight, vMidZ);
            group.add(vCeil);

            addWall(group, wallMat, tx - corr.width / 2, vMidZ, wallThickness, wallHeight, vLen, 'ew');
            addWall(group, wallMat, tx + corr.width / 2, vMidZ, wallThickness, wallHeight, vLen, 'ew');

            // Corner floor
            const cornerFloor = new THREE.Mesh(
                new THREE.BoxGeometry(corr.width, 0.2, corr.width),
                floorMat
            );
            cornerFloor.position.set(midX, -0.1, midZ);
            group.add(cornerFloor);

            const cornerCeil = new THREE.Mesh(
                new THREE.BoxGeometry(corr.width, 0.2, corr.width),
                ceilMat
            );
            cornerCeil.position.set(midX, wallHeight, midZ);
            group.add(cornerCeil);
        }
    });

    scene.add(group);

    // Set fog
    scene.fog = new THREE.FogExp2(level.fogColor, level.fogDensity);
    scene.background = new THREE.Color(level.fogColor);

    // Ambient light
    const ambient = new THREE.AmbientLight(level.ambientColor, 0.6);
    scene.add(ambient);

    return { group, playerStart, exitPosition, levelData: level };
}

function addWall(group, material, x, z, w, h, d, orientation) {
    const wall = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        material
    );
    wall.position.set(x, h / 2, z);
    wall.userData.isWall = true;
    group.add(wall);
}
