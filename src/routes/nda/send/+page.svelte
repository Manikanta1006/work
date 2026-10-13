<script>
  import NavBar from "../../components/NavBar.svelte";
  import { BACKEND_URL } from "$lib/backendUrl";

  export let data;

  let loading = false;
  let sent = false;
  let errorMessage = "";

  const handleSend = async () => {
    loading = true;
    errorMessage = "";

    try {
      const response = await fetch(`${BACKEND_URL}/api/nda/send-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactSubmissionId: data.contactSubmissionId }),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`);
      }

      sent = true;
    } catch (err) {
      console.error("NDA send failed:", err);
      errorMessage =
        "Something went wrong sending the NDA. Please try again in a moment.";
    } finally {
      loading = false;
    }
  };
</script>

<svelte:head>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<NavBar />

<div class="bg-white min-h-screen px-4 py-24 flex flex-col items-center">
  <div class="w-full max-w-lg">
    <h1 class="text-3xl sm:text-4xl font-bold text-black mb-6">Send NDA</h1>

    {#if sent}
      <div class="rounded-md bg-green-50 border border-green-200 p-6 text-black">
        <p class="font-medium">
          NDA download link sent to {data.contact.email} for {data.contact.name}.
        </p>
      </div>
    {:else}
      <div class="rounded-md bg-gray-100 p-6 text-black space-y-2 mb-6">
        <p><span class="font-semibold">Name:</span> {data.contact.name}</p>
        <p><span class="font-semibold">Email:</span> {data.contact.email}</p>
        {#if data.contact.organizationName}
          <p>
            <span class="font-semibold">Organization:</span>
            {data.contact.organizationName}
          </p>
        {/if}
      </div>

      <p class="text-black mb-6">
        This will email an NDA download link directly to {data.contact.email}
        right now.
      </p>

      {#if errorMessage}
        <p class="text-red-600 mb-4">{errorMessage}</p>
      {/if}

      <button
        type="button"
        disabled={loading}
        on:click={handleSend}
        class="w-full py-3 px-4 rounded-md text-lg font-semibold text-black diagonal-gradient hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
      >
        {loading ? "Sending..." : `Send NDA to ${data.contact.name}`}
      </button>
    {/if}
  </div>
</div>

<style>
  .diagonal-gradient {
    background: linear-gradient(135deg, #b9dff1, #f3c9bd, #f7e6a7);
  }
</style>
