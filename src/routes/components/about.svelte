<script lang="ts">
  import { linear } from "svelte/easing";
  import NavBar from "./NavBar.svelte";
  import { fade } from "svelte/transition";
  import { goto } from "$app/navigation";
  import GradientText from "./gradient_text.svelte";
  import Ventures from "./ventures.svelte";
  import VenturesLaptop from "./ventures_laptop.svelte";
  import { onMount } from "svelte";
  import { onDestroy } from "svelte";
  import {
    A_2,
    A_3,
    A_4,
    A_5,
    plus,
    minus,
    Govt,
    MSM,
    DPIT,
    ISO,
    R_1,
    R_2,
    R_3,
    R_4,
    R_70,
    R_71,
    R_68,
    R_69,
    M_1,
    M_2,
    M_3,
    M_4,
    Collab_Btn,
  } from "$lib/assets";

  let currentIndex = 0;
  const imageList = [
    { src: A_2, alt: "about_top 1" },
    { src: A_3, alt: "about_top 2" },
    { src: A_4, alt: "about_top 3" },
    { src: A_5, alt: "about_top 4" },
  ];

  function nextSlide() {
    currentIndex = (currentIndex + 1) % imageList.length;
  }

  // Start interval for automatic sliding
  const interval = setInterval(nextSlide, 5000); // Slower slide (5s per image)

  onDestroy(() => {
    clearInterval(interval); // Cleanup interval when component is destroyed
  });
  // Image assets
  let images = [R_70, R_71, R_68, R_69];
  let galleryFiles = [R_1, R_2, R_3, R_4, R_70, R_71, R_68, R_69];

  // Files to display (first 4)
  let visibleFiles = galleryFiles.slice(0, 4);

  function updateDisplayedImages() {
    visibleFiles = [...galleryFiles]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }

  onMount(() => {
    //  images every 3 seconds (3000ms)
    const intervalId = setInterval(updateDisplayedImages, 6000);

    return () => clearInterval(intervalId);
  });

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
  let intervals: number[] = [];
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

  // Accordion section state management
  type SectionKey = "expertise" | "collaboration" | "regulatory" | "impact";

  let expandedSections = {
    expertise: false,
    collaboration: false,
    regulatory: false,
    impact: false,
  };

  function toggleSection(section: SectionKey) {
    expandedSections[section] = !expandedSections[section];
  }

  function handleMouseEnter(section: SectionKey) {
    expandedSections[section] = true;
    expandedSections = { ...expandedSections }; // Trigger reactivity in Svelte
  }

  function handleMouseLeave(section: SectionKey) {
    expandedSections[section] = false;
    expandedSections = { ...expandedSections }; // Trigger reactivity in Svelte
  }

  // Content for each accordion section
  const sectionContent = {
    expertise:
      "With years of dedicated work in MedTech innovation, INDQ has developed a deep understanding of the challenges in medical technology. Our extensive portfolio of cutting-edge medical devices, AI-driven diagnostics, and advanced healthcare solutions reflects our commitment to improving patient outcomes.",
    collaboration:
      "We believe in the power of collaborative innovation. Our team works closely with healthcare professionals, researchers, and industry partners to create solutions that address real clinical needs and improve workflow efficiency.",
    regulatory:
      "Navigating complex regulatory frameworks is critical in healthcare innovation. Our team has expertise in FDA, CE, and international regulatory requirements, ensuring that our solutions meet the highest standards of safety and efficacy.",
    impact:
      "Every innovation we develop is measured by its impact on patient outcomes and healthcare delivery. We focus on creating solutions that demonstrate measurable improvements in clinical results, operational efficiency, and cost-effectiveness.",
  };

  // Icons for various UI elements
  const icons = {
    star: M_1,
    heart: M_2,
    shield: M_3,
    chart: M_4,
    plus: plus,
    minus: "./-.svg",
  };

  // Accordion sections data

  // Function to navigate to contact page
  function navigateToContact() {
    goto("/Contact");
  }

  // Location data
  const locations = [
    {
      city: "Visakhapatnam",
      address: [
        "Andhra Pradesh",
        "MedTech Zone",
        "Campus (AMTZ)",
        "Visakhapatnam",
        "Andhra Pradesh-530031",
      ],
      icon: plus,
      link: "https://g.co/kgs/n2cKFrq",
    },
    // {
    //     city: "Hyderabad",
    //     address: [
    //         "S17, 3rd Floor,",
    //         "Rajapushpa Business Center,",
    //         "Hi-Tech City Hyderabad,",
    //         "Telangana-500084",
    //     ],
    //     icon: plus,
    //     link: "https://g.co/kgs/RjRZwrb"
    // },
    // {
    //     city: "Bengaluru",
    //     address: [
    //         "6th Block",
    //         "Koramangala,",
    //         "Bengaluru,",
    //         "Karnataka-560095",
    //     ],
    //     icon: plus,
    //     link: ""
    // }
  ];

  const accordionSections = [
    {
      key: "expertise",
      title: "Expertise & Experience",
      icon: icons.star,
      content: sectionContent.expertise,
    },
    {
      key: "collaboration",
      title: "Integrated Collaboration",
      icon: icons.heart,
      content: sectionContent.collaboration,
    },
    {
      key: "regulatory",
      title: "Regulatory Excellence",
      icon: icons.shield,
      content: sectionContent.regulatory,
    },
    {
      key: "impact",
      title: "Impact-Driven Approach",
      icon: icons.chart,
      content: sectionContent.impact,
    },
  ];
  let isMobile = false;

  const updateMedia = () => {
    isMobile = window.innerWidth < 768;
  };

  onMount(() => {
    updateMedia();
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });
</script>

