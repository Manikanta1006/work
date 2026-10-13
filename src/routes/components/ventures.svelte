<script>
  import { onMount, onDestroy } from 'svelte';
  // import olemusImage from '$lib/assets/olemus.png';
  // import dentoImage from '$lib/assets/dento.svg';
  // import momImage from '$lib/assets/mom.svg';
  import {olemusImage, dentoImage,momImage, smileGuide} from '$lib/assets/'; 

  export let items = [
    {
      id: 1,
      image: olemusImage,
      title: "Olemus",
      content:
        "Olemus acts as a point of care device with an integrated surface plasmon resonance sensor that detects a wide range of biological components with the highest accuracy in a very short span of time. When combined with ECG, it is a complete foolproof technology to detect MI in biophysical and physicochemical-based methods.",
      url: "https://olemus.indq.in/",
    },
    {
      id: 2,
      image: dentoImage,
      title: "Dentobot",
      content:
        "Dentobot designed and developed a novel orthodontic dental braces custom made as per the patient anatomical structure, these are delivered in a revolutionary time right from receiving the patient details to dispatching the bracket set to the consultant orthodontist just takes a day!",
      url: "https://dentobot.indq.in/",
    },
    {
      id: 3,
      image: momImage,
      title: "Little MoM",
      content:
        "Little Mom supports mothers with innovative breastfeeding essentials like breast pumps, nipple creams, and heat pads. Designed for comfort and ease, our products make breastfeeding a smoother, more nurturing experience.",
      url: "https://littlemom.indq.in/",
    },
    {
      id: 4,
      name: 'Smile Guide',
            content:
        "Connected Dental Ecosystem transform your dental practice with seamless communication, advanced 3D modeling, and centralized case tracking across doctors, patients, manufacturers, and operators.",
        image: smileGuide,
      url: 'https://smileguide.in/'
    },
  ];

  let currentIndex = 0;
  let interval;
  
  // Variables for swipe detection
  let touchStartX = 0;
  let touchEndX = 0;
  let minSwipeDistance = 50;

  function next() {
    currentIndex = (currentIndex + 1) % items.length;
  }
  
  function prev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
  }

  function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    // Pause the auto-rotation when user starts touching
    clearInterval(interval);
  }

  function handleTouchMove(event) {
    touchEndX = event.touches[0].clientX;
  }

  function handleTouchEnd() {
    // Calculate swipe distance
    const swipeDistance = touchEndX - touchStartX;
    
    // Check if swipe was long enough
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe right -> go to previous slide
        prev();
      } else {
        // Swipe left -> go to next slide
        next();
      }
    }
    
    // Restart the auto-rotation timer
    clearInterval(interval);
    interval = setInterval(next, 4000);
  }

  onMount(() => {
    interval = setInterval(next, 4000); // auto swipe every 4 seconds

    return () => {
      clearInterval(interval);
    };
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<div class="carousel-container p-4 bg-white max-w-lg">
  <h2 class="text-2xl font-semibold text-center mt-25 mb-15">Related Ventures</h2>

  <div class="carousel relative overflow-hidden rounded-lg ml-1 mr-1"
       on:touchstart={handleTouchStart}
       on:touchmove={handleTouchMove}
       on:touchend={handleTouchEnd}>
    <div class="carousel-indicators flex justify-center mb-4">
      {#each items as _, index}
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <!-- svelte-ignore element_invalid_self_closing_tag -->
        <button
          class="w-3 h-3 rounded-full mx-1 border-2 transition-all duration-100"
          class:border-blue-200={index === 0}
          class:border-orange-200={index === 1}
          class:border-yellow-200={index === 2}
          class:bg-blue-200={index === 0 && index === currentIndex}
          class:bg-orange-200={index === 1 && index === currentIndex}
          class:bg-yellow-200={index === 2 && index === currentIndex}
          class:opacity-200={index === currentIndex}
          class:opacity-100={index !== currentIndex}
          on:click={() => (currentIndex = index)}/>
      {/each}
    </div>
    
    <div class="carousel-items relative">
      {#each items as item, index}
        <div
          class="absolute inset-0 transition-opacity duration-500"
          class:opacity-100={index === currentIndex}
          class:opacity-0={index !== currentIndex}>
          <img
            src={item.image}
            alt={item.title}
            class="w-full h-64 object-cover rounded-md" />

          <div class="bg-white p-6 rounded-b-lg">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-2xl font-bold">{item.title}</h3>
              {#if items[currentIndex]?.url}
              <a
                href={items[currentIndex].url}
                target="_blank"
                class="text-lg font-medium underline text-black hover:text-blue-500"
              >
                Visit the site
              </a>
            {/if}
            </div>
            <p class="text-base black leading-relaxed">{item.content}</p>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Navigation arrows -->
    <button 
      on:click={prev}
      aria-label="Previous slide">
    </button>
    
    <button 
      on:click={next}
      aria-label="Next slide">
    </button>
  </div>
</div>

<style>
  .carousel-container {
    margin: 0 auto;
    position: relative;
  }
  
  .carousel {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
  }
  
  .carousel-items {
    position: relative;
    height: 500px;
  }
</style>