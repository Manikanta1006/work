<script>
    import { fade, fly } from "svelte/transition";
    import PrivacyPolicy from "../components/privacypolicy.svelte";

</script>

<svelte:head>
  <title>Privacy Policy | INDQ Studio</title>
  <meta name="description" content="Read INDQ Studio's privacy policy covering how we collect, use and protect your information." />
  <link rel="canonical" href="https://indq.in/privacypolicy" />
</svelte:head>

<div in:fly={{duration: 500, y: 250}} class="lg:mt-24">
    <PrivacyPolicy/>
</div>