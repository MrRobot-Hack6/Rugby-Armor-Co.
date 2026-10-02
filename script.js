const IMG = {
  blue_b: "_images/blueBack.jpeg",
  group: "_images/groupPR.jpeg",
  poster: "_images/Hero.jpeg",
  blue: "_images/blueFront.jpeg",
  red_f: "_images/redFront.jpeg",
  grey: "_images/whiteFront.jpeg",
  pink_f: "_images/pinkFront.jpeg",
  pink_b: "_images/pinkBack.jpeg",
  kid_black: "_images/group2WRB.jpeg",
  steps: "_images/groupGPR.jpeg",
  dark_f: "_images/blackFrontDesign1.jpeg",
  dark_b: "_images/blackBackDesign1.jpeg",
  green_f: "_images/greenFront.jpeg",
  green_b: "_images/blueBack.jpeg",
  red_b: "_images/groupWRB.jpeg",
};
const SIZES = ["S", "M", "L", "XL", "XXL"];
const PRODUCTS = [
  {
    id: "pink",
    imgs: ["pink_f", "pink_b"],
    name: '"Armor of God" Pink Performance Tee',
    note: "Ephesians 6:11 printed on the back",
    price: 449,
    body: "#FF1493",
    trim: "#D4AF37",
    text: "ARMOR OF GOD",
  },
  {
    id: "lion",
    imgs: ["red_f", "red_b"],
    name: '"Ek Sal Niks Vrees Nie" Lion Red Tee',
    note: "Psalm 23 with a bold back print",
    price: 449,
    body: "#C0392B",
    trim: "#0F0F0F",
    text: "EK SAL NIKS VREES NIE",
  },
  {
    id: "flame",
    imgs: ["dark_f", "dark_b"],
    name: '"Never Giving Up" Dark Flame Rugby Tee',
    note: "Flame graphic, moisture-wicking fabric",
    price: 469,
    body: "#1A1A1A",
    trim: "#C0392B",
    text: "NEVER GIVING UP",
  },
  {
    id: "slate",
    imgs: ["grey"],
    name: "Classic Slate Grey & Gold Performance Jersey",
    note: "Match-ready cut with gold collar",
    price: 499,
    body: "#4B5560",
    trim: "#D4AF37",
    text: "ARMOR RUGBY",
  },
  {
    id: "royal",
    imgs: ["blue", "blue_b"],
    name: "Royal Blue & Gold Shield Edition Jersey",
    note: "Shield of Faith crest on the chest",
    price: 499,
    body: "#0055B8",
    trim: "#D4AF37",
    text: "SHIELD OF FAITH",
  },
  {
    id: "green",
    imgs: ["green_f"],
    name: 'Joshua 1:9 "Wees Sterk en Dapper" Lime Jersey',
    note: "Joshua 1:9 design on the front",
    price: 469,
    body: "#7ED321",
    trim: "#D4AF37",
    text: "WEES STERK EN DAPPER",
  },
];
const PILLARS = [
  ["🛡️", "Shield of Faith", "Stand firm when the pressure is on."],
  ["⛑️", "Helmet of Salvation", "Play with a settled mind."],
  ["🦺", "Breastplate of Righteousness", "Integrity on and off the field."],
  ["🎗️", "Belt of Truth", "Hold the line. Be honest."],
  ["👟", "Shoes of the Gospel", "Ready to move, ready to serve."],
  ["⚔️", "Sword of the Spirit", "Words and prayer that cut through."],
];

const fmt = (n) => CONFIG.currency + n.toFixed(2);
const $ = (s) => document.querySelector(s);
const esc = (s) =>
  s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

function tee(p, w = 220) {
  const lines =
    p.text.length > 14
      ? [
          p.text.slice(0, p.text.lastIndexOf(" ", 14)),
          p.text.slice(p.text.lastIndexOf(" ", 14) + 1),
        ]
      : [p.text];
  const txtCol = ["#1A1A1A", "#4B5560", "#C0392B"].includes(p.body)
    ? "#D4AF37"
    : "#fff";
  return `<svg width="${w}" viewBox="0 0 200 200" role="img" aria-label="${esc(p.name)}">
    <path d="M60 20 L18 52 L40 84 L56 72 L56 182 L144 182 L144 72 L160 84 L182 52 L140 20 Q100 48 60 20Z" fill="${p.body}" stroke="${p.trim}" stroke-width="3"/>
    <path d="M60 20 Q100 48 140 20" fill="none" stroke="${p.trim}" stroke-width="6"/>
    ${lines.map((l, i) => `<text x="100" y="${112 + i * 16}" text-anchor="middle" font-family="Oswald,Impact,sans-serif" font-size="${lines.length > 1 ? 15 : 17}" font-weight="700" fill="${txtCol}">${esc(l)}</text>`).join("")}
    <rect x="70" y="150" width="60" height="4" fill="${p.trim}"/></svg>`;
}

