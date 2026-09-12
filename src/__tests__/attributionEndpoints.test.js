/** @jest-environment node */
class Request {
  constructor(url, init) { this.url=url;this.method=init.method;this.body=init.body;const values=Object.fromEntries(Object.entries(init.headers||{}).map(([k,v])=>[k.toLowerCase(),v]));this.headers={get:k=>values[k.toLowerCase()]||null}; }
  async text(){return this.body;}
}
class Response {
  constructor(body, init={}){this.body=body;this.status=init.status||200;this.headers=init.headers;}
  async json(){return JSON.parse(this.body);}
}
global.Request=Request;global.Response=Response;global.crypto=require('crypto').webcrypto;
global.TextEncoder=require('util').TextEncoder;
describe('attribution endpoint boundaries',()=>{
  let sb, chain, captures;
  beforeEach(()=>{
    jest.resetModules();captures=[];
    chain={insert:async v=>{captures.push(v);return {error:null};},update:v=>{captures.push(v);return chain;},eq:()=>chain,gt:()=>chain,is:()=>chain,select:async()=>({data:[{token:'a'.repeat(32)}],error:null})};
    sb={from:()=>chain,rpc:jest.fn(async()=>({data:true,error:null}))};
    jest.doMock('../../supabase/functions/_shared/attribution-server.ts',()=>({
      ...jest.requireActual('../../supabase/functions/_shared/attribution-server.ts'),database:async()=>sb
    }));
    process.env.SUPABASE_SERVICE_ROLE_KEY='admin-secret';
    process.env.TELEGRAM_ATTRIBUTION_BOT_SECRET='bot-secret';
    process.env.TELEGRAM_ATTRIBUTION_ENABLED='true';
  });
  afterEach(()=>{delete process.env.SUPABASE_SERVICE_ROLE_KEY;delete process.env.TELEGRAM_ATTRIBUTION_BOT_SECRET;delete process.env.TELEGRAM_ATTRIBUTION_ENABLED;});
  const request=(body,headers={})=>new Request('https://example.test/',{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)});
  test('public endpoint rejects untrusted origins and never exposes snapshots',async()=>{
    const handler=require('../../supabase/functions/website-attribution/index.ts').default;
    expect((await handler(request({action:'reserve'},{origin:'https://evil.example'}))).status).toBe(403);
    const res=await handler(request({action:'reserve'},{origin:'https://studio.anix-ai.pro'}));
    const data=await res.json();
    expect(data.token).toMatch(/^[a-f0-9]{32}$/);expect(data.capture_key).toMatch(/^[a-f0-9]{64}$/);
    expect(captures[0].capture_key_hash).not.toBe(data.capture_key);
    expect(data.snapshot).toBeUndefined();
  });
  test('disabled integration preserves plain Telegram without reserving tokens',async()=>{
    process.env.TELEGRAM_ATTRIBUTION_ENABLED='false';
    const res=await require('../../supabase/functions/website-attribution/index.ts').default(request({action:'reserve'},{origin:'https://studio.anix-ai.pro'}));
    expect(await res.json()).toEqual({enabled:false});expect(captures).toHaveLength(0);
  });
  test('bot credential cannot provision fields and unauthenticated requests cannot resolve tokens',async()=>{
    const handler=require('../../supabase/functions/attribution-admin/index.ts').default;
    expect((await handler(request({action:'redeem',token:'a'.repeat(32)}))).status).toBe(401);
    expect((await handler(request({action:'provision'},{authorization:'Bearer bot-secret'}))).status).toBe(403);
    expect(sb.rpc).not.toHaveBeenCalled();
  });
  test('rate-limit failure does not create rows',async()=>{
    sb.rpc.mockResolvedValue({data:false});
    const res=await require('../../supabase/functions/website-attribution/index.ts').default(request({action:'reserve'},{origin:'https://studio.anix-ai.pro'}));
    expect(res.status).toBe(429);expect(captures).toHaveLength(0);
  });
});
