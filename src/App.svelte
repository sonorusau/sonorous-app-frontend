<!-- App.svelte -->
<script>
  import Router from 'svelte-spa-router';
  import Home from './routes/+Home.svelte';
  import About from './routes/+About.svelte';

  const routes = {
    '/': Home,
    '/about': About
  };
</script>

<main>
  <Router {routes} />
</main>
