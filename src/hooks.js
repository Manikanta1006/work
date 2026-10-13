/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const response = await resolve(event);
  
  if (!event.url.pathname.startsWith('/api')) {
    response.headers.set('Content-Security-Policy', 
      `default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com;`
    );
  }
  
  return response;
}