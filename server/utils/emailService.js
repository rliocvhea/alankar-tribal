import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email templates
const orderConfirmationTemplate = (order, items) => {
  const itemsList = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${item.product_name}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        $${item.price.toFixed(2)}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.quantity * item.price).toFixed(2)}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
        <p style="color: #f0f0f0; margin: 10px 0 0 0;">Thank you for your purchase</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #667eea; margin-top: 0;">Order Details</h2>
          <p><strong>Order ID:</strong> #${order.id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
          <p><strong>Status:</strong> <span style="background: #ffd700; padding: 4px 12px; border-radius: 20px; font-size: 14px;">${order.status}</span></p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #667eea; margin-top: 0;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f0f0f0;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #667eea; margin-top: 0;">Shipping Address</h3>
          <p style="white-space: pre-line;">${order.shipping_address}</p>
        </div>

        <div style="background: #667eea; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h2 style="margin: 0 0 10px 0;">Total Amount</h2>
          <p style="font-size: 32px; font-weight: bold; margin: 0;">$${order.total.toFixed(2)}</p>
        </div>

        <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
          <p style="margin: 0;"><strong>Payment ID:</strong> ${order.payment_id || 'Processing'}</p>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
          <p>If you have any questions about your order, please contact our support team at alankaratribal@gmail.com</p>
          <p style="margin-top: 20px;">
            <strong>Alankara Tribal</strong><br>
            Thank you for shopping with us!
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send order confirmation email
export const sendOrderConfirmation = async (userEmail, userName, order, items) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"E-Commerce Store" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: `Order Confirmation #${order.id} - Thank You for Your Purchase!`,
      html: orderConfirmationTemplate(order, items),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send admin notification
export const sendAdminNotification = async (order, items, userInfo) => {
  try {
    if (!process.env.ADMIN_EMAIL) {
      console.log('Admin email not configured, skipping notification');
      return { success: false, error: 'Admin email not configured' };
    }

    const transporter = createTransporter();

    const itemsList = items.map(item => 
      `${item.product_name} (x${item.quantity}) - $${(item.quantity * item.price).toFixed(2)}`
    ).join('\n');

    const mailOptions = {
      from: `"E-Commerce Store" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order #${order.id} - $${order.total.toFixed(2)}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Customer:</strong> ${userInfo.name} (${userInfo.email})</p>
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        <h3>Items:</h3>
        <pre>${itemsList}</pre>
        <h3>Shipping Address:</h3>
        <pre>${order.shipping_address}</pre>
        <p><strong>Payment ID:</strong> ${order.payment_id}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendOrderConfirmation,
  sendAdminNotification,
};
