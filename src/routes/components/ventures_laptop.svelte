<script>
  // @ts-ignore
  import { onMount } from "svelte";
  import gradient_text from "./gradient_text.svelte";
  import { olemusImage, dentoImage, momImage, smileGuide } from "$lib/assets/"; // Import images from assets folder

  // Define the ventures data with their details
  const ventures = [
    {
      id: "olemus",
      name: "Olemus",
      description:
        "Olemus acts as a point of care device with an integrated surface plasmon resonance sensor that detects a wide range of biological components with the highest accuracy in a very short span of time. When combined with ECG, it is a complete foolproof technology to detect MI in biophysical and physicochemical-based methods.",
      image: olemusImage,
      url: "https://olemus.indq.in/",
    },
    {
      id: "dentobot",
      name: "Dentobot",
      description:
        "Dentobot is an advanced dental care robot that utilizes AI-powered diagnostics to identify dental issues with precision. It offers non-invasive treatments and can assist dentists during complex procedures, making dental care more accessible and efficient.",
      image: dentoImage,
      url: "https://dentobot.indq.in/",
    },
    {
      id: "littlemom",
      name: "Little Mom",
      description:
        "Little Mom is an innovative maternal health monitoring system designed to track vital signs and fetal development remotely. It provides real-time data to healthcare providers and offers personalized guidance to expectant mothers throughout their pregnancy journey.",
      image: momImage,
      url: "https://drive.google.com/file/d/1jbA3cBCA_5yhmItmLa4zxdMn8MqrWHzf/view?usp=sharing",
    },
    {
      id: "smileguide",
      name: "Smile Guide",
      description:
        "Connected Dental Ecosystem transform your dental practice with seamless communication, advanced 3D modeling, and centralized case tracking across doctors, patients, manufacturers, and operators.",
      image: smileGuide,
      url: "https://smileguide.in/",
    },
  ];

  let activeVenture = ventures[0];

  function setActiveVenture(ventureId) {
    activeVenture = ventures.find((venture) => venture.id === ventureId);
  }
</script>

<div class="px-4 py-12 bg-white lg:mb-40">
  <h2 class="text-3xl font-bold mb-16 lg:-ml-5">Related Ventures</h2>

  <div class="flex flex-col lg:pl-15 md:flex-row gap-8 lg:mr-26">
    <!-- Left side: Navigation menu and description -->
    <div class="w-full md:w-1/2 flex flex-col">
      <!-- Navigation menu -->
      <div class="mb-8">
        <ul class="space-y-6">
          {#each ventures as venture}
            <li>
              <button
                class="relative text-left lg:text-3xl transition-colors duration-200 focus:outline-none pb-2 hover:gradient-text"
                class:font-bold={activeVenture.id === venture.id}
                class:text-black={activeVenture.id === venture.id}
                class:text-gray-400={activeVenture.id !== venture.id}
                on:click={() => setActiveVenture(venture.id)}
              >
                {venture.name}
                <span
                  class="absolute left-0 bottom-0 w-full h-1 transition-all duration-300 scale-x-0 origin-left opacity-50 rounded-lg diagonal-gradient"
                  class:scale-x-100={activeVenture.id === venture.id}
                ></span>
              </button>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Description section -->
      <div class="rounded-lg flex-grow">
        <p class="text-lg mb-6">
          {activeVenture.description}
        </p>

        <a
          href={activeVenture.url}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center text-black font-medium underline hover:gradient-text"
        >
          Visit the site
          <svg
            class="ml-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
      </div>
    </div>

    <!-- Image -->
    <div class="w-full md:w-1/2 rounded-lg overflow-hidden">
      <img
        src={activeVenture.image}
        alt={`${activeVenture.name} device`}
        class="w-full h-full object-contain p-4"
      />
    </div>
  </div>
</div>

<style>
  .diagonal-gradient {
    background: linear-gradient(135deg, #b9dff1, #f3c9bd, #f7e6a7);
    opacity: 1;
  }

  .hover\:gradient-text:hover {
    background: linear-gradient(135deg, #b9dff1, #f3c9bd, #f7e6a7);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
</style>
