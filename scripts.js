document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        console.error('Invalid or empty data from data.json');
        return;
      }

      const voicesCards = document.getElementById('voices-cards');
      const voicesDots = document.getElementById('voices-dots');
      const prevButton = document.getElementById('voices-prev');
      const nextButton = document.getElementById('voices-next');
      let cardData = [...data];
      const cardCount = cardData.length;
      let currentIndex = 0;

      function renderCards() {
        const fragment = document.createDocumentFragment();
        const isMobile = window.innerWidth <= 600;
        const isTablet = window.innerWidth <= 1200 && window.innerWidth > 600;
        const maxVisible = isMobile ? 1 : isTablet ? 2 : 3;

        const startIndex = currentIndex % cardCount;
        const endIndex = Math.min(startIndex + maxVisible, cardCount);
        const visibleCards = cardData.slice(startIndex, endIndex);

        if (visibleCards.length < maxVisible) {
          visibleCards.push(...cardData.slice(0, maxVisible - visibleCards.length));
        }

        visibleCards.forEach(item => {
          const card = document.createElement('div');
          card.className = 'voices__card';
          card.innerHTML = `
            <div class="voices__card-logo">
              <img src="${item.logo || ''}" alt="${item.company || ''}" class="voices__card-logo-img">
            </div>
            <p class="voices__card-description">${item.description || ''}</p>
            <img src="/images/quotes.jpg" alt="Quotes" class="voices__card-quotes">
            <div class="voices__card-author">
              <img src="${item.image || ''}" alt="${item.author || ''}" class="voices__card-author-image">
              <div class="voices__card-author-info">
                <p class="voices__card-author-name">${item.author || ''}</p>
                <p class="voices__card-author-position">${item.position || ''}</p>
              </div>
            </div>
          `;
          fragment.appendChild(card);
        });

        voicesCards.innerHTML = '';
        voicesCards.appendChild(fragment);
        renderDots();
      }

      function renderDots() {
        voicesDots.innerHTML = '';
        cardData.forEach((_, index) => {
          const dot = document.createElement('span');
          dot.className = `voices__dot ${index === currentIndex ? 'voices__dot--active' : ''}`;
          dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
          dot.addEventListener('click', () => {
            currentIndex = index;
            renderCards();
            updateButtons();
          });
          voicesDots.appendChild(dot);
        });
      }

      function updateButtons() {
        prevButton.disabled = false;
        nextButton.disabled = false;
      }

      nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cardCount;
        renderCards();
        updateButtons();
      });

      prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cardCount) % cardCount;
        renderCards();
        updateButtons();
      });

      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          renderCards();
          updateButtons();
        }, 200);
      });

      renderCards();
      updateButtons();
    })
    .catch(error => console.error('Error loading data:', error));
});