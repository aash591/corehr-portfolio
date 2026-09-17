/*
 * Core HR Management — site settings
 * ----------------------------------
 * Edit the values below; no other file needs to change.
 * Loaded before assets/site.js. Keep the syntax valid (quotes, commas).
 *
 * Note: this file is public, like every file on a static site. The Web3Forms
 * access key is designed to be public, so it is safe here. Never put private
 * secrets (passwords, SMTP credentials, private API keys) in this file.
 */
window.COREHR_CONFIG = {

  /* Contact details — applied to the Call / WhatsApp / Email links on the page. */
  contact: {
    phone: '+91 92920 15102',            // shown as written; the call link uses its digits
    whatsapp: '919292015102',             // country code + number, digits only. '' hides WhatsApp links
    whatsappMessage: "Hi Core HR Management — I'd like to discuss HR support.",
    email: 'info@corehrmanagement.in'     // shown on the page and used for the email fallback
  },

  /* Enquiry form — where submissions are delivered. */
  form: {
    // 'web3forms' | 'formsubmit' | 'formspree' | 'custom' | ''  ('' = email fallback only)
    provider: 'web3forms',

    web3formsKey: '14a45906-67d2-4e2d-8e14-0a1b8f2fc8a9',  // provider 'web3forms' — https://web3forms.com
    formspreeId: '',                                        // provider 'formspree' — the part after /f/ in your form URL
    endpoint: '',                                           // provider 'custom'    — receives a JSON POST
    // provider 'formsubmit' delivers to contact.email above (first submission sends a confirmation email)

    fromName: 'Core HR Management — website',  // sender name shown in the inbox (Web3Forms)
    extraFields: {}                            // extra key/values added to every submission
  }
};
