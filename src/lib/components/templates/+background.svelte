<script lang="ts">
 export let stage: Number;
 import { globalState } from '../../../stores';

 $: currentStage = $globalState.currentStage;

 let filledBlobRef: SVGPathElement | null = null;
 let strokeOnlyBlobRef: SVGPathElement | null= null;
 let firstPlusRef: SVGPathElement | null= null;
 let secondPlusRef: SVGPathElement | null= null;
 let thirdPlusRef: SVGPathElement | null= null;
 let filledCircleRef: SVGPathElement | null = null;
 let strokeOnlyCircleRef: SVGPathElement | null = null;
 let bottomRightSideRef: SVGPathElement | null = null;

 $: allBackgroundElements = [
     filledBlobRef,
     strokeOnlyBlobRef,
     firstPlusRef,
     secondPlusRef,
     thirdPlusRef,
     filledCircleRef,
     bottomRightSideRef,
     strokeOnlyCircleRef
 ];

 function removeClassesStartingWith(element: any, prefix: string) {
     if (!element || !prefix) return;
     const classesToRemove = Array.from(element.classList).filter(( className: string ) => className.startsWith(prefix));
     classesToRemove.forEach(className => element.classList.remove(className));
 }

 function slightDelay(callBack: Function, delay: number = 0) {
     setTimeout(() => {
         callBack();
     }, delay);
 }

 function setPrevTransform(element: any) {
     const currentTransform = getComputedStyle(element).transform;
     element.style.setProperty('--prev', currentTransform);
 }

 function performTransition(currentStage: number) {
     if (allBackgroundElements.some(x => x === null)) {
         console.error('Some background elements are not initialized');
         return;
     };

     allBackgroundElements.forEach((element: any) => {
         setPrevTransform(element);
     });

     slightDelay(() => {
         allBackgroundElements.forEach((element: any) => {
             removeClassesStartingWith(element, 'transition-');
             console.log(`transition-${currentStage}`);
             element.classList.add(`transition-${currentStage}`);
         });
     });
 }

 $: if (currentStage > 0) {
     performTransition(currentStage);
 } else if (currentStage === 0) {
     performTransition(0);
 }
</script>

