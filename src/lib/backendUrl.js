// indq-backend's live base URL — hardcoded rather than pulled from an env
// var (PUBLIC_BACKEND_URL) so nothing needs to be configured in Vercel's
// project settings. Deployed on AWS Lambda + API Gateway; see
// indq-backend/PROJECT_LOG.md for the full deployment writeup.
//
// If the backend ever moves (new API Gateway, custom domain, etc.), update
// this one constant — every form/page that talks to the backend imports it
// from here.
export const BACKEND_URL = "https://ye49m4unx0.execute-api.ap-south-1.amazonaws.com";
