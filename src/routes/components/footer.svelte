<script>
  import { goto } from "$app/navigation";
  import { logo, Govt, MSM, DPIT, ISO, Linkedin, Fb, Insta } from "$lib/assets";
  import privacypolicy from "./privacypolicy.svelte";

  const socialLinks = [
    {
      href: "https://www.linkedin.com/company/indq/",
      icon: Linkedin,
      alt: "LinkedIn",
    },
    { href: "https://www.facebook.com/indq.in/", icon: Fb, alt: "Facebook" },
    {
      href: "https://www.instagram.com/indq_studio/",
      icon: Insta,
      alt: "Instagram",
    },
  ];
</script>

<div
  class="bg-gray-100 p-8 flex flex-col lg:flex-row justify-between items-start text-xl"
>
  <!-- Left Section -->
  <div class="space-y-5 lg:ml-28">
    <a href="/" class="cursor-pointer">
      <img
        src={logo}
        alt="INDQ Medical Device Design Company Logo"
        class="lg:mb-10 h-19 -ml-3"
      />
    </a>
    <div class="flex space-x-3">
      {#each socialLinks as link}
        <a href={link.href} target="_blank" rel="noopener noreferrer">
          <img
            src={link.icon}
            alt={link.alt}
            class="h-12 w-12 hover:opacity-75"
          />
        </a>
      {/each}
    </div>

    <div class="flex items-center space-x-3 lg:mt-12">
      <img
        src={ISO}
        alt="ISO 13485:2016 Certified Medical Device Design Studio"
        class="h-18"
      />
      <p>ISO 13485:2016<br />certified company</p>
    </div>
    <p class="font-semibold text-lg lg:mt-10">Registered Under</p>
    <div class="flex flex-wrap items-center gap-3 bg-gray-100">
      <img
        src={Govt}
        alt="Make in India initiative supporter - INDQ"
        class="h-12"
      />
      <img
        src={MSM}
        alt="Registered MSME (Micro, Small and Medium Enterprises) India"
        class="h-12"
      />
      <img
        src={DPIT}
        alt="DPIIT Recognized Startup by Government of India"
        class="h-12"
      />
    </div>
  </div>

  <!-- Studio Section -->
  <div class="pt-5 lg:mr-23">
    <h2 class="text-3xl font-semibold">STUDIO</h2>
    <br />
    <div class="flex flex-col text-md space-y-4 f">
      <p>
        Andhra Pradesh MedTech Zone<br /> Campus (AMTZ)Visakhapatnam, <br /> Andhra
        Pradesh - 530 031
      </p>
      <h2 class="pt-5 text-3xl font-semibold font-bold">SERVICES</h2>
    <div class="text-lg">
      <p>
        <a
          href="/services"
          class="hover:gradient-text hover:underline transition-colors"
          >Industrial Design</a
        >
      </p>
      <p>
        <a
          href="/services"
          class="hover:gradient-text hover:underline transition-colors"
          >Rapid Prototyping</a
        >
      </p>
      <p>
        <a
          href="/services"
          class="hover:gradient-text hover:underline transition-colors">Software Development</a
        >
      </p>
      <p>
        <a
          href="/services"
          class="hover:gradient-text hover:underline transition-colors">Embedded Electronics</a
        >
      </p>
      <p>
        <a
          href="/services"
          class="hover:gradient-text hover:underline transition-colors"
          >Pre Compliance Testing</a
        >
      </p>
      <p>
        <a
          href="/services"
          class="hover:gradient-text hover:underline transition-colors"
          >Production</a
        >
      </p>
    </div>
    </div>
  </div>

  

  <!-- Contact Section -->
  <div class="pt-4 lg:mr-40 flex flex-col">
    <h2 class="text-3xl font-semibold font-bold">CONTACT</h2>

    <div class=" text-xl font-semibold">
      <p>
        Business Enquiries<br /><a
          href="mailto:business@indq.in"
          class="text-black underline underline-offset-2 decoration-blue-500"
          >business@indq.in</a
        >
      </p>
      <p>
        Careers<br /><a
          href="mailto:join@indq.in"
          class="text-black underline underline-offset-2 decoration-blue-500"
          >join@indq.in</a
        >
      </p>
      <br />
    </div>

    <h2 class="pt-5 text-3xl font-semibold font-bold">SITEMAP</h2>
    <div class="text-lg">
      <p>
        <a
          href="/work"
          class="hover:gradient-text hover:underline transition-colors"
          >Projects</a
        >
      </p>
      <p>
        <a
          href="/services"
          class="hover:gradient-text hover:underline transition-colors"
          >Services</a
        >
      </p>
      <p>
        <a
          href="/about"
          class="hover:gradient-text hover:underline transition-colors">About</a
        >
      </p>
      <p>
        <a
          href="/main_blog"
          class="hover:gradient-text hover:underline transition-colors">Blogs</a
        >
      </p>
      <p>
        <a
          href="/Contact"
          class="hover:gradient-text hover:underline transition-colors"
          >Connect</a
        >
      </p>
      <p>
        <a
          href="/privacypolicy"
          class="hover:gradient-text hover:underline transition-colors"
          >Privacy Policy</a
        >
      </p>
    </div>
  </div>
</div>
<div class="text-center text-sm text-gray-600 bg-gray-100">
  <p>© Copyright 2025 <strong>INDQ Studio</strong>. All Rights Reserved</p>
  <p>Designed by INDQ Studio</p>
</div>

<style>
  .hover\:gradient-text:hover {
    background: linear-gradient(135deg, #b9dff1, #f3c9bd, #f7e6a7);
    -webkit-background-clip: text; /* For Safari */
    background-clip: text;
    color: transparent; /* Make text color transparent to show gradient */
  }
</style>
