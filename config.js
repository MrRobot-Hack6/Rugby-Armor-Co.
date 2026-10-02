/* ============ CONFIG: fill in before going live ============ */
const CONFIG = {
  currency: "R",
  // WhatsApp number that receives orders, in international format with NO plus, spaces or dashes.
  // South African example: 0821234567 becomes '27821234567'
  whatsappNumber: "27827992209",
  // EmailJS (https://www.emailjs.com): leave blank to run in simulated mode
  emailjs: {
    publicKey: "",
    serviceId: "",
    contactTemplateId: "",
    newsletterTemplateId: "",
  },
  // Your server endpoint. It must create the PayFast signature / Stripe Checkout Session
  // using SECRET keys, then return { url } to redirect to. Never put secret keys in this file.
  checkoutEndpoint: "", // e.g. '/api/checkout'
};
