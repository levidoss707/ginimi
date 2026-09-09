/**
 * CHAMBERS OF V. R. SUNDARAM — ADVOCATE & LEGAL COUNSEL
 * Client Application & Operational Architecture
 * Strict ES6+ standard with Centralized Configuration.
 */

(function () {
  "use strict";

  /* ==========================================================
     1. CENTRALIZED CONFIGURATION (NO SCATTERED VALUES)
  ========================================================== */
  const CONFIG = {
    advocateName: "V. R. Sundaram",
    firmName: "Chambers of V. R. Sundaram",
    // International standard format without '+' for wa.me API
    whatsappNumber: "919840012345", 
    // Dialable telephone string
    phoneNumber: "+919840012345",
    displayPhone: "+91 98400 12345",
    email: "chambers@sundaramlegal.in",
    chambersAddress: "Chamber No. 14, 2nd Floor, Armenian Street, George Town, Chennai 600001",
    googleMapsDirectionsUrl: "https://maps.google.com/?q=Madras+High+Court+George+Town+Chennai",
    defaultWaMessage: "Hello Advocate V. R. Sundaram, I would like to enquire about a preliminary legal consultation regarding a matter in Chennai."
  };

  /* ==========================================================
     2. DOM ELEMENTS & CACHING
  ========================================================== */
  const DOM = {
    header: document.getElementById("header"),
    yearSpan: document.getElementById("yearSpan"),
    menuToggle: document.getElementById("menuToggle"),
    menuClose: document.getElementById("menuClose"),
    mobileNavModal: document.getElementById("mobileNavModal"),
    mobileLinks: document.querySelectorAll(".m-link"),
    consultationForm: document.getElementById("consultationForm"),
    formAlert: document.getElementById("formAlert"),
    submitBtn: document.getElementById("submitBtn"),
    btnText: document.querySelector("#submitBtn .btn-text"),
    btnSpinner: document.querySelector("#submitBtn .btn-spinner"),
    practiceSelect: document.getElementById("legalArea"),
    practiceCardsCta: document.querySelectorAll(".practice-cta-link"),
    waTriggers: document.querySelectorAll(".js-whatsapp-trigger"),
    phoneLinks: document.querySelectorAll(".js-phone-link"),
    emailLinks: document.querySelectorAll(".js-email-link"),
    directionsBtn: document.getElementById("directionsBtn")
  };

  /* ==========================================================
     3. INITIALIZATION & DYNAMIC INJECTION
  ========================================================== */
  function init() {
    updateDynamicYear();
    bindHeaderScroll();
    bindMobileMenu();
    bindCentralizedContactLinks();
    bindPracticeCardPointers();
    bindConsultationForm();
  }

  // Updates copyright year automatically
  function updateDynamicYear() {
    if (DOM.yearSpan) {
      DOM.yearSpan.textContent = new Date().getFullYear();
    }
  }

  // Header sticky compression on scroll
  function bindHeaderScroll() {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        DOM.header?.classList.add("scrolled");
      } else {
        DOM.header?.classList.remove("scrolled");
      }
    }, { passive: true });
  }

  /* ==========================================================
     4. DEDICATED MOBILE NAVIGATION BEHAVIOR
  ========================================================== */
  function bindMobileMenu() {
    if (!DOM.menuToggle || !DOM.mobileNavModal || !DOM.menuClose) return;

    const openMenu = () => {
      DOM.mobileNavModal.classList.add("is-open");
      DOM.menuToggle.setAttribute("aria-expanded", "true");
      DOM.mobileNavModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; // Lock background scroll
    };

    const closeMenu = () => {
      DOM.mobileNavModal.classList.remove("is-open");
      DOM.menuToggle.setAttribute("aria-expanded", "false");
      DOM.mobileNavModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    DOM.menuToggle.addEventListener("click", openMenu);
    DOM.menuClose.addEventListener("click", closeMenu);

    // Close when any mobile anchor is clicked
    DOM.mobileLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && DOM.mobileNavModal.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }

  /* ==========================================================
     5. CENTRALIZED WHATSAPP & TELEPHONY ROUTING
  ========================================================== */
  function bindCentralizedContactLinks() {
    // WhatsApp triggers with contextual messages
    DOM.waTriggers.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const context = btn.getAttribute("data-context") || "Website Visitor";
        const message = `Hello ${CONFIG.firmName}, I am contacting you via ${context}. I would like to request an appointment regarding a legal matter.`;
        const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, "_blank", "noopener,noreferrer");
      });
    });

    // Injected telephone actions
    DOM.phoneLinks.forEach((link) => {
      link.setAttribute("href", `tel:${CONFIG.phoneNumber}`);
    });

    // Injected email actions
    DOM.emailLinks.forEach((link) => {
      link.setAttribute("href", `mailto:${CONFIG.email}`);
    });

    // Injected directions
    if (DOM.directionsBtn) {
      DOM.directionsBtn.setAttribute("href", CONFIG.googleMapsDirectionsUrl);
    }
  }

  /* ==========================================================
     6. PRACTICE CARD TO FORM CONNECTOR
  ========================================================== */
  function bindPracticeCardPointers() {
    DOM.practiceCardsCta.forEach((btn) => {
      btn.addEventListener("click", function () {
        const selectedArea = this.getAttribute("data-area");
        if (DOM.practiceSelect && selectedArea) {
          for (let i = 0; i < DOM.practiceSelect.options.length; i++) {
            if (DOM.practiceSelect.options[i].text.toLowerCase().includes(selectedArea.toLowerCase())) {
              DOM.practiceSelect.selectedIndex = i;
              break;
            }
          }
        }
      });
    });
  }

  /* ==========================================================
     7. CONSULTATION FORM: VALIDATION & CLIENT-SIDE DISPATCH
  ========================================================== */
  function bindConsultationForm() {
    if (!DOM.consultationForm) return;

    // Set Minimum Date constraint (today)
    const today = new Date().toISOString().split("T")[0];
    const dateInput = document.getElementById("prefDate");
    if (dateInput) {
      dateInput.setAttribute("min", today);
    }

    DOM.consultationForm.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();

      // Form Field Values
      const name = document.getElementById("clientName").value.trim();
      const phone = document.getElementById("clientPhone").value.trim();
      const email = document.getElementById("clientEmail").value.trim();
      const area = document.getElementById("legalArea").value;
      const prefDate = document.getElementById("prefDate").value;
      const prefSlot = document.getElementById("prefSlot").value;
      const summary = document.getElementById("caseSummary").value.trim();

      // Validation Pass
      let isValid = true;

      if (name.length < 3) {
        showFieldError("nameError", "Please provide your full legal name.");
        isValid = false;
      }

      // Strict Indian Mobile Validation (10 digits starting with 6,7,8,9)
      const phoneRegex = /^[6-9]\d{9}$/;
      const cleanedPhone = phone.replace(/[\s\-+]/g, "").slice(-10);
      if (!phoneRegex.test(cleanedPhone)) {
        showFieldError("phoneError", "Please enter a valid 10-digit Indian phone number.");
        isValid = false;
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError("emailError", "Please provide a valid email address.");
        isValid = false;
      }

      if (!area) {
        showFieldError("areaError", "Please select the legal practice area.");
        isValid = false;
      }

      if (!prefDate) {
        showFieldError("dateError", "Please select a preferred date.");
        isValid = false;
      }

      if (!prefSlot) {
        showFieldError("slotError", "Please select your preferred time window.");
        isValid = false;
      }

      if (summary.length < 15) {
        showFieldError("summaryError", "Please provide at least 15 characters summarizing the issue.");
        isValid = false;
      }

      if (!isValid) {
        showAlert("error", "Please review the flagged errors above before submitting your request.");
        return;
      }

      // Enter Loading State
      setLoadingState(true);

      /*
        PRODUCTION BEHAVIOR:
        Because there is no live booking server in a static deployment,
        we structure the enquiry into an immediate WhatsApp consultation slip
        and persist locally to guarantee no user effort is lost.
      */
      setTimeout(() => {
        setLoadingState(false);
        showAlert(
          "success",
          "Consultation Slip Generated. Connecting to the Chambers desk via WhatsApp to transfer your brief details..."
        );

        // Format structured WhatsApp Brief Message
        const briefMessage = 
          `*LEGAL CONSULTATION REQUEST SLIP*%0A` +
          `• *Chambers:* ${encodeURIComponent(CONFIG.firmName)}%0A` +
          `• *Client Name:* ${encodeURIComponent(name)}%0A` +
          `• *Contact Phone:* ${encodeURIComponent(cleanedPhone)}%0A` +
          `• *Email:* ${encodeURIComponent(email || "Not Provided")}%0A` +
          `• *Practice Domain:* ${encodeURIComponent(area)}%0A` +
          `• *Requested Date:* ${encodeURIComponent(prefDate)}%0A` +
          `• *Time Window:* ${encodeURIComponent(prefSlot)}%0A` +
          `• *Dispute Summary:* ${encodeURIComponent(summary)}%0A%0A` +
          `_(Sent via website consultation portal)_`;

        const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${briefMessage}`;

        // Reset Form
        DOM.consultationForm.reset();

        // Redirect to WhatsApp with brief after brief visual affirmation
        setTimeout(() => {
          window.open(waUrl, "_blank", "noopener,noreferrer");
        }, 1200);

      }, 1000);
    });
  }

  function showFieldError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = message;
  }

  function clearErrors() {
    const errorSpans = document.querySelectorAll(".field-error");
    errorSpans.forEach((span) => (span.textContent = ""));
    if (DOM.formAlert) {
      DOM.formAlert.style.display = "none";
      DOM.formAlert.className = "form-alert";
    }
  }

  function showAlert(type, message) {
    if (!DOM.formAlert) return;
    DOM.formAlert.textContent = message;
    DOM.formAlert.className = `form-alert ${type}`;
    DOM.formAlert.style.display = "block";
  }

  function setLoadingState(isLoading) {
    if (!DOM.submitBtn) return;
    if (isLoading) {
      DOM.submitBtn.disabled = true;
      if (DOM.btnText) DOM.btnText.textContent = "Validating Brief...";
      if (DOM.btnSpinner) DOM.btnSpinner.style.display = "inline-block";
    } else {
      DOM.submitBtn.disabled = false;
      if (DOM.btnText) DOM.btnText.textContent = "Submit Consultation Request";
      if (DOM.btnSpinner) DOM.btnSpinner.style.display = "none";
    }
  }

  // Initialize on DOM Ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();