/* =====================================================================
   BASSAM & REJOYCE — invitation logic (vanilla JS, no dependencies)
   Everything you'll want to edit lives in the CONFIG block below.
   ===================================================================== */

/* ================== CONFIG ================== */
// 1) Paste your Google Apps Script Web App URL here (see README.md).
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwkXJ-BE0yP31Gn-OfDBkBpIIDdSdE3MFFCj5usV1qhiMta4Ehc-7cNNuBXVPrrvCBQxA/exec";

// 2) Event moment. Includes a timezone offset so every guest counts down to the same instant.
//    Cairo in October = +03:00. Change the time if the party starts later than midnight.
const WEDDING_DATE = new Date("2026-10-03T00:00:00+03:00");

// 3) Their story. Add, remove or reword entries freely.
const STORY = [
  {
    chapter: "Chapter I",
    year: "2017",
    icon: "⚡",
    title: "Hate at First Sight",
    subtitle: "Chemistry at an impressive absolute zero",
    text: "The very first time they crossed paths, they couldn't stand each other. No sparks, no romantic violins—just pure mutual eye-rolls. If someone had dared to tell them back then that they’d end up at the altar together, they would have been laughed out of the room!"
  },
  {
    chapter: "Chapter II",
    year: "2019",
    icon: "✈️",
    title: "Wait... Don't Leave",
    subtitle: "Checking in on each other until reality hit hard",
    text: "Occasional texts turned into daily conversations, and a genuine friendship began to bloom. But when the possibility came up that she might travel and move outside Egypt, Bassam suddenly realized he was definitely not okay with her being a thousand miles away. The plot thickened fast!"
  },
  {
    chapter: "Chapter III",
    year: "2020",
    icon: "🤫",
    title: "‘We Could NEVER Date’",
    subtitle: "Famous last words that Bassam happily ignored",
    text: "They had a serious conversation and solemnly agreed: 'We are strictly friends and could never, ever date.' Naturally, Bassam nodded politely, completely ignored that rule, and made his move anyway. Safe to say, it was the best decision of his life!"
  },
  {
    chapter: "Chapter IV",
    year: "2026",
    icon: "🥂",
    title: "The Promise",
    subtitle: "Walking hand in hand toward tomorrow",
    text: "Surrounded by the love and blessings of our dearest family and friends, we celebrate a love that found its home, and a promise that will last a lifetime."
  }
];

// 4) Memory wall. Drop your photos in /images and list them here.
//    rot = tilt in degrees, ratio = shape (width / height): 4/5 portrait, 1 square, 5/4 landscape.
const PHOTOS = [
  { src: "images/couple-01.jpg", alt: "Bassam and Rejoyce", caption: "One of our favorite memories", rot: -3,   ratio: "4/5" },
  { src: "images/couple-02.jpg", alt: "Bassam and Rejoyce", caption: "Somewhere we laughed a lot", rot: 2.5,  ratio: "1/1" },
  { src: "images/couple-03.jpg", alt: "Bassam and Rejoyce", caption: "The day it all felt easy",  rot: -1.5, ratio: "4/5" },
  { src: "images/couple-04.jpg", alt: "Bassam and Rejoyce", caption: "Just us, mid-conversation", rot: 3.5,  ratio: "4/5" },
  { src: "images/couple-05.jpg", alt: "Bassam and Rejoyce", caption: "Unplanned, unforgettable",  rot: -2.5, ratio: "1/1" },
  { src: "images/couple-06.jpg", alt: "Bassam and Rejoyce", caption: "Before the big day",        rot: 1.5,  ratio: "4/5" }
];

// 5) Guestbook. Add notes by hand here, e.g. { name: "Ahmed", message: "Wishing you a lifetime filled with joy." }
//    To load approved notes from your Google Sheet instead: deploy the Apps Script, set the flag below
//    to true, and type "yes" in the "Approved" column (D) of the Messages sheet for notes to show.
const guestMessages = [];
const LOAD_GUESTBOOK_FROM_SHEET = false;
/* ============ END CONFIG ============ */

