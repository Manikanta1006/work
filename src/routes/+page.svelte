<script>
  import Intro from "./components/intro.svelte";
  import Process from "./components/Process.svelte";
  import Services from "./components/services.svelte";
  import Believe from "./components/believe.svelte";
  import Desc from "./components/desc.svelte";
  import Award from "./components/award.svelte";
  import Ventures from "./components/ventures.svelte";
  import Clients from "./components/clients.svelte";
  import VenturesLaptop from "./components/ventures_laptop.svelte";
  import Blog from "./components/blog.svelte";
  import GradientText from "./components/gradient_text.svelte";
  import { onMount, onDestroy } from "svelte";

  let isMobile = false;

  let browser = false;
  let pageLoaded = false;

  function checkScreenSize() {
    isMobile = window.innerWidth <= 768;
  }

  onMount(() => {
    browser = true;
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    // Delay slightly to ensure all content/render completes
    setTimeout(() => {
      pageLoaded = true;
    }, 500); // Adjust this delay if needed
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener("resize", checkScreenSize);
    }
  });
</script>

<svelte:head>
  <title>INDQ - Product Design Studio | Medical Device Design & Prototyping India</title>
  <meta name="description"
    content="INDQ is a leading ISO 13485-certified product design studio in India, specializing in medical device design, rapid prototyping, and embedded electronics. With ISO 13485 certification and an in-house regulatory team, we provide end-to-end product development services for startups and enterprises." />
  <link rel="canonical" href="https://indq.in/" />

  <meta property="og:title" content="INDQ Studio | Product Design Studio | Medical Device Design & Prototyping India" />
  <meta property="og:description"
    content="ISO 13485 certified MedTech design studio delivering 75+ healthcare innovations. Industrial design, prototyping & embedded electronics." />
  <meta property="og:image" content="https://indq.in/images/og-homepage.jpg" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://indq.in/" />
  <meta property="og:site_name" content="INDQ Studio" />
  <meta property="og:locale" content="en_IN" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="INDQ Product Design Studio" />
  <meta name="twitter:description"
    content="ISO 13485 certified MedTech product design studio specializing in medical device design, prototyping and embedded electronics." />
  <meta name="twitter:image" content="https://indq.in/images/og-homepage.jpg" />
</svelte:head>

{#if !pageLoaded}
  <!-- Fullscreen GradientText Loader -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-white">
    <GradientText
      class="block"
      default_size="90px"
      mobile_size="45px"
      text="+++"
    />
  </div>
{/if}

{#if pageLoaded}
  <!-- Main Page Content -->
  <div class="pl-0 md:px-8 lg:pl-28 lg:pr-0">
    <div class="bg-white md:-mx-8 lg:-ml-28 lg:mr-0">
      <Intro />
    </div>

    <div>
      <Desc />
    </div>

    <div>
      <Services isMainPage={true} />
    </div>

    <div class="center">
      <Believe />
    </div>

    <div class="bg-white">
      <Process />
    </div>

    <div class="center">
      <Clients />
    </div>

    {#if browser}
      <div>
        {#if isMobile}
          <Ventures />
        {:else}
          <VenturesLaptop />
        {/if}
      </div>
    {/if}

    <div>
      <Blog />
    </div>

    <div>
      <Award />
    </div>
  </div>
{/if}
