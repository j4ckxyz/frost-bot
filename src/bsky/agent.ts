// src/bsky/agent.ts
import { AtpAgent } from "@atproto/api";
import { CUSTOM_PDS_URL, DEFAULT_PDS_URL } from "../config/index.js";

// Determine which PDS to use
const pdsUrl = CUSTOM_PDS_URL || DEFAULT_PDS_URL;
console.log(`[INFO] Initializing agent with PDS: ${pdsUrl}`);

const agent = new AtpAgent({ service: pdsUrl });

const identifier = process.env.BSKY_IDENTIFIER!;
// Backward compatibility: support legacy BSKY_PASSWORD as fallback
const password = (process.env.BSKY_APP_PASSWORD || process.env.BSKY_PASSWORD)!;
let accessJwt: string | null = null;
let refreshJwt: string | null = null;

/**
 * Auto-discover PDS for a given identifier
 */
async function discoverPDS(identifier: string): Promise<string> {
  try {
    // If identifier is a domain (custom PDS), try it directly
    if (identifier.includes('.') && !identifier.includes('@')) {
      const pdsUrl = `https://${identifier}`;
      console.log(`[INFO] Trying custom PDS: ${pdsUrl}`);
      return pdsUrl;
    }
    
    // If identifier is a handle, try to resolve it
    if (identifier.includes('.')) {
      const response = await fetch(`https://${identifier}/.well-known/atproto-did`);
      if (response.ok) {
        const did = await response.text();
        console.log(`[INFO] Resolved DID: ${did}`);
        
        // Get DID document to find PDS
        const didDocResponse = await fetch(`https://plc.directory/${did}`);
        if (didDocResponse.ok) {
          const didDoc = await didDocResponse.json();
          const pdsEndpoint = didDoc.service?.find((s: any) => s.type === 'AtprotoPersonalDataServer')?.serviceEndpoint;
          if (pdsEndpoint) {
            console.log(`[INFO] Discovered PDS: ${pdsEndpoint}`);
            return pdsEndpoint;
          }
        }
      }
    }
    
    // Fallback to default PDS
    return DEFAULT_PDS_URL;
  } catch (error) {
    console.warn(`[WARN] PDS discovery failed for ${identifier}:`, error);
    return DEFAULT_PDS_URL;
  }
}

/**
 * Initialize agent with PDS discovery
 */
export async function initAgent() {
  try {
    // If custom PDS is not specified, try to discover it
    if (!CUSTOM_PDS_URL) {
      const discoveredPDS = await discoverPDS(identifier);
      if (discoveredPDS !== pdsUrl) {
        console.log(`[INFO] Switching to discovered PDS: ${discoveredPDS}`);
        // Create new agent with discovered PDS
        const newAgent = new AtpAgent({ service: discoveredPDS });
        Object.setPrototypeOf(agent, Object.getPrototypeOf(newAgent));
        Object.assign(agent, newAgent);
      }
    }
    
    const response = await agent.login({ identifier, password });
    accessJwt = response.data.accessJwt;
    refreshJwt = response.data.refreshJwt;
    console.log(`[INFO] Created new session with PDS: ${agent.service}`);
  } catch (error) {
    console.error(`[ERROR] Failed to initialize agent:`, error);
    throw error;
  }
}

/**
 * トークンの期限チェックと更新
 */
export async function createOrRefreshSession() {
  if (!accessJwt && !refreshJwt) {
    await initAgent();
    return;
  }

  try {
    await agent.getTimeline();  // 成功すればそのまま
  } catch (err: any) {
    // 失敗した場合（トークン切れなど）
    if (
      err?.response?.data?.error === "ExpiredToken" || 
      err?.message?.includes("ExpiredToken")
    ) {
      const refresh = await agent.com.atproto.server.refreshSession();
      accessJwt = refresh.data.accessJwt;
      refreshJwt = refresh.data.refreshJwt;
      console.log("[INFO] token was expired, so refreshed the session.");
    } else {
      console.error("[ERROR] unexpected error:", err);
      throw err;
    }
  }
}

export { agent };
