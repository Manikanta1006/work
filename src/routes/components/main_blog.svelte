<script>
  import { onMount } from 'svelte';
  import GradientText from './gradient_text.svelte';

  
  let blogs = [];
  let searchTerm = '';
  let selectedCategory = 'All';
  let isLoading = true;
  let error = null;

  $: categories = ['All', ...new Set(blogs.map(blog => blog.category).filter(Boolean))];

  onMount(async () => {
    try {
      const response = await fetch('/assets.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      blogs = data.blogs.map(blog => ({
        title: blog.Name || '',
        description: blog.Description || '',
        category: blog.Tag || '',
        readTime: blog.Time || '',
        image: blog.Image || '',
        altText: `${blog.Name} - INDQ Medical Design Insights`,
        link: `/blog/${blog.id}`,  // Changed to absolute path with leading slash
        id: blog.id,
        fullContent: blog["Long Description"] || ''
      }));
    } catch (error) {
      console.error('Error loading blogs:', error);
      error = error.message;
      blogs = [];
    } finally {
      isLoading = false;
    }
  });

  $: filteredBlogs = blogs.filter(blog => 
    (selectedCategory === 'All' || blog.category === selectedCategory) &&
    ((blog.title?.toLowerCase() || '').includes((searchTerm || '').toLowerCase()) || 
     (blog.description?.toLowerCase() || '').includes((searchTerm || '').toLowerCase()))
  );
</script>


<div class="container mx-auto px-4 py-8">
  <section class="px-4 sm:px-8 md:px-12 lg:py-12  py-24">
    <div class="max-w-4xl ">
        <h1 class="text-6xl sm:text-5xl mt-50 ml-2 mb-35 md:text-6xl lg:text-8xl font-bold lg:ml-28 lg:mt-15 lg:mb-36  mb-6">
          Bringing you insights from<br>
          the world of medical<br> 
          technologies<br>
         <GradientText />
        </h1>
    </div>
    

</section>
  
  {#if isLoading}
    <div class="text-center py-8">
      <!-- <p class="text-xl">Loading blogs...</p> -->
      <GradientText class="block lg:hidden" default_size="90px" mobile_size="45px" text="+++" />
    </div>
  {:else if error}
    <div class="text-center py-8 text-red-600">
      <p>Error loading blogs: {error}</p>
    </div>
  {:else}
    <div class="mb-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 lg:ml-2 lg:mr-2 blog-grid-wrapper">
      <input 
        type="text" 
        placeholder="Search blogs..." 
        bind:value={searchTerm}
        class="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      <select 
        bind:value={selectedCategory}
        class="w-full md:w-1/3 px-4 py-2 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500">
        {#each categories as category}
          <option value={category}>{category}</option>
        {/each}
      </select>
    </div>

    {#if filteredBlogs.length > 0}
    <div class="blog-grid-wrapper">
      <div class="grid md:grid-cols-3 gap-6 lg:ml-2">
        {#each filteredBlogs as blog}
          <div class="bg-white rounded-lg overflow-hidden">
            <div class="px-4 py-2 flex justify-between items-center"> 
              <span class="text-xl font-semibold text-black" style="display: flex; align-items: center;">{blog.category} </span>
              <span 
                class="text-xm font-bold bg-clip-text text-transparent" 
                style="background: linear-gradient(135deg, #B9DFF1, #F3C9BD, #F7E6A7); background-clip: text;">
                {blog.readTime}</span>
            </div>
            <a href={blog.link}>
              <img 
                src={blog.image} 
                alt={blog.altText || blog.title} 
                class="w-full h-[284px] responsive-large-img object-cover rounded-lg hover:opacity-90 transition-opacity duration-300"
              />
            </a>
            <div class="p-4">
              <a href={blog.link} class="block">
                <h3 class="text-2xl font-semibold mb-4 lg:mt-5 transition-colors hover:gradient-text" >
                  {blog.title}
                </h3>
              </a>
              <p class="text-black font-normal lg:mt-5">{blog.description}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
    {:else}
      <div class="text-center py-8 text-gray-500">No blogs found.</div>
    {/if}
  {/if}
</div>
<style>
  h3 {
    color: black; /* Default text color */
    transition: color 0.3s ease; /* Smooth transition for color change */
  }

  .hover\:gradient-text:hover {
    background: linear-gradient(135deg, #B9DFF1, #F3C9BD, #F7E6A7);
    -webkit-background-clip: text; /* For Safari */
    background-clip: text;
    color: transparent; /* Make text color transparent to show gradient */
  }
</style>