<script>
    import { onMount, onDestroy } from "svelte";
      
    let slider;
    let animationId;
    let scrollSpeed = 1.5; // Adjust speed as needed
    
    onMount(() => {
      // Start the animation loop
      function animateScroll() {
        if (slider) {
          slider.scrollLeft += scrollSpeed;
          
          // Reset scroll position when reaching the end
          if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
            // Add small offset to avoid flickering
            slider.scrollLeft = 0;
          }
        }
        animationId = requestAnimationFrame(animateScroll);
      }
      
      // Start the animation
      animationId = requestAnimationFrame(animateScroll);
    });
    
    onDestroy(() => {
      // Clean up animation when component is destroyed
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    });
  </script>
  
  <div class="bg-white py-8 lg:mt-24 ">
    <!-- <h2 class="text-left  text-3xl font-bold mb-6 pb-20">Our Awards</h2> -->
    <h2 class="text-center md:text-left text-3xl font-bold mb-6 pb-20 lg:-ml-2">Our Awards</h2>

    <div class="overflow-hidden pb-5 lg:-ml-25 ">
      <div
        bind:this={slider}
        class="flex space-x-12  items-center overflow-x-auto py-4 px-6 no-scrollbar">
        <!-- Double the images to create seamless loop effect -->
        <img src="/Stanford.svg" alt="Recognized by Stanford Graduate School of Business" class="h-16" />
        <img src="/iit.svg" alt="Science and Technology Innovation award by IIT" class="h-16" />
        <img src="/ius.svg" alt="Supported by Indo-US Science and Technology Forum" class="h-16" />
        <img src="/start.svg" alt="Startup India recognized design studio" class="h-16" />
        <img src="/lock.svg" alt="Rolex Awards for Enterprise recognition" class="h-16" />
        <img src="/emp.svg" alt="Empanelment recognition logo" class="h-16" />
        <img src="/FICCI.svg" alt="Federation of Indian Chambers of Commerce & Industry member" class="h-16" />
        <img src="/msme.svg" alt="Registered MSME India" class="h-16" />
        <img src="/au-logo.svg" alt="Andhra University partnership logo" class="h-16" />
        <img src="/cytia.svg" alt="CYTIA recognition logo" class="h-16" />
        <img src="/TiEl.svg" alt="TiE recognition logo" class="h-16" />
        <img src="/bvic.svg" alt="BVIC partner logo" class="h-16" />
        
        <!-- Duplicate set for seamless looping -->
        <img src="/Stanford.svg" alt="Recognized by Stanford Graduate School of Business" class="h-16" />
        <img src="/iit.svg" alt="Science and Technology Innovation award by IIT" class="h-16" />
        <img src="/ius.svg" alt="Supported by Indo-US Science and Technology Forum" class="h-16" />
        <img src="/start.svg" alt="Startup India recognized design studio" class="h-16" />
        <img src="/lock.svg" alt="Rolex Awards for Enterprise recognition" class="h-16" />
        <img src="/emp.svg" alt="Empanelment recognition logo" class="h-16" />
        <img src="/FICCI.svg" alt="Federation of Indian Chambers of Commerce & Industry member" class="h-16" />
        <img src="/msme.svg" alt="Registered MSME India" class="h-16" />
        <img src="/au-logo.svg" alt="Andhra University partnership logo" class="h-16" />
        <img src="/cytia.svg" alt="CYTIA recognition logo" class="h-16" />
        <img src="/TiEl.svg" alt="TiE recognition logo" class="h-16" />
        <img src="/bvic.svg" alt="BVIC partner logo" class="h-16" />
         
      </div>
    </div>
  </div>
  
  <style>
    /* Hide scrollbar but keep functionality */
    .no-scrollbar {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;     /* Firefox */
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;         
    }
  </style>