<div class="background">
    <div style="display: none" class="transition-0 transition-1 transition-2 transition-3 transition-4 transition-5"></div>
    <svg width="100%" height="100%"  viewBox="0 0 297 210" preserveAspectRatio="none" version="1.1" id="svg1"  xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
        <defs id="defs2">
            <linearGradient
                xlink:href="#linearGradient30"
                id="linearGradient31"
                x1="-102.66643"
                y1="787.47852"
                x2="207.80771"
                y2="787.47852"
                gradientUnits="userSpaceOnUse"
                gradientTransform="matrix(0.26458333,0,0,0.26458333,0.5632036,-0.07794922)" />
            <linearGradient id="linearGradient30" >
                <stop style="stop-color:#8267e0;stop-opacity:1;" offset="0" id="stop30" />
                <stop style="stop-color:#b5a9fe;stop-opacity:1;" offset="1" id="stop31" />
            </linearGradient>
            <linearGradient id="linearGradient13">
                <stop style="stop-color:#9485ff;stop-opacity:1;" offset="0" id="stop13" />
                <stop style="stop-color:#b2a9f5;stop-opacity:1;" offset="1" id="stop14" />
            </linearGradient>
            <linearGradient
                xlink:href="#linearGradient13"
                id="linearGradient19"
                gradientUnits="userSpaceOnUse"
                x1="855.26562"
                y1="677.60059" x2="1047.3887"
                y2="677.60059"
                gradientTransform="rotate(6.7093027,956.50664,681.99924)" />
            <linearGradient
                xlink:href="#linearGradient27"
                id="linearGradient28"
                x1="119.74899"
                y1="545.92474"
                x2="157.47382"
                y2="402.11951"
                gradientUnits="userSpaceOnUse"
                spreadMethod="pad"
                gradientTransform="matrix(0.26458333,0,0,0.26458333,-19.177943,48.34167)" />
            <linearGradient id="linearGradient27" >
                <stop style="stop-color:#916fff;stop-opacity:1;" offset="0" id="stop27" />
                <stop style="stop-color:#ffffff;stop-opacity:0.74857146;" offset="1" id="stop28" />
            </linearGradient>
        </defs>
        <path id="bottom-left-side"
              style="fill:url(#linearGradient28);fill-opacity:1;stroke:#c185ff;stroke-width:0;stroke-dasharray:none;stroke-opacity:1"
              d="m 18.114351,162.17348 c -3.945781,2.75967 -6.301155,7.2674 -6.313307,12.08247 6.1e-5,8.16815 6.621639,14.78973 14.789792,14.78979 5.23203,-0.0123 11.36172,-2.76487 11.485034,-7.2993 0.02069,-0.76106 -0.704117,-0.8142 -1.85823,-1.32808 -4.563573,-2.03196 -11.292202,-4.89678 -14.923122,-8.96069 -2.563415,-2.86911 -3.576018,-6.33324 -3.180167,-9.28419 z" />
        <path id="path28"
              style="fill:url(#linearGradient31);fill-opacity:1;stroke:#c185ff;stroke-width:0;stroke-dasharray:none;stroke-opacity:1"
              d="m 0,176.92882 v 33.41295 H 55.500418 c 0.0091,-0.3106 0.02946,-0.61796 0.02946,-0.93121 -0.003,-3.03062 -0.08148,-4.80456 -2.618968,-6.4616 -4.540191,-2.96485 -9.733076,-2.32714 -15.959227,-3.43909 -9.460404,-1.35036 -33.2472524,-9.76408 -36.6070664,-22.58105 z" />
        <g transform="matrix(0.23365472,-0.12413625,0.12413625,0.23365472,-28.678774,151.84129)" style="fill:url(#linearGradient14);stroke:#9485ff;stroke-opacity:1">
            <path id="bottom-right-side"
                  bind:this={bottomRightSideRef}
                  style="fill:url(#linearGradient19);fill-opacity:1;stroke:#9485ff;stroke-opacity:1"
                  d="m 965.18084,550.6648 c -35.97677,-4.23161 -67.3218,14.22842 -71.52446,50.20858 -1.01551,8.69243 3.85681,24.90692 0.96817,33.168 -2.71065,7.75209 -11.94012,16.26521 -17.36614,22.10664 -12.98083,13.97465 -22.56254,24.95237 -24.82844,44.02202 -5.96395,50.70623 31.91321,96.83601 84.60212,103.03517 52.68977,6.19839 100.23921,-29.88232 106.20521,-80.58905 2.544,-21.71105 -2.8133,-35.99107 -15.0944,-54.01812 -3.6131,-5.30342 -12.2066,-15.73376 -12.7385,-22.29926 -0.6502,-8.02591 7.5842,-22.10335 8.5353,-30.09918 4.279,-35.97195 -22.7813,-61.30299 -58.75886,-65.5348 z" />
        </g>
        <ellipse id="circle-2--filled"
                 bind:this={filledCircleRef}
                 style="fill:url(#linearGradient16);fill-opacity:1;stroke:#9485ff;stroke-width:0.172485;stroke-opacity:1"
                 cx="247.08556"
                 cy="189.92982"
                 rx="6.9922214"
                 ry="6.9049282" />
    </svg>

    <svg width="100%" height="100%"  viewBox="0 0 297 210" version="1.1" id="svg1"  xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
        <defs id="defs1">
            <linearGradient xlink:href="#linearGradient6" id="linearGradient7" x1="340.89108" y1="178.72122" x2="671.16937" y2="269.72488" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0.26458333,0,0,0.26458333,13.97962,49.263405)" />
            <linearGradient id="linearGradient6">
                <stop style="stop-color:#c7c1ed;stop-opacity:1;" offset="0" id="stop6" />
                <stop style="stop-color:#9988fe;stop-opacity:1;" offset="1" id="stop7" />
            </linearGradient>
            <linearGradient id="linearGradient15">
                <stop style="stop-color:#9485ff;stop-opacity:1;" offset="0" id="stop15" />
                <stop style="stop-color:#9786fe;stop-opacity:1;" offset="1" id="stop16" />
            </linearGradient>
            <linearGradient
                xlink:href="#linearGradient15"
                id="linearGradient16"
                x1="907.09039"
                y1="723.14618"
                x2="959.94495"
                y2="723.14618"
                gradientUnits="userSpaceOnUse"
                gradientTransform="matrix(0.26458333,0,0,0.26458333,0.09233938,-1.40261)" />
        </defs>
        <g id="layer1">
            <path id="blob--filled"
                  bind:this={filledBlobRef}
                  style="fill:url(#linearGradient7);fill-opacity:1;stroke:none;stroke-width:0;stroke-dasharray:none;stroke-opacity:1"
                  d="m 139.68188,65.398999 c -18.17427,-1.262775 -33.93107,12.44678 -35.1937,30.621062 -1.26279,18.174509 12.44581,33.950469 30.62166,35.193749 5.18632,0.35477 10.3075,-4.27562 15.15699,-2.61226 3.40641,1.16838 5.92492,5.54266 8.24297,7.47015 2.97917,2.47722 6.03838,3.9995 10.033,4.27829 12.44698,0.86494 23.23831,-8.52443 24.10267,-20.97145 0.34871,-5.04263 -0.3114,-10.46686 -3.65225,-13.95655 -2.80636,-2.9314 -6.78036,-5.988122 -7.33789,-8.264475 -0.81415,-3.32423 2.69496,-5.847167 3.27891,-11.017438 1.12208,-16.159982 -10.84465,-16.096466 -17.4349,-14.867299 -1.96242,0.366024 -6.30633,2.648534 -8.21861,2.364914 -1.91227,-0.283625 -4.27127,-2.348092 -7.38779,-4.147611 -3.11653,-1.799518 -7.18277,-3.739382 -12.21106,-4.091082 z" />
            <path
                id="blog--stroke-only"
                bind:this={strokeOnlyBlobRef}
                style="fill:none;stroke:#ffffff;stroke-width:0.380349;stroke-dasharray:none"
                d="m 140.1369,70.006569 c -15.14619,2.7e-4 -27.42437,12.63588 -27.4241,28.22236 0.0147,14.203761 11.25599,19.727271 19.19473,22.546961 7.93874,2.81969 1.95743,10.83272 1.94541,13.90523 -3e-5,4.01039 0.99933,8.21207 3.76898,10.59424 1.29035,1.10983 3.00229,2.23838 4.77233,2.72177 1.72775,0.47184 3.69125,0.84887 5.01128,0.63095 4.9157,-0.81151 8.92594,-5.34062 13.90626,-5.47907 6.89646,-0.19171 11.58213,6.49678 19.64837,6.50558 15.14619,6e-5 27.42465,-12.63523 27.42474,-28.22172 2.6e-4,-15.58674 -16.81148,-23.213331 -24.17352,-23.886171 -6.85906,-0.62687 -10.93805,0.26113 -17.63811,-3.5104 -5.57366,-3.13745 -5.24167,-9.06051 -7.69986,-14.25447 -2.08429,-4.40392 -7.82477,-9.77465 -18.73651,-9.77526 z" />
            <!-- plus-1 start -->
            <g transform="matrix(-0.05007073,0,0,-0.04968615,135.08122,81.063069)">
                <path
                    bind:this={firstPlusRef} 
                    id="plus-1"
                    style="fill:#ffffff;fill-opacity:1;stroke:#9485ff;stroke-opacity:1"
                    d="m 406.30665,31.572266 v 88.513674 h -88.51367 v 15.78711 h 88.51367 v 88.51367 h 15.78711 v -88.51367 h 88.51367 V 120.08594 H 422.09376 V 31.572266 Z" />
            </g>
        </g>
        <!-- plus-1 end -->
        <!-- plus-2 start -->
        <g id="g12-8-3-0" style="fill:#ffffff;fill-opacity:1;stroke:#9485ff;stroke-opacity:1" transform="matrix(-0.05007073,0,0,-0.04968615,141.04413,145.80393)">
            <path
                bind:this={secondPlusRef} 
                id="plus-2"
                style="fill:#ffffff;fill-opacity:1;stroke:#9485ff;stroke-opacity:1"
                d="m 406.30665,31.572266 v 88.513674 h -88.51367 v 15.78711 h 88.51367 v 88.51367 h 15.78711 v -88.51367 h 88.51367 V 120.08594 H 422.09376 V 31.572266 Z" />
        </g>
        <!-- plus-2 end -->
        <!-- plus-3 start -->
        <g id="g12-8-3-0-5" style="fill:#ffffff;fill-opacity:1;stroke:#9485ff;stroke-opacity:1" transform="matrix(-0.05007073,0,0,-0.04968615,207.26974,141.08596)">
            <path
                id="plus-3"
                bind:this={thirdPlusRef}
                style="fill:#ffffff;fill-opacity:1;stroke:#9485ff;stroke-opacity:1"
                d="m 406.30665,31.572266 v 88.513674 h -88.51367 v 15.78711 h 88.51367 v 88.51367 h 15.78711 v -88.51367 h 88.51367 V 120.08594 H 422.09376 V 31.572266 Z" />
        </g>
        <!-- plus-3 end -->
        <ellipse bind:this={strokeOnlyCircleRef} id="circle-1" style="fill:none;fill-opacity:0;stroke:#ffffff;stroke-width:0.68847;stroke-dasharray:none;stroke-opacity:1" cx="153.65576" cy="63.620541" rx="2.6463184" ry="2.6955318" />
    </svg>
