const ORIGIN = 'https://studio.anix-ai.pro';
export const ALLOWED_HEADERS = 'content-type, authorization, x-client-info, apikey';
export const CORS = {
  'Access-Control-Allow-Origin': ORIGIN,
  'Access-Control-Allow-Headers': ALLOWED_HEADERS,
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};
