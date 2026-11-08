document.documentElement.classList.add("js");

// 스크롤하면 내비게이션에 그림자
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// 모바일 메뉴
const toggle = document.querySelector(".nav__toggle");
const mobileMenu = document.getElementById("mobile-menu");
const setMenu = (open) => {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  mobileMenu.hidden = !open;
};
toggle.addEventListener("click", () => setMenu(mobileMenu.hidden));
mobileMenu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

// 화면에 들어오면 나타나기
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-in"));
}

// 관리자 웹 기능 탭 (화살표 키로 이동)
for (const root of document.querySelectorAll("[data-tabs]")) {
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const select = (tab, focus) => {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    }
    if (focus) tab.focus();
  };
  root.addEventListener("click", (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab) select(tab, false);
  });
  root.addEventListener("keydown", (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(tabs[(next + tabs.length) % tabs.length], true);
  });
}

// 스크린샷 크게 보기
const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox.querySelector("img");
const openZoom = (src, alt) => {
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightbox.showModal();
};
lightbox.querySelector(".lightbox__close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });

document.querySelectorAll("[data-zoom]").forEach((btn) => {
  btn.addEventListener("click", () => openZoom(btn.dataset.zoom, btn.getAttribute("aria-label")));
});
document.querySelectorAll(".section .browser img, .phones .phone img").forEach((img) => {
  img.classList.add("zoomable");
  img.tabIndex = 0;
  img.setAttribute("role", "button");
  const open = () => openZoom(img.currentSrc || img.src, img.alt);
  img.addEventListener("click", open);
  img.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
  });
});
