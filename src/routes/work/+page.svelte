<script>
  import { fade, fly } from "svelte/transition"
  import Work from "../components/work.svelte";

</script>

<svelte:head>
  <title>Our Work | Medical Device Design Portfolio | INDQ Studio</title>
  <meta name="description"
    content="Explore INDQ's portfolio of medical device design and MedTech product development projects, from concept and prototyping through regulatory-ready manufacturing." />
  <link rel="canonical" href="https://indq.in/work" />

  <meta property="og:title" content="Our Work | Medical Device Design Portfolio | INDQ Studio" />
  <meta property="og:description"
    content="Portfolio of medical device design and MedTech product development projects by INDQ Studio." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://indq.in/work" />
  <meta property="og:site_name" content="INDQ Studio" />
</svelte:head>

<div in:fly={{duration: 500, y: 250}} class="lg:mt-24">
  <Work/>
</div>