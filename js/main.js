/* ════════════════════════════════════════
   섹션 스냅 스크롤 (easeInOutCubic)
════════════════════════════════════════ */
const snapContainer = document.getElementById('snapContainer');
const snapSections  = [...document.querySelectorAll('.snap-section')];
let snapCurrent = 0;
let snapLocked  = false;

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// 현재 보이는 섹션 추적
const snapObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            snapCurrent = snapSections.indexOf(entry.target);
        }
    });
}, { root: snapContainer, threshold: 0.5 });
snapSections.forEach(s => snapObserver.observe(s));

// 섹션 진입/이탈 애니메이션
const enterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const all = [
            ...entry.target.querySelectorAll('.fade-up'),
            ...entry.target.querySelectorAll('.stone')
        ];

        if (entry.isIntersecting) {
            all.forEach(el => {
                el.classList.remove('is-leaving');
                el.classList.add('is-visible');
            });
        } else {
            all.forEach(el => {
                el.classList.remove('is-visible');
                el.classList.add('is-leaving');
                setTimeout(() => {
                    el.classList.remove('is-leaving');
                    el.style.transition = 'none';
                    void el.offsetHeight;
                    el.style.transition = '';
                }, 350);
            });
        }
    });
}, { root: snapContainer, threshold: 0.35 });
snapSections.forEach(s => enterObserver.observe(s));

function goToSection(idx) {
    if (idx < 0 || idx >= snapSections.length || snapLocked) return;
    snapLocked  = true;
    snapCurrent = idx;

    const prevSnap = snapContainer.style.scrollSnapType;
    snapContainer.style.scrollSnapType = 'none';

    const startY   = snapContainer.scrollTop;
    const targetY  = snapSections[idx].offsetTop;
    const distance = targetY - startY;
    const duration = 750;
    let startTime  = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed  = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        snapContainer.scrollTop = startY + distance * easeInOutCubic(progress);
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            snapContainer.style.scrollSnapType = prevSnap;
            snapLocked = false;
        }
    }

    requestAnimationFrame(step);
}

snapContainer.addEventListener('wheel', e => {
    if (snapLocked) { e.preventDefault(); return; }
    e.preventDefault();
    if (e.deltaY > 0) goToSection(snapCurrent + 1);
    else              goToSection(snapCurrent - 1);
}, { passive: false });

/* ════════════════════════════════════════
   최상단 플로팅 버튼
════════════════════════════════════════ */
const scrollTopBtn = document.getElementById('scrollTopBtn');
scrollTopBtn.addEventListener('click', () => goToSection(0));

const btnObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.target.id === 'hero') {
            scrollTopBtn.classList.toggle('visible', !entry.isIntersecting);
        }
    });
}, { root: snapContainer, threshold: 0.5 });
btnObserver.observe(document.getElementById('hero'));

/* ════════════════════════════════════════
   사이드 네비
════════════════════════════════════════ */
const sideNav      = document.getElementById('side-nav');
const sideNavItems = [...sideNav.querySelectorAll('.side-nav-item')];
const lightSections = ['about', 'design'];

function updateSideNav(activeSectionId) {
    const isHero = activeSectionId === 'hero';
    sideNav.classList.toggle('is-visible', !isHero);
    sideNav.classList.toggle('light', lightSections.includes(activeSectionId));
    sideNavItems.forEach(item => {
        item.classList.toggle('active', item.dataset.target === activeSectionId);
    });
}

const sideNavObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) updateSideNav(entry.target.id);
    });
}, { root: snapContainer, threshold: 0.5 });
snapSections.forEach(s => sideNavObserver.observe(s));

sideNavItems.forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        const targetIdx = snapSections.findIndex(s => s.id === item.dataset.target);
        if (targetIdx !== -1) goToSection(targetIdx);
    });
});

// 히어로 네비 바로가기
document.querySelectorAll('.hero-nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetIdx = snapSections.findIndex(s => s.id === link.getAttribute('href').slice(1));
        if (targetIdx !== -1) goToSection(targetIdx);
    });
});

/* ════════════════════════════════════════
   Apps 렌더
════════════════════════════════════════ */
const isMobile     = window.innerWidth <= 768;
const isLandscape  = window.matchMedia('(orientation: landscape)').matches;
const APPS_PER_ROW = isMobile ? (isLandscape ? 3 : 4) : 3;

