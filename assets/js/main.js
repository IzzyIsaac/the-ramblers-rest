// assets/js/main.js
(() => {
  // Friendly console hello
  try {
    console.log(
      "%cThe Rambler’s Rest",
      "color:#2f4639;font-weight:700;font-size:16px",
      "\nThanks for peeking under the hood. Tiny static site, good vibes only. ✌️"
    );
  } catch (_) {}

  document.addEventListener("DOMContentLoaded", () => {
    // 1) Footer year
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();

    // 2) Analytics wrapper (works with Plausible or GA4 if present)
    const track = (name, props = {}) => {
      try {
        // Plausible (no cookies, privacy-friendly)
        if (typeof window.plausible === "function") {
          window.plausible(name, { props });
        }
      } catch (_) {}

      try {
        // Google Analytics 4
        if (typeof window.gtag === "function") {
          window.gtag("event", name, props);
        }
      } catch (_) {}
    };

    // 3) Track "Book on Airbnb" clicks
    document
      .querySelectorAll('a[href*="airbnb.com/h/theramblersrest"]')
      .forEach((el) => {
        el.addEventListener("click", () => {
          const section = el.closest(".hero")
            ? "hero"
            : el.closest(".cta")
            ? "cta"
            : "other";
          track("book_now_click", {
            section,
            text: (el.textContent || "").trim(),
          });
        });
      });

    // 4) Track nav anchor clicks (About / Photos / Amenities)
    document.querySelectorAll('header nav a[href^="#"]').forEach((el) => {
      el.addEventListener("click", () => {
        track("nav_click", { target: el.getAttribute("href") });
      });
    });

    // 5) Lightbox for gallery images & track clicks
    const lightbox = document.getElementById("lightbox");
    const closeLightbox = () => {
      if (!lightbox) return;
      lightbox.classList.add("hidden");
      lightbox.innerHTML = "";
      document.body.style.overflow = "";
    };
    if (lightbox) {
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });

    document.querySelectorAll("#gallery .grid-photos img").forEach((img) => {
      img.addEventListener("click", () => {
        const file = (img.currentSrc || img.src || "").split("/").pop() || "";
        track("gallery_click", { image: file.toLowerCase() });
        if (lightbox) {
          lightbox.innerHTML = `<img src="${img.currentSrc || img.src}" alt="${img.alt}">`;
          lightbox.classList.remove("hidden");
          document.body.style.overflow = "hidden";
        }
      });
    });
  });
})();