(() => {
"use strict";
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const store = { get: k => { try { return sessionStorage.getItem(k) } catch { return null } }, set: (k, v) => { try { sessionStorage.setItem(k, v) } catch {} } };

/* ---------- music player & autoplay on box open ---------- */
const audio = $("#audio"), pl = $("#player"), lab = $("#playLabel");
const setPlay = on => {
  if (pl) { pl.classList.toggle("on", on); pl.setAttribute("aria-pressed", on); }
  if (lab) lab.textContent = on ? "Pause" : "Play their song";
};
if (pl && audio) {
  pl.addEventListener("click", () => {
    if (audio.paused) audio.play().then(() => setPlay(true)).catch(() => { if (lab) lab.textContent = "Add music/wedding-song.mp3"; });
    else { audio.pause(); setPlay(false); }
  });
}

/* ---------- top secret proposal overlay interaction ---------- */
const secOverlay = $("#secretOverlay");
const secSealBtn = $("#secretSealBtn");
const secActionBtn = $("#secretActionBtn");

if (secOverlay) {
  let opened = false;

  function openSecretInvitation(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (opened) return;
    opened = true;

    // Start playing wedding soundtrack immediately on box open
    if (audio && audio.paused) {
      audio.play().then(() => setPlay(true)).catch(() => {});
    }

    if (secSealBtn) secSealBtn.classList.add("broken");

    // Break seal and smoothly unveil invitation
    setTimeout(() => {
      secOverlay.classList.add("unveiled");
    }, 380);
  }

  if (secSealBtn) secSealBtn.addEventListener("click", openSecretInvitation);
  if (secActionBtn) secActionBtn.addEventListener("click", openSecretInvitation);
}

/* ---------- scroll reveal ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target) } }), { threshold: .15 });
const watch = el => io.observe(el);

/* ---------- creative love chapters timeline ---------- */
const tl = $("#timeline");
if (tl) {
  tl.innerHTML = STORY.map(s => `
    <li class="story-item rv">
      <div class="story-node-wrap" aria-hidden="true">
        <div class="story-node">
          <span class="node-icon">${s.icon}</span>
        </div>
      </div>
      <div class="story-card">
        <div class="story-badge">
          <span class="chap-badge">${s.chapter}</span>
          <span class="year-badge">${s.year}</span>
        </div>
        <h3 class="story-title">${s.title}</h3>
        <p class="story-subtitle">${s.subtitle}</p>
        <p class="story-text">${s.text}</p>
      </div>
    </li>
  `).join("");
}

/* ---------- memory wall ---------- */
const wall = $("#wall");
wall.innerHTML = PHOTOS.map(p => `<figure class="rv" tabindex="0" style="--r:${p.rot}deg;--ar:${p.ratio}"><img src="${p.src}" alt="${p.alt}" loading="lazy"><figcaption>${p.caption}</figcaption></figure>`).join("");
wall.addEventListener("error", e => e.target.closest("figure")?.classList.add("empty"), true);
$$(".rv").forEach(watch);

/* ---------- luxury royal arch countdown (100% zero-lag) ---------- */
const dayEl = $("#cnt-days"), hrEl = $("#cnt-hours"), minEl = $("#cnt-minutes"), secEl = $("#cnt-seconds");
function tick() {
  const ms = WEDDING_DATE - Date.now();
  if (ms <= 0) {
    $("#clock").hidden = true;
    $("#today").hidden = false;
    clearInterval(clock);
    return;
  }
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  if (dayEl) dayEl.textContent = String(d).padStart(2, "0");
  if (hrEl) hrEl.textContent = String(h).padStart(2, "0");
  if (minEl) minEl.textContent = String(m).padStart(2, "0");
  if (secEl) secEl.textContent = String(sec).padStart(2, "0");
}
const clock = setInterval(tick, 1000);
tick();

/* ---------- guestbook ---------- */
const notes = $("#notes"); let noteCount = 0;
function addNote(m, fresh) {
  $(".blank", notes)?.remove();
  const n = document.createElement("blockquote"), p = document.createElement("p"), c = document.createElement("cite");
  p.textContent = "“" + m.message + "”"; c.textContent = "— " + m.name;   // textContent: guest text is never parsed as HTML
  n.className = "note rv" + (fresh ? " drop in" : ""); n.style.setProperty("--r", (((noteCount++ * 53) % 9) - 4) * .8 + "deg");
  n.append(p, c); notes.prepend(n); if (!fresh) watch(n);
}
function blankState() { if (!notes.children.length) notes.innerHTML = '<p class="blank">The first note is waiting to be written.</p>' }
guestMessages.forEach(m => addNote(m)); blankState();
if (LOAD_GUESTBOOK_FROM_SHEET && !GOOGLE_SCRIPT_URL.startsWith("YOUR_"))
  fetch(GOOGLE_SCRIPT_URL + "?type=messages").then(r => r.json()).then(rows => { rows.forEach(m => addNote(m)); blankState() }).catch(() => {});

/* ---------- forms → Google Sheets ---------- */
async function send(payload) {
  if (GOOGLE_SCRIPT_URL.startsWith("YOUR_")) {                       // preview mode until you add your URL
    console.warn("GOOGLE_SCRIPT_URL is not set — nothing was saved.", payload);
    return new Promise(r => setTimeout(r, 700));
  }
  // text/plain + no-cors avoids the CORS preflight Apps Script can't answer; the request still arrives.
  await fetch(GOOGLE_SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
}
function validate(f, form) {
  for (const i of $$("[required]:not(:disabled)", form)) {
    if (!i.value.trim()) return `Please fill in: ${$(`label[for="${i.id}"]`).textContent.toLowerCase()}.`;
  }
  if (f.link) { try { if (!/^https?:$/.test(new URL(f.link).protocol)) throw 0 } catch { return "That song link doesn't look right. Start it with https://" } }
  return "";
}
function wire(form, build, done) {
  const btn = $("[type=submit]", form), msg = $(".msg", form); let busy = false;
  form.addEventListener("submit", async e => {
    e.preventDefault(); if (busy) return; msg.textContent = "";
    const f = Object.fromEntries(new FormData(form)); Object.keys(f).forEach(k => f[k] = String(f[k]).trim());
    const err = validate(f, form); if (err) { msg.textContent = err; return }
    busy = true; btn.disabled = true; form.classList.add("loading");
    try {
      await send({ ...build(f), timestamp: new Date().toISOString() });
      
      // Smooth fade & scale out of the form
      form.style.transition = "opacity .3s ease, transform .3s ease";
      form.style.opacity = "0";
      form.style.transform = "scale(.96)";
      
      setTimeout(() => {
        form.hidden = true;
        form.style.display = "none";
        done(f, form.closest(".card"));
      }, 300);
    }
    catch {
      msg.textContent = "That didn't go through. Check your connection and try again.";
      busy = false; btn.disabled = false;
    }
    form.classList.remove("loading");
  });
}

function triggerEnvelope(card, letterInfo, celebrationInfo, callback) {
  const stage = $(".envelope-stage", card);
  if (!stage) { if (callback) callback(); return; }

  const tEl = $(".env-paper-title", stage);
  const dEl = $(".env-paper-desc", stage);
  const aEl = $(".env-paper-author", stage);
  const bEl = $(".env-paper-badge", stage);
  const spEl = $(".env-sparkles", stage);
  const stEl = $(".env-status-title", stage);
  const sdEl = $(".env-status-desc", stage);

  if (tEl) tEl.textContent = letterInfo.title || "";
  if (dEl) dEl.textContent = letterInfo.desc || "";
  if (aEl) aEl.textContent = letterInfo.author || "";
  if (bEl) bEl.textContent = letterInfo.badge || "Bassam & Rejoyce";
  if (spEl) spEl.textContent = celebrationInfo.icon || "✨";
  if (stEl) stEl.textContent = celebrationInfo.title || "Sealed with Love";
  if (sdEl) sdEl.textContent = celebrationInfo.desc || "";

  const env = $(".envelope", stage);
  const cel = $(".env-celebration", stage);

  if (cel) cel.classList.toggle("sad", Boolean(celebrationInfo.isSad));
  env.classList.remove("step-slide", "step-flap", "step-seal");
  cel.classList.remove("show");
  
  // Explicitly activate display
  stage.hidden = false;
  stage.classList.add("active");

  if (reduce) {
    env.classList.add("step-slide", "step-flap", "step-seal");
    cel.classList.add("show");
    if (callback) callback();
    return;
  }

  // Step 1: Slide paper down inside envelope pocket
  setTimeout(() => { env.classList.add("step-slide"); }, 400);

  // Step 2: Flap rotates down from open (180deg) to closed (0deg)
  setTimeout(() => { env.classList.add("step-flap"); }, 1300);

  // Step 3: B&R Wax seal stamps down with bounce & shockwave
  setTimeout(() => { env.classList.add("step-seal"); }, 2050);

  // Step 4: Celebration text appears
  setTimeout(() => {
    cel.classList.add("show");
    if (callback) callback();
  }, 2650);
}

wire($("#songForm"), f => ({ type: "song", name: f.name, song: f.song, platform: f.platform, link: f.link || "" }), (f, card) => {
  triggerEnvelope(card, {
    title: `🎵 ${f.song}`,
    desc: `Added on ${f.platform} to Bassam & Rejoyce's wedding soundtrack`,
    author: `— ${f.name}`
  }, {
    title: "Sealed into their Soundtrack",
    desc: "Your song is now part of the melody of their special day."
  });
});

wire($("#msgForm"), f => ({ type: "message", name: f.name, message: f.message }), (f, card) => {
  triggerEnvelope(card, {
    title: "Words for a Lifetime",
    desc: `“${f.message}”`,
    author: `— ${f.name}`
  }, {
    title: "Sealed with Love",
    desc: "Your words are now sealed into Bassam & Rejoyce's story."
  }, () => {
    addNote(f, true);
    setTimeout(() => {
      $("#guestbook").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    }, 1200);
  });
});

/* ---------- RSVP ---------- */
let attend = "";
const rForm = $("#rsvpForm"), rCard = $("#rsvpCard"), rSadCard = $("#rsvpSadCard");
const sadSwitchBtn = $("#sadSwitchBtn");

$$(".choice").forEach(b => b.addEventListener("click", () => {
  attend = b.dataset.a;
  $$(".choice").forEach(x => x.setAttribute("aria-pressed", x === b));
  
  if (attend === "yes") {
    // Show reservation form, hide sad card
    if (rSadCard) rSadCard.hidden = true;
    rCard.hidden = false;
    rForm.hidden = false;
    rForm.style.display = "";
    rForm.style.opacity = "";
    rForm.style.transform = "";
    $(".thanks", rCard).hidden = true;
    
    const stage = $(".envelope-stage", rCard);
    if (stage) {
      stage.hidden = true;
      stage.classList.remove("active");
      const env = $(".envelope", stage);
      if (env) env.classList.remove("step-slide", "step-flap", "step-seal");
      const cel = $(".env-celebration", stage);
      if (cel) cel.classList.remove("show");
    }
  } else {
    // Decline: Hide form, show sad message directly (no inputs, no sending)
    rCard.hidden = true;
    if (rSadCard) {
      rSadCard.hidden = false;
      rSadCard.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
    }
  }
}));

if (sadSwitchBtn) {
  sadSwitchBtn.addEventListener("click", () => {
    const yesBtn = $('.choice[data-a="yes"]');
    if (yesBtn) yesBtn.click();
  });
}

wire(rForm, f => ({ type: "rsvp", name: f.name, attendance: "Attending" }),
  (f, card) => {
    triggerEnvelope(card, {
      badge: "Bassam & Rejoyce",
      title: "I'll be there! 🥂",
      desc: "Seat reserved! Counting down the days until we celebrate together!",
      author: `— ${f.name}`
    }, {
      icon: "✨",
      title: "Your Seat is Sealed ✨",
      desc: "Bassam & Rejoyce are overjoyed and look forward to celebrating with you."
    });
  });

/* ---------- interactive dress code wardrobe ---------- */
function initDressCode(stageId, colorNameId) {
  const stage = $(stageId);
  const card = stage ? stage.closest(".dresscode-card") : null;
  const nameEl = $(colorNameId);
  if (!stage || !card) return;

  const imgs = $$(".dresscode-img", stage);
  const swatches = $$(".swatch", card);

  swatches.forEach(swatch => {
    swatch.addEventListener("click", () => {
      const color = swatch.dataset.color;
      const name = swatch.dataset.name;

      // Update active swatch
      swatches.forEach(s => {
        const isCurrent = s === swatch;
        s.classList.toggle("active", isCurrent);
        s.setAttribute("aria-checked", isCurrent);
      });

      // Update model image crossfade
      imgs.forEach(img => {
        img.classList.toggle("active", img.dataset.color === color);
      });

      // Update color name text
      if (nameEl) nameEl.textContent = name;
    });
  });
}

initDressCode("#manStage", "#manColorName");
initDressCode("#womanStage", "#womanColorName");


/* ---------- scroll: cover turn, timeline growth, easter egg ---------- */
const cover = $("#cover"), egg = $("#egg");
let queued = false;
let scrollSamples = [];
let eggActive = false;
let eggCooldown = false;

function onScroll() {
  queued = false;
  const y = scrollY, vh = innerHeight;
  if (cover) cover.style.setProperty("--p", Math.min(1, y / vh).toFixed(3));
  if (tl) {
    const r = tl.getBoundingClientRect();
    tl.style.setProperty("--g", Math.max(0, Math.min(1, (vh * .65 - r.top) / r.height)).toFixed(3));
  }
  
  const now = performance.now();
  scrollSamples.push({ y, t: now });
  // Keep only the last 300ms of scroll events
  while (scrollSamples.length > 0 && now - scrollSamples[0].t > 300) {
    scrollSamples.shift();
  }

  // ULTRA-FAST SCROLL ONLY: Requires moving > 1100px in under 250ms with speed > 4.8 px/ms
  // Absolutely never triggers during normal or moderate scrolling
  if (egg && !eggActive && !eggCooldown && scrollSamples.length >= 2 && y > 350) {
    const oldest = scrollSamples[0];
    const dt = now - oldest.t;
    const dy = y - oldest.y;
    if (dt >= 40 && dy > 1100 && (dy / dt) > 4.8) {
      eggActive = true;
      eggCooldown = true;
      scrollSamples = [];
      egg.classList.add(reduce ? "still" : "show");
      setTimeout(() => {
        egg.classList.remove("show", "still");
        eggActive = false;
        // Re-arm after 10 seconds cooldown
        setTimeout(() => { eggCooldown = false; }, 10000);
      }, reduce ? 5000 : 7000);
    }
  }
}
addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(onScroll) } }, { passive: true });
onScroll();
})();