<main class="min-h-screen bg-white">
  <!-- Hero Section -->
  <section class="px-4 sm:px-8 md:px-12 lg:py-12 py-24">
    <div class="max-w-4xl">
      <h1
        class="text-6xl sm:text-5xl mt-50 ml-3 mb-35 md:text-6xl lg:text-8xl font-bold lg:ml-28 lg:mt-30 lg:mb-36 mb-6"
      >
        We keep minimalism at the very core of our design philosophy
        <br />
        <GradientText />
      </h1>
    </div>
  </section>
  <div class="flex justify-center mb-1 lg:mb-24 lg:ml-20 lg:mr-20 rounded-lg">
    <div class="slider-container slider">
      {#each imageList as img, index}
        <img
          src={img.src}
          alt={img.alt}
          class={index === currentIndex ? "active" : ""}
        />
      {/each}
    </div>
  </div>

  <!-- About and Vision Section -->
  <!-- <section class="px-4 sm:px-8 md:px-12 py-12 md:py-16 ">      -->
  <section class="px-6 sm:px-8 md:px-12 py-12 md:py-16">
    <div class="w-full max-w-7xl mx-auto">
      <div
        class="mb-12 ml-1 md:mb-24 flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-48"
      >
        <h2
          class="text-2xl md:text-3xl font-bold mb-6 md:mb-0 md:min-w-[200px] self-start lg:ml-18"
        >
          About
        </h2>
        <!-- Small screen version -->
        <p class="text-base font-semibold leading-relaxed max-w-3xl md:hidden">
          We are a team of Industrial Designers, Biomedical, Hardware & Software
          Engineers, Doctors, and Manufacturing & Regulatory Consultants who
          deal with <strong
            >Medical Electronics, Robotics, AI-ML intensive products, Industry
            4.0, and Consumer Electronics.</strong
          >
        </p>
        <!-- Medium and up version -->
        <p
          class="hidden md:block text-base md:text-lg max-w-3xl font-normal leading-relaxed lg:ml-52"
        >
          We are a team of Industrial Designers, Biomedical, Hardware & Software
          Engineers, Doctors, and Manufacturing & Regulatory Consultants who
          deal with <strong
            >Medical Electronics, Robotics, AI-ML intensive products, Industry
            4.0, and Consumer Electronics.</strong
          >
        </p>
      </div>

      <div
        class="mb-24 ml-1 md:mb-32 flex flex-col md:flex-row md:items-start md:gap-12 lg:gap-48"
      >
        <h2
          class="text-2xl md:text-3xl font-bold mb-6 md:mb-0 md:min-w-[200px] self-start lg:ml-18"
        >
          Our Vision
        </h2>
        <!-- Small screen version -->
        <p class="text-base font-semibold leading-relaxed max-w-3xl md:hidden">
          Pioneering smart product solutions that integrate technology with
          everyday needs, making advanced design accessible across industries
          worldwide.
        </p>
        <!-- Medium and up version -->
        <p
          class="hidden md:block text-base md:text-lg max-w-3xl font-normal leading-relaxed lg:ml-52"
        >
          Pioneering smart product solutions that integrate technology with
          everyday needs, making advanced design accessible across industries
          worldwide.
        </p>
      </div>
    </div>

    <!-- Image Gallery -->
    <div
      class="lg:ml-15 lg:mr-15 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-2 ml-1 mr-1"
    >
      {#each visibleFiles as file}
        <div class="flex justify-center">
          <img
            src={file}
            alt="Showcasing our project"
            class="rounded-lg w-full h-[300px] md:h-[400px] object-cover"
          />
        </div>
      {/each}
    </div>
  </section>

  <!-- Stats and Achievements Section -->
  <section class="px-4 sm:px-8 py-12 md:py-16">
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div class="w-full max-w-7xl mx-auto">
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center lg:ml-18 lg:mb-24"
      >
        <div>
          <div>
            <!-- Small screen version -->
            <p class="text-lg leading-relaxed font-normal md:hidden ml-2">
              With a proven track record of <strong
                >75+ impactful MedTech Innovations</strong
              >
              and nearly
              <strong>36+ IPRs</strong>, INDQ has contributed to advancements in
              Neurosurgery, Cardiac Care, Nutraceuticals, and several other
              medical fields.
            </p>
            <!-- Medium and up version -->
            <p class="hidden md:block text-xl leading-relaxed font-normal">
              With a proven track record of <strong
                >75+ impactful <br />MedTech Innovations</strong
              >
              and nearly
              <strong>36+ IPRs</strong>, INDQ <br />has contributed to
              advancements in Neurosurgery,
              <br />Cardiac Care, Nutraceuticals, and several other medical
              fields.
            </p>
            <!-- Small screen version -->
            <p class="text-lg leading-relaxed font-normal mt-4 md:hidden ml-2">
              We take pride in addressing some of the most pressing challenges
              faced by medical practitioners, offering solutions that go beyond
              specific domains through the power of Industrial Design.
            </p>
            <!-- Medium and up version -->
            <p class="hidden md:block text-xl mt-4 leading-relaxed font-normal">
              We take pride in addressing some of the most pressing <br
              />challenges faced by medical practitioners, offering
              <br />solutions that go beyond specific domains through the
              <br />power of Industrial Design.
            </p>
          </div>
        </div>

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="grid grid-cols-2 gap-4 md:gap-6 text-center mt-8 md:mt-0"
          on:click={handleInteraction}
          on:mouseenter={handleInteraction}
          on:focus={handleInteraction}
          tabindex="0"
        >
          {#each animatedValues as stat}
            <div class="p-4 rounded-lg">
              <p
                class="text-xl md:text-xl diagonal-gradient p-3 rounded-lg sm:text-sm w-30 mx-auto"
              >
                {stat.label}
              </p>
              <p class="text-6xl md:text-6xl font-bold mt-2">{stat.value}+</p>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Certifications Section -->
    <div
      class="mt-12 md:mt-16 p-6 md:p-12 rounded-lg flex flex-col items-center text-center bg-gray-100 lg:ml-20 lg:mr-20"
    >
      <div
        class="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl gap-8"
      >
        <!-- Left Section: ISO Logo & Text -->
        <div
          class="flex flex-col md:flex-row items-center text-center md:text-left gap-6 max-w-2xl"
        >
          <img src={ISO} alt="ISO 13485:2016" class="h-20 md:h-24 lg:mr-15" />
          <p class="text-base md:text-lg font-semibold">
            INDQ is ISO 13485 certified, ensuring the
            <br />highest standards of quality, safety, and
            <br />regulatory compliance in MedTech innovation.
          </p>
        </div>
        <!-- Right Section: Registered Under -->
        <div class="flex flex-col items-center w-full md:w-auto">
          <p class="text-lg font-semibold mt-6 md:mt-0">Registered Under</p>
          <div
            class="flex flex-wrap justify-center md:justify-start gap-6 mt-4 lg:ml-10"
          >
            <img src={Govt} alt="CDSCO" class="h-12 md:h-14" />
            <img src={MSM} alt="MSME" class="h-12 md:h-14" />
            <img src={DPIT} alt="DPIIT" class="h-12 md:h-14" />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Accordion Feature Section -->
  <div class="max-w-2xl">
    <h1
      class="text-3xl sm:text-5xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 ml-19 lg:ml-28 lg:mt-36"
    >
      Why Choose INDQ?
    </h1>
  </div>
  <div class="max-w-full mx-auto my-16 px-4 lg:ml-28 lg:mr-28">
    <div class="space-y-4">
      {#each accordionSections as section}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="rounded-lg transition-all duration-300 bg-gray-50"
          on:mouseenter={() => handleMouseEnter(section.key as SectionKey)}
          on:mouseleave={() => handleMouseLeave(section.key as SectionKey)}
        >
          <div
            class="flex items-center justify-between p-6 cursor-pointer rounded-lg transition-colors duration-300"
            class:bg-gray-50={expandedSections[section.key as SectionKey]}
            class:lg:min-h-[100px]={!expandedSections[
              section.key as SectionKey
            ]}
          >
            <!-- Left Icon + Title -->
            <div class="flex items-center space-x-5">
              <div class="lg:w-10 lg:h-10 w-8 h-8 flex-shrink-0">
                <img
                  src={section.icon}
                  alt={section.title}
                  class="w-full h-full"
                />
              </div>
              <h3 class="text-xl lg:text-3xl font-semibold text-black">
                {section.title}
              </h3>
            </div>

            <!-- Plus / Minus Icon -->
            <div class="lg:w-8 lg:h-8 w-6 h-6 opacity-80">
              <img
                src={expandedSections[section.key as SectionKey]
                  ? icons.minus
                  : icons.plus}
                alt="toggle"
                class="w-full h-full transition-transform duration-200"
              />
            </div>
          </div>

          {#if expandedSections[section.key as SectionKey]}
            <div class="px-6 pb-6 pt-2 lg:mt-4 bg-gray-50 rounded-b-lg">
              <p class="text-black text-base lg:text-lg leading-relaxed">
                {sectionContent[section.key as SectionKey]}
              </p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <section class="py-12 md:py-16 px-4 sm:px-8 md:px-16 lg:px-24">
    <!-- Expansion Information -->

    <div class="w-full max-w-7xl mx-auto">
      <div
        class="flex flex-col md:flex-row items-start md:items-center gap-8 xl:gap-32 mb-16 md:mb-24 lg:mt-10"
      >
        <!-- Text Section -->
        <div class="flex-1 px-4 md:px-0">
          <h2 class="text-3xl sm:text-4xl md:text-3xl font-bold mb-6 md:ml-20">
            Beyond healthcare,<br />
            INDQ is expanding into
          </h2>

          <ul class="text-lg md:text-xl space-y-2 lg:ml-30 ml-5">
            <li>Research Labs</li>
            <li>MedTech Industries</li>
            <li>Startup Ecosystems</li>
            <li>Consumer Electronics</li>
            <li>& Universities</li>
          </ul>
        </div>

        <!-- Button Section -->
        <div
          class="flex-shrink-0 flex justify-center md:justify-start md:mr-25"
        >
          <button
            on:click={navigateToContact}
            class="px-6 py-4 flex items-center rounded-lg hover:bg-gray-50 transition-colors duration-200 bg-white w-full md:w-auto"
          >
            <img
              src={Collab_Btn}
              alt="Collaborate with us"
              class="w-70 h-30 md:h-auto md:w-65"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Locations Section -->
    <div>
      <h3
        class="text-3xl md:text-4xl md:w-auto font-bold mb-8 md:mb-12 flex justify-center md:block"
      >
        Find us here
      </h3>
      <div class="flex justify-center md:block">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:ml-46"
        >
          {#each locations as location}
            <a
              href={location.link}
              target="_blank"
              rel="noopener noreferrer"
              class="p-6 md:p-8 rounded-lg transition-all duration-300 transform hover:-translate-y-2"
              aria-label="View details about {location.city}"
            >
              <img
                src={location.icon}
                alt="{location.city} icon"
                class="w-8 h-8 md:w-10 md:h-10 mb-4 md:mb-6"
              />
              <h4 class="text-lg md:text-xl font-bold mb-3">{location.city}</h4>
              <div class="text-sm font-semibold md:text-base text-black mb-6">
                {#each location.address as line}
                  <p>{line}</p>
                {/each}
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          {/each}
        </div>
      </div>
    </div>
  </section>
</main>
<div class="lg:mx-24 mx-2 lg:-mb-36">
  {#if isMobile}
    <Ventures />
  {:else}
    <VenturesLaptop />
  {/if}
</div>

<style>
  .diagonal-gradient {
    background: linear-gradient(135deg, #b9dff1, #f3c9bd, #f7e6a7);
  }

  .slider-container {
    width: calc(100% - 60px);
    height: 300px; /* Adjust height as needed */
    margin-left: auto;
    margin-right: auto;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
  }

  .slider img {
    position: absolute;
    width: 100%;
    height: 300px;
    object-fit: cover;
    opacity: 0;
    transition: opacity 2s ease-in-out; /* Smooth fade transition */
  }
  @media (min-width: 768px) {
    /* Adjust the min-width as needed */
    .slider-container {
      height: 700px; /* Height for large screens */
    }

    .slider img {
      height: 700px; /* Height for large screens */
    }
  }

  .slider img.active {
    opacity: 1;
  }
</style>
