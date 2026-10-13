<!-- src/routes/+layout.svelte -->
<script>
    import "../app.css";
    import NavBar from "./components/NavBar.svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import Footer from "./components/footer.svelte";
    import Testimonial from "./components/testimonial.svelte";
    import Chat from "./components/chat.svelte";
    let isMobileMenuOpen = false;


  </script>
  <div class="min-h-screen font-gill " style="">
    <NavBar />
    <main class="overflow-x:visible">
      <slot />
    </main>
  </div>

  <div>
    {#if $page.url.pathname !== '/privacypolicy'}
    <Testimonial/>
    {/if}
  </div>

  <div>
    <Chat />
    <Footer/>
  </div>
  
  <style>
   
    @font-face {
        font-family: 'Gill Sans';
        src: url('/fonts/Gill Sans.otf') format('opentype');
        /* src: url('/fonts/Gill Sans Bold.otf') format('opentype'); 
        src: url('/fonts/Gill Sans Medium.otf') format('opentype');
        src: url('/fonts/Gill Sans Light.otf') format('opentype'); */
        font-weight: normal;
        font-style: normal;
    }

    :global(body), :global(html) {
        font-family: 'Gill Sans', sans-serif !important
    }

    .font-gill {
        font-family: 'Gill Sans', sans-serif;
    }
  </style>