// Retro 8-bit Synthesizer using Web Audio API

class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicInterval: number | null = null;
  private isMusicPlaying: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isMusicPlaying) {
      this.stopMusic();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // 1. Kick ball sound (Thump / Pop)
  public playKick(isSuper: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isSuper ? 'sawtooth' : 'triangle';
    const startFreq = isSuper ? 380 : 180;
    const endFreq = isSuper ? 60 : 40;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + (isSuper ? 0.25 : 0.12));

    gain.gain.setValueAtTime(isSuper ? 0.4 : 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isSuper ? 0.25 : 0.12));

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + (isSuper ? 0.25 : 0.12));

    if (isSuper) {
      // Add laser chirp
      const laser = this.ctx.createOscillator();
      const laserGain = this.ctx.createGain();
      laser.type = 'square';
      laser.frequency.setValueAtTime(800, now);
      laser.frequency.exponentialRampToValueAtTime(200, now + 0.2);
      laserGain.gain.setValueAtTime(0.2, now);
      laserGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      laser.connect(laserGain);
      laserGain.connect(this.ctx.destination);
      laser.start(now);
      laser.stop(now + 0.2);
    }
  }

  // 2. Defender / Post Bounce sound
  public playBounce() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  private lastWhistleTime: number = 0;

  // 3. Referee Whistle (Start, Goal, End) - Strictly Single Shot & Non-Looping
  public playWhistle(long: boolean = false) {
    if (this.isMuted) return;
    const nowMs = Date.now();
    // Guard against multiple invocations in rapid succession / loop triggers
    if (nowMs - this.lastWhistleTime < (long ? 1400 : 700)) {
      return;
    }
    this.lastWhistleTime = nowMs;

    this.initContext();
    if (!this.ctx) return;

    const baseNow = this.ctx.currentTime;
    const playChirp = (delay: number, duration: number, freq1: number, freq2: number) => {
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const startTime = baseNow + delay;
        const endTime = startTime + duration;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq1, startTime);
        osc.frequency.linearRampToValueAtTime(freq2, startTime + duration * 0.5);
        osc.frequency.linearRampToValueAtTime(freq1, endTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
        gain.gain.setValueAtTime(0.18, Math.max(startTime + 0.02, endTime - 0.03));
        gain.gain.linearRampToValueAtTime(0.0001, endTime);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.onended = () => {
          try {
            osc.disconnect();
            gain.disconnect();
          } catch (e) {}
        };

        osc.start(startTime);
        osc.stop(endTime);
      } catch (e) {
        // Safe catch for AudioContext clock boundaries
      }
    };

    if (long) {
      // 3 final whistle chirps (short, short, long) - plays once and ends completely
      playChirp(0, 0.14, 2400, 2600);
      playChirp(0.22, 0.14, 2400, 2600);
      playChirp(0.44, 0.42, 2500, 2750);
    } else {
      playChirp(0, 0.12, 2300, 2500);
      playChirp(0.18, 0.20, 2400, 2650);
    }
  }

  // 4. Goal Fanfare & Crowd Roar
  public playGoal() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Chiptune fanfare notes: C5, E5, G5, C6, G5, C6
    const notes = [
      { f: 523.25, d: 0.1, t: 0 },
      { f: 659.25, d: 0.1, t: 0.1 },
      { f: 783.99, d: 0.1, t: 0.2 },
      { f: 1046.5, d: 0.25, t: 0.3 },
      { f: 783.99, d: 0.12, t: 0.55 },
      { f: 1046.5, d: 0.45, t: 0.68 },
    ];

    notes.forEach((n) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(n.f, now + n.t);

      gain.gain.setValueAtTime(0.25, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.01, now + n.t + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + n.t);
      osc.stop(now + n.t + n.d);
    });

    // Crowd Noise buffer
    this.playCrowdCheer(1.5);
  }

  // 5. Crowd cheer burst
  public playCrowdCheer(duration: number = 1.2) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to make it sound like distant crowd cheer
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 850;
    filter.Q.value = 1.2;

    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // 6. Goalkeeper Spectacular Save / Catch ("Atajadón")
  public playSave() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Heavy leather gloves slap / impact
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.18);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);

    // 2. Glove friction / deflection squeak & air burst
    const sweep = this.ctx.createOscillator();
    const sweepGain = this.ctx.createGain();

    sweep.type = 'square';
    sweep.frequency.setValueAtTime(650, now);
    sweep.frequency.exponentialRampToValueAtTime(220, now + 0.12);

    sweepGain.gain.setValueAtTime(0.2, now);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    sweep.connect(sweepGain);
    sweepGain.connect(this.ctx.destination);

    sweep.start(now);
    sweep.stop(now + 0.12);
  }

  // 6b. Defender Hit & Rebound sound (1st or 2nd bounce)
  public playDefenderHit(bounceNumber: number = 1) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Pitch rises on successive bounces (e.g. bounce 1 -> 240Hz, bounce 2 -> 360Hz)
    const baseFreq = bounceNumber === 2 ? 360 : 250;
    osc.type = 'square';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.09);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // 6c. Defender Final Block / Interception (3rd bounce or Super Shot exhausted)
  public playDefenderBlock() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // 7. Buzzer / Miss
  public playBuzzer() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.setValueAtTime(95, now + 0.15);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // 8. Trophy / Level Up Victory jingle
  public playTrophyUnlock() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
    arpeggio.forEach((f, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.08);
      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.25);
    });
  }

  public playLevelUp() {
    this.playTrophyUnlock();
  }

  // 9. UI Click sound
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // 10. Background 8-bit Music loop (Arcade theme)
  public startMusic() {
    if (this.isMuted || this.isMusicPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    this.isMusicPlaying = true;
    const bassline = [
      130.81, 130.81, 164.81, 196.00,
      130.81, 130.81, 220.00, 196.00,
      110.00, 110.00, 146.83, 164.81,
      146.83, 164.81, 196.00, 220.00
    ];

    let step = 0;
    const stepDuration = 180; // ms

    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || this.isMuted || !this.isMusicPlaying) return;
      const now = this.ctx.currentTime;
      const freq = bassline[step % bassline.length];

      // Bass note
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);

      // Hi-hat tick on even beats
      if (step % 2 === 0) {
        const noise = this.ctx.createOscillator();
        const nGain = this.ctx.createGain();
        noise.type = 'square';
        noise.frequency.setValueAtTime(1800, now);
        nGain.gain.setValueAtTime(0.02, now);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        noise.connect(nGain);
        nGain.connect(this.ctx.destination);
        noise.start(now);
        noise.stop(now + 0.03);
      }

      step++;
    }, stepDuration);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const retroAudio = new RetroAudioEngine();
