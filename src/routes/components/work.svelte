<script>
    import { writable } from "svelte/store";
    import { onMount } from "svelte";
    import GradientText from "./gradient_text.svelte";
    import {
        M_1,
        iconWork_1,
        iconWork_2,
        iconWork_3,
        iconWork_4,
        iconWork_5,
        iconWork_6,
    } from "$lib/assets";

    // Icons mapping
    const iconPaths = {
        All: M_1,
        "Consumer Healthcare": iconWork_1,
        "Therapeutic Devices": iconWork_2,
        "Medical Equipment": iconWork_3,
        "Preliminary Screening": iconWork_4,
        "Diagnostic Devices": iconWork_5,
        "Monitoring Devices": iconWork_6,
    };

    // Stores for projects and filtering
    const projectsData = writable([]);
    const currentFilter = writable("All");
    const isLoading = writable(true);
    const error = writable(null);
    const expandedProject = writable(null);

    // New variables for scroll handling
    let lastScrollTop = 0;
    let isFilterVisible = true;
    let scrollThreshold = 200; // Minimum scroll distance before toggle happens

    // Fetch projects from JSON file
    async function fetchProjects() {
        try {
            // Use fetch to load projects from local JSON file
            const response = await fetch("./project.json");

            if (!response.ok) {
                throw new Error("Failed to fetch projects");
            }

            const projects = await response.json();
            projectsData.set(projects);
            isLoading.set(false);
        } catch (err) {
            error.set(err.message);
            isLoading.set(false);
        }
    }

    // Filter projects
    $: filteredProjects =
        $currentFilter === "All"
            ? $projectsData
            : $projectsData.filter(
                  (project) => project.category === $currentFilter,
              );

    // Handle scroll events
    function handleScroll() {
        const currentScrollTop =
            window.pageYOffset || document.documentElement.scrollTop;

        // Determine scroll direction and distance
        if (Math.abs(lastScrollTop - currentScrollTop) <= scrollThreshold) {
            return; // Not enough scrolling to trigger change
        }

        // Scrolling down
        if (currentScrollTop > lastScrollTop && currentScrollTop > 80) {
            isFilterVisible = false;
        }
        // Scrolling up
        else if (currentScrollTop < lastScrollTop) {
            isFilterVisible = true;
        }

        lastScrollTop = currentScrollTop;
    }

    // Lifecycle method to fetch projects when component mounts
    onMount(() => {
        fetchProjects();

        // Add event listeners
        document.addEventListener("click", handleClickOutside);
        window.addEventListener("scroll", handleScroll);

        return () => {
            // Clean up event listeners
            document.removeEventListener("click", handleClickOutside);
            window.removeEventListener("scroll", handleScroll);
        };
    });

    function selectFilter(category) {
        currentFilter.set(category);
        // Close any expanded project when changing filters
        expandedProject.set(null);
    }
    let savedScrollPosition = 0;
    // Project expansion logic
    function toggleProjectExpand(project) {
        if ($expandedProject === null) {
            // Save current scroll position when opening a project
            savedScrollPosition =
                window.pageYOffset || document.documentElement.scrollTop;
            expandedProject.set(project);
        } else {
            // Restore scroll position when closing
            expandedProject.set(null);
            setTimeout(() => {
                window.scrollTo(0, savedScrollPosition);
            }, 10);
        }
    }

    // Function to close expanded project when clicking outside
    function handleClickOutside(event) {
        const expandedCard = document.querySelector(".expanded-card");
        if (expandedCard && !expandedCard.contains(event.target)) {
            expandedProject.set(null);
        }
    }

    // For mobile dropdown
    let dropdownOpen = false;

    function toggleMobileDropdown() {
        dropdownOpen = !dropdownOpen;
    }
</script>

