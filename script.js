// Global variables
let currentPage = 0;
const totalPages = memoryImages.length + 1; // +1 for cover

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initFloatingImages();
  initBook();
  preloadImages(); // Start preloading immediately

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

// --- Image Preloading ---
function preloadImages() {
  // Preload the first 10 images immediately for instant start
  const priorityImages = memoryImages.slice(0, 10);
  priorityImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Preload the rest in the background with a slight delay
  setTimeout(() => {
    const remainingImages = memoryImages.slice(10);
    remainingImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, 2000);
}

// --- Floating Images Background ---
function initFloatingImages() {
  const container = document.getElementById('floatingImages');
  // Reduce number of floating images for better performance
  const shuffled = memoryImages.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 10); // Reduced from 15 to 10

  selected.forEach((imgSrc, index) => {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.className = 'floating-img';

    // Random positioning and sizing
    const size = Math.random() * 100 + 80; // Slightly smaller for performance
    img.style.width = `${size}px`;
    img.style.left = `${Math.random() * 80 + 10}%`; // Keep away from edges

    // Random animation duration and delay
    const duration = Math.random() * 20 + 20; // Slower animation is smoother
    const delay = Math.random() * 10;
    img.style.animationDuration = `${duration}s`;
    img.style.animationDelay = `-${delay}s`; // Start immediately with offset

    container.appendChild(img);
  });
}

