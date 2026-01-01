const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => [...p.querySelectorAll(s)];

const links = qsa('[data-scroll]');
const burger = qs('#burger');
const mobile = qs('#mobile');
const year = qs('#year');
const contactForm = qs('#contactForm');
const formHint = qs('#formHint');
const expYearsEl = qs('#expYears');

if (year) year.textContent = new Date().getFullYear();

function closeMobile() {
    if (!mobile || !burger) return;
    mobile.classList.remove('is-open');
    mobile.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
}

function openMobile() {
    if (!mobile || !burger) return;
    mobile.classList.add('is-open');
    mobile.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
}

if (burger) {
    burger.addEventListener('click', () => {
        const isOpen = mobile.classList.contains('is-open');
        if (isOpen) closeMobile();
        else openMobile();
    });
}

document.addEventListener('click', (e) => {
    if (!mobile || !burger) return;
    const isOpen = mobile.classList.contains('is-open');
    if (!isOpen) return;
    const clickedInside = mobile.contains(e.target) || burger.contains(e.target);
    if (!clickedInside) closeMobile();
});

links.forEach((a) => {
    a.addEventListener('click', (e) => {
        const href = a.getAttribute('href') || '';
        if (!href.startsWith('#')) return;
        const target = qs(href);
        if (!target) return;
        e.preventDefault();
        closeMobile();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

const revealEls = qsa('.reveal');
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((en) => {
            if (en.isIntersecting) {
                en.target.classList.add('is-visible');
                revealObserver.unobserve(en.target);
            }
        });
    },
    { threshold: 0.12 }
);
revealEls.forEach((el) => revealObserver.observe(el));

const sections = qsa('section[id]');
const navLinks = qsa('.topnav__link');
const dockLinks = qsa('.dock__btn');

function clearActive() {
    navLinks.forEach((l) => l.classList.remove('is-active'));
    dockLinks.forEach((l) => l.classList.remove('is-active'));
}

function setActive(id) {
    clearActive();
    navLinks.forEach((l) => {
        if (l.getAttribute('href') === `#${id}`) l.classList.add('is-active');
    });
    dockLinks.forEach((l) => {
        if (l.getAttribute('href') === `#${id}`) l.classList.add('is-active');
    });
}

const sectionObserver = new IntersectionObserver(
    (entries) => {
        const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
    },
    { threshold: [0.22, 0.35, 0.5] }
);
sections.forEach((s) => sectionObserver.observe(s));

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(contactForm);
        const name = (fd.get('name') || '').toString().trim();
        const email = (fd.get('email') || '').toString().trim();
        const message = (fd.get('message') || '').toString().trim();

        const text =
            `Hi Jakub,\n\n` +
            `My name is ${name} (${email}).\n\n` +
            `${message}\n\n` +
            `Best regards,\n${name}`;

        try {
            await navigator.clipboard.writeText(text);
            if (formHint) formHint.textContent = 'Copied. Paste into LinkedIn/email.';
            contactForm.reset();
            setTimeout(() => {
                if (formHint) formHint.textContent = 'Paste into LinkedIn/email.';
            }, 2400);
        } catch {
            if (formHint) formHint.textContent = 'Copy failed. Select and copy manually.';
        }
    });
}

const expStartYear = 2022;
const currentYear = new Date().getFullYear();
const years = Math.max(1, currentYear - expStartYear);
if (expYearsEl) expYearsEl.textContent = `${years}+`;
