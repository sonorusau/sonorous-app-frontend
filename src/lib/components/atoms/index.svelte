<script>
  export let text;
</script>

<main>
	<div class="button--main cursor-pointer flex justify-center items-center">{ text }</div>
</main>

<style>
  .button--main {
    width: 20vw;
    height: 20vw;
    border-radius: 100%;
    color: #FFF;
    background: #1e90ff;
  }

  .flex {
    display: flex
  }

  .justify-center {
    justify-content: center
  }

  .items-center {
    align-items: center
  }

  .cursor-pointer {
    cursor: pointer
  }
</style>
