<script lang="ts">
  import Markdown from '$md';
  import Navbar from '$navigation/navbar/navbar.svelte';
</script>

<Navbar />
<main>
  <Markdown filePath="/markdown/test.md" />
</main>
