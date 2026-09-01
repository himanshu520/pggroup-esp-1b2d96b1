/**
 * Server-side service to send WhatsApp messages using different providers:
 * - interakt: Interakt WhatsApp Business API
 * - twilio: Twilio WhatsApp API
 * - meta: Meta WhatsApp Cloud API
 * - wasender: WASender API
 * - custom: Custom HTTP GET/POST API Gateway
 */
export async function sendOtpWhatsApp(mobile: string, otp: string, name?: string | null): Promise<boolean> {
  const provider = (process.env.WHATSAPP_PROVIDER || (process.env.INTERAKT_API_KEY ? "interakt" : "custom")).toLowerCase();
  const apiKey = process.env.INTERAKT_API_KEY || process.env.WHATSAPP_API_KEY || process.env.WHATSAPP_AUTH_TOKEN || "";
  const accountSid = process.env.WHATSAPP_ACCOUNT_SID || "";
  const senderNumber = process.env.WHATSAPP_SENDER_NUMBER || "";
  const customUrl = process.env.WHATSAPP_API_URL || "";

  // Normalize mobile number (ensure it has country code, default to +91 if length is 10 digits)
  let cleanMobile = mobile.replace(/[\s\-\+\(\)]/g, "");
  if (cleanMobile.length === 10) {
    cleanMobile = "91" + cleanMobile;
  }
  
  const text = `Your Employee Suggestion Portal (ESP) login OTP code is: ${otp}. It is valid for 10 minutes.`;

  console.log(`[WhatsApp OTP] Preparing to send message to ${cleanMobile} via ${provider}...`);

  try {
    if (provider === "interakt") {
      if (!apiKey) {
        throw new Error("Missing Interakt API Key in environment (INTERAKT_API_KEY or WHATSAPP_API_KEY)");
      }

      const interaktUrl = process.env.INTERAKT_API_URL || "https://api.interakt.ai/v1/public/message/";
      const templateName = process.env.INTERAKT_TEMPLATE_NAME || "otp_verification";
      const languageCode = process.env.INTERAKT_TEMPLATE_LANG || "en";

      let countryCode = "+91";
      let phoneNumber = cleanMobile;
      if (cleanMobile.startsWith("91") && cleanMobile.length === 12) {
        countryCode = "+91";
        phoneNumber = cleanMobile.slice(2);
      } else if (cleanMobile.length === 10) {
        countryCode = "+91";
        phoneNumber = cleanMobile;
      }

      let authHeader: string;
      if (apiKey.startsWith("Basic ")) {
        authHeader = apiKey;
      } else {
        const isBase64 = /^[A-Za-z0-9+/]+={0,2}$/.test(apiKey) && apiKey.length % 4 === 0;
        if (isBase64) {
          authHeader = `Basic ${apiKey}`;
        } else {
          authHeader = `Basic ${Buffer.from(apiKey.includes(":") ? apiKey : `${apiKey}:`).toString("base64")}`;
        }
      }

      const payload = {
        countryCode,
        phoneNumber,
        type: "Template",
        template: {
          name: templateName,
          languageCode,
          bodyValues: [otp],
          buttonValues: {
            "0": [otp]
          }
        }
      };

      const res = await fetch(interaktUrl, {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Interakt API responded with status ${res.status}: ${errorText}`);
      }

      console.log(`[WhatsApp OTP] Successfully sent message via Interakt.`);
      return true;
    }
    if (provider === "wasender") {
      if (!apiKey) {
        throw new Error("Missing WASender API token in environment (WHATSAPP_API_KEY)");
      }
      
      const wasenderUrl = "https://wasenderapi.com/api/send-message";
      const recipient = `+${cleanMobile}`;
      
      const payload = {
        to: recipient,
        text: text
      };

      const res = await fetch(wasenderUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`WASender API responded with status ${res.status}: ${errorText}`);
      }

      console.log(`[WhatsApp OTP] Successfully sent message via WASender.`);
      return true;
    }

    if (provider === "twilio") {
      if (!accountSid || !apiKey || !senderNumber) {
        throw new Error("Missing Twilio credentials in environment (WHATSAPP_ACCOUNT_SID, WHATSAPP_AUTH_TOKEN, WHATSAPP_SENDER_NUMBER)");
      }
      
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const auth = Buffer.from(`${accountSid}:${apiKey}`).toString("base64");
      
      const params = new URLSearchParams();
      params.append("To", `whatsapp:+${cleanMobile}`);
      params.append("From", `whatsapp:${senderNumber.startsWith("+") ? "" : "+"}${senderNumber}`);
      params.append("Body", text);

      const res = await fetch(twilioUrl, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Twilio API responded with status ${res.status}: ${errorText}`);
      }

      console.log(`[WhatsApp OTP] Successfully sent message via Twilio.`);
      return true;
    } 
    
    if (provider === "meta") {
      if (!apiKey || !senderNumber) {
        throw new Error("Missing Meta credentials in environment (WHATSAPP_API_KEY, WHATSAPP_SENDER_NUMBER - which is phone number ID)");
      }

      const metaUrl = `https://graph.facebook.com/v17.0/${senderNumber}/messages`;
      
      const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanMobile,
        type: "text",
        text: {
          preview_url: false,
          body: text
        }
      };

      const res = await fetch(metaUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Meta Cloud API responded with status ${res.status}: ${errorText}`);
      }

      console.log(`[WhatsApp OTP] Successfully sent message via Meta Cloud API.`);
      return true;
    }

    // Default or fallback: custom HTTP API gateway
    if (provider === "custom") {
      if (!customUrl) {
        console.warn("[WhatsApp OTP] WHATSAPP_API_URL not configured. Logging OTP to console only.");
        console.log(`=========================================`);
        console.log(`[MOCK WHATSAPP MESSAGE]`);
        console.log(`To: +${cleanMobile}`);
        console.log(`Message: ${text}`);
        console.log(`=========================================`);
        return true;
      }

      let finalUrl = customUrl
        .replace(/\{\{TO\}\}/g, cleanMobile)
        .replace(/\{\{MESSAGE\}\}/g, encodeURIComponent(text))
        .replace(/\{\{API_KEY\}\}/g, apiKey);

      const isPost = customUrl.includes("{{POST}}") || (!customUrl.includes("{{TO}}") && !customUrl.includes("{{MESSAGE}}"));
      
      finalUrl = finalUrl.replace("{{POST}}", "");

      const options: RequestInit = {};
      if (isPost) {
        options.method = "POST";
        options.headers = {
          "Content-Type": "application/json",
          "Authorization": apiKey ? `Bearer ${apiKey}` : ""
        };
        options.body = JSON.stringify({
          to: cleanMobile,
          message: text
        });
      } else {
        options.method = "GET";
      }

      console.log(`[WhatsApp OTP] Dispatching request to custom gateway: ${finalUrl}`);
      const res = await fetch(finalUrl, options);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Custom Gateway responded with status ${res.status}: ${errorText}`);
      }

      console.log(`[WhatsApp OTP] Successfully sent message via custom gateway.`);
      return true;
    }

    throw new Error(`Unknown WhatsApp provider: ${provider}`);
  } catch (err: any) {
    console.error("[WhatsApp OTP] Failed to send WhatsApp message:", err.message || err);
    return false;
  }
}
