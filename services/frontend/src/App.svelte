<script lang="ts">
  import { Router, Route } from 'svelte-routing';
  import Navbar from '$navigation/navbar/navbar.svelte';
  import PageNav from '$navigation/pageNav/pageNav.svelte';
  import Markdown from '$md';
</script>

<div class="h-screen flex flex-col">
  <Navbar />
  <div class="flex flex-1 overflow-hidden">
    <PageNav />
    <main class="flex-1 overflow-hidden">
      <Router>
        <Route path="/:group/:file" let:params>
          <Markdown params={{group: params.group, file: params.file}} />
        </Route>
        <Route path="/">
          <Markdown params={{}} />
        </Route>
      </Router>
    </main>
  </div>
</div>
