/* ---------- reveal on scroll ---------- */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{threshold:0.15});
revealEls.forEach(el=>io.observe(el));

/* ---------- mobile nav ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', ()=>{
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{
    navToggle.classList.remove('open'); navLinks.classList.remove('open');
  }));
}

/* ---------- subtle hero parallax ---------- */
const heroVisual = document.querySelector('.hero-visual');
window.addEventListener('mousemove', (e)=>{
  if(window.innerWidth < 900 || !heroVisual) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 14;
  const y = (e.clientY / window.innerHeight - 0.5) * 14;
  heroVisual.style.transform = `translate(${x}px, ${y}px)`;
});

/* ---------- Graphic Design Portfolio Data ---------- */
const galleryData = [
  {
    id: 'mockup',
    title: 'MOCKUP',
    tag: 'Design & Mockup',
    pages: ['assets/images/mock up 1.png']
  },
  {
    id: 'catalog',
    title: 'CATALOG',
    tag: 'Editorial Catalog',
    pages: ['assets/images/catlog.png']
  },
  {
    id: 'flyer1',
    title: 'FLYER 01',
    tag: '2-Page Event Flyer (Cover & Inside)',
    pages: ['assets/images/Flyer 1 out.png', 'assets/images/Flyer 1 in.png']
  },
  {
    id: 'flyer2',
    title: 'FLYER 02',
    tag: '2-Page Promotional Flyer (Cover & Inside)',
    pages: ['assets/images/out-flyer 2.png', 'assets/images/Frame 11.png']
  },
  {
    id: 'onam',
    title: 'ONAM POSTER',
    tag: 'Festival Creative',
    pages: ['assets/images/onam -one asia.png']
  },
  {
    id: 'coming_soon_1',
    title: 'COMING SOON POSTER',
    tag: '2-Page Event Teaser',
    pages: ['assets/images/pro show comin.png', 'assets/images/PIE _juhana.png']
  },
  {
    id: 'startup_event',
    title: 'EVENT CREATIVE',
    tag: '2-Page Event & Design Creative',
    pages: ['assets/images/screening strartitup.jpg', 'assets/images/design.jpg']
  },
  {
    id: 'team',
    title: 'TEAM MEMBERS',
    tag: 'Board of Governors / Team Poster',
    pages: ['assets/images/IEEE SCTC BoG.jpeg']
  }
];

/* ---------- Render Gallery Grid ---------- */
const masonry = document.getElementById('masonry');
const cardHeights = [320, 280, 360, 360, 340, 300, 310, 270];

if (masonry) {
  galleryData.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'g-item';
    
    const isMultiPage = item.pages.length > 1;
    const badgeHTML = isMultiPage ? `<span class="page-badge">${item.pages.length} Pages</span>` : '';
    const h = cardHeights[i % cardHeights.length];
    
    card.innerHTML = `
      ${badgeHTML}
      <div class="g-thumb" style="height:${h}px; background-image:url('${item.pages[0]}')">
        <span>0${i+1} — ${item.title}</span>
      </div>
    `;
    card.addEventListener('click', () => openLightbox(i, 0));
    masonry.appendChild(card);
  });
}

/* ---------- Open / Close Gallery Overlay ---------- */
const galleryOverlay = document.getElementById('galleryOverlay');
const openGalleryBtn = document.getElementById('openGallery');
const closeGalleryBtn = document.getElementById('closeGallery');

