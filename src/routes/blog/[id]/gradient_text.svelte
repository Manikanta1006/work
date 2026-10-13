<script>
  import { onMount, onDestroy } from 'svelte';
  import CursorSVG from '$lib/assets/cursor.svg';
  // Props with default values
  export let text = "+++"; // Default text is three plus signs
  export let typingSpeed = 150; // Milliseconds between characters
  export let startDelay = 500; // Delay before typing starts
  export let cursorBlinkSpeed = 530; // Cursor blink speed in ms
  export let mobileSize = "4rem"; // Size for mobile devices
  export let desktopSize = "10rem"; // Size for desktop devices
  export let repeat = true; // Whether to repeat the animation
  export let repeatDelay = 1000; // Delay before repeating animation
  export let gradientColors = ["#B9DFF1", "#F3C9BD", "#F7E6A7"]; // Gradient colors
  export let gradientAngle = "135deg"; // Gradient angle
  export let default_size ;
  export let mobile_size;


  let displayedText = "";
  let showCursor = true;
  let typingComplete = false;
  let typingInterval;
  let cursorInterval;
  let repeatTimeout;
  let windowWidth;
  
  
  // Reactive declaration to determine current size based on window width
  $: currentSize = windowWidth <= 768 ? mobileSize : desktopSize;
  
  // Computed gradient style
  $: gradientStyle = `background: linear-gradient(${gradientAngle}, ${gradientColors.join(', ')});
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: bold;`;
  
  onMount(() => {
    // Get initial window width
    if (typeof window !== 'undefined') {
      windowWidth = window.innerWidth;
    }
    
    // Start the typing animation after the specified delay
    setTimeout(startTyping, startDelay);
    
    // Set up cursor blinking
    cursorInterval = setInterval(() => {
      showCursor = !showCursor;
    }, cursorBlinkSpeed);
  });
  
  onDestroy(() => {
    // Clean up all intervals and timeouts
    clearInterval(cursorInterval);
    clearInterval(typingInterval);
    clearTimeout(repeatTimeout);
  });
  
  function startTyping() {
    // Reset state for new typing sequence
    displayedText = "";
    typingComplete = false;
    let currentIndex = 0;
    
    // Clear any existing interval
    if (typingInterval) clearInterval(typingInterval);
    
    typingInterval = setInterval(() => {
      // Add the next character
      displayedText += text[currentIndex];
      currentIndex++;
      
      // Stop when all characters are typed
      if (currentIndex >= text.length) {
        clearInterval(typingInterval);
        typingComplete = true;
        
        // Set up repeat if enabled
        if (repeat) {
          repeatTimeout = setTimeout(() => {
            startTyping();
          }, repeatDelay);
        }
      }
    }, typingSpeed);
  }
  
  // Handle window resize
  function handleResize() {
    windowWidth = window.innerWidth;
  }
  </script>
  
  <style>
  .typing-container {
    display: inline-block;
    position: relative;
    font-family: monospace;
    line-height: 1;
  }
  
  .text-container {
  
    display: inline-block;
   
    /* Pre-allocate space for the full text to prevent layout shifts */
   
  }
  
  .gradient-text {
    display: inline-block;
    background-color: #000;
  }
  
  .invisible-text {
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    white-space: pre;
  }
  
  .cursor {
    display: inline-block;
    width: 0.01em;
    background-color: #000;
    vertical-align: middle;
    max-height: 2rem;
  }
  
  .cursor.blink {
    animation: blink 1s step-end infinite;
  }
  
  @keyframes blink {
    from, to { opacity: 1; }
    50% { opacity: 0; }
  }
  
  /* Responsive styles using CSS variables */
  @media (max-width: 668px) {
    .mobile-size {
      font-size: var(--mobile-size);
    }
  }
  
  @media (min-width: 765px) {
    .desktop-size {
      font-size: var(--desktop-size);
    }
  }
  .invisible-text {
  visibility: hidden;
  white-space: pre;
  display: inline-block;

  
}
  </style>
  
  <svelte:window on:resize={handleResize}/>
  
  <div class="typing-container">
    <!-- Container with pre-allocated space -->
    <div 
      class="text-container mobile-size desktop-size"
      style="--full-text-width: {text.length}ch; --mobile-size: {mobileSize}; --desktop-size: {desktopSize};">
    
   
      <div class="relative inline-block align-top">
        <!-- Invisible full text to preserve layout space -->
        <span class="absolute opacity-0 pointer-events-none whitespace-pre gradient-text mobile-size desktop-size"
         style="{gradientStyle}; --mobile-size: {mobileSize}; --desktop-size: {desktopSize};">
          {text}
        </span>
        <!-- Visible animated text with gradient -->
        <span
          class="gradient-text mobile-size desktop-size"
          style="{gradientStyle} --mobile-size: {mobileSize}; --desktop-size: {desktopSize}; ">
          {displayedText}
        </span>
          
      </div>
    </div>
    
    {#if !typingComplete || showCursor}
      <!-- <span
        class="cursor mobile-size desktop-size "
        class:blink={typingComplete}
        style="height: {default_size};"
      ></span> -->
      <img
    src={CursorSVG}
    alt="cursor"
    class="inline-block align-top h-[0.5em] w-auto m-0 pt-10" 
    style="height: {currentSize}; width: auto; align-top"
  />
    {/if}
  </div>