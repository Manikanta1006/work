<script>
    import { fade, fly } from "svelte/transition";
    import M_Blog from "../components/main_blog.svelte";

</script>

<svelte:head>
  <title>Blog | INDQ Studio - MedTech Design Insights</title>
  <meta name="description"
    content="Insights on medical device design, rapid prototyping, embedded electronics and regulatory pathways from INDQ's product design studio." />
  <link rel="canonical" href="https://indq.in/main_blog" />

  <meta property="og:title" content="Blog | INDQ Studio - MedTech Design Insights" />
  <meta property="og:description"
    content="Insights on medical device design, prototyping and embedded electronics from INDQ Studio." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://indq.in/main_blog" />
  <meta property="og:site_name" content="INDQ Studio" />
</svelte:head>

<div in:fly={{duration: 500, y: 250}} class="lg:mt-24">
    <M_Blog/>
</div>