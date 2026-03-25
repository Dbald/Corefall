// Procedural audio using Web Audio API
let audioCtx = null;

function getCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

export function resumeAudio() {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
}

function playTone(freq, duration, type = 'square', volume = 0.15, detune = 0) {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
}

function playNoise(duration, volume = 0.1) {
    const ctx = getCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
}

export function playShoot(weaponType) {
    switch (weaponType) {
        case 'blaster':
            playTone(220, 0.12, 'sawtooth', 0.12);
            playTone(440, 0.08, 'square', 0.06);
            playNoise(0.06, 0.08);
            break;
        case 'scatter':
            playNoise(0.15, 0.18);
            playTone(120, 0.1, 'sawtooth', 0.1);
            playTone(80, 0.15, 'square', 0.08);
            break;
        case 'pulse':
            playTone(600, 0.08, 'sine', 0.1);
            playTone(300, 0.15, 'sawtooth', 0.08);
            playNoise(0.04, 0.06);
            break;
    }
}

export function playEnemyHit() {
    playTone(800, 0.06, 'square', 0.1);
    playTone(400, 0.08, 'sawtooth', 0.06);
}

export function playEnemyDeath() {
    playTone(300, 0.15, 'sawtooth', 0.12);
    playTone(100, 0.3, 'square', 0.08);
    playNoise(0.2, 0.1);
}

export function playPlayerHit() {
    playTone(150, 0.2, 'sawtooth', 0.15);
    playTone(80, 0.3, 'square', 0.1);
}

export function playPickup(type) {
    if (type === 'health') {
        playTone(523, 0.08, 'sine', 0.1);
        setTimeout(() => playTone(659, 0.08, 'sine', 0.1), 80);
        setTimeout(() => playTone(784, 0.12, 'sine', 0.1), 160);
    } else if (type === 'ammo') {
        playTone(440, 0.06, 'square', 0.08);
        setTimeout(() => playTone(660, 0.1, 'square', 0.08), 60);
    } else if (type === 'score') {
        playTone(880, 0.06, 'sine', 0.08);
        setTimeout(() => playTone(1100, 0.1, 'sine', 0.08), 50);
    } else if (type === 'weapon') {
        playTone(330, 0.08, 'sine', 0.1);
        setTimeout(() => playTone(440, 0.08, 'sine', 0.1), 80);
        setTimeout(() => playTone(660, 0.1, 'sine', 0.1), 160);
        setTimeout(() => playTone(880, 0.15, 'sine', 0.1), 240);
    }
}

export function playLevelComplete() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => {
        setTimeout(() => playTone(n, 0.2, 'sine', 0.12), i * 150);
    });
}

export function playGameOver() {
    const notes = [440, 370, 311, 220];
    notes.forEach((n, i) => {
        setTimeout(() => playTone(n, 0.3, 'sawtooth', 0.1), i * 200);
    });
}

export function playMenuSelect() {
    playTone(660, 0.06, 'square', 0.06);
}

export function playBossWarning() {
    playTone(80, 0.5, 'sawtooth', 0.15);
    setTimeout(() => playTone(80, 0.5, 'sawtooth', 0.15), 600);
    setTimeout(() => playTone(80, 0.5, 'sawtooth', 0.15), 1200);
}

// Ambient music - simple looping bass and rhythm
let musicInterval = null;
let musicPlaying = false;

export function startMusic(intensity = 1) {
    if (musicPlaying) return;
    musicPlaying = true;
    let beat = 0;
    const bpm = 140;
    const interval = (60 / bpm) * 1000 / 2;
    musicInterval = setInterval(() => {
        const ctx = getCtx();
        if (ctx.state === 'suspended') return;
        beat = (beat + 1) % 16;
        // Bass drum
        if (beat % 4 === 0) {
            playTone(55, 0.15, 'sine', 0.06 * intensity);
            playNoise(0.03, 0.04 * intensity);
        }
        // Hi-hat
        if (beat % 2 === 0) {
            playNoise(0.02, 0.02 * intensity);
        }
        // Bass line
        const bassNotes = [55, 55, 65, 55, 73, 55, 65, 82, 55, 55, 65, 55, 73, 82, 65, 55];
        playTone(bassNotes[beat], 0.1, 'sawtooth', 0.03 * intensity);
    }, interval);
}

export function stopMusic() {
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
    musicPlaying = false;
}
