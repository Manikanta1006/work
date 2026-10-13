<script>
    import { fade, fly } from "svelte/transition";
    import Service from "../components/services.svelte";
  
  </script>

  <svelte:head>
    <title>Product Design & Engineering Services | INDQ Studio</title>
    <meta name="description"
      content="End-to-end product development services from INDQ: medical device design, rapid prototyping, embedded electronics, industrial design, and regulatory support for ISO 13485-certified MedTech products." />
    <link rel="canonical" href="https://indq.in/services" />

    <meta property="og:title" content="Product Design & Engineering Services | INDQ Studio" />
    <meta property="og:description"
      content="Medical device design, rapid prototyping, embedded electronics and regulatory support from an ISO 13485-certified studio." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://indq.in/services" />
    <meta property="og:site_name" content="INDQ Studio" />
  </svelte:head>

  <div in:fly={{duration: 500, y: 250}} class="lg:mt-24">
    <Service/>
  </div>