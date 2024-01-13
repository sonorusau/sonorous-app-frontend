<script>
</script>

<div class="left-panel flex flex-col items-center position-fixed">
  <slot></slot>
</div>

<style>
  .left-panel {
    position: fixed;
    overflow-y: scroll;
    top: 0; left: 0;
    padding-top: 20px;
    background: rgba(240, 240, 255, .5);
    -webkit-backdrop-filter: blur(10px);
    height: 100vh;
    max-width: 450px;
    width: 25vw
  }

</style>
