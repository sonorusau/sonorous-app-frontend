<script>
 import { push } from 'svelte-spa-router';
 import { onMount } from 'svelte';
 import { globalState } from '../stores';
 import img from '../lib/assets/chest.png';

 const updateRecordingPosition = (name, e) => {
     globalState.update(state => {
         state.locationOfRecording = name.toUpperCase();
         return state;
     });
 }

 $: locationOfRecording = $globalState.locationOfRecording;

 $: {
     if (locationOfRecording) {
         console.log(locationOfRecording);
     }
 }

 const continueToNextPart = () => {
     if (locationOfRecording) push('/position_device');
 }

 onMount(() => {
     globalState.update(state => {
         state.currentStage = 2;
         return state;
     });
 });

</script>

<section class="choose-recordig-position-section flex flex-col justify-center items-center">
    <header><h3>Choose Position to Record</h3></header>
    <div class="chest">
        <svg  class="marker" xmlns="http://www.w3.org/2000/svg">
            <g on:click={(e) => {updateRecordingPosition("aortic") }}
                class="aortic {locationOfRecording === "AORTIC" ? 'selected' : ''}">
                <path
                    stroke="#333"
                    stroke-width="5"
                    fill="transparent"
                    d="M 200 280 L 100 100"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <text x="58" y="95" font-family="Arial" font-size="16">Aortic valve</text>
            </g>
            <g on:click={() => updateRecordingPosition("pulmonic")}
                class="pulmonic"
                class:selected={locationOfRecording === "PULMONIC"}>
                <path
                    stroke="#333"
                    stroke-width="5"
                    fill="transparent"
                    d="M 250 280 L 350 100"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <text x="300" y="95" font-family="Arial" font-size="16">Pulmonic valve</text>
            </g>
            <g on:click={() => updateRecordingPosition("tricuspid")}
                on:click={() => updateRecordingPosition("tricuspid")}
                class:selected={locationOfRecording === "TRICUSPID"}>
                class="tricuspid">
                <path
                    stroke="#333"
                    stroke-width="5"
                    fill="transparent"
                    d="M 220 330 L 180 475"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <text x="150" y="495" font-family="Arial" font-size="16">Tricuspid valve</text>
            </g>
            <g
                on:click={() => updateRecordingPosition("mitral")}
                class:selected={locationOfRecording === "MITRAL"}>
                class="mitral">
                <path
                    stroke="#333"
                    stroke-width="5"
                    fill="transparent"
                    d="M 250 335 L 320 475"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <text x="300" y="495" font-family="Arial" font-size="16">Mitral valve</text>
            </g>


        </svg>
        <img src={img} />
    </div>
    <div 
        role="button"
        class="button self-end"
        on:click={() => continueToNextPart()}
        on:keydown={(e) => (e.key === 'Enter' || e.key === 'Space') && cancel()}
        tabindex="0"
        >
        Continue
    </div>
</section>

<style>
 @keyframes swingAnimation {
     0%, 100% {
         transform: rotate(-10deg);
     }
     50% {
         transform: rotate(10deg);
     }
 }

 .chest {
     width: 450px;
     height: 450px;
     box-sizing: border-box;
     padding: 30px;
 }

 .chest img {
     width: 100%;
     height: 100%;
 }

 .marker {
     position: absolute;
     top: 0; left: 0;
     width: 100%;
     height: 100%
 }

 g {
     cursor: pointer;
     padding: 20px;
 }

 g:hover *, .selected *  {
     stroke: #755;
 }
 
 
 .choose-recordig-position-section{
     position: absolute;
     padding: 10px;
     box-sizing: border-box;
     animation: fade-in .2s ease-in-out;
     top: 50%;
     left: 50%;
     transform: translateX(-50%) translateY(-50%);
     background: rgba(240, 240, 240, .3);
     border-radius: 12px;
     -webkit-backdrop-filter: blur(5px);
     backdrop-filter: blur(5px);
 }

</style>