/* ============ Cart state ============ */
let cart = [];
try {
  cart = JSON.parse(localStorage.getItem("armor-cart") || "[]");
} catch (e) {}
const save = () => {
  try {
    localStorage.setItem("armor-cart", JSON.stringify(cart));
  } catch (e) {}
};
const total = () => cart.reduce((s, i) => s + i.price * i.qty, 0);

function addToCart(id, size) {
  const p = PRODUCTS.find((x) => x.id === id);
  const line = cart.find((i) => i.id === id && i.size === size);
  line
    ? line.qty++
    : cart.push({ id, size, name: p.name, price: p.price, qty: 1 });
  renderCart();
  openDrawer();
}
function changeQty(idx, d) {
  cart[idx].qty += d;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  renderCart();
}
function renderCart() {
  save();
  $("#cartCount").textContent = cart.reduce((s, i) => s + i.qty, 0);
  $("#cartTotal").textContent = fmt(total());
  $("#checkoutBtn").disabled = !cart.length;
  $("#cartItems").innerHTML = cart.length
    ? cart
        .map(
          (i, n) => `
    <div class="flex gap-3 items-center bg-ink rounded p-3">
      <div class="flex-1 min-w-0"><p class="text-sm font-semibold">${esc(i.name)}</p>
        <p class="text-xs text-white/60">Size ${i.size} · ${fmt(i.price)}</p></div>
      <div class="flex items-center gap-2">
        <button class="qty px-2 border border-white/30 rounded" data-i="${n}" data-d="-1" aria-label="Decrease">−</button>
        <span>${i.qty}</span>
        <button class="qty px-2 border border-white/30 rounded" data-i="${n}" data-d="1" aria-label="Increase">+</button>
      </div></div>`,
        )
        .join("")
    : '<p class="text-white/60">Your cart is empty. Pick a tee from the collection to get started.</p>';
}
const openDrawer = () => {
  $("#drawer").classList.remove("translate-x-full");
  $("#overlay").classList.remove("hidden");
};
const closeDrawer = () => {
  $("#drawer").classList.add("translate-x-full");
  $("#overlay").classList.add("hidden");
};

/* ============ Checkout ============ */
function openPay() {
  $("#payTotal").textContent = fmt(total());
  $("#payMsg").textContent = "";
  $("#payModal").classList.replace("hidden", "flex");
}
function closePay() {
  $("#payModal").classList.replace("flex", "hidden");
}

function buildWhatsAppMessage() {
  const lines = cart.map(
    (item) =>
      `${item.qty} x ${item.name} (${item.size}) - ${fmt(item.price * item.qty)}`,
  );

  return [
    "Hello Armor Rugby Co., I would like to place this order:",
    ...lines,
    "",
    `Total: ${fmt(total())}`,
    "",
    "Please confirm availability and payment details.",
  ].join("\n");
}

function sendWhatsAppOrder() {
  const msg = $("#payMsg");

  if (!cart.length) {
    msg.className = "mt-4 text-sm text-crimson";
    msg.textContent = "Your cart is empty.";
    return;
  }

  const text = encodeURIComponent(buildWhatsAppMessage());
  const waUrl = `https://wa.me/${CONFIG.whatsappNumber || "27827992209"}?text=${text}`;

  msg.className = "mt-4 text-sm text-gold";
  msg.textContent = "Opening WhatsApp with your order...";
  window.open(waUrl, "_blank", "noopener,noreferrer");
}

async function startCheckout(gateway) {
  const msg = $("#payMsg");
  msg.className = "mt-4 text-sm";
  msg.textContent = "Preparing your order...";

  if (!CONFIG.checkoutEndpoint) {
    sendWhatsAppOrder();
    return;
  }

  try {
    const res = await fetch(CONFIG.checkoutEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gateway,
        currency: "ZAR",
        items: cart.map(({ id, size, qty }) => ({ id, size, qty })),
      }),
    });
    const data = await res.json();
    if (!data.url) throw new Error("No payment URL returned");
    location.href = data.url;
  } catch (e) {
    msg.className = "mt-4 text-sm text-crimson";
    msg.textContent =
      "Payment could not start. Please try again or send the order via WhatsApp.";
    sendWhatsAppOrder();
  }
}

/* ============ Email (EmailJS or simulated) ============ */
async function sendEmail(templateKey, params) {
  const c = CONFIG.emailjs;
  if (c.publicKey && c.serviceId && c[templateKey] && window.emailjs) {
    await emailjs.send(c.serviceId, c[templateKey], params, {
      publicKey: c.publicKey,
    });
    return "sent";
  }
  await new Promise((r) => setTimeout(r, 600));
  console.info("[Simulated email]", templateKey, params);
  return "simulated";
}

