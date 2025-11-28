// Global variables
let currentPage = 0;
const totalPages = memoryImages.length + 1; // +1 for cover

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initFloatingImages();
  initBook();

  // Smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// --- Floating Images Background ---
function initFloatingImages() {
  const container = document.getElementById('floatingImages');
  // Pick a random subset of images to float (e.g., 15 images)
  const shuffled = memoryImages.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 15);

  selected.forEach((imgSrc, index) => {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.className = 'floating-img';

    // Random positioning and sizing
    const size = Math.random() * 150 + 100; // 100px to 250px
    img.style.width = `${size}px`;
    img.style.left = `${Math.random() * 80 + 10}%`; // Keep away from edges

    // Random animation duration and delay
    const duration = Math.random() * 20 + 15; // 15s to 35s
    const delay = Math.random() * 10;
    img.style.animationDuration = `${duration}s`;
    img.style.animationDelay = `-${delay}s`; // Start immediately with offset

    container.appendChild(img);
  });
}

// --- Floating Hearts Background (Existing) ---
function createFloatingHeart() {
  const heartsContainer = document.getElementById('heartsContainer');
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝', '💞', '💘'];
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  heart.style.left = Math.random() * 100 + '%';
  const size = Math.random() * 20 + 15;
  heart.style.fontSize = size + 'px';
  const duration = Math.random() * 4 + 6;
  heart.style.animationDuration = duration + 's';
  const delay = Math.random() * 3;
  heart.style.animationDelay = delay + 's';
  heartsContainer.appendChild(heart);
  setTimeout(() => { heart.remove(); }, (duration + delay) * 1000);
}
setInterval(createFloatingHeart, 500);

// --- Envelope Logic ---
function openEnvelope() {
  const letterModal = document.getElementById('letterModal');
  const envelope = document.getElementById('envelope');
  const arrowPointer = document.getElementById('arrowPointer');

  if (arrowPointer) arrowPointer.style.opacity = '0';

  envelope.classList.add('open'); // You can add CSS for this class if needed

  // Heart explosion
  const rect = envelope.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  for (let i = 0; i < 20; i++) {
    setTimeout(() => createExplosionHeart(centerX, centerY), i * 40);
  }

  setTimeout(() => {
    letterModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }, 600);
}

function closeLetter() {
  const letterModal = document.getElementById('letterModal');
  const arrowPointer = document.getElementById('arrowPointer');
  letterModal.classList.remove('active');
  document.body.style.overflow = 'auto';
  setTimeout(() => {
    if (arrowPointer) arrowPointer.style.opacity = '1';
  }, 400);
}

// --- Memory Book Logic ---
function initBook() {
  const book = document.getElementById('flipBook');

  // Generate pages from images
  memoryImages.forEach((imgSrc, index) => {
    const page = document.createElement('div');
    page.className = 'page';
    page.style.zIndex = memoryImages.length - index; // Stack order

    const content = document.createElement('div');
    content.className = 'page-content';

    const img = document.createElement('img');
    img.src = imgSrc;
    img.loading = 'lazy';

    content.appendChild(img);
    page.appendChild(content);
    book.appendChild(page);
  });
}

function openBook() {
  const modal = document.getElementById('bookModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  currentPage = 0;
  updateBookState();
}

function closeBook() {
  const modal = document.getElementById('bookModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function nextPage() {
  const pages = document.querySelectorAll('.flip-book .page');
  if (currentPage < pages.length - 1) {
    pages[currentPage].style.transform = 'rotateY(-180deg)';
    currentPage++;
  }
}

function prevPage() {
  const pages = document.querySelectorAll('.flip-book .page');
  if (currentPage > 0) {
    currentPage--;
    pages[currentPage].style.transform = 'rotateY(0deg)';
  }
}

function updateBookState() {
  const pages = document.querySelectorAll('.flip-book .page');
  pages.forEach((page, index) => {
    if (index < currentPage) {
      page.style.transform = 'rotateY(-180deg)';
    } else {
      page.style.transform = 'rotateY(0deg)';
    }
  });
}

// --- Effects ---
function createHeartExplosion() {
  const button = document.querySelector('.hearts-button');
  if (!button) return;
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  for (let i = 0; i < 30; i++) {
    setTimeout(() => createExplosionHeart(centerX, centerY), i * 30);
  }
}

function createExplosionHeart(x, y) {
  const heart = document.createElement('div');
  heart.className = 'floating-heart'; // Reuse class for simplicity or create new
  heart.textContent = '♥️';
  heart.style.position = 'fixed';
  heart.style.left = x + 'px';
  heart.style.top = y + 'px';
  heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '9999';
  document.body.appendChild(heart);

  const angle = Math.random() * Math.PI * 2;
  const velocity = Math.random() * 200 + 150;
  const vx = Math.cos(angle) * velocity;
  const vy = Math.sin(angle) * velocity;
  let posX = x, posY = y, opacity = 1;

  const animate = () => {
    posX += vx * 0.016;
    posY += vy * 0.016 + 2;
    opacity -= 0.015;
    heart.style.left = posX + 'px';
    heart.style.top = posY + 'px';
    heart.style.opacity = opacity;
    if (opacity > 0) requestAnimationFrame(animate);
    else heart.remove();
  };
  requestAnimationFrame(animate);
}

// Close modals on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLetter();
    closeBook();
  }
});

console.log('💕 Made with love for Shahd 💕');
