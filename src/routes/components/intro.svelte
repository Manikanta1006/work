<script>
  import { onMount } from "svelte";
  import GradientText from "./gradient_text.svelte";
  import finalAnimation from '$lib/assets/Final_Animation.mp4';

  let loaded = false;
  let videoLoaded = false;
  let displayText = "";
  let fullText = "Shaping Possibilities.";
  let typingSpeed = 100;
  let typingIndex = 0;

  function typeNextCharacter() {
    if (typingIndex < fullText.length) {
      displayText += fullText[typingIndex];
      typingIndex++;
      setTimeout(typeNextCharacter, typingSpeed);
    } else {
      setTimeout(() => {
        displayText = "";
        typingIndex = 0;
        typeNextCharacter();
      }, 1500);
    }
  }

  onMount(() => {
    loaded = true;
    setTimeout(typeNextCharacter, 500);
  });

  function handleVideoLoaded() {
    videoLoaded = true;
  }
</script>

{#if loaded}
  <div class="min-h-screen w-full bg-white relative overflow-hidden">
    
    <!-- Background Video (always mounted) -->
    <div class="absolute inset-0 z-0">
      <video
        autoplay
        muted
        loop
        onloadeddata={handleVideoLoaded}
        class={`w-full h-full object-cover object-center transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <source src={finalAnimation} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- GradientText loader while video is loading -->
    {#if !videoLoaded}
      <div class="absolute inset-0 flex items-center justify-center z-10 bg-white">
        <GradientText class="block lg:hidden" default_size="90px" mobile_size="45px" text="+++" />
      </div>
    {/if}

    <!-- Content overlay -->
    <div class="relative z-10">
      <div class="h-screen flex items-center justify-center relative">
        <div class="absolute text-center small-screen-style">
          <h1 class="text-3xl sm:text-5xl md:text-5xl tracking-wider text-white -ml-30 lg:mt-135 mt-20">
            {displayText}
            <span class="relative after:content-['|'] after:absolute after:ml-1 after:animate-blink"></span>
          </h1>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @media (max-width: 600px) {
    .small-screen-style {
      top: 50%;
      margin-left: 50%;
      width: auto;
      position: absolute;
    }
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  :global(.animate-blink) {
    animation: blink 1s step-end infinite;
  }
</style>
