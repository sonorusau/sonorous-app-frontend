<script>
 export let hidden;
</script>

<div class="left-panel flex flex-col items-center" class:hidden={hidden}>
    <slot></slot>
</div>

<style>

 @keyframes slide-out {
     0% {
         display: block;
         transform: translateX(0)
     }
     100% {
         display: none;
         transform: translateX(-100%)
     }
 }


 @keyframes slide-in {
     0% {
         transform: translateX(-100%)
     }
     100% {
         transform: translateX(0)
     }
 }

 .left-panel {
     position: relative;
     padding: 0 !important;
     overflow-y: scroll;
     padding-top: 20px;
     background: rgba(240, 240, 255, .5);
     -webkit-backdrop-filter: blur(10px);
     backdrop-filter: blur(10px);
     height: 100vh;
     max-width: 450px;
     animation: slide-in .1s ease-out;
     width: 25vw
 }

    .left-panel.hidden {
        display: None;
        transform: translateX(-100%);
        animation: slide-out .1s ease-out;
    }

 .left-panel::-webkit-scrollbar-track
 {
     -webkit-box-shadow: inset 0 0 2px rgba(0,0,0,0.3);
     border-radius: 10px;
     background-color: #F5F5F5;
    }

    .left-panel::-webkit-scrollbar
    {
        width: 12px;
        background-color: #F5F5F5;
    }

    .left-panel::-webkit-scrollbar-thumb
    {
        border-radius: 4px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: #555;
    }
</style>
