<script>
    import { fade, fly } from "svelte/transition";
    import About from "../components/about.svelte";

</script>

<svelte:head>
  <title>About INDQ | ISO 13485 Certified Medical Device Design Studio</title>
  <meta name="description"
    content="INDQ is an ISO 13485-certified product design studio founded in 2018, delivering 75+ healthcare innovations across medical device design, prototyping and embedded electronics." />
  <link rel="canonical" href="https://indq.in/about" />

  <meta property="og:title" content="About INDQ | ISO 13485 Certified Medical Device Design Studio" />
  <meta property="og:description"
    content="ISO 13485-certified product design studio delivering 75+ healthcare innovations since 2018." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://indq.in/about" />
  <meta property="og:site_name" content="INDQ Studio" />
</svelte:head>

<div in:fly={{duration: 500, y: 250}} class="lg:mt-24">
    <About/>
</div>
