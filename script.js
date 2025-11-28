// Floating Hearts Background
function createFloatingHeart() {
  const heartsContainer = document.getElementById('heartsContainer');
  const heart = document.createElement('div');
  heart.className = 'floating-heart';

  // Random heart emoji
  const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝', '💞', '💘'];
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

  // Random position
  heart.style.left = Math.random() * 100 + '%';

  // Random size
  const size = Math.random() * 20 + 15;
  heart.style.fontSize = size + 'px';

  // Random animation duration
  const duration = Math.random() * 4 + 6;
  heart.style.animationDuration = duration + 's';

  // Random delay
  const delay = Math.random() * 3;
  heart.style.animationDelay = delay + 's';

  heartsContainer.appendChild(heart);

  // Remove after animation
  setTimeout(() => {
    heart.remove();
  }, (duration + delay) * 1000);
}

// Create hearts continuously
setInterval(createFloatingHeart, 300);

// Initial burst of hearts
for (let i = 0; i < 20; i++) {
  setTimeout(createFloatingHeart, i * 100);
}

// Heart Explosion Effect
function createHeartExplosion() {
  const button = document.querySelector('.hearts-button');
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Create 30 hearts exploding from button
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      createExplosionHeart(centerX, centerY);
    }, i * 30);
  }

  // Button animation
  button.style.transform = 'scale(0.9)';
  setTimeout(() => {
    button.style.transform = '';
  }, 200);
}

function createExplosionHeart(x, y) {
  const heart = document.createElement('div');
  heart.className = 'explosion-heart';

  const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝', '💞', '💘'];
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

  heart.style.position = 'fixed';
  heart.style.left = x + 'px';
  heart.style.top = y + 'px';
  heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '9999';

  document.body.appendChild(heart);

  // Random direction
  const angle = Math.random() * Math.PI * 2;
  const velocity = Math.random() * 200 + 150;
  const vx = Math.cos(angle) * velocity;
  const vy = Math.sin(angle) * velocity;

  let posX = x;
  let posY = y;
  let opacity = 1;
  let scale = 1;
  let rotation = 0;

  const animate = () => {
    posX += vx * 0.016;
    posY += vy * 0.016 + 2; // gravity
    opacity -= 0.015;
    scale += 0.02;
    rotation += 5;

    heart.style.left = posX + 'px';
    heart.style.top = posY + 'px';
    heart.style.opacity = opacity;
    heart.style.transform = `scale(${scale}) rotate(${rotation}deg)`;

    if (opacity > 0) {
      requestAnimationFrame(animate);
    } else {
      heart.remove();
    }
  };

  requestAnimationFrame(animate);
}

// Add sparkle effect on mouse move
document.addEventListener('mousemove', (e) => {
  if (Math.random() > 0.95) {
    createSparkle(e.clientX, e.clientY);
  }
});

function createSparkle(x, y) {
  const sparkle = document.createElement('div');
  sparkle.textContent = '✨';
  sparkle.style.position = 'fixed';
  sparkle.style.left = x + 'px';
  sparkle.style.top = y + 'px';
  sparkle.style.fontSize = '20px';
  sparkle.style.pointerEvents = 'none';
  sparkle.style.zIndex = '9999';
  sparkle.style.transition = 'all 1s ease-out';

  document.body.appendChild(sparkle);

  setTimeout(() => {
    sparkle.style.opacity = '0';
    sparkle.style.transform = 'translateY(-50px) scale(1.5)';
  }, 10);

  setTimeout(() => {
    sparkle.remove();
  }, 1000);
}

// Add parallax effect to main content
document.addEventListener('mousemove', (e) => {
  const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
  const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

  document.querySelector('.main-content').style.transform =
    `translate(${moveX}px, ${moveY}px)`;
});

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

console.log('💕 Made with love for Shahd 💕');

// Envelope Opening Function
function openEnvelope() {
  const letterModal = document.getElementById('letterModal');
  const envelope = document.getElementById('envelope');
  const arrowPointer = document.getElementById('arrowPointer');

  // Hide arrow pointer
  if (arrowPointer) {
    arrowPointer.style.opacity = '0';
    arrowPointer.style.transform = 'scale(0)';
  }

  // Add envelope opening animation
  envelope.style.transform = 'scale(1.1)';
  setTimeout(() => {
    envelope.style.transform = 'scale(1)';
  }, 300);

  // Create heart explosion from envelope
  const rect = envelope.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      createExplosionHeart(centerX, centerY);
    }, i * 40);
  }

  // Open letter modal
  setTimeout(() => {
    letterModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }, 400);
}

// Close Letter Function
function closeLetter() {
  const letterModal = document.getElementById('letterModal');
  const arrowPointer = document.getElementById('arrowPointer');

  letterModal.classList.remove('active');
  document.body.style.overflow = 'auto';

  // Show arrow pointer again
  setTimeout(() => {
    if (arrowPointer) {
      arrowPointer.style.opacity = '1';
      arrowPointer.style.transform = 'scale(1)';
    }
  }, 400);
}

// Close modal when pressing Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLetter();
  }
});
