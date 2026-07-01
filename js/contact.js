/* =========================================================
   Contact form handler.

   IMPORTANT: this is a frontend-only starter. A plain HTML
   form cannot send email by itself — you need to either:

   1. Use a form backend service (easiest, no server needed):
      - Formspree (formspree.io) — free tier available
      - Web3Forms (web3forms.com) — free, no signup for basic use
      Just swap the FORM_ENDPOINT below for the URL/ID they give you.

   2. Or build a small serverless function (e.g. a Vercel
      API route) that sends the email yourself via Resend,
      which you're already using in Zyn Beats.

   Until you wire up an endpoint, this script just prevents
   the page from reloading and shows a friendly inline message.
   ========================================================= */

(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  // TODO: replace with your real form endpoint (Formspree, Web3Forms, etc.)
  const FORM_ENDPOINT = "https://formspree.io/f/mvzjwvva";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    if (!FORM_ENDPOINT) {
      // No backend wired up yet — tell the developer (you) clearly,
      // and tell the visitor something reasonable.
      console.warn(
        "Contact form: FORM_ENDPOINT is empty. See the comment at the " +
          "top of js/contact.js for how to wire this up."
      );
      submitBtn.textContent = "Not connected yet";
      setTimeout(() => {
        submitBtn.textContent = originalText;
      }, 2000);
      return;
    }

    submitBtn.textContent = "Sending…";
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        submitBtn.textContent = "Message sent";
        form.reset();
      } else {
        submitBtn.textContent = "Something went wrong";
      }
    } catch (err) {
      submitBtn.textContent = "Something went wrong";
    } finally {
      submitBtn.disabled = false;
      setTimeout(() => {
        submitBtn.textContent = originalText;
      }, 2500);
    }
  });
})();
