<script lang="ts">
 import { push } from 'svelte-spa-router';
 import { onMount } from 'svelte';
 import { globalState } from '../stores';

 onMount(() => {
     if($globalState.currentStage < 2) {
         push("/");
     }

     if ($globalState.deviceInfo !== null) {
         push("/position_device");
     }

     setTimeout(() => {
         setDevice("Sonorus Model 1");
         push("/position_device");
     }, 6000)

     function setDevice(deviceName) {
         globalState.update(state => {
             state.deviceInfo = deviceName;
             return state;
         });
     }
 });

</script>

<section class="connect-device-section flex flex-col justify-center items-center">
    <h3>Searching for Device</h3>
    <div id="reading-key">
        <div id="key"><span></span><span></span></div>
        <div id="reading-animation"><span></span></div>
    </div>
</section>

<style>
 .connect-device-section{
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

 #reading-key{
     position: relative;
     width: 54px;
 }


 #key{
     width: 54px;
     height: 145px;
     background: #fefefe;
     position: relative;
     box-shadow:inset 0 0 0 2px #d9d9de, inset 0 0 0 5px #f4f4f5, inset 0 -50px 0 0 #f4f4f5;;
     -webkit-border-radius: 1px;
     -webkit-border-bottom-right-radius: 10px;
     -webkit-border-bottom-left-radius: 10px;
     -moz-border-radius: 1px;
     -moz-border-radius-bottomright: 10px;
     -moz-border-radius-bottomleft: 10px;
     border-radius: 1px;
     border-bottom-right-radius: 10px;
     border-bottom-left-radius: 10px;
 }

 #key::after,
 #key::before,
 #key span::after{
     content: "";
     display: block;
     position: absolute;
 }


 #key::after{
     width: 20px;
     height: 20px;
     background: #fff;
     bottom: 15px;
     left: 50%;
     transform: translateX(-50%);
     border-radius: 100%;
     box-shadow:inset 0 0 0 2px #ddd;
 }

 #key span{
     position: absolute;
     left: 50%;
     top: 10px;
     transform: translateX(-50%);
 }

 #key span, 
 #key span::before{
     width: 6px;
     height: 22px; 
     background: #e5c499;
     display: block;
     border-radius: 6px;
 }

 #key span:nth-of-type(1){
     margin-left: -5px;
 }

 #key span:nth-of-type(2){
     margin-left: 5px;
 }

 #key span::before{
     content: "";
     position: absolute;
     top: 0;
     margin-left: -10px;
 }

 #key span:nth-of-type(2)::before{
     margin-left: 10px;
 }



 #key span::before{
     content: "";
 }



 #reading-animation{
     width: 140%;
     height: 4px;
     border-radius: 4px;
     background: #009DE0;
     position: absolute;
     top: 0;
     left: 50%;
     transform: translateX(-50%) translateY(-50%);
     animation: reading-animation 2s infinite;
     opacity: .5;
 }


 @keyframes reading-animation {
     0% {
         top: 0%;
         opacity: .5;
     }
     
     25%, 75%{
         opacity: 1;
     }
     
     50% {
         top: 100%;
         opacity: .5;
     }
 }

 #reading-animation span{
     display: block;
     width: 100%;
     height: 15px;
     background: -moz-linear-gradient(top,  rgba(0,157,224,0) 0%, rgba(0,157,224,1) 100%);
     background: -webkit-linear-gradient(top,  rgba(0,157,224,0) 0%,rgba(0,157,224,1) 100%);
     background: linear-gradient(to bottom,  rgba(0,157,224,0) 0%,rgba(0,157,224,1) 100%);
     /* filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00009de0', endColorstr='#009de0',GradientType=0 ); */
     margin-top: 3px;
     opacity: .2;
     opacity: 0;
     animation: reading-animation__span 2s infinite;
     transform: rotate(180deg);
     -webkit-filter: blur(1px);
 }

 @keyframes reading-animation__span {
     0% {
         opacity: 0;
         transform: rotate(0deg);
         margin-top: -30px;
         height: 30px;
     }
     
     
     25% {
         opacity: .5;
         height: 15px;
         margin-top: -15px;
     }
     
     50%{
         opacity: 0;
         transform: rotate(0deg);
         margin-top: -5px;
         height: 5px;
         
     }
     
     51%{
         transform: rotate(180deg);
         margin-top: 3px;
         height: 30px;
     }
     
     75%{
         opacity: .5;
         height: 15px;
     }
     
     100%{
         opacity: 0;
         height: 5px;
     }
 }
</style>
