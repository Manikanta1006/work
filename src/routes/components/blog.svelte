<script>
  import { onMount } from 'svelte';
  import GradientText from './gradient_text.svelte';
  let blogs = [];

  onMount(async () => {
  try {
    const response = await fetch('/assets.json');
    const data = await response.json();
    blogs = data.blogs.slice(0, 3).map(blog => ({
      title: blog.Name,
      description: blog.Description,
      category: blog.Tag,
      readTime: blog.Time,
      image: blog.Image,
      altText: `${blog.Name} - INDQ Medical Design Insights`,
      link: `./blog/${blog.id}`, // Generate a link based on blog ID
      id: blog.id
    }));
  } catch (error) {
    console.error('Error loading blogs:', error);
    blogs = [];
  }
});
</script>

<div class="container max-w-full px-4 lg:-ml-5">
  <div class="flex flex-col">
    
    
    <!-- ✅ Mobile Header (only Blog title, centered) -->
    <div class="md:hidden flex justify-center mb-4 mt-20">
      <h2 class="text-3xl font-semibold text-center">Blogs</h2>
    </div>

    <!-- ✅ Desktop Header -->
    <div class="hidden md:flex justify-between items-center mb-6">
      <h2 class="text-3xl font-semibold">Blogs</h2>
      <a href="./main_blog" class="relative flex flex-col items-center text-black text-2xl font-semibold">
        <span class="flex items-center lg:mr-25">
          View More
          <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </span>
        <span class="w-35 h-1 mt-1 lg:mr-26 highlight-bar"></span>
      </a>
    </div>

    <!-- ✅ Blog Cards - Updated for Desktop with auto width -->
    {#if blogs.length > 0}
      <div class="grid md:grid-cols-3 gap-6 py-8 lg:w-auto lg:justify-between lg:mr-25 lg:ml-5">
        {#each blogs as blog}
          <div class="bg-white rounded-lg overflow-hidden">
            <div class="px-4 py-2 flex justify-between items-center">
              <span class="text-2xl font-Semibold text-black">{blog.category}</span>
              <span
                class="text-xl font-bold bg-clip-text text-transparent"
                style="background: linear-gradient(135deg, #B9DFF1, #F3C9BD, #F7E6A7); background-clip: text;"
              >
                {blog.readTime}
              </span>
            </div>
            <img
              src={blog.image}
              alt={blog.altText || blog.title}
              class="w-full h-[284px] object-cover rounded-lg"
            />
            <div class="p-4">
              <a href={blog.link} class="block">
                <h4 class="text-2xl font-Normal mb-2 transition-colors hover:gradient-text">
                  {blog.title}
                </h4>
              </a>
              <p class="text-black font-normal">{blog.description}</p>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="text-center py-8">
        <GradientText class="block lg:hidden" default_size="90px" mobile_size="45px" text="+++" />
      </div>
    {/if}

    <!-- ✅ Mobile View More at Bottom -->
    <div class="md:hidden flex justify-center mt-6 mb-24">
      <a href="./main_blog" class="flex items-center rounded-lg text-2xl font-semibold px-4 py-2 diagonal-gradient">
        View More
      </a>
    </div>

  </div>
</div>

<style>
  .diagonal-gradient {
    background: linear-gradient(135deg, #B9DFF1, #F3C9BD, #F7E6A7);
  }

  .highlight-bar {
        width: 100px;
        height: 4px;
        /* background: #FFD580; */
        background: linear-gradient(135deg, #B9DFF1, #F3C9BD, #F7E6A7 );
        margin-bottom: 1rem;
        display: block;
        border-radius: 20px;
    }


  .hover\:gradient-text:hover {
    background: linear-gradient(135deg, #B9DFF1, #F3C9BD, #F7E6A7);
    -webkit-background-clip: text; /* For Safari */
    background-clip: text;
    color: transparent; /* Make text color transparent to show gradient */
  }
</style>