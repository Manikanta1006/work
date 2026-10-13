<script>
  import { onDestroy } from "svelte";
  import NavBar from "./NavBar.svelte";
  import { fade } from "svelte/transition";
  import GradientText from "./gradient_text.svelte";
  import { goto } from '$app/navigation';
  import { Border, Business, Collab_1, Career, Attach } from '$lib/assets';
  import { BACKEND_URL } from "$lib/backendUrl";

  
  let activeTab = "business"; // Default to business tab, can be 'business', 'collaborate', or 'career'
  // Business Inquiry Form Data
  let businessFormData = {
    name: "",
    email: "",
    contactNumber: "",
    organizationName: "",
    website: "",
    stageOfOrganization: "",
    projectDescription: "",
    services: {
      industrialDesign: false,
      rapidPrototyping: false,
      softwareDevelopment: false,
      embeddedElectronics: false,
      preComplianceTesting: false,
      batchProduction: false,
    },
    projectTimeline: "",
    referralSource: "",
    privacyConsent: false,
  };

  // Collaboration Form Data
  let collaborationFormData = {
    name: "",
    email: "",
    contactNumber: "",
    organizationName: "",
    website: "",
    stageOfOrganization: "",
    natureOfCollaboration: {
      researchLabs: false,
      medTechIndustries: false,
      startupEcosystems: false,
      consumerElectronics: false,
      universities: false,
    },
    referralSource: "",
    privacyConsent: false,
  };

  // Career Form Data
  let careerFormData = {
    name: "",
    email: "",
    contactNumber: "",
    organizationName: "",
    resume: null,
    portfolio: null,
    positionOfInterest: "",
    backgroundExperience: "",
    referralSource: "",
    resumeUrl: "",
    portfolioUrl: "",
    privacyConsent: false,
  };

  let submitError = "";
  let isSubmitting = false;

  // Set once a submission succeeds — swaps the whole tabs+form area for a
  // thank-you screen with an auto-redirect countdown (see below).
  let submittedType = null; // null | "business" | "collaboration" | "career"
  const typeLabels = {
    business: "Business Inquiry",
    collaboration: "Collaboration form",
    career: "Career application",
  };
  const REDIRECT_SECONDS = 5;
  let redirectCountdown = REDIRECT_SECONDS;
  let redirectIntervalId = null;

  const clearRedirectCountdown = () => {
    if (redirectIntervalId) {
      clearInterval(redirectIntervalId);
      redirectIntervalId = null;
    }
  };

  const startRedirectCountdown = () => {
    // The thank-you screen renders right below the nav, but the page is
    // still scrolled to wherever the Submit button was — scroll up so it's
    // actually visible instead of sitting below the fold.
    window.scrollTo({ top: 0, behavior: "smooth" });

    clearRedirectCountdown();
    redirectCountdown = REDIRECT_SECONDS;
    redirectIntervalId = setInterval(() => {
      redirectCountdown -= 1;
      if (redirectCountdown <= 0) {
        clearRedirectCountdown();
        goto("/");
      }
    }, 1000);
  };

  const goHomeNow = () => {
    clearRedirectCountdown();
    goto("/");
  };

  onDestroy(clearRedirectCountdown);

  // Clear a stale error from one tab when switching to another.
  $: if (activeTab) {
    submitError = "";
  }

  const submitContact = async (type, formData) => {
    submitError = "";
    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, ...formData }),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`);
      }

      return true;
    } catch (err) {
      console.error(`${type} submission failed:`, err);
      submitError =
        "Something went wrong submitting the form. Please try again in a moment.";
      return false;
    }
  };

  // Form submission handlers
  const handleBusinessSubmit = async () => {
    if (isSubmitting) return;
    isSubmitting = true;
    try {
      const ok = await submitContact("business", businessFormData);
      if (ok) {
        submittedType = "business";
        startRedirectCountdown();
      }
    } finally {
      isSubmitting = false;
    }
  };

  const handleCollaborationSubmit = async () => {
    if (isSubmitting) return;
    isSubmitting = true;
    try {
      const ok = await submitContact("collaboration", collaborationFormData);
      if (ok) {
        submittedType = "collaboration";
        startRedirectCountdown();
      }
    } finally {
      isSubmitting = false;
    }
  };

  const handleCareerSubmit = async () => {
    if (isSubmitting) return;
    isSubmitting = true;
    try {
      const ok = await submitContact("career", careerFormData);
      if (ok) {
        submittedType = "career";
        startRedirectCountdown();
      }
    } finally {
      isSubmitting = false;
    }
  };

  // Options for dropdown
  const organizationStages = [
    "Ideation / Concept",
    "Seed / Early Stage",
    "Growth Stage",
    "Established Business",
    "Enterprise",
  ];

  // Options for referral sources
  const referralSources = [
    "Referral",
    "Social Media",
    "Website",
    "Event",
    "Other",
  ];

  // Options for timeline
  const timelineOptions = ["3-6 Months", "6-12 Months"];

  // Position options
  const positionOptions = ["Permanent", "Part-time", "Freelance", "Other"];

  
  // Message for resume URL format
  let resumeInfo = "Google Drive, Dropbox, or any other cloud storage link.";
  let portfolioInfo = "Google Drive, Dropbox, or any other cloud storage link.";

  // Handle URL inputs
  const handleResumeUrlChange = (event) => {
    careerFormData.resumeUrl = event.target.value;
  };

  const handlePortfolioUrlChange = (event) => {
    careerFormData.portfolioUrl = event.target.value;
  };

  let isDropdownOpen = false;
  let formSelected = false;

  const options = [
    { id: "business", name: "Business Enquiry" },
    { id: "collaborate", name: "Collaborate" },
    { id: "career", name: "Career" },
  ];

  const toggleDropdown = () => {
    isDropdownOpen = !isDropdownOpen;
  };

  const selectOption = (optionId) => {
    activeTab = optionId;
    isDropdownOpen = false;
    formSelected = true;
  };
  function navigateToPrivacyPolicy() {
    goto('/privacypolicy');
  }
</script>

<NavBar />

{#if isSubmitting}
  <div
    transition:fade={{ duration: 150 }}
    class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white/70 backdrop-blur-sm"
  >
    <span class="spinner spinner-lg" aria-hidden="true"></span>
    <p class="text-black text-lg font-medium">Submitting your enquiry — please wait...</p>
  </div>
{/if}

{#if submittedType}
  <div class="flex flex-col items-center justify-center text-center py-24 px-4 min-h-[60vh]">
    <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
      <svg
        class="w-9 h-9 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
      </svg>
    </div>
    <h2 class="text-3xl sm:text-4xl font-bold text-black mb-3">Thank you!</h2>
    <p class="text-black text-lg mb-2 max-w-md">
      Your {typeLabels[submittedType]} has been submitted. We'll be in touch shortly.
    </p>
    <p class="text-gray-600 mb-8 max-w-md">
      Want to reach us directly instead? Email us at
      <a href="mailto:business@indq.in" class="text-blue-600 underline"
        >business@indq.in</a
      >.
    </p>
    <button
      type="button"
      on:click={goHomeNow}
      class="py-3 px-8 rounded-md text-lg font-semibold text-black diagonal-gradient hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
    >
      Go to Home now
    </button>
    <p class="text-gray-500 text-sm mt-4">
      Redirecting to home in {redirectCountdown}...
    </p>
  </div>
{/if}
{#if !submittedType}
<div class="flex flex-col items-center justify-center px-4 py-8 sm:py-12">
  <!-- Adjusted padding for small screens -->
  <div class="w-full max-w-4xl lg:-ml-42">
    <!-- Heading section -->
    <div class="pt-8 sm:pt-1 pl-7 text-center mt-20 mb-0 sm:mb-12 text-left">
      <!-- Removed bottom margin for small screens -->
      <h1
        class="text-6xl lg:text-8xl lg:font-bold sm:text-9xl md:text-8xl mb-4 leading-tight"
      >
        <!-- Adjusted text size for small screens -->
        Let's build something
        <br />
        meaningful &amp;
        <br />
        impactful together
        <br />
          <div>
            <GradientText />
          </div>
      </h1>
    </div>
  </div>
</div>

<div
  class="bg-white min-h-screen p-6 flex flex-col items-center justify-center"
>
  <div class="max-w-3xl">
    <!-- Small Screen Dropdown -->
    <div class="block lg:hidden w-full px-4 mb-8">
      <div class="relative">
        <button
          type="button"
          class="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex justify-between items-center focus:ring-2 focus:ring-blue-500"
          on:click={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
        >
          <span>
            Filter By Type: {options.find((opt) => opt.id === activeTab)
              ?.name}</span
          >
          <svg
            class={`w-5 h-5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>

        {#if isDropdownOpen}
          <div
            class="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-lg py-1 border border-gray-200"
          >
            {#each options as option}
              <button
                type="button"
                class={`w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 transition ${activeTab === option.id ? "bg-blue-100 font-semibold" : ""}`}
                on:click={() => selectOption(option.id)}
                role="option"
                aria-selected={activeTab === option.id}
              >
                {option.name}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>

  <div class="max-w-15xl">
    <!-- Form Selection Cards -->
    <div class="flex justify-between max-w-4xl gap-4 mx-2 mb-8 hidden lg:flex ">
      <!-- Business Inquiry Card -->

      <button
        type="button"
        class=" rounded-lg p-6 flex flex-col items-center w-75 h-40 cursor-pointer relative {activeTab ===
        'business'
          ? 'active-card'
          : 'hover:bg-gray-50'}"
        on:click={() => (activeTab = "business")}
        on:keydown={(e) => e.key === "Enter" && (activeTab = "business")}
        aria-label="Switch to business enquiry form"
        aria-pressed={activeTab === "business"}
      >
        <div class="flex flex-col items-center justify-center h-screen">
          <div class="mb-4">
            <img src={Business} alt="Custom Icon" class="h-10 w-10" />
          </div>
          <div class="text-lg text-center font-medium text-black hover:gradient-text">
            Business Enquiry
          </div>
        </div>
      </button>

      <!-- Collaborate Card -->
      <button
        type="button"
        class=" rounded-lg p-6 flex flex-col items-center w-75 h-40 cursor-pointer relative {activeTab ===
        'collaborate'
          ? 'active-card'
          : 'hover:bg-gray-50'}"
        on:click={() => (activeTab = "collaborate")}
        aria-label="Switch to collaboration form"
      >
        <div class="flex flex-col items-center justify-center h-screen">
          <div class="mb-4">
            <img src={Collab_1} alt="Custom Icon" class="h-10 w-10" />
          </div>
          <div class="text-lg text-center font-medium text-black hover:gradient-text">
            Collaborate
          </div>
        </div>
      </button>

      <!-- Career Card -->
      <button
        type="button"
        class=" rounded-lg p-6 flex flex-col items-center w-75 h-40 cursor-pointer relative {activeTab ===
        'career'
          ? 'active-card'
          : 'hover:bg-gray-50'}"
        on:click={() => (activeTab = "career")}
        aria-label="Switch to career form"
      >
        <div class="flex flex-col items-center justify-center h-screen">
          <div class="mb-4">
            <img src={Career} alt="Custom Icon" class="h-10 w-10" />
          </div>
          <div class="text-lg text-center font-medium text-black hover:gradient-text">Career</div>
        </div>
      </button>
    </div>

    <!-- Tab-specific taglines -->
    {#if activeTab === "business"}
      <p class="text-black text-left mb-8 text-lg font-semibold">
        Let's bring your vision to life with our expertise in design,
        prototyping, and production.
      </p>
    {:else if activeTab === "collaborate"}
      <p class="text-black text-left mb-8 text-lg font-semibold">
        Partner with us to explore new possibilities and push the boundaries of
        design and technology.
      </p>
    {:else if activeTab === "career"}
      <p class="text-black text-left mb-8 text-lg font-semibold">
        Join our team and shape the future of innovation with creativity and
        passion.
      </p>
    {/if}

    <!-- Business Inquiry Form -->
    {#if activeTab === "business"}
      <form on:submit|preventDefault={handleBusinessSubmit} class="space-y-6">
        <fieldset disabled={isSubmitting} class="space-y-6 disabled:opacity-60 transition-opacity duration-200">
        <!-- Personal Information -->
        <div class="space-y-4">
          <div>
            <label for="business-name" class="block text-lg text-black"
              >Name<span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="business-name"
              bind:value={businessFormData.name}
              required
              class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
            />
          </div>

          <div>
            <label for="business-email" class="block text-lg text-black"
              >Official Email ID<span class="text-red-500">*</span></label
            >
            <input
              type="email"
              id="business-email"
              bind:value={businessFormData.email}
              required
              class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
            />
          </div>

          <div>
            <label for="business-contact" class="block text-lg text-black"
              >Contact Number<span class="text-red-500">*</span></label
            >
            <input
              type="tel"
              id="business-contact"
              bind:value={businessFormData.contactNumber}
              required
              class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
            />
          </div>

          <div>
            <label for="business-org" class="block text-lg text-black"
              >Organization Name<span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="business-org"
              bind:value={businessFormData.organizationName}
              required
              class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
            />
          </div>

          <div>
            <label for="business-website" class="block text-lg text-black"
              >Website (if any)</label
            >
            <input
              type="text"
              id="business-website"
              bind:value={businessFormData.website}
              class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
            />
          </div>

          <div>
            <label for="business-stage" class="block text-lg text-black"
              >Stage of Your Organization<span class="text-red-500">*</span
              ></label
            >
            <select
              id="business-stage"
              bind:value={businessFormData.stageOfOrganization}
              required
              class="mt-1 block w-full px-3 py-2  rounded-md text-black bg-gray-100 focus:outline-none"
            >
              <option value="" disabled selected>Select</option>
              {#each organizationStages as stage}
                <option value={stage}>{stage}</option>
              {/each}
            </select>
          </div>

          <div>
            <label for="business-description" class="block text-lg text-black"
              >Tell us briefly about your project.<span class="text-red-500"
                >*</span
              ></label
            >
            <textarea
              id="business-description"
              bind:value={businessFormData.projectDescription}
              rows="4"
              required
              class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
              placeholder="Write..."
            ></textarea>
          </div>
        </div>

        <!-- Services -->
        <div>
          <p class="block text-lg text-black mb-2">
            What services do you need?<span class="text-red-500">*</span>
          </p>
          <div class="space-y-2">
            <div class="flex items-start">
              <input
                type="checkbox"
                id="industrialDesign"
                bind:checked={businessFormData.services.industrialDesign}
                class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                for="industrialDesign"
                class="ml-2 block text-sm text-black"
              >
                Industrial Design (Product Development, Form Generation, 3D
                Visualization, Ergonomics)
              </label>
            </div>

            <div class="flex items-start">
              <input
                type="checkbox"
                id="rapidPrototyping"
                bind:checked={businessFormData.services.rapidPrototyping}
                class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                for="rapidPrototyping"
                class="ml-2 block text-sm text-black"
              >
                Rapid Prototyping (Quick Iteration, Functional Models, 3D
                Printing, CNC Machining, Refinement)
              </label>
            </div>

            <div class="flex items-start">
              <input
                type="checkbox"
                id="softwareDevelopment"
                bind:checked={businessFormData.services.softwareDevelopment}
                class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                for="softwareDevelopment"
                class="ml-2 block text-sm text-black"
              >
                Software Development (Mobile Applications, Web & Mobile, Cloud
                Solutions, AI ML Integration)
              </label>
            </div>

            <div class="flex items-start">
              <input
                type="checkbox"
                id="embeddedElectronics"
                bind:checked={businessFormData.services.embeddedElectronics}
                class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                for="embeddedElectronics"
                class="ml-2 block text-sm text-black"
              >
                Embedded Electronics (IoT Solutions, Circuit Design, Firmware
                Development, Sensor Integration)
              </label>
            </div>

            <div class="flex items-start">
              <input
                type="checkbox"
                id="preComplianceTesting"
                bind:checked={businessFormData.services.preComplianceTesting}
                class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                for="preComplianceTesting"
                class="ml-2 block text-sm text-black"
              >
                Pre-Compliance Testing (Regulatory Standards, Safety Testing,
                Certification Readiness, Debugging)
              </label>
            </div>

            <div class="flex items-start">
              <input
                type="checkbox"
                id="batchProduction"
                bind:checked={businessFormData.services.batchProduction}
                class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                for="batchProduction"
                class="ml-2 block text-sm text-black"
              >
                Batch Production (Small-Scale Manufacturing, Quality Assurance,
                Assembly, Market-Ready Products)
              </label>
            </div>
          </div>
        </div>

        <!-- Project Timeline -->
        <div>
          <p class="block text-lg text-black mb-2">
            Project Timeline<span class="text-red-500">*</span>
          </p>
          <div class="space-y-2">
            {#each timelineOptions as timeline, i}
              <div class="flex items-center">
                <input
                  type="radio"
                  id={`timeline${i}`}
                  name="businessProjectTimeline"
                  value={timeline}
                  bind:group={businessFormData.projectTimeline}
                  required
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label
                  for={`timeline${i}`}
                  class="ml-2 block text-sm text-black">{timeline}</label
                >
              </div>
            {/each}
          </div>
        </div>

        <div>
          <p class="block text-lg text-black mb-2">
            How did you find us?<span class="text-red-500">*</span>
          </p>
          <div class="space-y-2">
            <select
              name="businessReferralSource"
              bind:value={businessFormData.referralSource}
              required
              class="h-10 w-full px-3 py-2 text-black rounded-md text-black bg-gray-100 focus:outline-none"
            >
              <option value="" disabled selected
                >Select a referral source</option
              >
              {#each referralSources as source}
                <option value={source}>{source}</option>
              {/each}
            </select>
          </div>
        </div>
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="privacy-policy"
              name="privacy-policy"
              type="checkbox"
              bind:checked={businessFormData.privacyConsent}
              required
              class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="privacy-policy" class="font-medium text-black"
              >Privacy Policy Consent<span class="text-red-500">*</span
              ></label
            >
            <p class="text-gray-500">
              I consent to the processing of my personal data according to
              the company's <a href="/privacypolicy" target="_blank"

               class="underline text-blue-500">privacy policy</a>.
            </p>
          </div>
        </div>

        {#if submitError}
          <p class="text-red-600">{submitError}</p>
        {/if}

    <br />
    <div class="flex justify-center">
      <button
        type="submit"
        disabled={isSubmitting}
        class={`w-40 flex justify-center items-center gap-2 py-2 px-4 rounded-md text-lg font-semibold text-black ${businessFormData.privacyConsent ? 'diagonal-gradient' : 'bg-gray-200'} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {#if isSubmitting}
          <span class="spinner" aria-hidden="true"></span>
          Submitting...
        {:else}
          Submit
        {/if}
      </button>
    </div>
        </fieldset>
      </form>
    {/if}

    <!-- Collaboration Form -->
    {#if activeTab === "collaborate"}
      <form
        on:submit|preventDefault={handleCollaborationSubmit}
        class="space-y-6"
      >
        <fieldset disabled={isSubmitting} class="space-y-6 disabled:opacity-60 transition-opacity duration-200">
        <!-- Personal Information -->
        <div class="space-y-4">
          <div>
            <label for="collab-name" class="block text-lg text-black"
              >Name<span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="collab-name"
              bind:value={collaborationFormData.name}
              required
              class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
            />
          </div>

          <div>
            <label for="collab-email" class="block text-lg text-black"
              >Official Email ID<span class="text-red-500">*</span></label
            >
            <input
              type="email"
              id="collab-email"
              bind:value={collaborationFormData.email}
              required
              class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
            />
          </div>

          <div>
            <label for="collab-contact" class="block text-lg text-black"
              >Contact Number<span class="text-red-500">*</span></label
            >
            <input
              type="tel"
              id="collab-contact"
              bind:value={collaborationFormData.contactNumber}
              required
              class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
            />
          </div>

          <div>
            <label for="collab-org" class="block text-lg text-black"
              >Organization Name<span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="collab-org"
              bind:value={collaborationFormData.organizationName}
              required
              class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
            />
          </div>

          <div>
            <label for="collab-website" class="block text-lg text-black"
              >Website (if any)</label
            >
            <input
              type="url"
              id="collab-website"
              bind:value={collaborationFormData.website}
              class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
            />
          </div>

          <div>
            <label for="collab-stage" class="block text-lg text-black"
              >Stage of Your Organization<span class="text-red-500">*</span
              ></label
            >
            <select
              id="collab-stage"
              bind:value={collaborationFormData.stageOfOrganization}
              required
              class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
            >
              <option value="" disabled selected>Select</option>
              {#each organizationStages as stage}
                <option value={stage}>{stage}</option>
              {/each}
            </select>
          </div>
        </div>

        <!-- Nature of Collaboration -->
        <div>
          <p class="block text-lg text-black mb-2">
            Nature of Collaboration<span class="text-red-500">*</span>
          </p>
          <div class="space-y-2">
            <div class="flex items-start">
              <input
                type="checkbox"
                id="researchLabs"
                bind:checked={
                  collaborationFormData.natureOfCollaboration.researchLabs
                }
                class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="researchLabs" class="ml-2 block text-sm text-black">
                Research Labs
              </label>
            </div>

            <div class="flex items-start">
              <input
                type="checkbox"
                id="medTechIndustries"
                bind:checked={
                  collaborationFormData.natureOfCollaboration.medTechIndustries
                }
                class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                for="medTechIndustries"
                class="ml-2 block text-sm text-black"
              >
                MedTech Industries
              </label>
            </div>

            <div class="flex items-start">
              <input
                type="checkbox"
                id="startupEcosystems"
                bind:checked={
                  collaborationFormData.natureOfCollaboration.startupEcosystems
                }
                class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                for="startupEcosystems"
                class="ml-2 block text-sm text-black"
              >
                Startup Ecosystems
              </label>
            </div>

            <div class="flex items-start">
              <input
                type="checkbox"
                id="consumerElectronics"
                bind:checked={
                  collaborationFormData.natureOfCollaboration
                    .consumerElectronics
                }
                class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                for="consumerElectronics"
                class="ml-2 block text-sm text-black"
              >
                Consumer Electronics
              </label>
            </div>

            <div class="flex items-start">
              <input
                type="checkbox"
                id="universities"
                bind:checked={
                  collaborationFormData.natureOfCollaboration.universities
                }
                class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="universities" class="ml-2 block text-sm text-black">
                Universities
              </label>
            </div>
          </div>
        </div>

        <!-- How did you find us -->
        <div>
          <p class="block text-lg text-black mb-2">
            How did you find us?<span class="text-red-500">*</span>
          </p>
          <div class="space-y-2">
            {#each referralSources as source, i}
              <div class="flex items-center">
                <input
                  type="radio"
                  id={`collab-source${i}`}
                  name="collabReferralSource"
                  value={source}
                  bind:group={collaborationFormData.referralSource}
                  required
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label
                  for={`collab-source${i}`}
                  class="ml-2 block text-sm text-black">{source}</label
                >
              </div>
            {/each}
          </div>
        </div>
        <div>
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="privacy-policy"
                name="privacy-policy"
                type="checkbox"
                bind:checked={collaborationFormData.privacyConsent}
                required
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="privacy-policy" class="font-medium text-black"
                >Privacy Policy Consent<span class="text-red-500">*</span
                ></label
              >
              <p class="text-gray-500">
                I consent to the processing of my personal data according to
                the company's <a href="/privacypolicy" target="_blank"

                 class="underline text-blue-500">privacy policy</a>.
              </p>
            </div>
          </div>
      </div>

      {#if submitError}
        <p class="text-red-600">{submitError}</p>
      {/if}

      <br />
      <div class="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          class={`w-40 flex justify-center items-center gap-2 py-2 px-4 rounded-md text-lg font-semibold text-black ${collaborationFormData.privacyConsent ? 'diagonal-gradient' : 'bg-gray-200'} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {#if isSubmitting}
            <span class="spinner" aria-hidden="true"></span>
            Submitting...
          {:else}
            Submit
          {/if}
        </button>
      </div>
        </fieldset>

      </form>
    {/if}

    {#if activeTab === "career"}
      <form on:submit|preventDefault={handleCareerSubmit} class="space-y-6">
        <fieldset disabled={isSubmitting} class="space-y-6 disabled:opacity-60 transition-opacity duration-200">
        <!-- Personal Information -->
        <div class="space-y-4">
          <div>
            <label for="career-name" class="block text-lg text-black"
              >Name<span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="career-name"
              bind:value={careerFormData.name}
              required
              class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
            />
          </div>

          <div>
            <label for="career-email" class="block text-lg text-black"
              >Official Email ID<span class="text-red-500">*</span></label
            >
            <input
              type="email"
              id="career-email"
              bind:value={careerFormData.email}
              required
              class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
            />
          </div>

          <div>
            <label for="career-contact" class="block text-lg text-black"
              >Contact Number<span class="text-red-500">*</span></label
            >
            <input
              type="tel"
              id="career-contact"
              bind:value={careerFormData.contactNumber}
              required
              class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
            />
          </div>

          <div>
            <label for="resume" class="block text-lg text-black"
              >Resume<span class="text-red-500">*</span></label>
            <div class="relative mt-1">
              <input
                type="url"
                id="resume"
                on:input={handleResumeUrlChange}
                placeholder="https://example.com/my-resume"
                value={careerFormData.resumeUrl}
                class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"/>
              <div
                class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <img src={Attach} alt="Link"class="h-5 w-5 text-gray-400"/>
                <!-- Changed from attach.svg to link.svg -->
              </div>
            </div>
            {#if resumeInfo}
              <p class="mt-1 text-sm text-blue-500">{resumeInfo}</p>
            {/if}
          </div>

          <div class="mt-4">
            <label for="portfolio" class="block text-lg text-black"
              >Portfolio/Website</label
            >
            <div class="relative mt-1">
              <input type="url"
                id="portfolio"
                on:input={handlePortfolioUrlChange}
                placeholder="https://example.com"
                value={careerFormData.portfolioUrl}
                class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"/>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <img src={Attach} alt="Link"class="h-5 w-5 text-gray-400"/>
              </div>
            </div>
            {#if portfolioInfo}
            <p class="mt-1 text-sm text-blue-500">{portfolioInfo}</p>
          {/if}
          </div>

          <br />
          <!-- Position Details -->
          <div class="space-y-4">
            <div>
              <label for="career-position" class="block text-lg text-black"
                >Position Applied For<span class="text-red-500">*</span></label
              >
              <select
                id="career-position"
                bind:value={careerFormData.position}
                required
                class="mt-1 block w-full px-3 py-2  rounded-md text-black bg-gray-100 focus:outline-none"
              >
                <option value="" disabled selected>Select a position</option>
                <option value="software-engineer">Internship</option>
                <option value="data-scientist">Full-Time</option>
                <option value="product-manager">Freelance</option>
                <option value="other">Other</option>
              </select>
            </div>

            {#if careerFormData.position === "other"}
              <div>
                <label
                  for="career-other-position"
                  class="block text-lg text-black"
                  >Specify Position<span class="text-red-500">*</span></label
                >
                <input
                  type="text"
                  id="career-other-position"
                  bind:value={careerFormData.otherPosition}
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-gray-100 focus:outline-none"
                />
              </div>
            {/if}

            <div>
              <label for="career-experience" class="block text-lg text-black"
                >Years of Experience<span class="text-red-500">*</span></label
              >
              <input
                type="number"
                id="career-experience"
                bind:value={careerFormData.experience}
                min="0"
                step="0.5"
                required
                class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label for="career-skills" class="block text-lg text-black"
                >Key Skills</label
              >
              <textarea
                id="career-skills"
                bind:value={careerFormData.skills}
                rows="3"
                placeholder="List your key skills separated by commas"
                class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label for="career-cover-letter" class="block text-lg text-black"
                >Cover Letter</label
              >
              <textarea
                id="career-cover-letter"
                bind:value={careerFormData.coverLetter}
                rows="5"
                placeholder="Tell us why you're interested in this position and what you can bring to our team"
                class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
              ></textarea>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="space-y-4">
            <div>
              <label for="career-source" class="block text-lg text-black"
                >How did you hear about us?<span class="text-red-500">*</span
                ></label
              >
              <select
                id="career-source"
                bind:value={careerFormData.source}
                required
                class="mt-1 block w-full px-3 py-2 rounded-md text-black bg-gray-100 focus:outline-none"
              >
                <option value="" disabled selected>Select an option</option>
                <option value="job-portal">Job Portal</option>
                <option value="company-website">Company Website</option>
                <option value="linkedin">LinkedIn</option>
                <option value="referral">Employee Referral</option>
                <option value="other">Other</option>
              </select>
            </div>

            {#if careerFormData.source === "referral"}
              <div>
                <label for="career-referral" class="block text-lg text-black"
                  >Referred by (Employee Name)<span class="text-red-500">*</span
                  ></label
                >
                <input
                  type="text"
                  id="career-referral"
                  bind:value={careerFormData.referralName}
                  required
                  class="mt-1 block w-full px-3 py-2  rounded-md text-black bg-gray-100 focus:outline-none"
                />
              </div>
            {/if}

            {#if careerFormData.source === "other"}
              <div>
                <label
                  for="career-other-source"
                  class="block text-lg text-black"
                  >Please specify<span class="text-red-500">*</span></label
                >
                <input
                  type="text"
                  id="career-other-source"
                  bind:value={careerFormData.otherSource}
                  required
                  class="mt-1 block w-full px-3 py-2 border rounded-md text-black bg-gray-100 focus:outline-none"
                />
              </div>
            {/if}

            <div>
              <!-- svelte-ignore a11y_label_has_associated_control -->
              <label class="block text-lg text-black">
                Are you willing to relocate if needed?</label >
              <div class="mt-2 space-x-4 flex items-center">
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    name="relocation"
                    value="yes"
                    bind:group={careerFormData.willingToRelocate}
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-black">Yes</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    name="relocation"
                    value="no"
                    bind:group={careerFormData.willingToRelocate}
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-black">No</span>
                </label>
              </div>
            </div>

            <div>
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="privacy-policy"
                name="privacy-policy"
                type="checkbox"
                bind:checked={careerFormData.privacyConsent}
                required
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="privacy-policy" class="font-medium text-black"
                >Privacy Policy Consent<span class="text-red-500">*</span
                ></label
              >
              <p class="text-gray-500">
                I consent to the processing of my personal data according to
                the company's <a href="/privacypolicy" target="_blank" 
                
                 class="underline text-blue-500">privacy policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {#if submitError}
        <p class="text-red-600">{submitError}</p>
      {/if}

      <br />
      <div class="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          class={`w-40 flex justify-center items-center gap-2 py-2 px-4 rounded-md text-lg font-semibold text-black ${careerFormData.privacyConsent ? 'diagonal-gradient' : 'bg-gray-200'} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {#if isSubmitting}
            <span class="spinner" aria-hidden="true"></span>
            Submitting...
          {:else}
            Submit
          {/if}
        </button>
      </div>
        </div>
        </fieldset>
      </form>
    {/if}
  </div>
</div>
{/if}
<style>
  .diagonal-gradient {
    background: linear-gradient(135deg, #b9dff1, #f3c9bd, #f7e6a7);
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(0, 0, 0, 0.25);
    border-top-color: #1a1a1a;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  .spinner-lg {
    width: 40px;
    height: 40px;
    border-width: 3px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .active-card {
    position: relative;
    border: none !important;
    z-index: 1;
  }
  .active-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("/border.svg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    z-index: -1;
    padding: 0;
  }

  .hover\:gradient-text:hover {
    background: linear-gradient(135deg, #B9DFF1, #F3C9BD, #F7E6A7);
    -webkit-background-clip: text; /* For Safari */
    background-clip: text;
    color: transparent; /* Make text color transparent to show gradient */
  }
</style>
