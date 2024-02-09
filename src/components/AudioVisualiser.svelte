<script>
  import { onMount } from 'svelte';
  import WaveSurfer from 'wavesurfer.js';
  import { globalState } from '../stores';

  let wavesurfer;
  let duration = '0:00';
  let currentTime = '0:00';
  let hoverWidth = '0px';
  let buttonText = 'Play';
  $: recordingLoc = $globalState.locationOfRecording;

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
      wavesurfer.getCurrentTime();
      console.log(wavesurfer.getPeaks());
    });
  });

  const playPause = () => {
    time = wavesurfer.getCurrentTime();
    wavesurfer.setTime(time);
    wavesurfer.playPause();
    buttonText = wavesurfer.isPlaying() ? 'Pause' : 'Play';
  };

  const handleMouseMove = (event) => {
    hoverWidth = `${event.offsetX}px`;
  };
</script>

<style>
  #waveform {
    cursor: pointer;
    position: relative;
    min-width: 100%;
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

  .play-pause-button {
    display: flex;
    background: rgba(250, 240, 255, .7);
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
    border-radius: 8px;
    padding: 20px;
    height: 35px;
    justify-content: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    align-items: center;
    cursor: pointer
}

  .waveform-section {
    justify-content: space-around;
    height: 40vh;

  }

  .waveform--container {
    overflow: auto;
    min-width: 100%;
  }

</style>


<section class="position-relative w-full waveform-section flex flex-col items-center">
  <div class="waveform--container w-full">
  <div id="waveform" on:mousemove={handleMouseMove}>
    <div id="time">{currentTime}</div>
    <div id="duration">{duration}</div>
    <div id="hover" style="--hover-width: {hoverWidth};"></div>
  </div>
  </div>
  <button class="play-pause-button" on:click={() => playPause()}>{buttonText}</button>
  <div class="flex flex-col items-center">
    <h4>Recording details - Feb 9, 2024</h4>
    <p>Recording Location: {recordingLoc} | Murmur Detected: No</p>
</section>