/* ============ Init ============ */
document.addEventListener("DOMContentLoaded", () => {
  $("#posterImg").src = IMG.poster;
  $("#yr").textContent = new Date().getFullYear();
  $("#heroArt").innerHTML =
    `<img src="${IMG.red_b}" alt="Player in the Ek Sal Niks Vrees Nie lion jersey" class="rounded-lg w-full max-w-sm max-h-[560px] object-cover border-2 border-gold">`;
  $("#gallery").innerHTML = [
    [
      "group",
      "Three players in the grey, red and blue Armor Rugby Co. jerseys",
    ],
    ["steps", "Teammates in Armor Rugby Co. kit on the stands"],
    ["green_b", "Lineout in the Joshua 1:9 jersey"],
    ["kid_black", "Young player holding a rugby ball"],
  ]
    .map(
      (g) =>
        `<img src="${IMG[g[0]]}" alt="${g[1]}" loading="lazy" class="w-full h-72 sm:h-96 object-cover rounded-lg">`,
    )
    .join("");
  $("#pillars").innerHTML = PILLARS.map(
    (p) =>
      `<div class="bg-ink border border-white/10 rounded-lg p-5"><div class="text-3xl">${p[0]}</div><h3 class="font-head text-xl mt-2 text-gold">${p[1]}</h3><p class="text-white/70 text-sm mt-1">${p[2]}</p></div>`,
  ).join("");

  const sel = {};
  $("#products").innerHTML = PRODUCTS.map((p) => {
    sel[p.id] = "M";
    return `
    <article class="bg-coal rounded-lg overflow-hidden border border-white/10 flex flex-col" data-id="${p.id}">
      <div class="relative bg-black aspect-[3/4]"><img class="pimg w-full h-full object-cover" src="${IMG[p.imgs[0]]}" alt="${esc(p.name)}" loading="lazy">${p.imgs.length > 1 ? '<button class="flip absolute bottom-2 right-2 bg-ink/85 text-xs px-3 py-1.5 rounded border border-white/30">View back</button>' : ""}</div>
      <div class="p-5 flex-1 flex flex-col">
        <h3 class="font-head text-xl leading-tight">${esc(p.name)}</h3>
        <p class="text-sm text-white/60 mt-1">${esc(p.note)}</p>
        <p class="text-gold text-2xl font-head mt-3">${fmt(p.price)}</p>
        <div class="flex flex-wrap gap-2 mt-3" role="group" aria-label="Size">
          ${SIZES.map((s) => `<button class="size" data-size="${s}" aria-pressed="${s === "M"}">${s}</button>`).join("")}
        </div>
        <button class="add mt-5 bg-crimson hover:brightness-110 font-bold py-3 rounded mt-auto">Add to cart</button>
      </div></article>`;
  }).join("");

  $("#products").addEventListener("click", (e) => {
    const card = e.target.closest("article");
    if (!card) return;
    const id = card.dataset.id;
    if (e.target.classList.contains("size")) {
      sel[id] = e.target.dataset.size;
      card
        .querySelectorAll(".size")
        .forEach((b) => b.setAttribute("aria-pressed", b === e.target));
    } else if (e.target.classList.contains("flip")) {
      const p = PRODUCTS.find((x) => x.id === id),
        v = card.dataset.v === "1" ? 0 : 1;
      card.dataset.v = v;
      card.querySelector(".pimg").src = IMG[p.imgs[v]];
      e.target.textContent = v ? "View front" : "View back";
    } else if (e.target.classList.contains("add")) addToCart(id, sel[id]);
  });
  $("#cartItems").addEventListener("click", (e) => {
    const b = e.target.closest(".qty");
    if (b) changeQty(+b.dataset.i, +b.dataset.d);
  });
  $("#openCart").onclick = openDrawer;
  $("#closeCart").onclick = closeDrawer;
  $("#overlay").onclick = closeDrawer;
  $("#checkoutBtn").onclick = () => {
    closeDrawer();
    openPay();
  };
  $("#payClose").onclick = () => {
    closePay();
    openDrawer();
  };
  $("#whatsappOrderBtn").onclick = () => sendWhatsAppOrder();
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
      closePay();
    }
  });

  $("#contactForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("#sendBtn"),
      msg = $("#formMsg");
    btn.disabled = true;
    btn.textContent = "Sending...";
    try {
      const mode = await sendEmail(
        "contactTemplateId",
        Object.fromEntries(new FormData(e.target)),
      );
      msg.className = "text-sm text-gold";
      msg.textContent =
        mode === "sent"
          ? "Thanks! Your message is on its way to our inbox."
          : "Demo mode: message captured in the console. Add your EmailJS keys in CONFIG to deliver it.";
      e.target.reset();
    } catch (err) {
      msg.className = "text-sm text-crimson";
      msg.textContent =
        "Your message was not sent. Please check your connection and try again.";
    }
    btn.disabled = false;
    btn.textContent = "Send message";
  });
  $("#newsletter").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await sendEmail(
        "newsletterTemplateId",
        Object.fromEntries(new FormData(e.target)),
      );
      $("#nlMsg").textContent = "You are on the list.";
      e.target.reset();
    } catch (err) {
      $("#nlMsg").textContent = "Could not subscribe. Please try again.";
    }
  });
  renderCart();
});
