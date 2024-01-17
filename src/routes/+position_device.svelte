<script lang="ts">
 import {push} from 'svelte-spa-router';
 import { onMount } from 'svelte';
 import { globalState } from '../stores';

 onMount(() => {
     if($globalState.currentStage < 2) {
         push("/");
     }
 });

</script>

<section class="position-device-section flex flex-col justify-center items-center">
    <h3>Position the Device on the Heart of the Patient</h3>
    <div class="stethoscope flex justify-center items-center">
        <svg id="mySvg" xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewbox="0 0 220 200" preserveaspectratio="xmidymid meet" style="width: 100%; height: 100%">
            <g style="user-select: none; display: block;" transform="matrix(1,0,0,1,100,99.94468176177097)" opacity="1"> 
                <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" class="bm_stroke bm_color_4" style="display: block;" stroke="rgb(96,50,86)" stroke-opacity="1" stroke-width="3" d=" M19,5.262 C19,21.838 19,40.6 19,40.6 C12.75843265826662,47.254384982298646 12.148313468346677,36.030357569759836 2.348313468346676,36.030357569759836 C2.348313468346676,36.030357569759836 2.348313468346676,36.030357569759836 2.348313468346676,36.030357569759836 C-7.551686531653325,36.030357569759836 -10.75816281320209,47.25425005976638 -16.8,40.6 C-16.8,40.6 -16.8,24.968 -16.8,23.423"></path> 
            </g> 
            <g class="swing">
            <g style="user-select: none; display: block;" transform="matrix(1,0,0,1,100,99.94468176177097)" opacity="1"> 
                <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" class="bm_stroke bm_color_4" style="display: block;" stroke="rgb(96,50,86)" stroke-opacity="1" stroke-width="3" d=" M19,10.5 C19,10.5 19,-21.309523240320217 19,-21.309523240320217 C19,-25.460939926909013 23.3,-34.55446364536025 28.5,-34.55446364536025 C28.5,-34.55446364536025 28.5,-34.55446364536025 28.5,-34.55446364536025 C33.7,-34.55446364536025 38,-26.709253395255686 38,-21.31 C38,-21.31 38,8.163 38,10.37"></path> 
            </g> 
            <g style="user-select: none; display: block;" transform="matrix(1,0,0,1,100,99.94468176177097)" opacity="1"> 
                <path class="bm_fill bm_color_3" style="display: block;" fill="rgb(191,104,168)" fill-opacity="1" d=" M37.80025141979995,5.155717575018183 C42.36828123410703,5.155717575018183 46.07133814280553,8.858774483716681 46.07133814280553,13.426804298023761 C46.07133814280553,17.994834112330842 42.36828123410703,21.697891021029335 37.80025141979995,21.697891021029335 C33.23222160549287,21.697891021029335 29.529164696794375,17.994834112330842 29.529164696794375,13.426804298023761 C29.529164696794375,8.858774483716681 33.23222160549287,5.155717575018183 37.80025141979995,5.155717575018183z"></path> 
                <path stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0" stroke-miterlimit="4" class="bm_stroke bm_color_4" style="display: block;" stroke="rgb(96,50,86)" stroke-opacity="1" stroke-width="2" d=" M37.80025141979995,5.155717575018183 C42.36828123410703,5.155717575018183 46.07133814280553,8.858774483716681 46.07133814280553,13.426804298023761 C46.07133814280553,17.994834112330842 42.36828123410703,21.697891021029335 37.80025141979995,21.697891021029335 C33.23222160549287,21.697891021029335 29.529164696794375,17.994834112330842 29.529164696794375,13.426804298023761 C29.529164696794375,8.858774483716681 33.23222160549287,5.155717575018183 37.80025141979995,5.155717575018183z"></path> 
            </g> 
            </g>
        </svg>
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

 .swing {
     transform-origin: center center; /* Adjust this based on the pivot point */
     animation: swingAnimation 2s ease-in-out infinite;
}

 .position-device-section{
     padding: 100px;
     box-sizing: border-box;
     position: absolute;
     animation: fade-in .2s ease-in-out;
     top: 50%;
     left: 50%;
     transform: translateX(-50%) translateY(-50%);
     background: rgba(240, 240, 240, .3);
     border-radius: 12px;
     -webkit-backdrop-filter: blur(20px);
     backdrop-filter: blur(20px);
 }

 .stethoscope {
     /* width: 70%;
        height: 80%; */
 }
</style>
