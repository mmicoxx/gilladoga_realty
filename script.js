// Gilladoga Realty — vanilla JS behavior (no build step required)

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('[data-sync]');

  function syncNav(id) {
    navLinks.forEach((link) => {
      link.classList.toggle('nav-active', link.dataset.sync === id);
    });
  }

  // Smooth-scroll navigation with active-state syncing
  document.querySelectorAll('[data-goto]').forEach((el) => {
    el.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(el.dataset.goto);
      target?.scrollIntoView({ behavior: 'smooth' });
      if (el.dataset.sync) syncNav(el.dataset.sync);
    });
  });

  // Reveal-on-scroll animation
  const revealItems = document.querySelectorAll('.reveal, .property-card, .numbers');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));

  // Property search: type tabs + text filter
  const searchTabs = document.querySelectorAll('.search-tabs button');
  const searchInput = document.querySelector('.search-controls input');
  const propertyCards = document.querySelectorAll('.property-card');
  const emptyMessage = document.querySelector('.empty');
  let activeType = 'All homes';

  function applyFilter() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;
    propertyCards.forEach((card) => {
      const matchesType = activeType === 'All homes' || card.dataset.type === activeType;
      const matchesQuery = card.dataset.search.includes(query);
      const show = matchesType && matchesQuery;
      card.classList.toggle('is-hidden', !show);
      if (show) visibleCount += 1;
    });
    emptyMessage?.classList.toggle('is-visible', visibleCount === 0);
  }

  searchTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      searchTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeType = tab.dataset.type;
      applyFilter();
    });
  });

  searchInput?.addEventListener('input', applyFilter);

  document.querySelector('.view-all')?.addEventListener('click', () => {
    activeType = 'All homes';
    searchTabs.forEach((t) => t.classList.toggle('active', t.dataset.type === 'All homes'));
    if (searchInput) searchInput.value = '';
    applyFilter();
  });

  // Property detail modal
  const modal = document.querySelector('.modal-backdrop');
  const modalImage = modal?.querySelector('img');
  const modalPlace = modal?.querySelector('.eyebrow');
  const modalName = modal?.querySelector('h2');
  const modalPrice = modal?.querySelector('strong');
  const modalDetails = modal?.querySelector('p:last-of-type');
  let lastFocused = null;

  function openModal(card) {
    const img = card.querySelector('.property-image img');
    const badge = card.querySelector('.property-image span');
    const place = card.querySelector('.property-info p');
    const name = card.querySelector('.property-info h3');
    const price = card.querySelector('.property-info strong');
    const facts = card.querySelectorAll('.facts span');

    modalImage.src = img.src;
    modalImage.alt = img.alt;
    modalPlace.textContent = place.textContent;
    modalName.textContent = name.textContent;
    modalPrice.textContent = price.textContent;
    modalDetails.textContent = Array.from(facts).map((f) => f.textContent.trim()).join(' · ');
    modal.dataset.type = badge.textContent;

    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('.close')?.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    lastFocused?.focus();
  }

  document.querySelectorAll('.property-image').forEach((button) => {
    button.addEventListener('click', () => openModal(button.closest('.property-card')));
  });

  modal?.querySelector('.close')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal?.classList.contains('is-open')) closeModal();
  });
  modal?.querySelector('.property-modal a')?.addEventListener('click', closeModal);

  // Contact form
  const contactForm = document.querySelector('.contact form');
  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = contactForm.querySelector('button[type="submit"] span');
    if (button) button.textContent = 'Message received';
  });
});
