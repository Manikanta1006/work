<script>
  import { onMount, onDestroy } from "svelte";

  let sliderDesktop;
  let sliderMobile;
  let interval;

  // Original images without duplication
  const originalImages = [
    {
      src: "/DAG.svg",
      alt: "Client testimonial reviewing INDQ product design services",
    },
    {
      src: "/VS_test.svg",
      alt: "Client testimonial reviewing INDQ product design services",
    },
    {
      src: "/PK_test.svg",
      alt: "Client testimonial reviewing INDQ product design services",
    },
  ];

  // Create a working array with the first image duplicated at the end
  // This allows for the illusion of infinite scrolling
  const images = [...originalImages, originalImages[0]];

  let currentIndex = 0;
  let isTransitioning = false;

  onMount(() => {
    startSlideshow();
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  function startSlideshow() {
    clearInterval(interval);
    interval = setInterval(() => {
      nextSlide();
    }, 3000);
  }

  function nextSlide() {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex++;
    updateSliders();

    // If we've reached the duplicated first slide (at the end)
    if (currentIndex >= images.length - 1) {
      // Wait for transition to complete
      setTimeout(() => {
        // Disable transition temporarily
        if (sliderDesktop) sliderDesktop.style.transition = "none";
        if (sliderMobile) sliderMobile.style.transition = "none";

        // Jump back to the first slide without animation
        currentIndex = 0;
        updateSliders();

        // Re-enable transition after a brief delay
        setTimeout(() => {
          if (sliderDesktop)
            sliderDesktop.style.transition = "transform 700ms ease-in-out";
          if (sliderMobile)
            sliderMobile.style.transition = "transform 700ms ease-in-out";
          isTransitioning = false;
        }, 50);
      }, 700); // Wait for transition to complete
    } else {
      setTimeout(() => {
        isTransitioning = false;
      }, 700);
    }
  }

  function updateSliders() {
    if (sliderDesktop) {
      sliderDesktop.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    if (sliderMobile) {
      sliderMobile.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }
</script>

<section
  class="px-6 py-12 md:py-24 bg-white lg:mt-10 lg:mb-10 lg:ml-24 justify-center items-center rounded-lg"
>
  <div class="flex flex-col lg:flex-row lg:items-center">
    <!-- Left side - Main heading -->
    <div class="w-full md:w-1/2 mb-10 md:mb-0 pr-0 md:pr-10">
      <h2
        class="text-5xl sm:text-6xl md:text-8xl font-bold leading-tight p-4 ml-4 sm:ml-6 md:ml-0 lg:ml-4"
      >
        Shape<br />
        possibilities<br />
        with us!
      </h2>
    </div>

    <!-- Right side - Slideshow (visible only on desktop) -->
    <div class="hidden lg:block w-full lg:w-auto relative overflow-hidden">
      <div
        class="relative w-120 h-120 flex transition-transform duration-500 ease-in-out"
        bind:this={sliderDesktop}
      >
        {#each images as img, i}
          <img src={img.src} alt={img.alt} class="w-120 h-120 flex-shrink-0" />
        {/each}
      </div>
    </div>
  </div>

  <!-- Testimonial slider (visible only on mobile) -->
  <div
    class="lg:hidden mt-8 md:max-w-[80%] md:mx-auto relative overflow-hidden"
  >
    <div
      class="relative flex transition-transform duration-700 ease-in-out"
      bind:this={sliderMobile}
    >
      {#each images as img, i}
        <img src={img.src} alt={img.alt} class="w-full flex-shrink-0" />
      {/each}
    </div>
  </div>
</section>