function renderApps() {
    const wrap      = document.getElementById('portCardsWrap');
    const indicator = document.getElementById('portIndicator');

    for (let i = 0; i < APPS_DATA.length; i += APPS_PER_ROW) {
        const chunk = APPS_DATA.slice(i, i + APPS_PER_ROW);
        const row   = document.createElement('div');
        row.className = 'portfolio-cards ' + (i === 0 ? 'port-row' : 'port-row--hidden');

        chunk.forEach(app => {
            const card = document.createElement('a');
            card.href      = app.link;
            card.className = 'port-card';
            card.innerHTML = `
                <img src="${app.img}" alt="${app.title}" onerror="this.style.display='none'">
                <div class="port-card-overlay"></div>
                <div class="port-card-content">
                    <span class="port-card-tag">${app.tag}</span>
                    <div class="port-card-bottom">
                        <h3 class="port-card-title">${app.title}</h3>
                        ${app.sub1 ? `<p class="port-card-sub1">${app.sub1}</p>` : ''}
                        <p class="port-card-sub">${app.sub}</p>
                    </div>
                </div>`;
            row.appendChild(card);
        });

        wrap.appendChild(row);
    }

    const rowCount = Math.ceil(APPS_DATA.length / APPS_PER_ROW);
    for (let i = 0; i < rowCount; i++) {
        const dot = document.createElement('span');
        dot.className = 'port-dot' + (i === 0 ? ' port-dot--active' : '');
        indicator.appendChild(dot);
    }
}

/* ════════════════════════════════════════
   Design 렌더
════════════════════════════════════════ */
const TILES_PER_PAGE = window.innerWidth <= 768 ? 6 : 8;

function renderDesign() {
    const track = document.getElementById('designTrack');

    for (let i = 0; i < DESIGN_DATA.length; i += TILES_PER_PAGE) {
        const chunk = DESIGN_DATA.slice(i, i + TILES_PER_PAGE);
        const page  = document.createElement('div');
        page.className = 'design-page';

        chunk.forEach(item => {
            const tile = document.createElement('div');
            tile.className = 'design-tile';
            tile.innerHTML = `<img src="${item.src}" alt="${item.alt}" onerror="this.style.display='none'">`;
            page.appendChild(tile);
        });

        track.appendChild(page);
    }
}

renderApps();
renderDesign();

/* ════════════════════════════════════════
   Design 슬라이더
════════════════════════════════════════ */
const designTrack = document.getElementById('designTrack');
const designPrev  = document.getElementById('designPrev');
const designNext  = document.getElementById('designNext');
let designCurrent = 0;

function goDesignPage(idx) {
    const pages   = designTrack.querySelectorAll('.design-page');
    designCurrent = Math.max(0, Math.min(idx, pages.length - 1));
    designTrack.style.transform = `translateX(-${designCurrent * 100}%)`;
    designPrev.disabled = designCurrent === 0;
    designNext.disabled = designCurrent === pages.length - 1;
}

designPrev.addEventListener('click', () => goDesignPage(designCurrent - 1));
designNext.addEventListener('click', () => goDesignPage(designCurrent + 1));
goDesignPage(0);

/* ════════════════════════════════════════
   Apps 페이지 전환
════════════════════════════════════════ */
const portSection = document.getElementById('portfolio');
let portCurrent   = 0;
let portAnimating = false;

function showPortPage(newIdx) {
    const rows = portSection.querySelectorAll('.portfolio-cards');
    const dots = portSection.querySelectorAll('.port-dot');
    if (portAnimating || newIdx === portCurrent) return;
    if (newIdx < 0 || newIdx >= rows.length) return;
    portAnimating = true;

    const goingForward = newIdx > portCurrent;
    const oldRow = rows[portCurrent];
    const newRow = rows[newIdx];

    oldRow.classList.remove('port-row', 'port-row--enter');
    oldRow.classList.add(goingForward ? 'port-row--exit' : 'port-row--hidden');

    newRow.classList.remove('port-row--hidden', 'port-row--exit');
    newRow.classList.add(goingForward ? 'port-row--enter' : 'port-row');

    dots[portCurrent].classList.remove('port-dot--active');
    dots[newIdx].classList.add('port-dot--active');

    portCurrent = newIdx;
    setTimeout(() => { portAnimating = false; }, 600);
}

portSection.addEventListener('wheel', e => {
    const rows = portSection.querySelectorAll('.portfolio-cards');
    if (e.deltaY > 0 && portCurrent < rows.length - 1) {
        e.preventDefault(); e.stopPropagation();
        showPortPage(portCurrent + 1);
        return;
    }
    if (e.deltaY < 0 && portCurrent > 0) {
        e.preventDefault(); e.stopPropagation();
        showPortPage(portCurrent - 1);
        return;
    }
}, { passive: false });

/* ════════════════════════════════════════
   Apps 터치 스와이프
════════════════════════════════════════ */
let touchStartY = 0;

portSection.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

portSection.addEventListener('touchmove', e => {
    const rows = portSection.querySelectorAll('.portfolio-cards');
    const diff = touchStartY - e.touches[0].clientY;
    if (diff > 0 && portCurrent < rows.length - 1) e.preventDefault();
    if (diff < 0 && portCurrent > 0)               e.preventDefault();
}, { passive: false });

portSection.addEventListener('touchend', e => {
    const diff = touchStartY - e.changedTouches[0].clientY;
    const rows = portSection.querySelectorAll('.portfolio-cards');
    if (diff > 40 && portCurrent < rows.length - 1) showPortPage(portCurrent + 1);
    else if (diff < -40 && portCurrent > 0)         showPortPage(portCurrent - 1);
}, { passive: true });