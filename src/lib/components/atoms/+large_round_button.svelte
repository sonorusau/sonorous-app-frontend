<script>
</script>

<main>
	<div class="button--main cursor-pointer flex justify-center items-center no-select">
    <slot></slot>
  </div>
</main>

<style>
  main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
  }

  .button--main {
    width: 20vw;
    height: 20vw;
    border-radius: 100%;
    color: #FFF;
    backdrop-filter: blur(20px);
    background: rgba(30, 144, 255, .5);
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

  @media (min-width: 640px) {
		main {
			max-width: none;
		}
  }
</style>
