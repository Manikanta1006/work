import { error, redirect } from "@sveltejs/kit";
import { BACKEND_URL } from "$lib/backendUrl";

export const load = async ({ fetch, url }) => {
  // ?contact=<id> lets Krishna generate an NDA download link tied to a
  // specific lead (org name, contact person) — he gets this link from the
  // internal enquiry-notification email.
  const contactSubmissionId = url.searchParams.get("contact") || undefined;

  const response = await fetch(`${BACKEND_URL}/api/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "nda", contactSubmissionId }),
  });

  if (!response.ok) {
    error(503, "Unable to generate a form link right now. Please try again shortly.");
  }

  const { id } = await response.json();
  if (!id) {
    error(503, "Unable to generate a form link right now. Please try again shortly.");
  }

  redirect(307, `/nda/${id}`);
};