// --- Floating Hearts Background (Existing) ---
function createFloatingHeart() {
  const heartsContainer = document.getElementById('heartsContainer');
  // Limit total hearts to avoid DOM overload
  if (heartsContainer.childElementCount > 20) return;

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
setInterval(createFloatingHeart, 800); // Slower interval for performance

// --- Envelope Logic ---
function openEnvelope() {
  const letterModal = document.getElementById('letterModal');
  const envelope = document.getElementById('envelope');
  const arrowPointer = document.getElementById('arrowPointer');

  if (arrowPointer) arrowPointer.style.opacity = '0';

  envelope.classList.add('open'); // You can add CSS for this class if needed

  // Heart explosion - Reduced count for performance
  const rect = envelope.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  for (let i = 0; i < 15; i++) {
    setTimeout(() => createExplosionHeart(centerX, centerY), i * 50);
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

// --- Memory Book Logic (Realistic Album) ---
let currentSheetIndex = 0;
let totalSheets = 0;

function initBook() {
  const book = document.getElementById('albumBook');
  book.innerHTML = ''; // Clear existing

  // 1. Create Cover Sheet
  const coverSheet = createSheet(0);
  coverSheet.classList.add('cover-sheet');

  // Cover Front
  const coverFront = document.createElement('div');
  coverFront.className = 'page-front album-cover';
  coverFront.innerHTML = `
        <div class="album-cover-content">
            <h1 class="cover-title">شهد</h1>
            <div class="cover-decoration">♥️</div>
            <p class="cover-verse">"وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"</p>
        </div>
    `;

  // Cover Back (First Image)
  const coverBack = document.createElement('div');
  coverBack.className = 'page-back';
  if (memoryImages.length > 0) {
    coverBack.appendChild(createPhotoFrame(memoryImages[0], 1));
  }

  coverSheet.appendChild(coverFront);
  coverSheet.appendChild(coverBack);
  book.appendChild(coverSheet);

  // 2. Create Content Sheets
  const remainingImages = memoryImages.slice(1);
  const sheetCount = Math.ceil(remainingImages.length / 2);

  // Optimization: Only create first few sheets initially if there are many
  // But for smooth flipping, creating all is better if images are lazy/preloaded.
  // We will stick to creating DOM structure but rely on preloader for images.

  for (let i = 0; i < sheetCount; i++) {
    const sheet = createSheet(i + 1);

    // Front of sheet (Right page when open)
    const frontImgIndex = i * 2;
    const frontPage = document.createElement('div');
    frontPage.className = 'page-front';
    if (frontImgIndex < remainingImages.length) {
      frontPage.appendChild(createPhotoFrame(remainingImages[frontImgIndex], frontImgIndex + 2));
    }

    // Back of sheet (Left page when flipped)
    const backImgIndex = i * 2 + 1;
    const backPage = document.createElement('div');
    backPage.className = 'page-back';
    if (backImgIndex < remainingImages.length) {
      backPage.appendChild(createPhotoFrame(remainingImages[backImgIndex], backImgIndex + 2));
    } else {
      // Empty back page or end message
      backPage.innerHTML = '<div style="text-align:center; font-family:Great Vibes; font-size:2rem; color:#d35400">The End ♥️</div>';
    }

    sheet.appendChild(frontPage);
    sheet.appendChild(backPage);
    book.appendChild(sheet);
  }

  totalSheets = sheetCount + 1; // +1 for cover

  // Set initial Z-Indexes (Stack order)
  updateZIndexes();
}

function createSheet(index) {
  const sheet = document.createElement('div');
  sheet.className = 'album-page';
  sheet.id = `sheet-${index}`;
  sheet.style.zIndex = 100 - index; // Higher index on top
  // Hardware acceleration hint
  sheet.style.willChange = 'transform';
  return sheet;
}

function createPhotoFrame(src, num) {
  const frame = document.createElement('div');
  frame.className = 'photo-frame';

  const img = document.createElement('img');
  img.src = src;
  // Remove lazy loading here because we want them preloaded for smoothness
  // or keep it if we trust the preloader. Let's keep standard loading to avoid 'lazy' delay.

  const caption = document.createElement('div');
  caption.className = 'photo-caption';
  caption.textContent = `Memory #${num} ♥️`;

  frame.appendChild(img);
  frame.appendChild(caption);
  return frame;
}

function openBook() {
  const modal = document.getElementById('bookModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Reset state
  currentSheetIndex = 0;
  const sheets = document.querySelectorAll('.album-page');
  sheets.forEach(sheet => {
    sheet.classList.remove('flipped');
  });
  updateZIndexes();
}

function closeBook() {
  const modal = document.getElementById('bookModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function nextPage() {
  if (currentSheetIndex < totalSheets) {
    const sheet = document.getElementById(`sheet-${currentSheetIndex}`);
    if (sheet) {
      // Bring to very top during flip
      sheet.style.zIndex = 1000;
      sheet.classList.add('flipped');

      currentSheetIndex++;

      // Reset z-index after transition (0.6s matches CSS)
      setTimeout(() => {
        updateZIndexes();
      }, 600);
    }
  }
}

function prevPage() {
  if (currentSheetIndex > 0) {
    currentSheetIndex--;
    const sheet = document.getElementById(`sheet-${currentSheetIndex}`);
    if (sheet) {
      // Bring to very top during flip
      sheet.style.zIndex = 1000;
      sheet.classList.remove('flipped');

      // Reset z-index after transition
      setTimeout(() => {
        updateZIndexes();
      }, 600);
    }
  }
}

function updateZIndexes() {
  const sheets = document.querySelectorAll('.album-page');
  sheets.forEach((sheet, index) => {
    // If sheet is currently animating (has high z-index), skip it
    // We check this by comparing with our manual 1000 value
    if (sheet.style.zIndex === '1000') return;

    if (index < currentSheetIndex) {
      // Sheet is on the LEFT side (flipped)
      // Stack order: Bottom to Top (Index 0 is bottom, Index N is top)
      sheet.style.zIndex = index + 1;
    } else {
      // Sheet is on the RIGHT side (not flipped)
      // Stack order: Top to Bottom (Index current is top, Index N is bottom)
      // We need the first unflipped sheet to be highest
      sheet.style.zIndex = 100 - index;
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
  for (let i = 0; i < 20; i++) { // Reduced count
    setTimeout(() => createExplosionHeart(centerX, centerY), i * 40);
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
  const velocity = Math.random() * 150 + 100; // Reduced velocity
  const vx = Math.cos(angle) * velocity;
  const vy = Math.sin(angle) * velocity;
  let posX = x, posY = y, opacity = 1;

  const animate = () => {
    posX += vx * 0.016;
    posY += vy * 0.016 + 2;
    opacity -= 0.02; // Faster fade out
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
