<script>
  import { fly } from "svelte/transition";
  import NavBar from "../../components/NavBar.svelte";
</script>

<svelte:head>
  <title>Download CRS Document | INDQ</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<NavBar />

<div
  in:fly={{ duration: 500, y: 250 }}
  class="bg-white min-h-screen px-4 py-24 flex flex-col items-center"
>
  <div class="w-full max-w-lg text-center">
    <h1 class="text-3xl sm:text-4xl font-bold text-black mb-6">
      Customer Requirement Specification
    </h1>

    <p class="text-black mb-8">
      Download the CRS document below, fill it in, and send it back to us by
      replying to the email you received this link in.
    </p>

    <a
      href="/downloads/CRS-INDQ-F51-Customer-Requirement-Specification.docx"
      download
      class="inline-block w-full py-3 px-4 rounded-md text-lg font-semibold text-black diagonal-gradient hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
    >
      Download CRS Document
    </a>

    <p class="text-sm text-gray-500 mt-6">
      Trouble replying to the original email? Send the filled document to
      <a href="mailto:business@indq.in" class="text-blue-600 underline"
        >business@indq.in</a
      >.
    </p>
  </div>
</div>

<style>
  .diagonal-gradient {
    background: linear-gradient(135deg, #b9dff1, #f3c9bd, #f7e6a7);
  }
</style>
