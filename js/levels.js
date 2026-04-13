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

// Compute which openings each room needs based on corridor connections
function computeOpenings(level) {
    // For each room, store openings: { side: 'north'|'south'|'east'|'west', center, width }
    const openings = level.rooms.map(() => []);

    level.corridors.forEach(corr => {
        const fromRoom = level.rooms[corr.from];
        const toRoom = level.rooms[corr.to];
        const w = corr.width;

        const dx = toRoom.x - fromRoom.x;
        const dz = toRoom.z - fromRoom.z;

        if (Math.abs(dx) < 1) {
            // Vertical corridor (rooms aligned on x)
            if (dz < 0) {
                // toRoom is north of fromRoom
                openings[corr.from].push({ side: 'north', center: fromRoom.x, width: w });
                openings[corr.to].push({ side: 'south', center: toRoom.x, width: w });
            } else {
                openings[corr.from].push({ side: 'south', center: fromRoom.x, width: w });
                openings[corr.to].push({ side: 'north', center: toRoom.x, width: w });
            }
        } else {
            // L-shaped: horizontal from 'from' room, vertical into 'to' room
            // From room: opening on east or west side
            if (dx > 0) {
                openings[corr.from].push({ side: 'east', center: fromRoom.z, width: w });
            } else {
                openings[corr.from].push({ side: 'west', center: fromRoom.z, width: w });
            }
            // To room: opening on south or north side
            if (dz < 0) {
                // 'to' is north, corridor enters from south
                openings[corr.to].push({ side: 'south', center: toRoom.x, width: w });
            } else if (dz > 0) {
                openings[corr.to].push({ side: 'north', center: toRoom.x, width: w });
            } else {
                // Same z — opening on west or east
                if (dx > 0) {
                    openings[corr.to].push({ side: 'west', center: toRoom.z, width: w });
                } else {
                    openings[corr.to].push({ side: 'east', center: toRoom.z, width: w });
                }
            }
        }
    });

    return openings;
}

