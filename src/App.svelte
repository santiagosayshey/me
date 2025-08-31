<script lang="ts">
  import Router from 'svelte-spa-router';
  import Navbar from '$navigation/navbar/navbar.svelte';
  import PageNav from '$navigation/pageNav/pageNav.svelte';
  import Markdown from '$md';
  
  const routes = {
    '/': Markdown,
    '/:group/:file': Markdown,
    '*': Markdown
  };
</script>

<Navbar />
<div class="flex h-screen">
  <PageNav />
  <main class="flex-1 overflow-y-auto">
    <Router {routes} />
  </main>
</div>
