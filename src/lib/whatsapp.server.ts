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

  // Normalize mobile number
  let rawDigits = (mobile || "").replace(/[^0-9]/g, "");
  if (rawDigits.startsWith("0") && rawDigits.length === 11) {
    rawDigits = rawDigits.slice(1);
  }

  let countryCode = "+91";
  let phoneNumber = rawDigits;

  if (rawDigits.length === 10) {
    countryCode = "+91";
    phoneNumber = rawDigits;
  } else if (rawDigits.startsWith("91") && rawDigits.length === 12) {
    countryCode = "+91";
    phoneNumber = rawDigits.slice(2);
  } else if (rawDigits.length > 10) {
    countryCode = `+${rawDigits.slice(0, rawDigits.length - 10)}`;
    phoneNumber = rawDigits.slice(-10);
  }

  const cleanMobile = `${countryCode.replace("+", "")}${phoneNumber}`;
  const text = `Your Employee Suggestion Portal (ESP) login OTP code is: ${otp}. It is valid for 10 minutes.`;

  console.log(`[WhatsApp OTP] Dispatching to countryCode=${countryCode} phone=${phoneNumber} via provider=${provider}...`);

  try {
    if (provider === "interakt") {
      if (!apiKey) {
        throw new Error("Missing Interakt API Key in environment (INTERAKT_API_KEY or WHATSAPP_API_KEY)");
      }

      const interaktUrl = process.env.INTERAKT_API_URL || "https://api.interakt.ai/v1/public/message/";
      const templateName = process.env.INTERAKT_TEMPLATE_NAME || "otp_verification";
      const languageCode = process.env.INTERAKT_TEMPLATE_LANG || "en";

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

      const payloadWithButtons = {
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

      const payloadWithoutButtons = {
        countryCode,
        phoneNumber,
        type: "Template",
        template: {
          name: templateName,
          languageCode,
          bodyValues: [otp]
        }
      };

      let res = await fetch(interaktUrl, {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payloadWithButtons)
      });

      // If buttonValues caused an issue (e.g. template has no dynamic buttons), fallback to body-only
      if (!res.ok && (res.status === 400 || res.status === 422)) {
        const firstErr = await res.text();
        console.warn(`[WhatsApp OTP] Retrying without buttonValues. First response:`, firstErr);
        res = await fetch(interaktUrl, {
          method: "POST",
          headers: {
            "Authorization": authHeader,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payloadWithoutButtons)
        });
      }

      if (!res.ok) {
        const errorText = await res.text();
        let errMsg = `Interakt API error (${res.status}): ${errorText}`;
        try {
          const parsed = JSON.parse(errorText);
          if (parsed.message) errMsg = `Interakt: ${parsed.message}`;
        } catch (_) {}
        throw new Error(errMsg);
      }

      console.log(`[WhatsApp OTP] Successfully sent message via Interakt.`);
      return { success: true };
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
        throw new Error("WhatsApp Gateway is not configured. Please set WHATSAPP_PROVIDER='interakt' and INTERAKT_API_KEY in your server environment variables.");
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
    throw err;
  }
}
