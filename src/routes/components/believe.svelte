<script>
  // Import your SVG icons
  import { onMount } from "svelte";
  import { onDestroy } from "svelte";
  
  // Determine if we're in mobile view
  let isMobile = false;
  
  // Check screen size on mount and resize
  function checkScreenSize() {
    if (typeof window !== 'undefined') { 
    isMobile = window.innerWidth < 1024;
  }
}
  onMount(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
  });
  
  onDestroy(() => {
    if (typeof window !== 'undefined') {
    window.removeEventListener('resize', checkScreenSize);
    }
  });
  
  const icons = {
    icon1: "./Frame_1.svg",
    icon2: "./Frame_2.svg",
    icon3: "./Frame_3.svg",
    icon4: "./Frame_4.svg",
  };
  
  const images = {
    digitalstethoscope: "./ds2.png",
    digitalstethoscope1: "./ds1-r.png",
    olemus: "./olemus-r.png",
    nutritionScanning: "./mal-r.png",
    hospitalBed: "./bed-r.png",
  };
  
  
  const featuredItems = [
    {
      id: 1,
      iconSrc: icons.icon1,
      title: ["Designing clarity,", "eliminating confusion"],
      description: "Digital Stethoscope ",
      logoPosition: "left",
      imageSrc: images.digitalstethoscope,
      bgColor: "bg-gradient-to-r from-white-50 to-[#a8c0b6]",
      labelPosition: "right-4 bottom-4",
      short_Des: "A modern tool used for pulmonary and heart beat check up"
    },
    {
      id: 2,
      iconSrc: icons.icon2,
      title: ["Shaping the futures,", "refining the present. "],
      description: "Olemus",
      logoPosition: "right",
      imageSrc: images.olemus,
      bgColor: "bg-gradient-to-l from-white to-blue-50",
      labelPosition: "right-10 bottom-10", // Changed from left-10 to right-10
      short_Des: "A point of care device to detect a wide range of biological components with the highest accuracy in less than a minute",
      alignRight: true // Added flag for right alignment
    },
    {
      id: 3,
      iconSrc: icons.icon3,
      title: ["Adding function,", " eliminating clutter"],
      description: "Malnutrition Screening",
      logoPosition: "left",
      imageSrc: images.nutritionScanning,
      bgColor: "bg-gradient-to-l from-gray-100 to-white",
      labelPosition: "right-4 bottom-4",
      short_Des: "A device that detects iodine and haemoglobin in a single device"
    },
    {
      id: 4,
      iconSrc: icons.icon4,
      title: ["Building meaning,", "discarding excess"],
      description: "Hospital Bed",
      logoPosition: "right",
      imageSrc: images.hospitalBed,
      bgColor: "bg-gradient-to-l from-white to-blue-50",
      labelPosition: "right-10 bottom-10",
      short_Des: "Transforming Patient Care with a Revolutionary Modular Bed System",
      alignRight: true
    },
  ];
  
  // Updated mobile featured items based on reference image
  const featuredItemsMobile = [
    {
      id: 1,
      iconSrc: icons.icon1,
      title: ["Designing clarity,", "eliminating confusion"],
      description: "Digital Stethoscope ",
      logoPosition: "center",
      imageSrc: images.digitalstethoscope1,
      bgColor: "bg-blue-50",
      short_Des: "A modern tool used for pulmonary and heart beat check up"
    },
    {
      id: 2,
      iconSrc: icons.icon2,
      title: ["Shaping the futures,", "refining the present. "],
      description: "Olemus",
      logoPosition: "center",
      imageSrc: images.olemus,
      bgColor: "bg-blue-50",
      short_Des: "A point of care device to detect a wide range of biological components with the highest accuracy in less than a minute"
    },
    {
      id: 3,
      iconSrc: icons.icon3,
      title: ["Adding function,", "eliminating clutter"],
      description: "Malnutrition Screening",
      logoPosition: "center",
      imageSrc: images.nutritionScanning,
      bgColor: "bg-blue-50",
      short_Des: "A device that detects iodine and haemoglobin in a single device"
    },
    {
      id: 4,
      iconSrc: icons.icon4,
      title: ["Building meaning,", "discarding excess"],
      description: "Hospital Bed",
      logoPosition: "center",
      imageSrc: images.hospitalBed,
      bgColor: "bg-blue-50",
      short_Des: "Transforming Patient Care with a Revolutionary Modular Bed System"
    },
  ];

  // Statistics data
  const stats = [
    { label: "PROJECTS", value: 70 },
    { label: "CLIENTS", value: 50 },
    { label: "SECTORS", value: 18 },
    { label: "AWARDS", value: 15 },
  ];

  // Initialize animated values
  let animatedValues = stats.map((stat) => ({
    label: stat.label,
    value: 0,
    max: stat.value,
  }));
  let intervals = [];
  let hasAnimated = false;

  // Function to start or restart animation
  function startCountAnimation() {
    // Clear any existing intervals first
    intervals.forEach((interval) => clearInterval(interval));
    intervals = [];

    // Reset all values to 0
    animatedValues = animatedValues.map((stat) => ({ ...stat, value: 0 }));

    // Start new animation
    animatedValues.forEach((stat) => {
      let count = 0;
      const duration = 1500; // Total animation time in ms
      const incrementTime = Math.max(20, Math.min(50, duration / stat.max));

      const interval = setInterval(() => {
        if (count < stat.max) {
          count++;
          // Create a new array to trigger Svelte reactivity
          animatedValues = animatedValues.map((s) =>
            s.label === stat.label ? { ...s, value: count } : s,
          );
        } else {
          clearInterval(interval);
        }
      }, incrementTime);

      intervals.push(interval);
    });

    hasAnimated = true;
  }

  // Function to handle user interaction
  function handleInteraction() {
    startCountAnimation();
  }

  onMount(() => {
    // Start animation on initial load
    startCountAnimation();

    // Clean up intervals when component is destroyed
    return () => {
      intervals.forEach((interval) => clearInterval(interval));
    };
  });