{#if $isLoading}
    <div class="flex justify-center items-center h-screen">
        <!-- <p>Loading projects...</p> -->
        <GradientText
            class="block lg:hidden"
            default_size="90px"
            mobile_size="45px"
            text="+++"
        />
    </div>
{:else if $error}
    <div class="text-red-500 text-center p-6">
        Error: {$error}
    </div>
{:else if $expandedProject}
    <!-- Background overlay -->
    <div
        class="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-40 flex justify-center items-center p-4"
    >
        <!-- Popup Box -->
        <div
            class="relative bg-white rounded-xl shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto p-8"
        >
            <!-- Close button -->
            <button
                class="absolute top-4 right-4 z-50 bg-white rounded-full p-2 shadow-md"
                on:click|stopPropagation={() => {
                    expandedProject.set(null);
                    setTimeout(() => {
                        window.scrollTo(0, savedScrollPosition);
                    }, 10);
                }}
            >
                <img src="./cross.svg" alt="Close" class="h-6 w-6" />
            </button>

            <!-- Content -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <!-- Left: Product image -->
                <div class="rounded-lg p-6 flex items-center justify-center">
                    <img
                        src={$expandedProject.image}
                        alt={$expandedProject.altText || $expandedProject.name}
                        class="w-full h-auto object-contain max-h-96"
                    />
                </div>

                <!-- Right: Product details -->
                <div class="flex flex-col justify-center">
                    <h2 class="text-4xl font-bold mb-2">
                        {$expandedProject.name}
                    </h2>
                    <span class="highlight-bar"></span>
                    <p class="text-lg mb-4">{$expandedProject.tags}</p>

                    <div class="mb-8">
                        <p class="text-gray-700 mb-6 font-semibold">
                            {$expandedProject.longdescription}
                        </p>
                    </div>
                    <!-- Development stages -->
                    <div class="flex flex-wrap gap-4 mt-6">
                        {#if $expandedProject.developmentStages}
                            {#each $expandedProject.developmentStages as stage}
                                <div
                                    class="px-4 py-2 bg-gray-100 rounded-lg text-gray-800 text-sm font-medium"
                                >
                                    {stage}
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
{:else}
    <div class="container mx-auto px-4 py-8">
        <h1
            class="text-5xl lg:-ml-60 md:text-6xl lg:text-8xl font-bold mb-6 md:mb-4 lg:mb-8 text-left pt-64 md:pt-10 lg:pt-30 pb-64 md:pb-10 lg:pb-30 pl-4 lg:pl-10"
        >
            Innovative & intentional<br />
            <!-- Small screens only: design that + gradient -->
            <p class="block lg:hidden mt-1 md:-mt-2">design that</p>
            <p class="hidden lg:block -mt-4 md:-mt-2 lg:-mt-8 lg:pt-12">
                design that
            </p>
            <p class="">shapes the future</p>
            <GradientText
                class="block lg:hidden"
                default_size="90px"
                mobile_size="45px"
                text="+++"
            />
        </h1>

        <div class="hidden lg:block">
            <h3 class="text-xl text-center mt-20 mb-15">
                Filter Our Projects By Category
            </h3>
            <div class="svg-container text-center mb-15 lg:ml-25">
                <img
                    src="./down_arrow.svg"
                    alt="Down Arrow"
                    class="down-arrow"
                />
            </div>
        </div>

        <div class="container">
            <!-- Filter Icons with scroll-hide functionality -->
            <div
                class="sticky top-10 z-50 bg-gray-50 filter-container rounded-lg"
            >
                <!-- Mobile Dropdown (visible only on small screens) -->
                <div class="lg:hidden mx-4 my-2">
                    <div class="bg-gray-50 rounded-lg">
                        <button
                            class="w-full p-4 flex justify-between items-center"
                            on:click={() => toggleMobileDropdown()}
                        >
                            <span class="font-medium">FILTER BY TYPE</span>
                            <svg
                                class="w-5 h-5 transform transition-transform {dropdownOpen
                                    ? 'rotate-180'
                                    : ''}"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>

                        {#if dropdownOpen}
                            <div class="py-2 flex flex-col items-center">
                                {#each Object.keys(iconPaths) as category}
                                    <button
                                        class="w-full text-center px-4 py-2 hover:bg-gray-100 {$currentFilter ===
                                        category
                                            ? 'gradient-text'
                                            : ''}"
                                        on:click={() => {
                                            selectFilter(category);
                                            toggleMobileDropdown();
                                        }}
                                    >
                                        {category}
                                    </button>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Desktop View (visible only on large screens) -->
                <div
                    class="hidden lg:flex justify-center lg:space-x-6 flex-wrap"
                >
                    {#each Object.keys(iconPaths) as category}
                        <button
                            class="flex flex-col items-center m-2"
                            on:click={() => selectFilter(category)}
                        >
                            <img
                                src={iconPaths[category]}
                                alt={category}
                                class="w-15 h-15"
                            />
                            <span
                                class="text-sm md:text-sm font-semibold hover:gradient-text {$currentFilter ===
                                category
                                    ? 'gradient-text'
                                    : 'text-gray-500'}">{category}</span
                            >
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Projects Grid -->
            <div class="custom-container">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:mt-12">
                    {#each filteredProjects as project (project.id)}
                        <div
                            class="bg-gray-50 rounded-xl overflow-hidden relative"
                        >
                            <!-- Card Preview -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <div
                                class="cursor-pointer"
                                on:click|stopPropagation={() =>
                                    toggleProjectExpand(project)}
                            >
                                <img
                                    src={project.image}
                                    alt={project.altText || project.name}
                                    class="lg:w-180 lg:h-130 object-cover w-full h-[328px] md:h-[364px] responsive-project-img"
                                />

                                <div class="p-6">
                                    <h2
                                        class="text-xl font-bold hover:gradient-text"
                                    >
                                        {project.name}
                                    </h2>
                                    <p class="text-base text-gray-700">
                                        {@html project.description}
                                    </p>
                                    <button
                                        class="absolute bottom-4 right-1 rounded-full p-2 text-amber-400"
                                        on:click|stopPropagation={() =>
                                            toggleProjectExpand(project)}
                                    >
                                        <img
                                            src="./+.png"
                                            alt="Custom Icon"
                                            class=" h-8 w-8"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
{/if}

<!-- svelte-ignore css_unused_selector -->
<style>
    .diagonal-gradient {
        background: linear-gradient(135deg, #b9dff1, #f3c9bd, #f7e6a7);
    }

    .gradient-text {
        background: linear-gradient(135deg, #87b7d7, #e19f8a, #e6cd6c);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        display: inline-block;
        opacity: 1;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .svg-container {
        margin-top: 1rem;
    }

    .down-arrow {
        width: 50px;
        height: auto;
    }

    /* Animation for expanding cards */
    .expanded-card {
        animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    /* Style for the plus-sign buttons in development stages */
    .stage-item {
        transition: transform 0.2s ease;
    }

    .stage-item:hover {
        transform: translateY(-2px);
    }

    /* Styling for the expanded product view */
    .expanded-view {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        overflow-y: auto;
        background-color: white;
    }

    .development-tag {
        background-color: #f1f1f1;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        display: inline-flex;
        align-items: center;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .highlight-bar {
        width: 100px;
        height: 4px;
        /* background: #FFD580; */
        background: linear-gradient(135deg, #b9dff1, #f3c9bd, #f7e6a7);
        margin-bottom: 1rem;
        display: block;
        border-radius: 20px;
    }

    /* Animation for filter visibility */
    .filter-container {
        transition:
            transform 0.3s ease-out,
            opacity 0.3s ease-out;
    }

    .hover\:gradient-text:hover {
        background: linear-gradient(135deg, #b9dff1, #f3c9bd, #f7e6a7);
        -webkit-background-clip: text; /* For Safari */
        background-clip: text;
        color: transparent; /* Make text color transparent to show gradient */
    }
</style>
