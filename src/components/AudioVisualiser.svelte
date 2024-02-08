<script>
  import { onMount } from 'svelte';
  import WaveSurfer from 'wavesurfer.js';

  let wavesurfer;
  let duration = '0:00';
  let currentTime = '0:00';
  let hoverWidth = '0px';

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  onMount(() => {
    // Define the progress gradient
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
    progressGradient.addColorStop(0, 'rgb(200, 0, 200)')
    progressGradient.addColorStop(0.7, 'rgb(100, 0, 100)')
    progressGradient.addColorStop(1, 'rgb(0, 0, 0)')
    
    const waveformContainer = document.querySelector('#waveform');

    wavesurfer = WaveSurfer.create({
      container: waveformContainer,
      waveColor: 'rgba(45, 42, 73, 0.7)',
      progressColor: progressGradient,
      barWidth: 2,
      height: 128,
      url: '/audio.wav',
    });

    // Set the audio clip length text
    wavesurfer.on('decode', (maxTime) => {
      duration = formatTime(maxTime);
    });

    // Update current timestamp text
    wavesurfer.on('timeupdate', (elapsedTime) => {
      currentTime = formatTime(elapsedTime);
    });

    // Play/pause on interaction
    wavesurfer.on('interaction', () => {
      wavesurfer.playPause()
    });
  });


  const handleMouseMove = (event) => {
    hoverWidth = `${event.offsetX}px`;
  };
</script>

<style>
  #waveform {
    cursor: pointer;
    position: absolute;
    width: 80%;
  }
  #hover {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    pointer-events: none;
    height: 100%;
    width: var(--hover-width);
    mix-blend-mode: overlay;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  #waveform:hover #hover {
    opacity: 1;
  }
  #time,
  #duration {
    position: absolute;
    z-index: 11;
    top: 50%;
    transform: translateY(-50%);
    font-size: 11px;
    background: rgba(0, 0, 0, 0.75);
    padding: 2px;
    color: #ddd;
  }
  #time {
    left: 0;
  }
  #duration {
    right: 0;
  }
</style>

<div id="waveform" on:mousemove={handleMouseMove}>
  <div id="time">{currentTime}</div>
  <div id="duration">{duration}</div>
  <div id="hover" style="--hover-width: {hoverWidth};"></div>
</div>
