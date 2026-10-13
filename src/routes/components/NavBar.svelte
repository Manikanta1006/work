<script>
  // @ts-nocheck
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount, onDestroy } from "svelte";
  import Contact from "./Contact.svelte";
  import {logo} from '$lib/assets';
  export let navItems = [
    { text: 'Services', href: '/services' },
    { text: 'Work', href: '/work' },
    { text: 'About', href: '/about' },
    { text: 'Blogs', href: '/main_blog' },
  ];
  let isMobileMenuOpen = false;
  let isScrolled = false;
  let scrollY = 0;
  let lastScrollY = 0;
  let scrollThreshold = 50; // Pixels to scroll before collapsing
  
  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  
  function navigateTo(href) {
    isMobileMenuOpen = false; // Close the menu
    goto(href); // Navigate to the page
  }
  
  // Use a reactive statement to track the current path
  $: currentPath = $page.url.pathname;
  $: isHome = currentPath === "/";
  
  // Handle scroll events with debounce
  function handleScroll() {
    scrollY = window.scrollY;
    // Only update if we've scrolled more than 10px since last check (debounce)
    if (Math.abs(scrollY - lastScrollY) > 10) {
      isScrolled = scrollY > scrollThreshold;
      lastScrollY = scrollY;
    }
  }
  
  // Set up scroll listener
  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      // Initial check
      handleScroll();
    }
  });
  
  // Clean up scroll listener
  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', handleScroll);
    }
  });
</script>

<style>
  .diagonal-gradient {
    background: linear-gradient(135deg, #B9DFF1, #F3C9BD, #F7E6A7);
  }
</style>

<nav class="w-full fixed top-0 left-0 z-50 transition-all duration-300"
  class:bg-transparent={isHome && !isScrolled}
  class:bg-white={!isHome || isScrolled}
  class:py-1={isScrolled}
  class:py-3={!isScrolled}>
  <div class="px-4 sm:px-6 py-2 flex justify-between items-center"
    class:text-white={isHome && !isScrolled}
    class:text-gray-800={!isHome || isScrolled}
    class:bg-transparent={isHome && !isScrolled}
    class:bg-white={!isHome || isScrolled}>
    <!-- Logo -->

    
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="flex-shrink-0" on:click={() => goto("/")} style="cursor: pointer;">
      <img src={logo} alt="INDQ Product Design Studio Logo"
        class="transition-all duration-300 "
        class:h-6={isScrolled}
        class:sm:h-8={isScrolled}
        class:h-8={!isScrolled}
        class:sm:h-12={!isScrolled}
        class:invert={isHome && !isScrolled} />
    </div>
    
    <!-- Desktop Navigation -->
    <div class="hidden md:flex items-center space-x-8">
      {#each navItems as item}
      <a
          href={item.href}
          class="font-semibold transition-colors duration-200"
          class:text-sm={isScrolled}
          class:text-base={!isScrolled}
          class:lg:text-base={isScrolled}
          class:lg:text-lg={!isScrolled}
          class:text-white={isHome && !isScrolled}
          class:text-gray-800={!isHome || isScrolled}
          hover:text-gray-600>
          {item.text}
        </a>
      {/each}
      <a
        href="./Contact"
        class="font-semibold transition-colors duration-200 flex items-center"
        class:text-sm={isScrolled}
        class:text-base={!isScrolled}
        class:lg:text-base={isScrolled}
        class:lg:text-lg={!isScrolled}
        class:text-white={isHome && !isScrolled}
        class:text-gray-800={!isHome || isScrolled}
        hover:text-gray-600>
        Let's connect <span class="ml-1">&rarr;</span>
      </a>
    </div>

    <!-- Mobile Menu Button -->
    <button
      class="md:hidden flex items-center focus:outline-none"
      aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      aria-expanded={isMobileMenuOpen}
      on:click={toggleMobileMenu}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="transition-all duration-300"
        class:h-5={isScrolled}
        class:w-5={isScrolled}
        class:h-6={!isScrolled}
        class:w-6={!isScrolled}
        class:text-white={isHome && !isScrolled}
        class:text-gray-800={!isHome || isScrolled}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {#if isMobileMenuOpen}
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        {:else}
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        {/if}
      </svg>
    </button>
  </div>

  <!-- Mobile Navigation Menu -->
  {#if isMobileMenuOpen}
    <div 
      class="md:hidden fixed top-0 left-0 right-0 bottom-0 z-50 diagonal-gradient"
    >
      <!-- Close button -->
      <div class="flex justify-end p-4">
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button
          class="focus:outline-none text-white"
          on:click={toggleMobileMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Navigation Items -->
      <div class="flex flex-col px-12 pt-8">
        <button on:click={() => navigateTo('/services')} class="text-left text-white text-4xl font-medium py-5">
          Services
        </button>
        <div class="h-px w-full bg-white/30"></div>
        
        <button on:click={() => navigateTo('/work')} class="text-left text-white text-4xl font-medium py-5">
          Work
        </button>
        <div class="h-px w-full bg-white/30"></div>
        
        <button on:click={() => navigateTo('/about')} class="text-left text-white text-4xl font-medium py-5">
          About
        </button>
        <div class="h-px w-full bg-white/30"></div>
        
        <button on:click={() => navigateTo('/main_blog')} class="text-left text-white text-4xl font-medium py-5">
          Blog
        </button>
        <div class="h-px w-full bg-white/30"></div>
        
        <button on:click={() => navigateTo('./Contact')} class="text-left text-white text-4xl font-medium py-5">
          Connect
        </button>
        <div class="h-px w-full bg-white/30"></div>
      </div>
    </div>
  {/if}
</nav>

