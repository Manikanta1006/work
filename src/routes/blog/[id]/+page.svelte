<script>
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import { browser } from '$app/environment';
  import { Linkedin, Fb, Insta} from '$lib/assets/';
  import GradientText from "./gradient_text.svelte";
  if (browser) {
    document.addEventListener('click', handleClickOutside);
  }
  
  let blogData = null;
  let isLoading = true;
  let error = null;

  let blogUrl = '';
  let blogTitle = '';

  let showMenu = false;
  let showTopMenu = false;

  // Close menus when clicking outside
  function handleClickOutside(event) {
    // For top menu
    const topMenuButton = document.getElementById('top-share-button');
    const topMenuContent = document.getElementById('top-menu-content');
    if (showTopMenu && topMenuButton && !topMenuButton.contains(event.target) && 
        topMenuContent && !topMenuContent.contains(event.target)) {
      showTopMenu = false;
    }
    
    // For bottom menu
    const bottomMenuButton = document.getElementById('bottom-share-button');
    const bottomMenuContent = document.getElementById('bottom-menu-content');
    if (showMenu && bottomMenuButton && !bottomMenuButton.contains(event.target) && 
        bottomMenuContent && !bottomMenuContent.contains(event.target)) {
      showMenu = false;
    }
  }

  const toggleMenu = () => showMenu = !showMenu;
  const toggleTopMenu = () => showTopMenu = !showTopMenu;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(decodeURIComponent(blogUrl));
    alert("Link copied to clipboard!");
    showMenu = false;
    showTopMenu = false;
  };

  const shareLinks = {
    linkedin: '',
    facebook: '',
    whatsapp: '',
    x: ''
  };

  onMount(async () => {
    try {
      const blogId = $page.params.id;

      blogUrl = encodeURIComponent(window.location.href);
      blogTitle = encodeURIComponent("Check out this blog!");

      shareLinks.linkedin = `https://www.linkedin.com/shareArticle?mini=true&url=${blogUrl}&title=${blogTitle}`;
      shareLinks.facebook = `https://www.facebook.com/sharer/sharer.php?u=${blogUrl}`;
      shareLinks.whatsapp = `https://wa.me/?text=${blogTitle}%20${blogUrl}`;
      shareLinks.x = `https://twitter.com/intent/tweet?url=${blogUrl}&text=${blogTitle}`;

      const response = await fetch('/assets.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      blogData = data.blogs.find(blog => blog.id == blogId);
      if (!blogData) throw new Error('Blog not found');

      // Add click event listener to close menus when clicking outside
      // document.addEventListener('click', handleClickOutside);
      // const element = document.querySelector('#someElement');

    } catch (err) {
      console.error('Error loading blog:', err);
      error = err.message;
    } finally {
      isLoading = false;
    }
  });

  // Clean up event listener on component unmount
  onDestroy(() => {
    if (browser) {
      document.removeEventListener('click', handleClickOutside);
    }
  });
</script>

<svelte:head>
  <title>{blogData ? `${blogData.Name} | INDQ Studio Blog` : "Loading Blog..."}</title>
  {#if blogData}
    <meta name="description" content={blogData.Description} />
    <link rel="canonical" href={`https://indq.in/blog/${blogData.id}`} />

    <meta property="og:title" content={blogData.Name} />
    <meta property="og:description" content={blogData.Description} />
    <meta property="og:type" content="article" />
    <meta property="og:url" content={`https://indq.in/blog/${blogData.id}`} />
    <meta property="og:image" content={blogData.Image} />
    <meta property="og:site_name" content="INDQ Studio" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={blogData.Name} />
    <meta name="twitter:description" content={blogData.Description} />
    <meta name="twitter:image" content={blogData.Image} />
  {/if}
</svelte:head>

<style>
  .diagonal-gradient {
    background: linear-gradient(135deg, #B9DFF1, #F3C9BD, #F7E6A7);
  }
</style>

<div class="max-w-4xl mx-auto px-4 py-8 lg:mt-30 mt-26">
  {#if isLoading}
    <!-- <div class="text-center py-20">
      <p class="text-xl">Loading blog content...</p>
    </div> -->
    <div class="absolute inset-0 flex items-center justify-center z-10 bg-white">
        <GradientText class="block lg:hidden" default_size="90px" mobile_size="45px" text="+++" />
      </div>
  {:else if error}
    <div class="text-center py-20">
      <p class="text-xl text-red-600">Error: {error}</p>
      <a href="/main_blog" class="inline-block mt-4 px-4 py-2 diagonal-gradient text-black rounded">Return to blogs</a>
    </div>
  {:else}
    <!-- Top share button and menu -->
    <div class="mb-12 flex items-center justify-between">
      <span class="diagonal-gradient text-gray-800 px-3 py-1 rounded-md text-sm font-medium uppercase shadow-sm">
          {blogData.Tag}
      </span>
      <div class="relative">
        <button id="top-share-button" class="ml-2 focus:outline-none" on:click={toggleTopMenu}>
            <img src="share.svg" alt="Share" class="h-12 w-12" />
        </button>
        
        <!-- Top share menu -->
        {#if showTopMenu}
          <div id="top-menu-content" transition:fade={{ duration: 200 }} class="absolute right-0 top-14 bg-white border border-gray-300 rounded-lg shadow-md py-2 px-4 w-50 z-50">
            <button 
              type="button"
              class="text-gray-700 cursor-pointer hover:underline gap-2 w-full text-left"
              on:click={copyToClipboard}>
              🔗  Copy Link
            </button>
            
            <a href={shareLinks.linkedin} target="_blank" class="flex items-center gap-2 text-gray-800 hover:underline mb-2">
              <img src="./LinkedIn.svg" alt="LinkedIn" class="w-5 h-5" />
              Share on LinkedIn
            </a>
            <a href={shareLinks.facebook} target="_blank" class="flex items-center gap-2 text-gray-800 hover:underline mb-2">
              <img src="./Facebook.svg" alt="Facebook" class="w-5 h-5" />
              Share on Facebook
            </a>
            <a href={shareLinks.whatsapp} target="_blank" class="flex items-center gap-2 text-gray-800 hover:underline mb-2">
              <img src="./whatsapp.svg" alt="WhatsApp" class="w-5 h-5" />
              Share on WhatsApp
            </a>
            <a href={shareLinks.x} target="_blank" class="flex items-center gap-2 text-gray-800 hover:underline">
              <img src="./X.svg" alt="X" class="w-5 h-5" />
              Share on X
            </a>
          </div>
        {/if}
      </div>
    </div>

    <h1 class="text-4xl md:text-5xl font-bold mb-8 leading-tight">
      {blogData.Name}
    </h1>

    <div class="w-full mb-12">
      <img 
        src={blogData.Image} 
        alt={blogData.Name}
        class="w-full lg:h-150 h-80 object-cover rounded-lg"
        on:error={(e) => e.target.src = '/ceramic.png'}
      />
    </div>

    <div class="prose prose-lg max-w-none">
      <p class="mb-6 font-semibold text-lg">
        {blogData.Description}
      </p>

      <div class="mt-8">
        {@html blogData.Content || "No content available for this blog."}
      </div>
    </div>

    <!-- Social Sharing Section -->
    <div class="flex justify-between items-center w-full max-w-5xl mx-auto py-6 px-4 mt-12 relative">
      <div class="flex flex-col items-center gap-2">
        <button
          id="bottom-share-button"
          on:click={toggleMenu}
          class="flex items-center hover:opacity-70 transition-opacity">
          <img src="./share.svg" alt="Share Icon" class="w-15 h-15" />
        </button>
        <span class="text-xl font-medium">Share this blog</span>

        {#if showMenu}
          <div id="bottom-menu-content" transition:fade={{ duration: 200 }} class="absolute top-24 bg-white border border-gray-300 rounded-lg shadow-md py-2 px-4 w-50 z-50">
            <button 
              type="button"
              class="text-gray-700 cursor-pointer hover:underline gap-2 w-full text-left"
              on:click={copyToClipboard}>
              🔗  Copy Link
            </button>
            
            <a href={shareLinks.linkedin} target="_blank" class="flex items-center gap-2 text-gray-800 hover:underline mb-2">
              <img src="./LinkedIn.svg" alt="LinkedIn" class="w-5 h-5" />
              Share on LinkedIn
            </a>
            <a href={shareLinks.facebook} target="_blank" class="flex items-center gap-2 text-gray-800 hover:underline mb-2">
              <img src="./Facebook.svg" alt="Facebook" class="w-5 h-5" />
              Share on Facebook
            </a>
            <a href={shareLinks.whatsapp} target="_blank" class="flex items-center gap-2 text-gray-800 hover:underline mb-2">
              <img src="./whatsapp.svg" alt="WhatsApp" class="w-5 h-5" />
              Share on WhatsApp
            </a>
            <a href={shareLinks.x} target="_blank" class="flex items-center gap-2 text-gray-800 hover:underline">
              <img src="./X.svg" alt="X" class="w-5 h-5" />
              Share on X
            </a>
          </div>
        {/if}
      </div>

      <div class="flex flex-col items-center gap-6">
        <div class="flex items-center gap-2">
          <a href="https://in.linkedin.com/company/indq" class="hover:opacity-70 transition-opacity" aria-label="LinkedIn">
            <img src= {Linkedin}   alt="LinkedIn Icon" class="w-10 h-10" />
          </a>
          <a href="https://www.facebook.com/indq.in/" class="hover:opacity-70 transition-opacity" aria-label="Facebook">
            <img src={Fb} alt="Facebook Icon" class="w-10 h-10" />
          </a>
          <a href="https://www.instagram.com/indq_studio/" class="hover:opacity-70 transition-opacity" aria-label="Instagram">
            <img src={Insta}  alt="Instagram Icon" class="w-10 h-10" />
          </a>
        </div>
        <span class="text-xl font-medium">Visit our socials</span>
      </div>
    </div>

    <div class="mt-6 text-center">
      <a href="/main_blog" class="inline-block px-6 py-3 diagonal-gradient text-black font-semibold rounded-md shadow-sm">
        Back to all blogs
      </a>
    </div>
  {/if}
</div>