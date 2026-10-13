<script>
  import { ID, prot,SW,EC,PRE,Pro,  iconID, iconprot, iconSW, iconEC, iconPRE, iconPro, icon_G_EC, icon_G_ID, icon_G_PRE, icon_G_Pro, icon_G_SW, icon_G_prot } from '$lib/assets';

  let services = [
    {
      id: "Start",
      icon: iconID,
      alternateIcon: icon_G_ID,
      title: "Industrial Design",
      image: ID,
      altText: "Medical device industrial design and engineering services by INDQ",
      description: "Leveraging AI and machine learning to create intelligent automation, <br /> Predictive analytics, and innovative tech solutions."
    },
    {
      id: "rapid-prototyping",
      icon: iconprot,
      alternateIcon: icon_G_prot,
      title: "Rapid Prototyping",
      image: prot,
      altText: "Medical device rapid prototyping and 3D printing services",
      description: "We offer advanced prototyping services to bring your ideas to life, <br /> Ensuring seamless design iterations and functionality testing."
    }, 
    {
      id: "software-development",
      icon: iconSW,
      alternateIcon: icon_G_SW,
      title: "Software Development",
      image: SW,
      altText: "Medical software and application development",
      description: "Building robust and scalable software solutions tailored to industry needs, <br />From embedded systems to AI-driven applications."
    },
    {
      id: "embedded",
      icon: iconEC,
      alternateIcon: icon_G_EC,
      title: "Embedded Electronics",
      image: EC,
      altText: "Embedded electronics and PCB design for medical devices",
      description: "Designing embedded electronic systems optimized for efficiency, <br />Power consumption, and real-world performance."
    },
    {
      id: "pre-compliance",
      icon: iconPRE,
      alternateIcon: icon_G_PRE,
      title: "Pre Compliance Testing",
      image: PRE,
      altText: "ISO 13485 pre-compliance testing and regulatory support",
      description: "Ensuring regulatory compliance with thorough pre-compliance <br />Testing to prevent certification failures."
    },
    {
      id: "production",
      icon: iconPro,
      alternateIcon: icon_G_Pro,
      title: "Production",
      image: Pro,
      altText: "End-to-end medical product manufacturing and engineering",
      description: "Scalable manufacturing solutions with high precision and quality <br />Assurance to bring your product to market efficiently."
    },
    
  ];
  
  // Default selected service
  let selectedService = services[0];
  
  // Current active section for mobile scrolling
  let activeSection = services[0].id;
  
  // Track which service is showing alternate icon
  let activeServiceId = "Start";
  
  function selectService(service) {
    selectedService = service;
    
    // For desktop: toggle active service for icon change
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      activeServiceId = activeServiceId === service.id ? null : service.id;
    }
    
    // For mobile: scroll to the selected service section
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const element = document.getElementById(`mobile-service-${service.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
  
  // Function to update active section based on scroll position
  function updateActiveSection() {
    if (typeof window === 'undefined' || window.innerWidth >= 768) return;
    
    const scrollPosition = window.scrollY + 200; // Add offset to improve detection
    
    for (let i = 0; i < services.length; i++) {
      const element = document.getElementById(`mobile-service-${services[i].id}`);
      if (!element) continue;
      
      const rect = element.getBoundingClientRect();
      const topPos = rect.top + window.scrollY;
      const bottomPos = topPos + rect.height;
      
      if (scrollPosition >= topPos && scrollPosition < bottomPos) {
        activeSection = services[i].id;
        break;
      }
    }
  }
  
  // Set up event listeners
  if (typeof window !== 'undefined') {
    // Initial check
    window.addEventListener('load', updateActiveSection);
    
    // Update on scroll
    window.addEventListener('scroll', updateActiveSection);
    
    // Update on resize
    window.addEventListener('resize', updateActiveSection);
  }
  export let isMainPage = false;

  $: layoutMargin = isMainPage ? 'lg:mr-17 lg:-ml-12' : 'lg:ml-12 lg:mr-17';
</script>

<!-- svelte-ignore css_unused_selector -->
<style>
  .diagonal-gradient {
    background: linear-gradient(135deg, #B9DFF1, #F3C9BD, #F7E6A7);
  }
  
  /* Mobile layout styles */
  @media (max-width: 767px) {
    .services-container {
      display: flex;
      flex-direction: row;
    }
    
    .sticky-container {
      position: sticky;
      top: 100px;
      height: 100vh;
      align-self: flex-start;
      z-index: 10;
    }
    
    .mobile-tabs {
      width: 75px;
      padding: 10px 0;
      background-color: rgba(255, 255, 255, 0.95);
      border-radius: 8px;
      overflow-y: auto;
    }
    
    .mobile-tab {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px 0;
      cursor: pointer;
      transition: all 0.3s;
      margin-left: -5px;
    }
    
    .icon-container {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      
      
    }
    
    .original-icon {
      width: 32px;
      height: 32px;
      object-fit: contain;
      transition: opacity 0.3s;
    }
    
    .icon-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #B9DFF1, #F3C9BD, #F7E6A7);
      mask-image: var(--icon-url);
      -webkit-mask-image: var(--icon-url);
      mask-size: contain;
      -webkit-mask-size: contain;
      mask-repeat: no-repeat;
      -webkit-mask-repeat: no-repeat;
      mask-position: center;
      -webkit-mask-position: center;
      opacity: 0;
      transition: opacity 0.3s;
    }
    
    .active .icon-mask {
      opacity: 1;
    }
    
    .active .original-icon {
      opacity: 0;
    }
    
    .mobile-content {
      flex: 1;
      padding-left: 15px;
    }
    
    .mobile-service-item {
      margin-bottom: 30px;
      scroll-margin-top: 20px;
      margin-right: 20px;
      margin-left: -20px;
    }
    
    .desktop-grid {
      display: none;
      height: 50px;
    }
    
    .desktop-content {
      display: none;
    }
  }
  .service-item {
      transition: all 1s ease;
      overflow: hidden;
    }
  /* Desktop layout styles */
  @media (min-width: 768px) {
    .mobile-layout {
      display: none;
    }
    
    .desktop-grid {
      display: grid;
    }
    
    .service-item {
      transition: all 1s ease;
      overflow: hidden;
    }
    
    .service-item.active {
    background-color: white;
  }
  
  /* Remove or adjust the hover if needed for better interaction */
  .service-item:hover:not(.active) {
    background-color: #ffffff; /* lighter gray on hover for non-active items */
  }
    
    
    .service-icon {
      transition: all 0.3s ease;
    }
    
    .service-title {
      transition: all 0.3s ease;
      height: 20px;
    }
    
    

  .alternate-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-height: 80px; /* Increased from 64px to 80px */
  padding: 0; /* Remove any padding that might restrict size */
}

  }
</style>


<div class="lg:p-12 bg-white">
  <!-- Services Section -->
  <h2 class="text-center md:text-left text-3xl font-bold mb-6 pb-20 {layoutMargin}">Our Services</h2>
  
  <!-- Desktop Layout -->
  <div class="hidden md:grid desktop-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 {layoutMargin}"> 

    {#each services as service}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
  
        <div
    class="service-item flex flex-col items-center border border-transparent {activeServiceId === service.id ? 'bg-white' : 'bg-gray-200'} p-6 rounded-md cursor-pointer transition-all hover:bg-gray-200"
    on:click={() => selectService(service)}>
        {#if activeServiceId === service.id}
          <img src={service.alternateIcon} alt="Selected" class="alternate-icon" />
        {:else}
          <img src={service.icon} alt={service.altText} class="service-icon w-16 h-16 mb-3 object-fit" />
          <p class="service-title text-center font-medium">{service.title}</p>
        {/if}
      </div>
    {/each}
  </div>
  
  <!-- Dynamic Content Section (Desktop) -->

  <div class="desktop-grid relative mt-6 lg:mt-5 lg:mb-20 block: {layoutMargin}">
    <img
      src={selectedService.image}
      alt={selectedService.altText}
      class="w-full h-125 object-cover rounded-lg transition-all duration-300 shadow-lg"/>
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 rounded-lg">
      <h3 class="text-3xl font-semibold text-white mb-3">{selectedService.title}</h3>
      <p class="text-base text-white/90 max-w-3xl text-xl">{@html selectedService.description}</p>
    </div>
  </div>


  <!-- Mobile Layout -->
  <div class="block md:hidden mobile-layout services-container">
    <!-- Sticky Tabs -->
    <div class="sticky-container">
      <div class="mobile-tabs ">
        {#each services as service}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="mobile-tab flex-shrink-0 p-2  {activeSection === service.id ? ' text-white' : 'bg-gray-50'}"
            on:click={() => selectService(service)}
          >
            <div class="icon-container">
              {#if activeSection === service.id}
                <img 
                  src={service.alternateIcon} 
                  alt={service.altText} 
                  class="w-10 h-10 object-contain"
                />
              {:else}
                <img 
                  src={service.icon || service.icon} 
                  alt={service.altText} 
                  class="w-10 h-10 object-contain"
                />
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
    
    <!-- Mobile Content (All services displayed) -->
    <div class="mobile-content">
      {#each services as service}
        <div id={`mobile-service-${service.id}`} class="mobile-service-item">
          <div class="relative">
            <img
              src={service.image}
              alt={service.altText}
              class="w-full h-100 object-cover rounded-lg transition-all duration-300"
            />
            <div class="absolute bottom-0 left-0 bg-black/40 md:bg-black/70 p-6 w-full text-white rounded-b-lg">
              <h3 class="text-xl font-semibold">{service.title}</h3>
              <p class="text-sm">{@html service.description}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>