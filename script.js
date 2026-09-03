// Initialize Icons
lucide.createIcons();

// --- 1. Supabase Initialization ---
// Replace placeholders with your Supabase credentials
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// --- 2. Interactive Cursor Tracking ---
const cursor = document.getElementById('cursor-glow');
if (cursor && window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });
}

// --- 3. 3D Card Tilt Effect ---
const cards = document.querySelectorAll('.tilt-card');
cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 20}deg) rotateY(${x / 20}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  });
});

// --- 4. Interactive Cost Calculator ---
let basePrice = 5000;
let selectedScopeLabel = "Landing Page";
const typeBtns = document.querySelectorAll('.calc-type-btn');
const addons = document.querySelectorAll('.calc-addon');
const priceDisplay = document.getElementById('estimated-price');
const bookBtn = document.getElementById('book-estimate-btn');

function updatePrice() {
  let total = basePrice;
  addons.forEach(addon => {
    if (addon.checked) total += parseInt(addon.getAttribute('data-price'));
  });
  priceDisplay.textContent = `₹${total.toLocaleString('en-IN')}`;
}

typeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    typeBtns.forEach(b => {
      b.classList.remove('active', 'border-purple-500/50', 'bg-purple-500/10');
      b.classList.add('border-white/10', 'bg-black/40');
    });
    btn.classList.add('active', 'border-purple-500/50', 'bg-purple-500/10');
    btn.classList.remove('border-white/10', 'bg-black/40');
    
    basePrice = parseInt(btn.getAttribute('data-price'));
    selectedScopeLabel = btn.getAttribute('data-label');
    updatePrice();
  });
});

addons.forEach(addon => addon.addEventListener('change', updatePrice));

bookBtn.addEventListener('click', () => {
  const serviceSelect = document.getElementById('form-service');
  if (serviceSelect) serviceSelect.value = selectedScopeLabel;
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
});

// --- 5. Background Particle Engine ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.8 + 0.4;
    this.speedX = Math.random() * 0.4 - 0.2;
    this.speedY = Math.random() * 0.4 - 0.2;
    this.color = Math.random() > 0.5 ? '#8b5cf6' : '#06b6d4';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) {
      this.reset();
    }
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 18000);
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// --- 6. Form Submission Handling ---
const contactForm = document.getElementById('contact-form');
const statusDiv = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  submitBtn.disabled = true;
  submitBtn.innerText = "Submitting...";
  statusDiv.classList.add('hidden');

  const payload = {
    name: document.getElementById('form-name').value,
    phone: document.getElementById('form-phone').value,
    email: document.getElementById('form-email').value,
    service_type: document.getElementById('form-service').value,
    estimated_budget: priceDisplay.textContent,
    message: document.getElementById('form-message').value
  };

  try {
    if (supabase && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
      const { error } = await supabase.from('leads').insert([payload]);
      if (error) throw error;
    }

    statusDiv.textContent = "Inquiry received! We will contact you on WhatsApp shortly.";
    statusDiv.className = "text-center text-sm font-semibold text-green-400 block mt-4";
    contactForm.reset();
  } catch (err) {
    statusDiv.textContent = "Failed to save inquiry. Please contact us on WhatsApp directly.";
    statusDiv.className = "text-center text-sm font-semibold text-red-400 block mt-4";
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit Inquiry";
  }
});
