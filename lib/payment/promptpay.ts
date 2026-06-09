import QRCode from "qrcode";

// Generate PromptPay QR payload (EMVCo standard)
function generatePromptPayPayload(promptPayId: string, amount: number): string {
  const sanitized = promptPayId.replace(/-/g, "");
  const isPhone = sanitized.length === 10;
  const isTaxId = sanitized.length === 13;

  let id = "";
  if (isPhone) {
    id = `0066${sanitized.slice(1)}`; // convert 08x → 0066x
  } else if (isTaxId) {
    id = sanitized;
  }

  const idField = `0016A000000677010111${String(id.length).padStart(2, "0")}${id}`;
  const amountStr = amount.toFixed(2);
  const amountField = `54${String(amountStr.length).padStart(2, "0")}${amountStr}`;

  const payload = [
    "000201",               // Payload format indicator
    "010212",               // Point of initiation (dynamic)
    `2930${String(idField.length).padStart(2, "0")}${idField}`, // Merchant account
    "5303764",              // Currency: THB
    amountField,
    "5802TH",               // Country
    "6304",                 // CRC placeholder
  ].join("");

  const crc = crc16(payload);
  return payload + crc;
}

// CRC16-CCITT calculation
function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

// Generate QR code as base64 image
export async function generatePromptPayQR(amount: number): Promise<string> {
  const promptPayId = process.env.PROMPTPAY_ID!;
  const payload = generatePromptPayPayload(promptPayId, amount);
  return await QRCode.toDataURL(payload, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 300,
  });
}

export const bankInfo = {
  name: process.env.BANK_NAME || "กสิกรไทย",
  accountName: process.env.BANK_ACCOUNT_NAME || "บริษัท จอลลี่ เพ็ท จำกัด",
  accountNumber: process.env.BANK_ACCOUNT_NUMBER || "",
};
