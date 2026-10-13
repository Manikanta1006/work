<script>
  // Import your SVG icons
  import { onMount } from "svelte";
  import { onDestroy } from "svelte";
  
  // Determine if we're in mobile view
  let isMobile = false;
  
  // Check screen size on mount and resize
  function checkScreenSize() {
    isMobile = window.innerWidth < 768;
  }
  
  onMount(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
  });
  
  onDestroy(() => {
    window.removeEventListener('resize', checkScreenSize);
  });
  
  const icons = {
    icon1: "./Frame_1.svg",
    icon2: "./Frame_2.svg",
    icon3: "./Frame_3.svg",
    icon4: "./Frame_4.svg",
  };
  
  const images = {
    contactlessCovidScreening: "./covid-r.png",
    olemus: "./olemus-r.png",
    nutritionScanning: "./mal-r.png",
    hospitalBed: "./bed-r.png",
  };
  
  // Desktop featured items
  const featuredItems = [
    {
      id: 1,
      iconSrc: icons.icon1,
      title: ["Designing", "clarity,", "eliminating", "confusion"],
      description: "Contactless Covid Screening",
      logoPosition: "left",
      imageSrc: images.contactlessCovidScreening,
      bgColor: "bg-gradient-to-r from-white via-gray-100 to-gray-200",
      labelPosition: "right-4 bottom-4"
    },
    {
      id: 2,
      iconSrc: icons.icon2,
      title: ["Shaping the", "future,", "refining the", "present."],
      description: "Olemus",
      logoPosition: "right",
      imageSrc: images.olemus,
      bgColor: "bg-gradient-to-l from-white to-blue-50",
      labelPosition: "left-10 bottom-10"
    },
    {
      id: 3,
      iconSrc: icons.icon3,
      title: ["Adding", "function,", "eliminating", "clutter"],
      description: "Innutrition Screening",
      logoPosition: "left",
      imageSrc: images.nutritionScanning,
      bgColor: "bg-gradient-to-l from-gray-100 to-white",
      labelPosition: "right-4 bottom-4"
    },
    {
      id: 4,
      iconSrc: icons.icon4,
      title: ["Building", "meaning,", "discarding", "excess"],
      description: "Hospital Bed",
      logoPosition: "right",
      imageSrc: images.hospitalBed,
      bgColor: "bg-gradient-to-l from-white to-blue-50",
      labelPosition: "left-4 bottom-4"
    },
  ];
  
  // Mobile featured items - kept unchanged
  const featuredItemsMobile = [
    {
      id: 1,
      iconSrc: icons.icon1,
      title: ["Designing Clarity", "eliminating confusion"],
      description: "",
      logoPosition: "left",
      imageSrc: images.contactlessCovidScreening,
      bgColor: "bg-gray-200",
    },
    {
      id: 2,
      iconSrc: icons.icon2,
      title: ["Shaping future", "refining the present."],
      description: "",
      logoPosition: "right",
      imageSrc: images.olemus,
      bgColor: "bg-blue-50",
    },
    {
      id: 3,
      iconSrc: icons.icon3,
      title: ["Adding function", "eliminating clutter"],
      description: "",
      logoPosition: "left",
      imageSrc: "./beat.svg",
      bgColor: "bg-white",
    },
    {
      id: 4,
      iconSrc: icons.icon4,
      title: ["Building meaning", "discarding excess"],
      description: "",
      logoPosition: "right",
      imageSrc: images.hospitalBed,
      bgColor: "bg-blue-100",
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
      console.log(window.innerWidth);
    };
  });
</script>

<div class="grid grid-cols-1 w-full mx-auto bg-white">
  <h2 class="text-center md:text-left text-3xl font-bold mb-3 pb-20 mt-20 mx-auto md:mx-5">
    We believe in
  </h2>
  
  <div class="-ml-24 lg:ml-0 lg:mr-20">
    <!-- Conditionally render mobile or desktop featured list -->
    {#if isMobile}
      <!-- Mobile Featured List - Kept unchanged -->
      {#each featuredItemsMobile as item}
        <div class="sticky top-20 overflow-hidden rounded-lg h-auto bg-white mb-8">
          <!-- Mobile: Top Section with Icon and Text -->
          <div class="flex flex-col w-full">
            <div class="flex flex-col items-center mb-8 pl-24">
              <img
                src={item.iconSrc}
                alt="Icon"
                class="h-24 w-24 object-contain mb-3"
              />
              <div class="text-center mb-6">
                <h2 class="text-gray-800 text-lg leading-snug">
                {#each item.title as line}
                  {line} <br />
                {/each}
              </h2>
            </div>
          </div>

          <!-- Image Section -->
          <div class="relative w-full flex flex-col mx-auto">
            <div class="relative h-120 pl-24 w-full rounded-2xl {item.bgColor}">
              <img
                src={item.imageSrc}
                alt={item.description}
                class="object-contain h-full w-full"
              />
            </div>
          </div>
        </div>
      {/each}
    {:else}
      <!-- Desktop Featured List - Updated with precise layout -->
      {#each featuredItems as item, index}
        <div class="relative overflow-hidden rounded-lg h-120 {item.bgColor} mb-12">
          <!-- Featured Tag -->
          <div class="absolute {index % 2 === 0 ? 'top-4 right-4' : 'top-4 left-4'} text-xl text-gray-600 tracking-wide">
            FEATURED
          </div>
          
          <div class="flex h-full w-full">
            <!-- Text column -->
            <div class="flex flex-col justify-center {item.id % 2 === 0 ? 'order-last ml-auto' : 'mr-auto'} w-1/3 px-8">  
            <!-- Gradient Icon -->
              <div class="mb-6 ml-20">
                <img
                  src={item.iconSrc}
                  alt="Icon"
                  class="w-35 h-35 object-contain"
                />
              </div>
              <!-- Text - Precisely styled as in reference -->
              <h2 class="text-3xl ml-20 font-medium text-gray-800 leading-relaxed">
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
                  class="object-contain h-full w-full p-6"
                />
                
                <!-- Device name and Description label -->
                <div class="absolute {item.labelPosition} text-right text-gray-700">
                  <!-- <div class="font-medium text">{item.description}</div> -->
                  <div class="font-semibold text-2xl"><!-- Increased from text-sm -->{item.description}</div>
                  
                  <div class="text-xs">Description</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>