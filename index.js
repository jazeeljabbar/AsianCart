/* Premium Clientside Interactivity Script - Asian Cart (Emerald Retail Logic) */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Dark/Light Mode Theme Switcher
  // ==========================================
  const htmlElement = document.documentElement;
  const themeToggler = document.getElementById('themeToggler');
  const themeIcon = document.getElementById('themeIcon');

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    htmlElement.classList.add('dark');
    themeIcon.innerText = 'light_mode';
  } else {
    htmlElement.classList.remove('dark');
    themeIcon.innerText = 'dark_mode';
  }

  // Theme Toggler Click Handler
  themeToggler.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    const isDark = htmlElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeIcon.innerText = isDark ? 'light_mode' : 'dark_mode';
    
    // Play subtle transition click animation
    themeToggler.classList.add('scale-90');
    setTimeout(() => themeToggler.classList.remove('scale-90'), 1500);
  });

  // ==========================================
  // 2. Sticky Header Shrink & Scroll-to-Top FAB
  // ==========================================
  const header = document.getElementById('topAppBar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('py-2', 'shadow-md', 'bg-surface/95');
      header.classList.remove('py-4', 'shadow-sm', 'bg-surface/90');
      scrollTopBtn.classList.add('visible');
    } else {
      header.classList.add('py-4', 'shadow-sm', 'bg-surface/90');
      header.classList.remove('py-2', 'shadow-md', 'bg-surface/95');
      scrollTopBtn.classList.remove('visible');
    }
  });

  // Scroll to Top Smoothly
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ==========================================
  // 3. Interactive Search Dropdown Suggestion
  // ==========================================
  const searchInput = document.getElementById('headerSearch');
  const searchDropdown = document.getElementById('searchDropdown');
  const suggestButtons = document.querySelectorAll('.search-suggest-btn');

  searchInput.addEventListener('focus', () => {
    searchDropdown.classList.remove('hidden');
    // Animate scale-up & fade-in using CSS transition properties via JS
    setTimeout(() => {
      searchDropdown.classList.add('opacity-100', 'scale-100');
      searchDropdown.classList.remove('opacity-0', 'scale-95');
    }, 10);
  });

  searchInput.addEventListener('blur', () => {
    // Wait for click events to trigger if suggestions are tapped
    setTimeout(() => {
      searchDropdown.classList.add('opacity-0', 'scale-95');
      searchDropdown.classList.remove('opacity-100', 'scale-100');
      setTimeout(() => searchDropdown.classList.add('hidden'), 200);
    }, 200);
  });

  suggestButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      searchInput.value = btn.textContent.trim().replace('trending_up', '').trim();
    });
  });

  // ==========================================
  // 4. Interactive Shopping Cart State & Drawer
  // ==========================================
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOpenBtn = document.getElementById('cartOpenBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartDrawerItems = document.getElementById('cartDrawerItems');
  const emptyCartMessage = document.getElementById('emptyCartMessage');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartBadgeCount = document.getElementById('cartBadgeCount');
  const drawerCartBadge = document.getElementById('drawerCartBadge');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const cartShopBtn = document.getElementById('cartShopBtn');

  // Initialize cart with Google Stitch default export items
  let cart = [
    {
      id: 'p2',
      name: 'Premium Basmati Rice',
      price: 999.00,
      quantity: 1,
      img: 'https://lh3.googleusercontent.com/aida/ADBb0ujb7P0FHHLdKWhs97GNMsugl4cPpNvZcykTQlYo4hhoX26qci01AycfUCMnkfaVORw3_kc1xTzyXBC-I844WkREwC40gVF4vbM_1z8CkUztNqhKYKfU_eDEeO4vLqXzKqazXN9gbyaj4s4s_GB3tl45Z3ji096vuXpuY-YQTd4K4q1382uMroip2RkmDq3jmFtpYGghcv9ukyks-DsZggcNukw0pWzCFq80bFv8nTWtnHy8Mhl6L8e1xRry'
    },
    {
      id: 'p1',
      name: 'Organic Red Lentils',
      price: 349.00,
      quantity: 1,
      img: 'https://lh3.googleusercontent.com/aida/ADBb0ujlZ0kSblKr55PIynbD3dDpBD-EgHaZCmgieEaMs6yF2w-XpIdy3X1zPgqJqaNxozYb5TrYKggybBfRSYwRkFpqCJV1ZUfmtbWCE3Tp8QJomRAQiVb1TdyA6bi_lXiXLxEk2DUr9Ao7H2nypEmQkI8OnK3_wzo7yrlkyEEmmlOSkelQVsVDDXAYOFiCVwdOfyhK5dFu6Fk5pX8lvTXjYEYGrXvU_8patDNhFArD2ZT5oauJ0Z-9kyuCRaws'
    },
    {
      id: 'p4',
      name: 'Essence of Elegance Parfum',
      price: 8999.00,
      quantity: 1,
      img: 'https://lh3.googleusercontent.com/aida/ADBb0uhfoFV8AlZotaf4FwW8u4TTez39a2g9tVi35Si-STrXctkQwubEUyU3fq5xQNgliGoLBsbhJmsE7txowf_GUu_AopGTNGZalM-SCSSfMoV1HQv3uDr0HFr3iC1CIPZD7fBACU-PjEV1Q4RQ9YPXtWT3sP0rANvDhFkOEq35FzgVUEt3uakEx0aq-SzsWxWvSxliuMIweFr_Cig3x6Yu0cOcaEJsBl3w7Cl7-t3wXyfJ513RQ3Wc2hC-_rsj'
    }
  ];

  // Drawer Toggle Handlers
  const openCart = () => cartDrawer.classList.add('active');
  const closeCart = () => cartDrawer.classList.remove('active');

  cartOpenBtn.addEventListener('click', openCart);
  cartCloseBtn.addEventListener('click', closeCart);
  
  // Close cart by clicking outside drawer
  cartDrawer.addEventListener('click', (e) => {
    if (e.target === cartDrawer) closeCart();
  });

  // Close cart on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer.classList.contains('active')) closeCart();
  });

  // Empty cart shop navigation click handler
  if (cartShopBtn) {
    cartShopBtn.addEventListener('click', () => {
      closeCart();
      document.getElementById('featuredSection').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Calculate Subtotals & Badge counts
  const updateCartState = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update Badges
    cartBadgeCount.innerText = totalItems;
    drawerCartBadge.innerText = totalItems;
    
    // Toggle badge visibility if empty
    if (totalItems > 0) {
      cartBadgeCount.classList.remove('scale-0');
      cartBadgeCount.classList.add('scale-100');
    } else {
      cartBadgeCount.classList.remove('scale-100');
      cartBadgeCount.classList.add('scale-0');
    }

    // Update Subtotal Display
    cartSubtotal.innerText = `₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}`;

    // Update Shipping estimate rules
    const shippingStatus = document.getElementById('shippingStatus');
    if (subtotal >= 1999.00 || subtotal === 0) {
      shippingStatus.innerText = 'FREE';
      shippingStatus.className = 'text-primary font-bold uppercase tracking-wider text-xs';
    } else {
      const remaining = (1999.00 - subtotal).toLocaleString('en-IN', {minimumFractionDigits: 2});
      shippingStatus.innerText = `₹99.00 (Add ₹${remaining} for FREE delivery)`;
      shippingStatus.className = 'text-on-surface-variant font-medium text-xs';
    }
  };

  // Render Cart DOM Elements Dynamically
  const renderCart = () => {
    // Clear dynamic children
    const dynamicItems = cartDrawerItems.querySelectorAll('.cart-item-row');
    dynamicItems.forEach(row => row.remove());

    if (cart.length === 0) {
      emptyCartMessage.classList.remove('hidden');
      emptyCartMessage.classList.add('flex');
      checkoutBtn.disabled = true;
      checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      emptyCartMessage.classList.add('hidden');
      emptyCartMessage.classList.remove('flex');
      checkoutBtn.disabled = false;
      checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');

      cart.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item-row flex gap-4 p-4 bg-surface border border-outline-variant rounded-xl items-center shadow-sm relative group hover:shadow-md transition-all';
        itemRow.innerHTML = `
          <div class="w-16 h-16 bg-surface-container-low border border-outline-variant rounded-lg overflow-hidden shrink-0">
            <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover">
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-xs text-on-surface truncate pr-6">${item.name}</h4>
            <p class="text-xs text-primary font-extrabold mt-1">₹${(item.price).toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
            
            <!-- Quantity adjusters -->
            <div class="flex items-center gap-2 mt-2 bg-surface-container-low border border-outline-variant/60 rounded-full w-fit px-2 py-0.5">
              <button class="text-xs text-on-surface-variant hover:text-primary p-0.5 rounded-full hover:bg-surface-container active:scale-90 transition-all font-bold btn-minus" data-id="${item.id}" aria-label="Decrease quantity">
                <span class="material-symbols-outlined text-[14px]">remove</span>
              </button>
              <span class="text-xs font-bold text-on-surface w-4 text-center select-none">${item.quantity}</span>
              <button class="text-xs text-on-surface-variant hover:text-primary p-0.5 rounded-full hover:bg-surface-container active:scale-90 transition-all font-bold btn-plus" data-id="${item.id}" aria-label="Increase quantity">
                <span class="material-symbols-outlined text-[14px]">add</span>
              </button>
            </div>
          </div>
          <!-- Delete button -->
          <button class="absolute top-3 right-3 text-on-surface-variant hover:text-error p-1 rounded-full hover:bg-surface-container-high transition-colors btn-delete" data-id="${item.id}" aria-label="Remove item">
            <span class="material-symbols-outlined text-base">delete</span>
          </button>
        `;
        cartDrawerItems.appendChild(itemRow);
      });

      // Bind quantity adjusting buttons
      document.querySelectorAll('.btn-plus').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          adjustQuantity(id, 1);
        });
      });

      document.querySelectorAll('.btn-minus').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          adjustQuantity(id, -1);
        });
      });

      document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          removeFromCart(id);
        });
      });
    }

    updateCartState();
  };

  // Adjust Item Quantity
  const adjustQuantity = (id, change) => {
    const item = cart.find(x => x.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      renderCart();
    }
  };

  // Remove Item completely
  const removeFromCart = (id) => {
    cart = cart.filter(x => x.id !== id);
    renderCart();
  };

  // Fly-to-Cart Curved Bezier Animation
  const animateFlyToCart = (sourceElement, imageUrl, onCompleteCallback) => {
    const rect = sourceElement.getBoundingClientRect();
    const anchor = document.getElementById('cartIconAnchor');
    const destRect = anchor.getBoundingClientRect();

    // Create the particle element
    const particle = document.createElement('div');
    particle.className = 'cart-fly-particle';
    particle.style.backgroundImage = `url('${imageUrl}')`;
    particle.style.top = `${rect.top + window.scrollY}px`;
    particle.style.left = `${rect.left + window.scrollX}px`;
    document.body.appendChild(particle);

    // Initial and target coordinates relative to viewport
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const endX = destRect.left + destRect.width / 2;
    const endY = destRect.top + destRect.height / 2;

    // Control point for a high quadratic Bezier curve
    const controlX = startX + (endX - startX) * 0.3;
    const controlY = Math.min(startY, endY) - 150; // Fly high!

    const duration = 800; // ms
    const startTime = performance.now();

    function step(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Quadratic Bezier Formula: B(t) = (1-t)^2 * P0 + 2*(1-t)*t * P1 + t^2 * P2
      const t = progress;
      const currentX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
      const currentY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;

      // Adjust particle properties
      particle.style.left = `${currentX - 20}px`;
      particle.style.top = `${currentY - 20 + window.scrollY}px`;
      
      // Gradually shrink and fade out as it approaches cart
      const scale = 1 - t * 0.6;
      particle.style.transform = `scale(${scale})`;
      particle.style.opacity = `${1 - t * 0.4}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Animation finished
        particle.remove();
        
        // Cart badge bounce bounce bounce effect
        const cartBadge = document.getElementById('cartBadgeCount');
        cartBadge.classList.add('scale-150', 'bg-primary-container', 'text-on-primary-container');
        cartBadge.classList.remove('scale-100');
        
        setTimeout(() => {
          cartBadge.classList.remove('scale-150', 'bg-primary-container', 'text-on-primary-container');
          cartBadge.classList.add('scale-100');
        }, 400);

        if (onCompleteCallback) onCompleteCallback();
      }
    }

    requestAnimationFrame(step);
  };

  // Add Item to Cart Main Handler
  const addToCart = (id, name, price, img, sourceBtn) => {
    // Temporarily animate source button to checked/added state
    if (sourceBtn) {
      sourceBtn.disabled = true;
      const originalHtml = sourceBtn.innerHTML;
      sourceBtn.innerHTML = `<span class="material-symbols-outlined text-sm">check</span> Added`;
      
      setTimeout(() => {
        sourceBtn.disabled = false;
        sourceBtn.innerHTML = originalHtml;
      }, 2000);

      // Start Bezier flight particle
      animateFlyToCart(sourceBtn, img, () => {
        // Sync actual data changes AFTER animation completes
        const existing = cart.find(x => x.id === id);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ id, name, price: parseFloat(price), img, quantity: 1 });
        }
        renderCart();
      });
    } else {
      // Direct adding without source trigger
      const existing = cart.find(x => x.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id, name, price: parseFloat(price), img, quantity: 1 });
      }
      renderCart();
    }
  };

  // Checkout Success Simulation Trigger
  checkoutBtn.addEventListener('click', () => {
    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = `<span class="material-symbols-outlined text-lg animate-spin font-bold">sync</span> Processing...`;
    
    setTimeout(() => {
      // Checkout complete
      checkoutBtn.innerHTML = `Success!`;
      
      // Success modal notification
      const successToast = document.createElement('div');
      successToast.className = 'fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-6';
      successToast.innerHTML = `
        <div class="bg-surface border border-outline-variant rounded-2xl shadow-2xl p-8 max-w-sm text-center space-y-4 scale-95 opacity-0 transition-all duration-300 transform" id="checkoutSuccessModal">
          <span class="material-symbols-outlined text-6xl text-primary animate-bounce">check_circle</span>
          <h3 class="font-headline-lg text-2xl font-bold tracking-tight text-on-surface">Order Confirmed!</h3>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            Thank you for shopping with Asian Cart. Your premium delivery details and secure invoice tracking code have been dispatched to your registered address.
          </p>
          <button class="w-full bg-primary hover:brightness-110 active:scale-95 text-on-primary py-3.5 rounded-xl font-bold transition-all" id="closeSuccessBtn">Continue Browsing</button>
        </div>
      `;
      document.body.appendChild(successToast);

      // Animate modal pop-in
      setTimeout(() => {
        const modal = document.getElementById('checkoutSuccessModal');
        modal.classList.remove('scale-95', 'opacity-0');
        modal.classList.add('scale-100', 'opacity-100');
      }, 50);

      document.getElementById('closeSuccessBtn').addEventListener('click', () => {
        successToast.remove();
        cart = []; // Empty cart
        renderCart();
        closeCart();
      });
    }, 1800);
  });

  // Bind Standard Product Cards "Quick Add" Buttons
  document.querySelectorAll('.quick-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = btn.getAttribute('data-price');
      // Retrieve image from sibling product card image elements
      const card = btn.closest('.product-card');
      const imgUrl = card.querySelector('.product-img').src;

      addToCart(id, name, price, imgUrl, btn);
    });
  });

  // Bind Standard Product Cards "Secure Your Stock / Shop Now / Experience Scent" click handlers
  document.querySelectorAll('.buy-now-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = btn.getAttribute('data-price');
      const card = btn.closest('.product-card');
      const imgUrl = card.querySelector('.product-img').src;

      addToCart(id, name, price, imgUrl, btn);
    });
  });

  // Hotspots Add-to-cart click handler
  document.querySelectorAll('.hotspot-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const hotspot = btn.closest('.hotspot');
      const id = hotspot.getAttribute('data-id');
      const name = hotspot.getAttribute('data-name');
      const price = hotspot.getAttribute('data-price');
      const imgUrl = hotspot.getAttribute('data-img');

      addToCart(id, name, price, imgUrl, btn);
    });
  });

  // Active Hotspots card toggle on click (for mobile touch target support)
  document.querySelectorAll('.hotspot-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const hotspot = dot.closest('.hotspot');
      const card = hotspot.querySelector('.hotspot-card');
      const currentlyActive = card.classList.contains('active');
      
      // Dismiss other active cards
      document.querySelectorAll('.hotspot-card').forEach(x => x.classList.remove('active'));
      
      if (!currentlyActive) {
        card.classList.add('active');
      }
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.hotspot-card').forEach(x => x.classList.remove('active'));
  });

  // ==========================================
  // 5. Fragrance Finder Quiz Navigation Logic
  // ==========================================
  window.nextStep = (step) => {
    const currentStep = document.querySelector('.quiz-step:not(.hidden)');
    const nextStep = document.getElementById(`quiz-step-${step}`);
    
    if (currentStep) {
      // Slide exit transition
      currentStep.classList.add('slide-exit-left');
      setTimeout(() => {
        currentStep.classList.add('hidden');
        currentStep.classList.remove('slide-exit-left');
        
        // Slide enter transition for the next card
        nextStep.classList.remove('hidden');
        nextStep.classList.add('slide-enter-right');
        
        setTimeout(() => {
          nextStep.classList.remove('slide-enter-right');
        }, 50);
      }, 300);
    } else {
      nextStep.classList.remove('hidden');
    }
  };

  // Bind Scent Quiz Result Add-to-cart button
  const quizAddToCartBtn = document.getElementById('quizAddToCartBtn');
  if (quizAddToCartBtn) {
    quizAddToCartBtn.addEventListener('click', () => {
      const id = quizAddToCartBtn.getAttribute('data-id');
      const name = quizAddToCartBtn.getAttribute('data-name');
      const price = quizAddToCartBtn.getAttribute('data-price');
      const imgUrl = 'https://lh3.googleusercontent.com/aida/ADBb0uhfoFV8AlZotaf4FwW8u4TTez39a2g9tVi35Si-STrXctkQwubEUyU3fq5xQNgliGoLBsbhJmsE7txowf_GUu_AopGTNGZalM-SCSSfMoV1HQv3uDr0HFr3iC1CIPZD7fBACU-PjEV1Q4RQ9YPXtWT3sP0rANvDhFkOEq35FzgVUEt3uakEx0aq-SzsWxWvSxliuMIweFr_Cig3x6Yu0cOcaEJsBl3w7Cl7-t3wXyfJ513RQ3Wc2hC-_rsj';

      addToCart(id, name, price, imgUrl, quizAddToCartBtn);
    });
  }

  // ==========================================
  // 6. Live "Trending Near You" Toast Rotations
  // ==========================================
  const liveToast = document.getElementById('live-toast');
  const toastText = document.getElementById('toast-text');
  const toastImg = document.getElementById('toast-img');

  const simulatedToasts = [
    {
      text: "Someone in Bengaluru just secured their stock of Premium Basmati Rice.",
      img: "https://lh3.googleusercontent.com/aida/ADBb0ujb7P0FHHLdKWhs97GNMsugl4cPpNvZcykTQlYo4hhoX26qci01AycfUCMnkfaVORw3_kc1xTzyXBC-I844WkREwC40gVF4vbM_1z8CkUztNqhKYKfU_eDEeO4vLqXzKqazXN9gbyaj4s4s_GB3tl45Z3ji096vuXpuY-YQTd4K4q1382uMroip2RkmDq3jmFtpYGghcv9ukyks-DsZggcNukw0pWzCFq80bFv8nTWtnHy8Mhl6L8e1xRry"
    },
    {
      text: "A shopper in New Delhi added Organic Red Lentils to their pantry grid.",
      img: "https://lh3.googleusercontent.com/aida/ADBb0ujlZ0kSblKr55PIynbD3dDpBD-EgHaZCmgieEaMs6yF2w-XpIdy3X1zPgqJqaNxozYb5TrYKggybBfRSYwRkFpqCJV1ZUfmtbWCE3Tp8QJomRAQiVb1TdyA6bi_lXiXLxEk2DUr9Ao7H2nypEmQkI8OnK3_wzo7yrlkyEEmmlOSkelQVsVDDXAYOFiCVwdOfyhK5dFu6Fk5pX8lvTXjYEYGrXvU_8patDNhFArD2ZT5oauJ0Z-9kyuCRaws"
    },
    {
      text: "A customer in Mumbai checked out Essence of Elegance Parfum.",
      img: "https://lh3.googleusercontent.com/aida/ADBb0uhfoFV8AlZotaf4FwW8u4TTez39a2g9tVi35Si-STrXctkQwubEUyU3fq5xQNgliGoLBsbhJmsE7txowf_GUu_AopGTNGZalM-SCSSfMoV1HQv3uDr0HFr3iC1CIPZD7fBACU-PjEV1Q4RQ9YPXtWT3sP0rANvDhFkOEq35FzgVUEt3uakEx0aq-SzsWxWvSxliuMIweFr_Cig3x6Yu0cOcaEJsBl3w7Cl7-t3wXyfJ513RQ3Wc2hC-_rsj"
    },
    {
      text: "Someone in Chennai just ordered Jumbo Roasted Cashews.",
      img: "https://lh3.googleusercontent.com/aida/ADBb0ujhHs8NpPSVRxyxmMM43fwmMWz2Q0pIgwcS036JsuiwAVXeSEaefKHzkzUvuzzv0F9xXNKHidGizVSZyJQ7KZKghLhZLBKGc8iKjQRTsNoxx-nWi6UWWuAe7SCzT_KcetFELo6Xl5zNWqfzP3ARmZQVlAoT_MDWUre_NP4Ut7X4XwBoXXhRrzTxxKRg-APY1wWN064hTqpibu1t4grD81TN9AteQ2aqhCI049cLMPl1BG6-usc2RxtwG59I"
    }
  ];

  window.hideToast = () => {
    liveToast.classList.add('toast-slide-out');
    liveToast.classList.remove('toast-slide-in');
    setTimeout(() => {
      liveToast.classList.add('hidden');
    }, 450);
  };

  const triggerLiveToast = () => {
    const data = simulatedToasts[Math.floor(Math.random() * simulatedToasts.length)];
    toastText.innerText = data.text;
    toastImg.src = data.img;

    liveToast.classList.remove('hidden', 'toast-slide-out');
    liveToast.classList.add('toast-slide-in');

    // Automatically hide after 6 seconds
    setTimeout(() => {
      if (!liveToast.classList.contains('hidden')) {
        window.hideToast();
      }
    }, 6000);
  };

  // Launch first notification in 4 seconds, cycle every 18 seconds
  setTimeout(triggerLiveToast, 4000);
  setInterval(triggerLiveToast, 18000);

  // ==========================================
  // 7. Newsletter Subscription & Validations
  // ==========================================
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterEmail.value.trim();

    if (!email) return;

    // Display custom elegant success glassmorphism card in form container
    const originalContent = newsletterForm.innerHTML;
    newsletterForm.innerHTML = `
      <div class="w-full bg-primary-container/25 text-on-primary-container p-4 rounded-xl border border-primary/20 flex items-center gap-3 animate-pulse glassmorphism">
        <span class="material-symbols-outlined text-primary text-2xl">mail_lock</span>
        <div class="text-left">
          <p class="font-bold text-sm text-inverse-on-surface">Thank You for Subscribing!</p>
          <p class="text-xs text-on-surface-variant mt-0.5">Your 10% coupon has been sent to <span class="font-bold text-primary">${email}</span>.</p>
        </div>
      </div>
    `;

    // Reset after 10 seconds if they wish to subscribe another address
    setTimeout(() => {
      newsletterForm.innerHTML = originalContent;
      // Re-bind validation/handler if reloaded
    }, 10000);
  });

  // ==========================================
  // 8. Mobile Drawer Menu (Basic toggler)
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const alertBox = document.createElement('div');
      alertBox.className = 'fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] flex items-center justify-center p-6';
      alertBox.innerHTML = `
        <div class="bg-surface border border-outline-variant rounded-2xl shadow-2xl p-6 w-full max-w-xs text-center space-y-4">
          <span class="material-symbols-outlined text-4xl text-primary">smartphone</span>
          <h3 class="font-headline-sm text-base font-bold text-on-surface">Responsive Mega Menu</h3>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            Welcome to the mobile interface! In a production deployment, this expands a clean overlay menu.
          </p>
          <button class="w-full bg-primary text-on-primary py-2.5 rounded-xl text-xs font-semibold" id="closeMobileAlert">Close Panel</button>
        </div>
      `;
      document.body.appendChild(alertBox);
      document.getElementById('closeMobileAlert').addEventListener('click', () => alertBox.remove());
    });
  }

  // Initial cart draw
  renderCart();
});
