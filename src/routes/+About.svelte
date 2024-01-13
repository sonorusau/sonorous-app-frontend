<script>
  export let name;
  import LargeRoundButton from '../lib/components/atoms/+large_round_button.svelte';
  import LeftPanel from '../lib/components/organisms/+left_panel.svelte';
</script>

<main class="flex justify-center">
  <LeftPanel />
  <LargeRoundButton>Start Recording</LargeRoundButton>
</main>

<style>
  main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
  }

  .bg-red {
    background-color: red;
  }

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

  .no-select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  @media (min-width: 640px) {
		main {
			max-width: none;
		}
  }
</style>