</script>


<div class="grid grid-cols-1 w-full mx-auto bg-white px-6 lg:px-0">
  <h2 class="text-center md:text-left text-3xl font-bold mb-3 pb-20 mt-20 mx-auto md:mx-0 lg:-ml-1">
    We believe in
  </h2>
  
  <div class="lg:ml-0 lg:mr-20">
    <!-- Conditionally render mobile or desktop featured list -->
    {#if isMobile}
      <!-- Updated Mobile Featured List based on reference image -->
      {#each featuredItemsMobile as item}
        <div class="sticky top-20 overflow-hidden rounded-lg h-auto bg-white mb-8 px-5 ">
          <div class="flex flex-col w-full items-center">
            <div class="flex flex-col items-center mb-8">
              <!-- Icon/Logo centered -->
              <img
                src={item.iconSrc}
                alt="Icon"
                class="h-24 w-24 object-contain mb-3"
              />
              <!-- Centered tagline text -->
              <div class="text-center mb-6">
                <h2 class="text-gray-800 text-lg leading-snug">
                  {#each item.title as line}
                    {line}<br />
                  {/each}
                </h2>
              </div>
            </div>
          </div>

          <!-- Featured product card -->
          <div class="relative rounded-lg overflow-hidden {item.bgColor}">
            <!-- "FEATURED" badge in top right -->
            <div class="absolute top-4 right-4 bg-white py-1 px-3 rounded-full text-sm font-medium text-gray-500">
              FEATURED
            </div>
            
            <!-- Main product image -->
            <div class="py-8 px-4 flex justify-center ">
              <img
                src={item.imageSrc}
                alt={item.description}
                class={item.id === 1 ? "object-contain h-full w-full max-h-64 p-6 ml-5 mr-20" : "object-contain h-full w-full p-6"}
              />
            </div>
            
            <!-- Product description footer -->
            <div class="absolute bottom-4 left-4 text-gray-800 ">
              <div class="font-medium text-lg">{item.description}</div>
              <div class="font-medium text-xs">{item.short_Des}</div>
            </div>
          </div>
        </div>
      {/each}
    {:else}
      <!-- Desktop Featured List - Updated for Olemus alignment -->
      {#each featuredItems as item, index}
        <div class="relative overflow-hidden rounded-lg h-120 {item.bgColor} mb-12 lg:mr-15">
          <!-- Featured Tag -->
          <div class="absolute {index % 2 === 0 ? 'top-4 right-4' : 'top-4 left-4'} bg-white text-xl py-1 px-3 text-gray-600 rounded-full tracking-wide">
            FEATURED
          </div>
          
          <div class="flex h-full w-full ">
            <!-- Text column -->
            <div class="flex flex-col justify-center {item.id % 2 === 0 ? 'order-last ml-auto' : 'mr-auto'} w-1/3 px-8 ">  
              <!-- Gradient Icon -->
              <div class="mb-6 ml-20">
                <img
                  src={item.iconSrc}
                  alt="Icon"
                  class="w-35 h-35 object-contain"
                />
              </div>
              <!-- Text - Precisely styled as in reference -->
              <h2 class="text-2xl ml-20 font-medium text-gray-800 leading-relaxed">
                {#each item.title as line, i}
                  {line}<br />
                {/each}
              </h2>
            </div>

            <!-- Image Section -->
            <div class="relative w-2/3 h-120">
              <div class="relative h-full w-full flex items-center justify-center">
                <img
                  src={item.imageSrc}
                  alt={item.description}
                  class={item.id === 1 ? "object-contain h-full w-full p-6 ml-35 -mr-20" : "object-contain h-full w-full p-6"}/>
                  
                
                <!-- Device name and Description label - Updated for Olemus -->
                  {#if item.id === 2} 
                  <!-- Special case for Olemus with specific alignment -->
                  <div class="absolute left-8 bottom-10 text-left text-gray-700 ml-8 bg-gradient-to-r from-zinc-200 via-gray-100 to-gray rounded-lg w-135">
                    <div class="font-semibold text-2xl px-5">{item.description}</div>
                    <div class="font-light text-base px-5">{item.short_Des}</div>
                  </div>
                {:else if item.id === 4}
                  <!-- Special case for Hospital Bed matching Hospital -->
                  <div class="absolute left-8 bottom-5 text-left text-gray-700 ml-5 bg-gradient-to-r from-zinc-200 via-gray-100 to-gray rounded-lg w-135">
                    <div class="font-semibold text-2xl px-5">{item.description}</div>
                    <div class="font-light text-base px-5">{item.short_Des}</div>
                  </div> 
                  {:else if item.id === 1}
                  <!-- Special case for Digital Stethoscope -->
                  <div class="absolute {item.labelPosition} text-right text-gray-700 mr-8 ml-8 bg-gradient-to-l from-zinc-200 via-gray-100 to-gray rounded-lg w-108">
                    <div class="font-semibold text-2xl px-5">{item.description} </div>
                    <div class="font-light text-base px-5">{item.short_Des}</div>
                  </div> 
                
                {:else}
                  <!-- Original positioning for other items -->
                  <!-- <div class="absolute {item.labelPosition} text-gray-700 text-right mr-8 "> -->
                    <div class="absolute {item.labelPosition} text-gray-700 text-right mr-8 bg-gradient-to-l from-gray-200 via-gray-100 to-gray rounded-lg w-112">
                    <div class="font-semibold text-2xl px-5 ">{item.description}</div>
                    <div class="font-light text-base px-5 ">{item.short_Des}</div>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>


<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center mt-15 mb-10 md:mt-0"
  on:click={handleInteraction}
  on:mouseenter={handleInteraction}
  on:focus={handleInteraction}
  tabindex="0"
>
  {#each animatedValues as stat}
    <div class="p-4 rounded-lg lg:mr-28">
      <p class="text-xl md:text-2xl diagonal-gradient p-3 rounded-lg sm:text-base items-center w-32 mx-auto">
        {stat.label}
      </p>
      <br>
      <p class="text-6xl md:text-6xl font-bold mt-2">{stat.value}+</p>
    </div>
  {/each}
</div>

<div class="flex justify-center items-center lg:mb-10 lg:mt-15 lg:mr-18">
  <a href="./work" class="flex items-center text-black text-2xl font-semibold hover:gradient-text">
    View all our projects
    <svg
      class="ml-1 w-7 h-15 "
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M14 5l7 7m0 0l-7 7m7-7H3 "
      ></path>
    </svg>
  </a>
</div>

<style>
  .diagonal-gradient {
    background: linear-gradient(135deg, #b9dff1, #f3c9bd, #f7e6a7);
  }

  .hover\:gradient-text:hover {
    background: linear-gradient(135deg, #B9DFF1, #F3C9BD, #F7E6A7);
    -webkit-background-clip: text; /* For Safari */
    background-clip: text;
    color: transparent; /* Make text color transparent to show gradient */
  }
</style>