// Build a wall with gaps for openings
// wallStart/wallEnd: the extent of the wall along its length axis
// wallFixedPos: the fixed coordinate (x for ns walls, z for ew walls)
// openings: array of { center, width } along the length axis
// orientation: 'ns' (wall runs along x) or 'ew' (wall runs along z)
function buildWallWithGaps(group, material, wallFixedPos, wallStart, wallEnd, wallHeight, wallThickness, orientation, openingsOnWall) {
    // Sort openings by center position
    const sorted = openingsOnWall.slice().sort((a, b) => a.center - b.center);

    // Build solid segments between gaps
    let cursor = wallStart;
    for (const opening of sorted) {
        const gapStart = opening.center - opening.width / 2;
        const gapEnd = opening.center + opening.width / 2;

        if (gapStart > cursor + 0.1) {
            const segLen = gapStart - cursor;
            const segCenter = (cursor + gapStart) / 2;
            if (orientation === 'ns') {
                addWall(group, material, segCenter, wallFixedPos, segLen, wallHeight, wallThickness);
            } else {
                addWall(group, material, wallFixedPos, segCenter, wallThickness, wallHeight, segLen);
            }
        }
        cursor = gapEnd;
    }

    // Final segment after last opening
    if (cursor < wallEnd - 0.1) {
        const segLen = wallEnd - cursor;
        const segCenter = (cursor + wallEnd) / 2;
        if (orientation === 'ns') {
            addWall(group, material, segCenter, wallFixedPos, segLen, wallHeight, wallThickness);
        } else {
            addWall(group, material, wallFixedPos, segCenter, wallThickness, wallHeight, segLen);
        }
    }
}

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

    // Compute corridor openings for each room
    const roomOpenings = computeOpenings(level);

    // Build rooms
    level.rooms.forEach((room, roomIndex) => {
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

        const halfW = room.w / 2;
        const halfH = room.h / 2;
        const openings = roomOpenings[roomIndex];

        // North wall (z - halfH), runs along x-axis
        const northOpenings = openings.filter(o => o.side === 'north');
        buildWallWithGaps(group, wallMat, room.z - halfH,
            room.x - halfW, room.x + halfW,
            wallHeight, wallThickness, 'ns', northOpenings);

        // South wall (z + halfH), runs along x-axis
        const southOpenings = openings.filter(o => o.side === 'south');
        buildWallWithGaps(group, wallMat, room.z + halfH,
            room.x - halfW, room.x + halfW,
            wallHeight, wallThickness, 'ns', southOpenings);

        // East wall (x + halfW), runs along z-axis
        const eastOpenings = openings.filter(o => o.side === 'east');
        buildWallWithGaps(group, wallMat, room.x + halfW,
            room.z - halfH, room.z + halfH,
            wallHeight, wallThickness, 'ew', eastOpenings);

        // West wall (x - halfW), runs along z-axis
        const westOpenings = openings.filter(o => o.side === 'west');
        buildWallWithGaps(group, wallMat, room.x - halfW,
            room.z - halfH, room.z + halfH,
            wallHeight, wallThickness, 'ew', westOpenings);

        // Room lighting — brighter and more of it
        const roomLight = new THREE.PointLight(0xffeedd, 1.5, room.w * 2.5);
        roomLight.position.set(room.x, wallHeight - 0.5, room.z);
        group.add(roomLight);

        // Extra fill lights in larger rooms
        if (room.w > 12 || room.h > 12) {
            const fl1 = new THREE.PointLight(0xffeedd, 0.8, room.w * 1.5);
            fl1.position.set(room.x - room.w * 0.25, 2, room.z - room.h * 0.25);
            group.add(fl1);
            const fl2 = new THREE.PointLight(0xffeedd, 0.8, room.w * 1.5);
            fl2.position.set(room.x + room.w * 0.25, 2, room.z + room.h * 0.25);
            group.add(fl2);
        }

        // Accent lights with level color
        const accentLight = new THREE.PointLight(level.wallColor, 1.0, room.w * 2);
        accentLight.position.set(room.x, 1, room.z);
        group.add(accentLight);

        if (room.isStart) {
            playerStart = new THREE.Vector3(room.x, 1.5, room.z + room.h / 2 - 2);
        }

        if (room.isExit) {
            exitPosition = new THREE.Vector3(room.x, 0, room.z - room.h / 2 + 1);
            const exitLight = new THREE.PointLight(0x00ffaa, 3, 8);
            exitLight.position.set(room.x, 1, room.z - room.h / 2 + 1);
            group.add(exitLight);
            const exitPad = new THREE.Mesh(
                new THREE.CylinderGeometry(1.5, 1.5, 0.1, 16),
                new THREE.MeshBasicMaterial({ color: 0x00ffaa, transparent: true, opacity: 0.5 })
            );
            exitPad.position.set(room.x, 0.05, room.z - room.h / 2 + 1);
            exitPad.userData.isExit = true;
            group.add(exitPad);
        }

        if (room.isBossRoom) {
            const bossLight = new THREE.PointLight(0xff0044, 3, 35);
            bossLight.position.set(room.x, wallHeight - 1, room.z);
            group.add(bossLight);
            const bossLight2 = new THREE.PointLight(0xff4400, 2, 25);
            bossLight2.position.set(room.x, 1, room.z);
            group.add(bossLight2);
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
            // Vertical corridor (rooms share x)
            const edgeFrom = dz < 0 ? fz - fromRoom.h / 2 : fz + fromRoom.h / 2;
            const edgeTo = dz < 0 ? tz + toRoom.h / 2 : tz - toRoom.h / 2;
            const minZ = Math.min(edgeFrom, edgeTo);
            const maxZ = Math.max(edgeFrom, edgeTo);
            const len = maxZ - minZ;
            if (len < 0.1) return;
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
            addWall(group, wallMat, fx - corr.width / 2, midZ, wallThickness, wallHeight, len);
            addWall(group, wallMat, fx + corr.width / 2, midZ, wallThickness, wallHeight, len);

            // Corridor light
            const cLight = new THREE.PointLight(0xffeedd, 0.8, corr.width * 4);
            cLight.position.set(fx, wallHeight - 0.5, midZ);
            group.add(cLight);
        } else {
            // L-shaped corridor
            // Horizontal segment from 'from' room edge to tx
            const hEdge = dx > 0 ? fx + fromRoom.w / 2 : fx - fromRoom.w / 2;
            const hMinX = Math.min(hEdge, tx);
            const hMaxX = Math.max(hEdge, tx);
            const hLen = hMaxX - hMinX;
            const hMidX = (hMinX + hMaxX) / 2;

            if (hLen > 0.1) {
                const hFloor = new THREE.Mesh(
                    new THREE.BoxGeometry(hLen, 0.2, corr.width), floorMat
                );
                hFloor.position.set(hMidX, -0.1, fz);
                group.add(hFloor);

                const hCeil = new THREE.Mesh(
                    new THREE.BoxGeometry(hLen, 0.2, corr.width), ceilMat
                );
                hCeil.position.set(hMidX, wallHeight, fz);
                group.add(hCeil);

                addWall(group, wallMat, hMidX, fz - corr.width / 2, hLen, wallHeight, wallThickness);
                addWall(group, wallMat, hMidX, fz + corr.width / 2, hLen, wallHeight, wallThickness);

                const hLight = new THREE.PointLight(0xffeedd, 0.6, corr.width * 4);
                hLight.position.set(hMidX, wallHeight - 0.5, fz);
                group.add(hLight);
            }

            // Vertical segment from fz to 'to' room edge
            const vEdge = dz < 0 ? tz + toRoom.h / 2 : tz - toRoom.h / 2;
            const vMinZ = Math.min(fz, vEdge);
            const vMaxZ = Math.max(fz, vEdge);
            const vLen = vMaxZ - vMinZ;
            const vMidZ = (vMinZ + vMaxZ) / 2;

            if (vLen > 0.1) {
                const vFloor = new THREE.Mesh(
                    new THREE.BoxGeometry(corr.width, 0.2, vLen), floorMat
                );
                vFloor.position.set(tx, -0.1, vMidZ);
                group.add(vFloor);

                const vCeil = new THREE.Mesh(
                    new THREE.BoxGeometry(corr.width, 0.2, vLen), ceilMat
                );
                vCeil.position.set(tx, wallHeight, vMidZ);
                group.add(vCeil);

                addWall(group, wallMat, tx - corr.width / 2, vMidZ, wallThickness, wallHeight, vLen);
                addWall(group, wallMat, tx + corr.width / 2, vMidZ, wallThickness, wallHeight, vLen);

                const vLight = new THREE.PointLight(0xffeedd, 0.6, corr.width * 4);
                vLight.position.set(tx, wallHeight - 0.5, vMidZ);
                group.add(vLight);
            }

            // Corner piece
            const cornerFloor = new THREE.Mesh(
                new THREE.BoxGeometry(corr.width, 0.2, corr.width), floorMat
            );
            cornerFloor.position.set(tx, -0.1, fz);
            group.add(cornerFloor);

            const cornerCeil = new THREE.Mesh(
                new THREE.BoxGeometry(corr.width, 0.2, corr.width), ceilMat
            );
            cornerCeil.position.set(tx, wallHeight, fz);
            group.add(cornerCeil);
        }
    });

    scene.add(group);

    // Set fog — reduced density for better visibility
    scene.fog = new THREE.FogExp2(level.fogColor, level.fogDensity * 0.6);
    scene.background = new THREE.Color(level.fogColor);

    // Stronger ambient light so nothing is pitch black
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    // Additional hemisphere light for natural fill
    const hemi = new THREE.HemisphereLight(0xaabbcc, level.floorColor, 0.4);
    scene.add(hemi);

    return { group, playerStart, exitPosition, levelData: level };
}

function addWall(group, material, x, z, w, h, d) {
    const wall = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        material
    );
    wall.position.set(x, h / 2, z);
    wall.userData.isWall = true;
    group.add(wall);
}
