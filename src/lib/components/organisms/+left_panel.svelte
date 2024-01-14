<script>
</script>

<div class="left-panel flex flex-col items-center">
    <slot></slot>
</div>

<style>
 .left-panel {
     position: relative;
     /* top: 0; left: 0; */
     transform: translate(-12px, -12px);
     overflow-y: scroll;
     padding-top: 20px;
     background: rgba(240, 240, 255, .5);
     -webkit-backdrop-filter: blur(10px);
     height: 100vh;
     max-width: 450px;
     width: 25vw
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
