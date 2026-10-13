
<script lang="ts">
  import { Client, Client_P } from '$lib/assets'; 
  // import Client from '$lib/assets/Clients.svg';
  // import Client_P from '$lib/assets/clients_phone.png';
</script>
  


<section class="clients-section py-12  bg-white">
  <div class="container px-6 lg:px-0">
      <!-- Heading with similar styling to your existing headings -->
      <div class="text-left pl-4 mb-10">
        <!-- <h3 class="text-3xl md:text-3xl font-bold">
          Our Clients<span class="bg-gradient-to-r from-[#B9DFF1] via-[#F3C9BD] to-[#F7E6A7] bg-clip-text text-transparent ml-1">.</span>
        </h3> -->
        <h2 class="text-center md:text-left text-3xl font-bold mb-5 pb-8 lg:-ml-5">Our Clients</h2>
      </div>
      
      <!-- Responsive image display -->
      <div class="flex justify-center max-w-auto  lg:-ml-5">
        <!-- Image for large screens, hidden on small screens -->
        <img 
          src= {Client}
          alt="Medical device design clients and partners of INDQ Studio" 
          class="hidden md:block w-full max-w-6xl  p-6 mb-20  rounded-lg"
        />
        
        <!-- Image for small screens, hidden on large screens -->
        <img 
          src= {Client_P}
          alt="Medical device design clients and partners of INDQ Studio" 
          class="block md:hidden w-full max-w-md  rounded-lg"
        />
    </div>
  </div>
</section>