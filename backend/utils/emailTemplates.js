const SITE_NAME = 'Adult Desire';
const SITE_TAGLINE = 'Where Desire Meets Luxury';

function getSiteUrl() {
  return (process.env.FRONTEND_URL || 'https://sex-toy.vercel.app').replace(/\/$/, '');
}

function getBaseStyles() {
  return `
    body { margin: 0; padding: 0; background-color: #0b0112; font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif; }
    .wrapper { width: 100%; background: #0b0112; padding: 40px 16px; }
    .card {
      max-width: 560px; margin: 0 auto; background: #150421;
      border-radius: 20px; overflow: hidden;
      border: 1px solid rgba(236, 72, 153, 0.2);
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.65), 0 0 40px rgba(236, 72, 153, 0.08);
    }
    .header {
      background: linear-gradient(135deg, #4c0519 0%, #db2777 50%, #831843 100%);
      padding: 36px 32px 28px; text-align: center;
      position: relative;
    }
    .header::after {
      content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
      height: 20px; background: #150421; border-radius: 20px 20px 0 0;
    }
    .brand { font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; margin: 0; font-family: 'Cinzel', Georgia, serif; }
    .tagline { font-family: 'Montserrat', Arial, sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.85); margin: 10px 0 0; }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.15), transparent); margin: 0 32px; }
    .body { padding: 36px 32px; text-align: center; }
    .title {
      font-family: 'Montserrat', Arial, sans-serif; font-size: 13px; font-weight: 600;
      letter-spacing: 4px; text-transform: uppercase; color: #ec4899; margin: 0 0 16px;
    }
    .message { font-family: 'Montserrat', Arial, sans-serif; font-size: 14px; line-height: 1.7; color: #9ca3af; margin: 0 0 28px; }
    .otp-wrap { margin: 28px 0; }
    .otp-label { font-family: 'Montserrat', Arial, sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9ca3af; margin-bottom: 12px; }
    .otp-box {
      display: inline-block; padding: 18px 36px; border-radius: 12px;
      background: linear-gradient(145deg, rgba(236,72,153,0.15), rgba(131,24,67,0.2));
      border: 1px solid rgba(236,72,153,0.5);
      font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold;
      letter-spacing: 12px; color: #ffffff;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 24px rgba(236,72,153,0.2);
    }
    .note { font-family: 'Montserrat', Arial, sans-serif; font-size: 12px; color: #4b5563; line-height: 1.5; margin: 0; }
    .btn {
      display: inline-block; margin: 28px 0 8px; padding: 14px 36px; border-radius: 50px;
      background: linear-gradient(135deg, #db2777, #ec4899);
      color: #ffffff !important; text-decoration: none; font-family: 'Montserrat', Arial, sans-serif;
      font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
      box-shadow: 0 8px 24px rgba(236, 72, 153, 0.35);
    }
    .status-badge {
      display: inline-block; padding: 10px 24px; border-radius: 50px; margin: 8px 0 24px;
      background: rgba(236, 72, 153, 0.15); border: 1px solid rgba(236, 72, 153, 0.4);
      font-family: 'Montserrat', Arial, sans-serif; font-size: 14px; font-weight: 600;
      letter-spacing: 1px; text-transform: capitalize; color: #f9a8d4;
    }
    .footer {
      padding: 24px 32px 32px; text-align: center;
      border-top: 1px solid rgba(255,255,255,0.05);
      background: #0b0112;
    }
    .footer-text { font-family: 'Montserrat', Arial, sans-serif; font-size: 11px; color: #4b5563; line-height: 1.6; margin: 0; }
    .footer-brand { color: #ec4899; font-style: italic; }

    /* Stepper styles */
    .step-circle {
      width: 40px; height: 40px;
      border-radius: 50%;
      display: inline-block;
      text-align: center;
      line-height: 40px;
      font-size: 16px;
      margin: 0 auto 10px;
    }
    .step-circle.done {
      background: linear-gradient(135deg, #db2777, #ec4899);
      color: #ffffff;
    }
    .step-circle.active {
      background: linear-gradient(135deg, #ec4899, #db2777);
      box-shadow: 0 0 16px rgba(236, 72, 153, 0.4);
      color: #ffffff;
    }
    .step-circle.pending {
      background: #0b0112;
      border: 2px solid rgba(255, 255, 255, 0.1);
      color: #4b5563;
    }
    .step-label {
      font-size: 11px;
      font-weight: 600;
      text-align: center;
      line-height: 1.3;
    }
    .step-label.done { color: #ec4899; }
    .step-label.active { color: #f9a8d4; }
    .step-label.pending { color: #4b5563; }
  `;
}

