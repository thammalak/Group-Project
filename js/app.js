document.addEventListener('DOMContentLoaded', () => {
    // --- Language switch ---
  const translations = {
    TH: {
      'hero-title': 'สำหรับคนทำอาหาร<br class="d-none d-md-block">รวมวัตถุดิบเกรดร้านอาหารไว้ในที่เดียว',
      'hero-sub': 'เลือกผัก เนื้อ ซีฟู้ด และเครื่องปรุงจากฟาร์มพันธมิตร ตรวจสอบย้อนกลับได้ สั่งง่าย เหมาะทั้งเชฟบ้านและร้านอาหารขนาดเล็ก'
    },
    EN: {
      'hero-title': 'marketplace for chefs<br class="d-none d-md-block">All premium ingredients in one place',
      'hero-sub': 'Select fresh vegetables, meats, seafood and seasonings from trusted farms. Easy ordering for home cooks and small restaurants.'
    }
  };

  function setLang(lang) {
    const map = translations[lang];
    if (!map) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (map[key]) el.innerHTML = map[key];
    });
    const curr = document.getElementById('currentLang');
    if (curr) curr.textContent = lang;
    localStorage.setItem('site-lang', lang);
  }

  document.querySelectorAll('.lang-select').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang || 'TH';
      setLang(lang);
    });
  });

  const savedLang = localStorage.getItem('site-lang') || 'TH';
  setLang(savedLang);

   const trialBtn = document.getElementById('checkBtn');
  if (trialBtn) {
    trialBtn.addEventListener('click', () => {
      alert(
        'ขอบคุณที่สนใจ Pro Kitchen Plan\\n' +
        'ตัวอย่างระบบ: เราจะบันทึกข้อมูลการขอทดลองใช้ และทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง.'
      );
    });
  }
  const cart = {};
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartCountEl = document.getElementById('cartCount');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkBtn = document.getElementById('checkBtn');

  function renderCart() {
    if (!cartItemsEl || !cartTotalEl || !cartCountEl) return;
    const names = Object.keys(cart);
    if (names.length === 0) {
      cartItemsEl.innerHTML = 'Your cart is empty.';
      cartTotalEl.textContent = '0';
      cartCountEl.textContent = '0';
      return;
    }
    let html = '';
    let total = 0;
    let count = 0;
    names.forEach(name => {
      const item = cart[name];
      const lineTotal = item.qty * item.price;
      total += lineTotal;
      count += item.qty;
      html += `
        <div class="cart-line">
          <span>${item.qty}x ${name}</span>
          <span>${lineTotal} THB</span>
          <button class="remove-item" data-name="${name}">x</button>
        </div>
      `;
    });
    cartItemsEl.innerHTML = html;
    cartItemsEl.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        delete cart[name];
        renderCart();
      });
    });
    cartTotalEl.textContent = total.toString();
    cartCountEl.textContent = count.toString();
  }

    // ปรับจำนวนบนการ์ดสินค้า
  document.querySelectorAll('.ingredient-card .qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card  = btn.closest('.ingredient-card');
      const valEl = card.querySelector('.qty-val');
      let current = parseInt(valEl.textContent, 10) || 1;

      if (btn.dataset.action === 'inc') current++;
      if (btn.dataset.action === 'dec' && current > 1) current--;

      valEl.textContent = current;
    });
  });

  // เพิ่มในตะกร้าตามจำนวนที่เลือก
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name  = btn.dataset.name;
      const price = parseInt(btn.dataset.price, 10) || 0;
      if (!name) return;

      let qty = 1;
      const card = btn.closest('.ingredient-card');
      if (card) {
        const valEl = card.querySelector('.qty-val');
        if (valEl) {
          const v = parseInt(valEl.textContent, 10);
          if (!isNaN(v) && v > 0) qty = v;
        }
      }

      if (!cart[name]) cart[name] = { qty, price };
      else cart[name].qty += qty;

      renderCart();

      const drawer = document.getElementById('cartDrawer');
      if (drawer && typeof bootstrap !== 'undefined') {
        const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(drawer);
        offcanvas.show();
      }
    });
  });


  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const names = Object.keys(cart);
      if (!names.length) {
        alert('ยังไม่มีสินค้าในตะกร้า');
        return;
      }
      let summary = 'สรุปรายการในตะกร้า:\n';
      names.forEach(name => {
        const item = cart[name];
        summary += `- ${item.qty} x ${name} = ${item.qty * item.price} THB\n`;
      });
      summary += `รวมทั้งหมด: ${cartTotalEl.textContent} THB\n\n(Prototype Frontend สำหรับแสดงผลเท่านั้น)`;
      alert(summary);
    });
  }

  renderCart();

});
