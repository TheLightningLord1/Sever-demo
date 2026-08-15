/* ========================================
   SEVER — Main JavaScript
   ======================================== */

// --- ДАННЫЕ: 8 товаров коллекции SS26 ---
const products = [
    {
        id: 1,
        title: "Худи оверсайз «Core»",
        category: "hoodies",
        price: 6900,
        desc: "Плотное худи оверсайз из футера 320 г/м². Капюшон с двойным швом, манжеты из рельефной резинки. Тираж: 50 шт.",
        features: ["100% хлопок", "Футер 320 г/м²", "Оверсайз крой", "Рельефные манжеты"],
        sizes: ["S", "M", "L", "XL"],
        img: "hoodie"
    },
    {
        id: 2,
        title: "Свитшот «Blank»",
        category: "hoodies",
        price: 5900,
        desc: "Минималистичный свитшот без принтов. Мягкая внутренняя начёсная сторона. Идеальная база под любой образ.",
        features: ["100% хлопок", "Футер 280 г/м²", "Прямой крой", "Начёс внутри"],
        sizes: ["S", "M", "L", "XL"],
        img: "sweatshirt"
    },
    {
        id: 3,
        title: "Футболка оверсайз «Base»",
        category: "tees",
        price: 2900,
        desc: "Базовая футболка свободного кроя из плотного хлопка 240 г/м². Усиленная горловина, плоские швы.",
        features: ["100% хлопок", "Плотность 240 г/м²", "Оверсайз", "Плоские швы"],
        sizes: ["S", "M", "L", "XL"],
        img: "tee"
    },
    {
        id: 4,
        title: "Лонгслив «Layer»",
        category: "tees",
        price: 3900,
        desc: "Удлинённый лонгслив для наслоений. Плотный трикотаж, не просвечивает. Усиленные плечевые швы.",
        features: ["100% хлопок", "Плотность 260 г/м²", "Удлинённый крой", "Не просвечивает"],
        sizes: ["S", "M", "L", "XL"],
        img: "longsleeve"
    },
    {
        id: 5,
        title: "Футболка «Heavy»",
        category: "tees",
        price: 3400,
        desc: "Максимально плотная футболка 300 г/м². Премиальный хлопок кольцевого прядения. Двойная строчка.",
        features: ["100% хлопок", "Плотность 300 г/м²", "Кольцевое прядение", "Двойная строчка"],
        sizes: ["S", "M", "L", "XL"],
        img: "heavytee"
    },
    {
        id: 6,
        title: "Шоппер «Tote»",
        category: "access",
        price: 1900,
        desc: "Вместительный шоппер из плотного хлопка 400 г/м². Внутренний карман, удлинённые ручки.",
        features: ["100% хлопок", "Плотность 400 г/м²", "Внутренний карман", "Удлинённые ручки"],
        sizes: ["ONE SIZE"],
        img: "tote"
    },
    {
        id: 7,
        title: "Кепка «Logo»",
        category: "access",
        price: 2400,
        desc: "Шестипанельная кепка с вышивкой SEVER. Премиальный хлопок, регулируемый ремешок.",
        features: ["100% хлопок", "Вышивка SEVER", "Регулируемый ремешок", "6 панелей"],
        sizes: ["ONE SIZE"],
        img: "cap"
    },
    {
        id: 8,
        title: "Носки «Pack»",
        category: "access",
        price: 900,
        desc: "Набор из 2 пар носков средней высоты. Плотное плетение, усиленная пятка и носок.",
        features: ["80% хлопок", "Усиленная пятка", "Средняя высота", "Набор 2 пары"],
        sizes: ["ONE SIZE"],
        img: "socks"
    }
];

const catLabels = {
    hoodies: "Худи и свитшоты",
    tees: "Футболки",
    access: "Аксессуары"
};

// --- СОСТОЯНИЕ ---
let cart = [];
try {
    const saved = localStorage.getItem("sever_cart");
    if (saved) cart = JSON.parse(saved);
} catch (e) { cart = []; }

let currentModalProduct = null;
let currentSize = "S";

