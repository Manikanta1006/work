<script>
    import { fade, fly } from "svelte/transition";
    import Contact from "../components/Contact.svelte";

</script>

<svelte:head>
  <title>Contact INDQ | Get in Touch with Our MedTech Design Team</title>
  <meta name="description"
    content="Get in touch with INDQ's product design team in Visakhapatnam, Bengaluru and Hyderabad for medical device design, prototyping and embedded electronics enquiries." />
  <link rel="canonical" href="https://indq.in/Contact" />

  <meta property="og:title" content="Contact INDQ | Get in Touch with Our MedTech Design Team" />
  <meta property="og:description"
    content="Reach INDQ's product design studio in Visakhapatnam, Bengaluru and Hyderabad." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://indq.in/Contact" />
  <meta property="og:site_name" content="INDQ Studio" />
</svelte:head>

<div in:fly={{duration: 500, y: 250}} class="lg:mt-24">
    <Contact/>
</div>
