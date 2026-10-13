<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import {P_1, P_2, P_3, plus, minus} from '$lib/assets';

  const sectionsData = {
    discover: {
      icon: P_1,
      title: "Discover",
      content: [
        {
          title: "Context Research",
          checkType: "Checks Actionability",
          items: [
            "Ethnography",
            "Task Flow & Error Analysis",
            "Behaviour & Cognition",
            "Competitive Study"
          ]
        },
        {
          title: "Technological Research",
          checkType: "Checks Feasability",  
          items: [
            "Possible Technologies",
            "Advancements",
            "Algorithms",
            "Mechanisms"
          ]
        },
        {
          title: "User Needs Mapping",
          checkType: "Checks Desirability",  
          items: [
            "Stakeholder Interviews",
            "Empathy Mapping",
            "Value Proposition Mapping"
          ]
        }
      ]
    },
    develop: {
      icon: P_2,
      title: "Develop",
      content: [
        {
          title: "Proof of Concept",
          checkType: "Checks Functionality",
          items: [
            "Addressing Core Features",
            "Unique Selling Proposition",
            "Embedded Systems"
          ]
        },
        {
          title: "Functional Prototype",
          checkType: "Checks Viability",
          items: [
            "Product Conceptualisation",
            "Product Visualisation",
            "Rapid Prototyping",
            "Minimum Viable Product",
            "Ergonomics"
          ]
        },
        {
          title: "Advanced Prototype",
          checkType: "Checks Customisability",
          items: [
            "User-Centred Design",
            "PCB Customisation",
            "Software Integration",
            "Branding & Story"
          ]
        }
      ]
    },
    deliver: {
      icon: P_3,
      title: "Deliver",
      content: [
        {
          title: "Production Ready",
          checkType: "Checks Manufacturability",
          items: [
            "Design for Assembly",
            "Design for Manufacturing",
            "Optimisation of Industry Processes",
            "Cost Reduction",
            "Batch Production",
            "Packaging"
          ]
        },
        {
          title: "Design for Mass Manufacturing",
          checkType: "Checks Scalability",
          items: [
            "Material Selection",
            "Industrial Process Selection",
            "Packaging"
          ]
        },
        {
          title: "Pre-Compliance & Testing",
          checkType: "Checks Reliability",
          items: [
            "Pre-Compliance Testing",
            "Functional Testing",
            "Certification Alignment (CE, FDA, etc.)",
            "Risk Analysis",
            "Documentation for QA/QC"
          ]
        }
      ]
    }
  };

  let expandedSections = {
    discover: false,
    develop: false,
    deliver: false
  };
</script>

<div class="px-6 lg:px-0 max-w-7xl mx-auto w-full">
  <div class="flex flex-col gap-6 w-full mt-8 mb-12 rounded-lg lg:mt-30 lg:-ml-6">
    <h2 class="text-center md:text-left text-3xl font-bold mb-1 pb-4 mt-1 md:ml-0 ml-5">Our Process</h2>
  </div>

  <div class="flex flex-col gap-1 mx-auto mt-6 mb-12 px-6 lg:-ml-5 lg:mr-28 ">
  {#each Object.entries(sectionsData) as [key, section], index}
    <div 
      role="button"
      tabindex="0"
      class="border-b border-gray-100 mb-8 {index === (Object.keys(sectionsData).length - 1) ? 'border-b-0' : ''}"
      on:mouseenter={() => expandedSections[key as keyof typeof expandedSections] = true}
      on:mouseleave={() => expandedSections[key as keyof typeof expandedSections] = false}>

      <!-- <div class="flex lg:flex-row gap-3 lg:gap-3 flex-col justify-between items-center p-6 mb-8 bg-white rounded-lg "> -->
        <div class="flex lg:flex-row gap-3 lg:gap-3 flex-col justify-between items-center p-6  rounded-lg transition-colors duration-300 lg:min-h-[170px]"
        class:bg-gray-50={!expandedSections[key as keyof typeof expandedSections]}
        class:bg-gray-100={expandedSections[key as keyof typeof expandedSections]}>
   
        <div class="flex flex-col md:flex-row items-center md:items-start text-center md:text-left ">
          <div class="mb-2 md:mb-0 md:mr-2 ">
            <img src={section.icon} alt={section.title} class="w-12 h-12 " />
          </div>
          <span class="text-4xl font-bold">{section.title}</span>
        </div>

        <div class="flex gap-2 lg:text-lg text-xl text-center ">
          {#if !expandedSections[key as keyof typeof expandedSections]}
            <div>
              {#each section.content as item}
                <span class="text-gray-700 font-semibold">{item.title}</span><br>
              {/each}
            </div>
          {/if}
        </div>

        <div class="flex justify-center items-center">
          <div class="flex items-center justify-center w-10 h-10 rounded-md relative">
            {#if expandedSections[key as keyof typeof expandedSections]}
              <img src={minus} alt="Collapse" class="w-12 h-2">
            {:else}
              <img src={plus} alt="Expand" class="w-20">
            {/if}
          </div>
        </div>
      </div>

      {#if expandedSections[key as keyof typeof expandedSections]}
        <div in:fly={{ y: -10 }} class="px-6 pb-6 pt-6  lg:pt-6 bg-gray-100 rounded-lg ">
          <div class="grid grid-cols-1 lg:ml-15 md:grid-cols-3 gap-8 justify-items-stretch  w-full ">
            {#each section.content as contentItem}
              <div>
                <div class="mb-4 px-4 py-2 rounded-full diagonal-gradient inline-block text-gray-700">
                  {contentItem.checkType}
                </div>
                <h3 class="text-2xl font-bold mb-4">{contentItem.title}</h3>
                <ul class="space-y-2">
                  {#each contentItem.items as item}
                    <li>+ {item}</li>
                  {/each}
                </ul>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/each}
</div>
</div>

<style>
  .diagonal-gradient {
    background: linear-gradient(135deg, #B9DFF1, #F3C9BD, #F7E6A7);
  }
</style>
