<script>

    import { onMount } from 'svelte';
    
    
    const pageData = {
      title: "BrainGate: A Breakthrough Neural Interface for Paralysis",
      category: "ASSISTIVE TECH",
      
    };
  </script>
  
  <style>
    .diagonal-gradient {
      background: linear-gradient(135deg, #B9DFF1, #F3C9BD, #F7E6A7);
    }
  </style>
  
  <div class="max-w-4xl mx-auto px-4 py-8">

    <div class="mb-4">
      <span class="diagonal-gradient text-gray-800 px-3 py-1 rounded-md text-sm font-medium uppercase shadow-sm">
        {pageData.category}
      </span>
    </div>
    
    <!-- Main Heading -->
    <h1 class="text-4xl md:text-5xl font-bold mb-8 leading-tight">
      {pageData.title}
    </h1>
    
    <!-- Featured Image - Placeholder with checkerboard pattern -->
    <div class="w-full h-80 bg-gray-100 mb-12 grid grid-cols-8" 
         style="background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                                  linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                                  linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                                  linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
                background-size: 40px 40px;
                background-position: 0 0, 0 20px, 20px -20px, -20px 0px;">
    </div>
    
    <!-- Article Content -->
    <div class="prose prose-lg max-w-none">
      <p class="mb-6">
        Burn injuries are among the most challenging wounds to treat. These injuries can cause severe pain, increase the risk of infection, and often result in significant scarring. Traditional treatments like skin grafts and wound dressings, while effective, can be painful and offer imperfect recovery. However, breakthroughs in bioengineering have introduced innovative materials that are transforming the way burns are treated. These cutting-edge solutions offer faster healing, reduced scarring, and better outcomes for patients.
      </p>
      
      <!-- Section: Bio-engineered Materials -->
      <h2 class="text-2xl font-bold mt-10 mb-4">What Are bio-engineered Materials?</h2>
      
      <p class="mb-6">
        bio-engineered materials are specially designed substances that interact with the body's natural processes to promote healing. Often made from biodegradable polymers, natural proteins, or a combination of both, these materials mimic the structure and function of human tissue. By creating an optimal environment for cell regeneration, they support faster and more effective wound healing. These advanced materials can stimulate cell growth, deliver medications directly to the wound site, help repair and reduce inflammation.
      </p>
      
      <!-- Section: Breakthrough Innovations -->
      <h2 class="text-2xl font-bold mt-10 mb-4">Breakthrough Innovations in Burn Treatment</h2>
      
      <p class="mb-6">
        One of the most exciting advancements in this field is the development of sprayable skin grafts. In this technique, bio-engineered materials containing a patient's own skin cells are sprayed directly onto the burn site. Unlike traditional skin grafts, which require surgical procedures and long recovery times, sprayable grafts are minimally invasive and promote rapid healing. Patients treated with this technology have shown significant improvements in recovery time and reduced scarring.
      </p>
      
      <p class="mb-6">
        Another notable innovation is the use of hydro-gel dressings. These dressings are made from water-based polymers that keep wounds moist—a critical factor in speeding up the healing process. Additionally, hydro-gel dressings can deliver medications directly to the wound while providing a protective barrier against infection. The cooling effect of these materials also ensures a more comfortable healing experience for patients.
      </p>
      
      <p class="mb-6">
        Other bio-engineered solutions include scaffold materials, which provide a temporary framework for new skin cells to grow. These scaffolds degrade naturally over time as the body regenerates its own tissue, reducing the need for multiple procedures.
      </p>
      
      <!-- Section: Clinical Success -->
      <h2 class="text-2xl font-bold mt-10 mb-4">Clinical Success and Patient Benefits</h2>
      
      <p class="mb-6">
        Clinical trials and patient studies have shown remarkable results with bio-engineered materials. Burn patients treated with these innovations experience faster healing, less pain, and a lower risk of infection. The long-term benefits are equally promising, as these materials help reduce scarring and improve the overall functionality of the healed skin.
      </p>
    </div>
  </div> 