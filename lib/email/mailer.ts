import nodemailer from "nodemailer";

// Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: nodemailer.Attachment[];
}

export async function sendEmail({ to, subject, html, attachments }: SendEmailOptions) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    attachments,
  });
}

// --- Email Templates ---

export function orderConfirmationHtml(order: {
  orderNumber: string;
  customerName: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
}) {
  const itemRows = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${i.price.toLocaleString("th-TH")}฿</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#1B3664;padding:24px;text-align:center">
        <h1 style="color:#FFC200;margin:0;font-size:24px">Jolly Pet</h1>
        <p style="color:#fff;margin:8px 0 0">ยืนยันคำสั่งซื้อ</p>
      </div>
      <div style="padding:24px">
        <p>สวัสดีคุณ ${order.customerName}</p>
        <p>ขอบคุณสำหรับคำสั่งซื้อ <strong>#${order.orderNumber}</strong></p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px">
          <thead>
            <tr style="background:#f3f4f6">
              <th style="padding:8px;text-align:left">สินค้า</th>
              <th style="padding:8px;text-align:center">จำนวน</th>
              <th style="padding:8px;text-align:right">ราคา</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:8px;font-weight:bold">รวมทั้งหมด</td>
              <td style="padding:8px;font-weight:bold;text-align:right">${order.total.toLocaleString("th-TH")}฿</td>
            </tr>
          </tfoot>
        </table>
        <p style="margin-top:24px;color:#666">ทีมงาน Jolly Pet จะติดต่อกลับเพื่อยืนยันการชำระเงินของคุณ</p>
      </div>
      <div style="background:#f3f4f6;padding:16px;text-align:center;color:#999;font-size:12px">
        บริษัท จอลลี่ เพ็ท จำกัด | 72/93 หมู่ที่ 5 ต.บึงคำพรอย อ.ลำลูกกา จ.ปทุมธานี 12150
      </div>
    </div>
  `;
}
