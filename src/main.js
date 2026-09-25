import "./styles.css";
import { defaultCard } from "./data/defaultCard.js";
import { getGiftCard } from "./services/cardRepository.js";

const query = new URLSearchParams(window.location.search);
const cardSlug = query.get("card") || defaultCard.slug;

const elements = {
  intro: document.querySelector("#intro"),
  experience: document.querySelector("#experience"),
  openExperience: document.querySelector("#open-experience"),
  revealTrip: document.querySelector("#reveal-trip"),
  tripSection: document.querySelector("#trip-section"),
  gallerySection: document.querySelector("#gallery-section"),
  photoGrid: document.querySelector("#photo-grid"),
  birthdayMessage: document.querySelector("#birthday-message"),
  introName: document.querySelector("#intro-name"),
  letterName: document.querySelector("#letter-name"),
  ticketName: document.querySelector("#ticket-name"),
  destinationTitle: document.querySelector("#destination-title"),
  ticketDestination: document.querySelector("#ticket-destination"),
  ticketValidUntil: document.querySelector("#ticket-valid-until"),
  validityBadge: document.querySelector("#validity-badge"),
  floatingIcons: document.querySelector("#floating-icons"),
  confettiLayer: document.querySelector("#confetti-layer"),
  dataSource: document.querySelector("#data-source")
};

let card = defaultCard;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function textToParagraphs(text) {
  return String(text)
    .trim()
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`)
    .join("");
}

function formatMonthYear(dateString) {
  if (!dateString) return "Septiembre de 2027";

  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "Septiembre de 2027";

  const text = new Intl.DateTimeFormat("es-CO", {
    month: "long",
    year: "numeric"
  }).format(date);

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getValidityState(validFrom, validUntil, active) {
  if (!active) return { label: "Promesa pausada", state: "paused" };

  const now = new Date();
  const start = validFrom ? new Date(`${validFrom}T00:00:00`) : null;
  const end = validUntil ? new Date(`${validUntil}T23:59:59`) : null;

  if (start && now < start) return { label: "Promesa activa", state: "active" };
  if (end && now > end) return { label: "Vigencia finalizada", state: "expired" };

  return { label: "Promesa activa", state: "active" };
}

function sanitizePhoto(photo) {
  if (!photo || typeof photo !== "object") return null;
  if (!/^https?:\/\//i.test(photo.url || "")) return null;

  return {
    url: photo.url,
    alt: String(photo.alt || "Recuerdo juntos").slice(0, 140),
    caption: String(photo.caption || "").slice(0, 180)
  };
}

function renderPhotos(photos) {
  const safePhotos = Array.isArray(photos) ? photos.map(sanitizePhoto).filter(Boolean) : [];

  if (!safePhotos.length) {
    elements.gallerySection.classList.add("is-hidden");
    return;
  }

  elements.photoGrid.replaceChildren();

  safePhotos.slice(0, 8).forEach((photo, index) => {
    const figure = document.createElement("figure");
    figure.className = `photo-card photo-card-${(index % 3) + 1}`;

    const image = document.createElement("img");
    image.src = photo.url;
    image.alt = photo.alt;
    image.loading = "lazy";
    image.decoding = "async";
    image.referrerPolicy = "no-referrer";

    figure.appendChild(image);

    if (photo.caption) {
      const caption = document.createElement("figcaption");
      caption.textContent = photo.caption;
      figure.appendChild(caption);
    }

    elements.photoGrid.appendChild(figure);
  });

  elements.gallerySection.classList.remove("is-hidden");
}

function renderCard(data, source) {
  card = { ...defaultCard, ...data };

  const recipient = card.recipient_name || "Hermanita";
  const destination = card.destination || "Brasil";
  const validity = getValidityState(card.valid_from, card.valid_until, card.active);

  document.title = `15 años · ${recipient}`;
  elements.introName.textContent = recipient;
  elements.letterName.textContent = recipient;
  elements.ticketName.textContent = recipient;
  elements.destinationTitle.textContent = destination;
  elements.ticketDestination.textContent = destination;
  elements.ticketValidUntil.textContent = formatMonthYear(card.valid_until);
  elements.birthdayMessage.innerHTML = textToParagraphs(card.message);
  elements.validityBadge.textContent = validity.label;
  elements.validityBadge.dataset.state = validity.state;
  elements.dataSource.textContent = source;

  renderPhotos(card.photos);
}

function createFloatingIcons() {
  const symbols = ["✦", "♥", "✈", "★", "♡", "✧"];
  const amount = window.innerWidth < 620 ? 10 : 18;

  const fragment = document.createDocumentFragment();

  for (let index = 0; index < amount; index += 1) {
    const icon = document.createElement("span");
    icon.className = "float-icon";
    icon.textContent = symbols[index % symbols.length];
    icon.style.left = `${Math.random() * 96}%`;
    icon.style.setProperty("--size", `${0.8 + Math.random() * 1.05}rem`);
    icon.style.setProperty("--duration", `${14 + Math.random() * 12}s`);
    icon.style.setProperty("--delay", `${Math.random() * -20}s`);
    icon.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
    fragment.appendChild(icon);
  }

  elements.floatingIcons.appendChild(fragment);
}

function launchConfetti() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const colors = ["#1f9d55", "#ffd83d", "#1f57a8", "#ffffff", "#ff78b7"];
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 90; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.setProperty("--fall", `${2.8 + Math.random() * 2.1}s`);
    piece.style.setProperty("--x", `${-140 + Math.random() * 280}px`);
    piece.style.setProperty("--spin", `${360 + Math.random() * 900}deg`);
    fragment.appendChild(piece);

    window.setTimeout(() => piece.remove(), 5200);
  }

  elements.confettiLayer.appendChild(fragment);
}

function setupScrollReveal() {
  const targets = document.querySelectorAll(".reveal-on-scroll");

  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((target) => observer.observe(target));
}

function openExperience() {
  elements.intro.classList.add("intro-opening");

  window.setTimeout(() => {
    elements.intro.classList.add("is-hidden");
    elements.experience.classList.remove("is-hidden");
    document.body.classList.add("experience-open");
    setupScrollReveal();
    window.scrollTo({ top: 0, behavior: "auto" });
  }, 650);
}

function revealTrip() {
  if (elements.revealTrip.getAttribute("aria-expanded") === "true") return;

  elements.revealTrip.setAttribute("aria-expanded", "true");
  elements.tripSection.classList.remove("is-hidden");
  elements.tripSection.classList.add("trip-revealed");
  launchConfetti();

  window.setTimeout(() => {
    setupScrollReveal();
    elements.tripSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 160);
}

elements.openExperience.addEventListener("click", openExperience);
elements.revealTrip.addEventListener("click", revealTrip);

createFloatingIcons();

const result = await getGiftCard(cardSlug);
renderCard(result.data, result.source);
