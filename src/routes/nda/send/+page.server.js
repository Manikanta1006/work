import { error } from "@sveltejs/kit";
import { BACKEND_URL } from "$lib/backendUrl";

export const load = async ({ url, fetch }) => {
  const contactSubmissionId = url.searchParams.get("contact");

  if (!contactSubmissionId) {
    error(400, "Missing ?contact= id.");
  }

  const response = await fetch(
    `${BACKEND_URL}/api/contacts/${contactSubmissionId}`
  );

  if (!response.ok) {
    error(response.status === 404 ? 404 : 503, "Couldn't find that contact.");
  }

  const contact = await response.json();

  return { contactSubmissionId, contact };
};
