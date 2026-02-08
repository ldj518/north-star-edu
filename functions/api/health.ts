// Cloudflare Pages Function - Health Check
export const onRequest: PagesFunction = async () => {
  return new Response(JSON.stringify({
    status: 'ok',
    timestamp: new Date().toISOString(),
    models: ['GLM-4-Flash', 'GLM-4V-Flash (Vision)'],
    platform: 'Cloudflare Pages'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