// --- ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initScrollTop();
    initScrollHeader();
    initFadeInObserver();
    updateCartUI();

    const page = document.body.dataset.page;
    if (page === "home") {
        renderHomeProducts();
    } else if (page === "catalog") {
        renderCatalogProducts("all");
    } else if (page === "checkout") {
        initCheckout();
    }
});

// --- РЕНДЕР: Главная (Новый дроп — первые 4) ---
function renderHomeProducts() {
    const grid = document.getElementById("home-products-grid");
    if (!grid) return;
    grid.innerHTML = products.slice(0, 4).map(p => createProductCard(p)).join("");
}

// --- РЕНДЕР: Каталог ---
function renderCatalogProducts(category) {
    const grid = document.getElementById("catalog-products-grid");
    if (!grid) return;
    const filtered = category === "all" ? products : products.filter(p => p.category === category);
    grid.innerHTML = filtered.map(p => createProductCard(p)).join("");
}

function createProductCard(p) {
    return `
        <div class="product-card" onclick="openModal(${p.id})">
            <div class="product-img-wrap">
                <img src="images/products/${p.img}.jpg"
                     alt="${p.title}"
                     class="product-img"
                     loading="lazy"
                     onerror="this.onerror=null;this.outerHTML='<div class=\'product-img-placeholder\'><span>${p.title}</span></div>';">
            </div>
            <div class="product-info">
                <div class="product-category">${catLabels[p.category] || p.category}</div>
                <div class="product-header">
                    <span class="product-title">${p.title}</span>
                    <span class="product-price">${p.price.toLocaleString("ru-RU")} ₽</span>
                </div>
                <p class="product-desc">${p.desc}</p>
                <button class="add-btn" onclick="event.stopPropagation(); quickAddToCart(${p.id})">В корзину</button>
            </div>
        </div>
    `;
}

// --- ФИЛЬТРАЦИЯ ---
function filterCategory(category, btn) {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    renderCatalogProducts(category);
}

// --- МОДАЛЬНОЕ ОКНО ---
function openModal(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    currentModalProduct = p;
    currentSize = p.sizes[0];

    document.getElementById("modal-category").textContent = catLabels[p.category] || p.category;
    document.getElementById("modal-title").textContent = p.title;
    document.getElementById("modal-price").textContent = p.price.toLocaleString("ru-RU") + " ₽";
    document.getElementById("modal-desc").textContent = p.desc;

    document.getElementById("modal-features").innerHTML = p.features
        .map(f => `<span class="feature-tag">${f}</span>`).join("");

    const sizeContainer = document.querySelector(".size-options");
    sizeContainer.innerHTML = p.sizes.map((s, i) =>
        `<button class="size-btn ${i === 0 ? "active" : ""}" onclick="selectSize(this)">${s}</button>`
    ).join("");

    document.getElementById("modal-img-container").innerHTML =
        `<img src="images/products/${p.img}.jpg" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.outerHTML='<div class=\'modal-img-placeholder\'><span>${p.title}</span></div>';">`;

    document.getElementById("modal-add-btn").onclick = () => {
        addToCart(p.id, currentSize);
        closeModal();
    };

    document.getElementById("product-modal-overlay").classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    document.getElementById("product-modal-overlay").classList.remove("open");
    document.body.style.overflow = "";
}

function closeModalOnOverlay(e) {
    if (e.target === document.getElementById("product-modal-overlay")) closeModal();
}

function selectSize(btn) {
    document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentSize = btn.textContent;
}

// --- КОРЗИНА ---
function quickAddToCart(id) {
    const p = products.find(x => x.id === id);
    const size = p.sizes[0];
    addToCart(id, size);
}

function addToCart(id, size) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    const key = id + "-" + (size || p.sizes[0]);
    const existing = cart.find(item => item.key === key);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            key,
            id,
            title: p.title,
            price: p.price,
            size: size || p.sizes[0],
            qty: 1
        });
    }

    saveCart();
    updateCartUI();
    showToast(`«${p.title}» (${size || p.sizes[0]}) добавлен`);
}

function removeFromCart(key) {
    cart = cart.filter(item => item.key !== key);
    saveCart();
    updateCartUI();
}

function changeQty(key, delta) {
    const item = cart.find(i => i.key === key);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.key !== key);
    }
    saveCart();
    updateCartUI();
}