if (openGalleryBtn && galleryOverlay) {
  openGalleryBtn.addEventListener('click', () => {
    galleryOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  openGalleryBtn.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') openGalleryBtn.click();
  });
}
if (closeGalleryBtn) {
  closeGalleryBtn.addEventListener('click', closeGallery);
}
function closeGallery() {
  if (galleryOverlay) {
    galleryOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ---------- Open / Close Projects Overlay ---------- */
const projectsOverlay = document.getElementById('projectsOverlay');
const openProjectsBtn = document.getElementById('openProjects');
const closeProjectsBtn = document.getElementById('closeProjects');

if (openProjectsBtn && projectsOverlay) {
  openProjectsBtn.addEventListener('click', () => {
    projectsOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  openProjectsBtn.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') openProjectsBtn.click();
  });
}
if (closeProjectsBtn) {
  closeProjectsBtn.addEventListener('click', () => {
    if (projectsOverlay) {
      projectsOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ---------- Lightbox & Multi-Page Slider State ---------- */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbLabel = document.getElementById('lbLabel');
const lbCount = document.getElementById('lbCount');
const lbImgWrap = document.getElementById('lbImgWrap');
const lbPageControls = document.getElementById('lbPageControls');
const lbPageIndicator = document.getElementById('lbPageIndicator');
const lbPagePrev = document.getElementById('lbPagePrev');
const lbPageNext = document.getElementById('lbPageNext');

let projectIndex = 0;
let pageIndex = 0;
let zoomed = false;

function openLightbox(pIdx, pgIdx = 0) {
  projectIndex = pIdx;
  pageIndex = pgIdx;
  renderLB();
  if (lightbox) lightbox.classList.add('open');
}

function renderLB() {
  const currentProject = galleryData[projectIndex];
  if (!currentProject) return;

  // Clamp page index
  if (pageIndex < 0) pageIndex = 0;
  if (pageIndex >= currentProject.pages.length) pageIndex = currentProject.pages.length - 1;

  lbImg.src = currentProject.pages[pageIndex];
  lbImg.alt = `${currentProject.title} Page ${pageIndex + 1}`;

  // Label text formatting
  const pageText = currentProject.pages.length > 1 ? ` (Page ${pageIndex + 1} of ${currentProject.pages.length})` : '';
  lbLabel.textContent = `0${projectIndex + 1} — ${currentProject.title}${pageText}`;
  lbCount.textContent = `${projectIndex + 1} / ${galleryData.length}`;

  // Multi-page controls setup
  if (currentProject.pages.length > 1) {
    if (lbPageControls) lbPageControls.style.display = 'flex';
    if (lbPageIndicator) lbPageIndicator.textContent = `${pageIndex + 1} / ${currentProject.pages.length}`;
    if (lbPagePrev) lbPagePrev.disabled = (pageIndex === 0);
    if (lbPageNext) lbPageNext.disabled = (pageIndex === currentProject.pages.length - 1);
  } else {
    if (lbPageControls) lbPageControls.style.display = 'none';
  }

  // Reset zoom state
  zoomed = false;
  panX = 0; panY = 0;
  if (lbImgWrap) {
    lbImgWrap.classList.remove('zoomed');
    lbImgWrap.style.transform = 'scale(1)';
  }
}

/* Lightbox Project & Page Navigation */
const lbCloseBtn = document.getElementById('lbClose');
const lbPrevBtn = document.getElementById('lbPrev');
const lbNextBtn = document.getElementById('lbNext');

if (lbCloseBtn) lbCloseBtn.addEventListener('click', () => lightbox && lightbox.classList.remove('open'));

if (lbPrevBtn) {
  lbPrevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    projectIndex = (projectIndex - 1 + galleryData.length) % galleryData.length;
    pageIndex = 0;
    renderLB();
  });
}
if (lbNextBtn) {
  lbNextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    projectIndex = (projectIndex + 1) % galleryData.length;
    pageIndex = 0;
    renderLB();
  });
}

if (lbPagePrev) {
  lbPagePrev.addEventListener('click', (e) => {
    e.stopPropagation();
    if (pageIndex > 0) {
      pageIndex--;
      renderLB();
    }
  });
}
if (lbPageNext) {
  lbPageNext.addEventListener('click', (e) => {
    e.stopPropagation();
    const currentProject = galleryData[projectIndex];
    if (pageIndex < currentProject.pages.length - 1) {
      pageIndex++;
      renderLB();
    }
  });
}

/* Zoom / Click Handler */
if (lbImgWrap) {
  lbImgWrap.addEventListener('click', () => {
    zoomed = !zoomed;
    lbImgWrap.classList.toggle('zoomed', zoomed);
    if (!zoomed) {
      panX = 0; panY = 0;
      lbImgWrap.style.transform = 'scale(1)';
    } else {
      lbImgWrap.style.transform = 'scale(1.7)';
    }
  });
}

/* Keyboard Navigation */
document.addEventListener('keydown', (e) => {
  if (lightbox && lightbox.classList.contains('open')) {
    if (e.key === 'Escape') lightbox.classList.remove('open');
    if (e.key === 'ArrowLeft') {
      const currentProject = galleryData[projectIndex];
      if (currentProject.pages.length > 1 && pageIndex > 0) {
        pageIndex--;
        renderLB();
      } else {
        lbPrevBtn && lbPrevBtn.click();
      }
    }
    if (e.key === 'ArrowRight') {
      const currentProject = galleryData[projectIndex];
      if (currentProject.pages.length > 1 && pageIndex < currentProject.pages.length - 1) {
        pageIndex++;
        renderLB();
      } else {
        lbNextBtn && lbNextBtn.click();
      }
    }
  } else if (galleryOverlay && galleryOverlay.classList.contains('open') && e.key === 'Escape') {
    closeGallery();
  }
});

/* Pan when Zoomed (Mouse Drag) */
let isDown = false, startX = 0, startY = 0, panX = 0, panY = 0;
if (lbImgWrap) {
  lbImgWrap.addEventListener('mousedown', (e) => {
    if (!zoomed) return;
    isDown = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDown || !zoomed) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    lbImgWrap.style.transform = `scale(1.7) translate(${panX / 1.7}px, ${panY / 1.7}px)`;
  });
  window.addEventListener('mouseup', () => { isDown = false; });
}

/* Mobile Touch / Swipe Gesture Handler */
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

if (lightbox) {
  lightbox.addEventListener('touchstart', (e) => {
    if (zoomed) return;
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    if (zoomed) return;
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, { passive: true });
}

function handleSwipe() {
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;
  const minSwipeDistance = 45;

  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
    const currentProject = galleryData[projectIndex];
    if (diffX < 0) {
      // Swiped Left -> Next Page or Next Project
      if (currentProject.pages.length > 1 && pageIndex < currentProject.pages.length - 1) {
        pageIndex++;
        renderLB();
      } else {
        projectIndex = (projectIndex + 1) % galleryData.length;
        pageIndex = 0;
        renderLB();
      }
    } else {
      // Swiped Right -> Prev Page or Prev Project
      if (currentProject.pages.length > 1 && pageIndex > 0) {
        pageIndex--;
        renderLB();
      } else {
        projectIndex = (projectIndex - 1 + galleryData.length) % galleryData.length;
        pageIndex = 0;
        renderLB();
      }
    }
  }
}
