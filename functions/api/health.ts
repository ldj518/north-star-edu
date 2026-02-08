// Cloudflare Pages Function - Health Check
export const onRequest: PagesFunction<Env> = async (context) => {
  const { GLM_API_KEY } = context.env;
  
  return new Response(JSON.stringify({
    status: 'ok',
    timestamp: new Date().toISOString(),
    models: ['GLM-4-Flash', 'GLM-4V-Flash (Vision)'],
    platform: 'Cloudflare Pages',
    apiConfigured: !!GLM_API_KEY,
    apiKeyType: GLM_API_KEY ? 'GLM-4.7' : 'none'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