</div>

<style>

 path, ellipse {
     transform-origin: center;
     transform-box: fill-box;   
 }

 .background {
     position: fixed;
     width: 100%; height: 100%;
     top: 0; left: 0;
 }

 .transition-0 {
     --stage-0: translate(0, 0) rotate(0deg);
     animation: transition-0 .7s ease-in-out;
     transform: var(--stage-0);
 }

 @keyframes transition-0 {
     from {
         transform: var(--prev)
     }
     to {
         transform: translate(0, 0) rotate(0deg);
     }
 }

 .transition-1 {
     animation: transition-1 .7s ease-in-out;
     transform: var(--stage-1);
 }

 @keyframes transition-1 {
     0% {
         transform: var(--prev)
     }
     100% {
         transform: var(--stage-1)
     }
 }

 .transition-2 {
     animation: transition-2 .7s ease-in-out;
     transform: var(--stage-2);
 }

 @keyframes transition-2 {
     0% {
         transform: var(--prev)
     }
     100% {
         transform: var(--stage-2)
     }
 }

 .background svg {
     position: fixed;
     top: 0; left: 0;
     width: 100%; height: 100%;
     z-index: -1;
 }
 
 #circle-1 {
     --stage-1: translate(10px, 10px);
     --stage-2: translate(12px, 12px);
 }

 #circle-2--filled {
     --stage-1: translate(8px, 6px) rotate(-7deg);
     --stage-2: translate(10px, 8px) rotate(-9deg);
 }

 #bottom-right-side {
     --stage-1: translate(18px, 9px) rotate(-7deg);
     --stage-2: translate(19px, 11px) rotate(-9deg);
 }

 #bottom-left-side {
     position: fixed;
     bottom: 0; left: 0;
     fill-opacity:0
 }
 
 #plus-2, #plus-3  {
     --stage-1: translate(5px, 10px) rotate(90deg);
     --stage-2: translate(7px, 12px) rotate(180deg);
 }

 #plus-1{
     --stage-1: translate(-120px, -32px) rotate(90deg);
     --stage-2: translate(-140px, -42px) rotate(120deg);
 }

 #blog--stroke-only {
     --stage-1: translate(5px, 8px);
     --stage-2: translate(-5px, 10px) rotate(3deg);
 }

 #blob--filled {
     --stage-1: translate(5px, 10px);
     --stage-2: translate(-5px, 12px) rotate(3deg);
 }

</style>