function saveCart() {
    try { localStorage.setItem("sever_cart", JSON.stringify(cart)); } catch (e) {}
}

function updateCartUI() {
    document.querySelectorAll(".cart-count").forEach(el => {
        el.textContent = cart.reduce((s, i) => s + i.qty, 0);
    });

    const itemsContainer = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total-price");
    if (!itemsContainer || !totalEl) return;

    if (cart.length === 0) {
        itemsContainer.innerHTML = `<div class="cart-empty">Корзина пуста</div>`;
        totalEl.textContent = "0 ₽";
        return;
    }

    let total = 0;
    itemsContainer.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-meta">Размер: ${item.size} · ${item.price.toLocaleString("ru-RU")} ₽</div>
                </div>
                <div class="cart-item-controls">
                    <button onclick="changeQty('${item.key}', -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty('${item.key}', 1)">+</button>
                </div>
            </div>
        `;
    }).join("");

    totalEl.textContent = total.toLocaleString("ru-RU") + " ₽";
}

function toggleCart(show) {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    if (show) {
        drawer.classList.add("open");
        overlay.classList.add("open");
        document.body.style.overflow = "hidden";
        updateCartUI();
    } else {
        drawer.classList.remove("open");
        overlay.classList.remove("open");
        document.body.style.overflow = "";
    }
}

// --- ОФОРМЛЕНИЕ ЗАКАЗА ---
function handleCheckout() {
    if (cart.length === 0) {
        showToast("Корзина пуста");
        return;
    }
    window.location.href = "checkout.html";
}

function initCheckout() {
    const summaryItems = document.getElementById("checkout-summary-items");
    const summaryTotal = document.getElementById("checkout-summary-total");
    if (!summaryItems || !summaryTotal) return;

    if (cart.length === 0) {
        summaryItems.innerHTML = `<div class="summary-empty">Корзина пуста. <a href="catalog.html">В каталог</a></div>`;
        summaryTotal.textContent = "0 ₽";
        return;
    }

    let total = 0;
    summaryItems.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        return `
            <div class="summary-item">
                <div class="summary-item-name">
                    <strong>${item.title}</strong>
                    ${item.qty > 1 ? `<span style="color:#999;font-size:0.78rem;">${item.qty} шт.</span>` : ""}
                    <span style="display:block;color:#999;font-size:0.78rem;">Размер: ${item.size}</span>
                </div>
                <div class="summary-item-price">${(item.price * item.qty).toLocaleString("ru-RU")} ₽</div>
            </div>
        `;
    }).join("");

    summaryTotal.textContent = total.toLocaleString("ru-RU") + " ₽";

    const form = document.getElementById("checkout-form");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const original = btn.textContent;
            btn.textContent = "Оформляем…";
            btn.disabled = true;

            setTimeout(() => {
                showToast("Заказ оформлен! Мы свяжемся с вами.");
                cart = [];
                saveCart();
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            }, 1200);
        });
    }
}

// --- ПОДПИСКА ---
function handleSubscribe(e) {
    e.preventDefault();
    const input = e.target.querySelector('input[type="email"]');
    if (input && input.value) {
        showToast("Спасибо за подписку!");
        input.value = "";
    }
}

// --- МОБИЛЬНОЕ МЕНЮ ---
function initMobileMenu() {
    const btn = document.querySelector(".mobile-menu-btn");
    const nav = document.querySelector(".mobile-nav");
    if (!btn || !nav) return;

    btn.addEventListener("click", () => {
        btn.classList.toggle("active");
        nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            btn.classList.remove("active");
            nav.classList.remove("open");
        });
    });
}

// --- SCROLL TO TOP ---
function initScrollTop() {
    const btn = document.querySelector(".scroll-top");
    if (!btn) return;
    window.addEventListener("scroll", () => {
        btn.classList.toggle("visible", window.scrollY > 500);
    });
    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// --- HEADER SCROLL ---
function initScrollHeader() {
    const header = document.querySelector(".header");
    if (!header) return;
    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 40);
    });
}

// --- FADE IN OBSERVER ---
function initFadeInObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".animate-on-scroll, .fade-in").forEach(el => observer.observe(el));
}

// --- TOAST ---
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2800);
}