function wrapEmail(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${SITE_NAME}</title>
  <style>${getBaseStyles()}</style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <p class="brand">${SITE_NAME}</p>
        <p class="tagline">${SITE_TAGLINE}</p>
      </div>
      ${content}
      <div class="footer">
        <p class="footer-text">
          &copy; ${new Date().getFullYear()} <span class="footer-brand">${SITE_NAME}</span>. All rights reserved.<br>
          Discreet packaging &amp; private delivery on every order.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generateForgotPasswordTemplate(otp, user = {}) {
  const greeting = user.name ? `Hi ${user.name}, ` : '';
  const resetUrl = `${getSiteUrl()}/auth`;

  return wrapEmail(`
    <div class="body">
      <p class="title">Forgot Password?</p>
      <p class="message">${greeting}We received a request to reset your ${SITE_NAME} account password. Use the code below to verify it's you and choose a new password.</p>
      <div class="otp-wrap">
        <p class="otp-label">Your password reset code</p>
        <div class="otp-box">${otp}</div>
      </div>
      <p class="note">This code expires in 10 minutes.<br>Never share it with anyone — including ${SITE_NAME} staff.</p>
      <a href="${resetUrl}" class="btn">Reset My Password</a>
      <p class="note" style="margin-top: 24px;">Didn't request a password reset? You can safely ignore this email — your account remains secure.</p>
    </div>
  `);
}

function generateEmailTemplate(otp, title, message, user = {}) {
  const greeting = user.name ? `Hi ${user.name}, ` : '';

  return wrapEmail(`
    <div class="body">
      <p class="title">${title}</p>
      <p class="message">${greeting}${message}</p>
      <div class="otp-wrap">
        <p class="otp-label">Your verification code</p>
        <div class="otp-box">${otp}</div>
      </div>
      <p class="note">This code expires in 10 minutes.<br>Never share it with anyone — including ${SITE_NAME} staff.</p>
    </div>
  `);
}

function generatePasswordUpdatedTemplate(user) {
  const greeting = user.name ? `Hi ${user.name}, ` : '';
  const loginUrl = `${getSiteUrl()}/auth`;

  return wrapEmail(`
    <div class="body">
      <p class="title">Password Updated</p>
      <p class="message">${greeting}Your password has been updated successfully. You can now sign in to your ${SITE_NAME} account with your new credentials.</p>
      <a href="${loginUrl}" class="btn">Sign In to Your Account</a>
    </div>
  `);
}

function generateRegisterSuccessTemplate(user) {
  const greeting = user.name ? `Hi ${user.name}, ` : '';
  const shopUrl = getSiteUrl();

  return wrapEmail(`
    <div class="body">
      <p class="title">Welcome to ${SITE_NAME}</p>
      <p class="message">${greeting}Your account is verified and ready. We're thrilled to welcome you to our exclusive collection — curated with care, delivered with discretion.</p>
      <a href="${shopUrl}" class="btn">Explore the Collection</a>
    </div>
  `);
}

function generateOrderStatusTemplate({ order, message }) {
  const shortId = order._id.toString().substring(0, 8).toUpperCase();
  const shopUrl = getSiteUrl();
  const deliveryStatus = order.deliveryStatus || 'Not Confirmed yet';

  // Stepper calculations
  const statusSteps = ['Not Confirmed yet', 'Order Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const stepIndex = statusSteps.indexOf(deliveryStatus) !== -1 ? statusSteps.indexOf(deliveryStatus) : 0;
  const linePct = `${stepIndex * 25}%`;

  const stepIcons = ['📦', '✅', '🏭', '🚚', '🏠'];
  const stepLabels = ['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

  let stepperHtml = '';
  for (let i = 0; i < 5; i++) {
    let circleClass = 'pending';
    let labelClass = 'pending';
    let circleContent = stepIcons[i];
    
    if (i < stepIndex) {
      circleClass = 'done';
      labelClass = 'done';
      circleContent = '✓';
    } else if (i === stepIndex) {
      circleClass = 'active';
      labelClass = 'active';
    }
    
    stepperHtml += `
      <div class="step-item" style="display: inline-block; vertical-align: top; width: 80px; text-align: center; margin: 0 5px; z-index: 1; position: relative;">
        <div class="step-circle ${circleClass}">${circleContent}</div>
        <div class="step-label ${labelClass}">${stepLabels[i]}</div>
      </div>
    `;
  }

  const activeIcon = stepIcons[stepIndex];

  const isCancelled = deliveryStatus === 'Cancelled';
  let progressSectionHtml = '';

  if (isCancelled) {
    progressSectionHtml = 
      '<!-- Cancelled Status Callout -->\n' +
      '<div class="cancelled-section" style="margin-bottom: 32px; text-align: left; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 18px 20px;">\n' +
      '  <table border="0" cellpadding="0" cellspacing="0" width="100%">\n' +
      '    <tr>\n' +
      '      <td width="44" valign="middle">\n' +
      '        <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #dc2626, #ef4444); border-radius: 10px; text-align: center; line-height: 44px; font-size: 20px; color: #ffffff;">\n' +
      '          ❌\n' +
      '        </div>\n' +
      '      </td>\n' +
      '      <td style="padding-left: 14px;" valign="middle">\n' +
      '        <div style="font-size: 16px; font-weight: 700; color: #ef4444; margin-bottom: 4px;">\n' +
      '          Order Cancelled\n' +
      '        </div>\n' +
      '        <div style="font-size: 13px; color: #9ca3af; line-height: 1.5;">\n' +
      '          ' + (message || 'This order has been cancelled.') + '\n' +
      '        </div>\n' +
      '      </td>\n' +
      '    </tr>\n' +
      '  </table>\n' +
      '</div>';
  } else {
    progressSectionHtml = 
      '<!-- Stepper Progress section -->\n' +
      '<div class="progress-section" style="margin-bottom: 32px; text-align: left;">\n' +
      '  <div class="section-label" style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 700; color: #ec4899; margin-bottom: 20px;">— Shipment progress</div>\n' +
      '\n' +
      '  <div class="stepper" style="position: relative; text-align: center; font-size: 0; padding: 0 10px;">\n' +
      '    <!-- Track line -->\n' +
      '    <div class="step-line-track" style="position: absolute; top: 20px; left: 30px; right: 30px; height: 3px; background: rgba(255, 255, 255, 0.08); z-index: 0;">\n' +
      '      <table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">\n' +
      '        <tr>\n' +
      '          <td width="' + linePct + '" style="background: linear-gradient(90deg, #db2777, #ec4899); border-radius: 3px;"></td>\n' +
      '          <td style="background: transparent;"></td>\n' +
      '        </tr>\n' +
      '      </table>\n' +
      '    </div>\n' +
      '    ' + stepperHtml + '\n' +
      '  </div>\n' +
      '\n' +
      '  <!-- Active step callout -->\n' +
      '  <div class="active-detail" style="margin-top: 24px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(236, 72, 153, 0.25); border-radius: 12px; padding: 16px 20px; text-align: left;">\n' +
      '    <table border="0" cellpadding="0" cellspacing="0" width="100%">\n' +
      '      <tr>\n' +
      '        <td width="44" valign="middle">\n' +
      '          <div class="active-detail-icon" style="width: 44px; height: 44px; background: linear-gradient(135deg, #db2777, #ec4899); border-radius: 10px; text-align: center; line-height: 44px; font-size: 20px; color: #ffffff;">\n' +
      '            ' + activeIcon + '\n' +
      '          </div>\n' +
      '        </td>\n' +
      '        <td style="padding-left: 14px;" valign="middle">\n' +
      '          <div style="font-size: 14px; font-weight: 700; color: #ffffff; margin-bottom: 3px;">\n' +
      '            Status: ' + deliveryStatus + '\n' +
      '          </div>\n' +
      '          <div style="font-size: 12px; color: #9ca3af;">\n' +
      '            ' + (message || 'Your order status has been updated to ' + deliveryStatus + '.') + '\n' +
      '          </div>\n' +
      '        </td>\n' +
      '      </tr>\n' +
      '    </table>\n' +
      '  </div>\n' +
      '</div>';
  }

  // Parse items
  let itemsList = [];
  try {
    itemsList = JSON.parse(order.items || '[]');
  } catch (e) {
    console.error("Failed to parse order items for email", e);
  }

  let productsHtml = '';
  for (const item of itemsList) {
    const formattedItemPrice = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(item.price);

    productsHtml += `
      <div class="product-row" style="padding: 14px 16px; background: rgba(255, 255, 255, 0.02); border-radius: 10px; border: 1px solid rgba(236, 72, 153, 0.08); margin-bottom: 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td width="56" valign="middle">
              <img src="${item.image}" alt="${item.title}" style="width: 56px; height: 56px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(236, 72, 153, 0.15);" />
            </td>
            <td style="padding-left: 16px; text-align: left;" valign="middle">
              <div style="font-size: 13px; font-weight: 600; color: #ffffff; margin-bottom: 3px;">${item.title}</div>
              <div style="font-size: 11px; color: #9ca3af; font-weight: 500;">Qty: ${item.quantity} · ${item.category || 'Luxury Item'}</div>
            </td>
            <td align="right" valign="middle" style="font-size: 14px; font-weight: 700; color: #ec4899;">
              ${formattedItemPrice}
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(order.totalAmount);

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return wrapEmail(`
    <div class="body" style="padding: 36px 32px; text-align: center;">
      <p class="greeting" style="font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 8px; text-align: left;">Hello ${order.customerName} ✨</p>
      <p class="subtext" style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin-bottom: 28px; text-align: left;">Your luxury order status has been updated. You can check the details and status progress below.</p>

      <!-- Order Info Table -->
      <div class="order-info" style="background: #0b0112; border-radius: 12px; overflow: hidden; margin-bottom: 32px; border: 1px solid rgba(236, 72, 153, 0.15);">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td style="padding: 14px 18px; border-right: 1px solid rgba(236, 72, 153, 0.15); text-align: center;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #ec4899; font-weight: 600; margin-bottom: 4px;">Order</div>
              <div style="font-size: 14px; font-weight: 700; color: #ffffff;">#${shortId}</div>
            </td>
            <td style="padding: 14px 18px; border-right: 1px solid rgba(236, 72, 153, 0.15); text-align: center;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #ec4899; font-weight: 600; margin-bottom: 4px;">Placed on</div>
              <div style="font-size: 14px; font-weight: 700; color: #ffffff;">${orderDate}</div>
            </td>
            <td style="padding: 14px 18px; text-align: center;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #ec4899; font-weight: 600; margin-bottom: 4px;">Payment</div>
              <div style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase;">${order.paymentMethod}</div>
            </td>
          </tr>
        </table>
      </div>

      ${progressSectionHtml}

      <div class="divider" style="height: 1px; background: linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.15), transparent); margin: 28px 0;"></div>

      <!-- Items Section -->
      <div class="product-section" style="margin-bottom: 28px; text-align: left;">
        <div class="section-label" style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.2px; font-weight: 700; color: #ec4899; margin-bottom: 20px;">— Items in this order</div>
        ${productsHtml}
      </div>

      <!-- Total -->
      <div class="order-total" style="background: rgba(236, 72, 153, 0.1); border: 1px solid rgba(236, 72, 153, 0.15); border-radius: 10px; padding: 14px 18px; margin-bottom: 28px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="color: #f9a8d4; font-size: 13px; font-weight: 500; text-align: left;">Order total (incl. GST)</td>
            <td align="right" style="color: #ffffff; font-size: 18px; font-weight: 700;">${formattedTotal}</td>
          </tr>
        </table>
      </div>

      <a href="${shopUrl}/profile" class="btn" style="display: inline-block; margin: 8px 0; padding: 14px 36px; border-radius: 50px; background: linear-gradient(135deg, #db2777, #ec4899); color: #ffffff !important; text-decoration: none; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; box-shadow: 0 8px 24px rgba(236, 72, 153, 0.35);">View Your Orders</a>
    </div>
  `);
}

module.exports = {
  SITE_NAME,
  generateEmailTemplate,
  generateForgotPasswordTemplate,
  generatePasswordUpdatedTemplate,
  generateRegisterSuccessTemplate,
  generateOrderStatusTemplate,
};
