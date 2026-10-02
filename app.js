const books = window.BOOKS;
const grid = document.getElementById('bookGrid');
const categoryWrap = document.getElementById('categoryPills');
const categoryCards = document.getElementById('categoryCards');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const resultsCount = document.getElementById('resultsCount');
const clearFilters = document.getElementById('clearFilters');
const loadMore = document.getElementById('loadMore');
const cartDrawer = document.getElementById('cartDrawer');
const cartButton = document.getElementById('cartButton');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const dialog = document.getElementById('bookDialog');
const dialogBody = document.getElementById('dialogBody');
const toast = document.getElementById('toast');

let activeCategory = 'All';
let visibleCount = 24;
let cart = JSON.parse(localStorage.getItem('everbook-cart') || '[]');

document.getElementById('heroBookCount').textContent = books.length;
const categories = ['All', ...new Set(books.map(b => b.category))];
document.getElementById('heroCategoryCount').textContent = categories.length - 1;

const categoryIcons = {
  'Classics':'◈','Mystery & Thriller':'⌕','Fantasy':'✦','Science Fiction':'◌',
  'Romance':'♡','Horror':'☾','Self-Development':'↑','Business & Finance':'◇',
  'Biography & Memoir':'◎','Kids & Young Readers':'☀','Young Adult':'☆','History & Society':'⌛'
};

categoryWrap.innerHTML = categories.map(c =>
  `<button class="${c==='All'?'active':''}" data-category="${c}">${c}${c!=='All'?` <span>${books.filter(b=>b.category===c).length}</span>`:''}</button>`
).join('');

categoryCards.innerHTML = categories.filter(c=>c!=='All').map(c => {
  const count = books.filter(b=>b.category===c).length;
  return `<button class="category-card" data-category="${c}">
    <span class="category-icon">${categoryIcons[c] || '•'}</span>
    <strong>${c}</strong><small>${count} selected titles</small>
  </button>`;
}).join('');

function coverUrl(book){ return `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg?default=false`; }
function fallbackUrl(book){ return `assets/fallbacks/${book.isbn}.webp`; }
function openLibraryUrl(book){ return `https://openlibrary.org/isbn/${book.isbn}`; }

function imgTag(book, cls=''){
  return `<img class="${cls}" src="${coverUrl(book)}" alt="Cover of ${escapeHtml(book.title)}" loading="lazy" referrerpolicy="no-referrer"
  onerror="this.onerror=null;this.src='${fallbackUrl(book)}'">`;
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function money(v){ return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v); }

function filtered(){
  const q = searchInput.value.trim().toLowerCase();
  let list = books.filter(b =>
    (activeCategory==='All' || b.category===activeCategory) &&
    (!q || `${b.title} ${b.author} ${b.isbn} ${b.category}`.toLowerCase().includes(q))
  );
  if(sortSelect.value==='price-asc') list.sort((a,b)=>a.price-b.price);
  if(sortSelect.value==='price-desc') list.sort((a,b)=>b.price-a.price);
  if(sortSelect.value==='title') list.sort((a,b)=>a.title.localeCompare(b.title));
  if(sortSelect.value==='author') list.sort((a,b)=>a.author.localeCompare(b.author));
  return list;
}

function render(){
  const list = filtered();
  const shown = list.slice(0, visibleCount);
  resultsCount.textContent = `${list.length} ${list.length===1?'book':'books'}${list.length>shown.length?` · showing ${shown.length}`:''}`;
  grid.innerHTML = shown.length ? shown.map(b=>`<article class="book-card">
    <div class="cover-wrap">
      ${imgTag(b)}
      <span class="badge">${escapeHtml(b.badge)}</span>
      <button class="quick-view" aria-label="View ${escapeHtml(b.title)}" onclick="openBook(${b.id})">Quick view</button>
    </div>
    <div class="book-info">
      <span class="category">${escapeHtml(b.category)}</span>
      <h3>${escapeHtml(b.title)}</h3>
      <p class="author">${escapeHtml(b.author)}</p>
      <p class="meta">${escapeHtml(b.format)} · ISBN ${b.isbn}</p>
      <div class="book-bottom">
        <div class="price"><strong>${money(b.price)}</strong><small>edition reference price</small></div>
        <button class="add-btn" onclick="addToCart(${b.id})">Add to cart</button>
      </div>
    </div>
  </article>`).join('') : '<div class="empty-state"><strong>No books found.</strong><br>Try another title, author, ISBN, or category.</div>';

  loadMore.style.display = list.length > shown.length ? 'inline-flex' : 'none';
}

function setCategory(category){
  activeCategory = category;
  visibleCount = 24;
  [...categoryWrap.children].forEach(x=>x.classList.toggle('active',x.dataset.category===category));
  render();
  document.getElementById('catalog').scrollIntoView({behavior:'smooth',block:'start'});
}

categoryWrap.addEventListener('click', e=>{
  const btn=e.target.closest('button[data-category]');
  if(!btn) return;
  setCategory(btn.dataset.category);
});

categoryCards.addEventListener('click', e=>{
  const btn=e.target.closest('button[data-category]');
  if(!btn) return;
  setCategory(btn.dataset.category);
});

searchInput.addEventListener('input',()=>{visibleCount=24;render();});
sortSelect.addEventListener('change',()=>{visibleCount=24;render();});
loadMore.addEventListener('click',()=>{visibleCount+=24;render();});

clearFilters.addEventListener('click',()=>{
  activeCategory='All';
  searchInput.value='';
  sortSelect.value='featured';
  visibleCount=24;
  [...categoryWrap.children].forEach(x=>x.classList.toggle('active',x.dataset.category==='All'));
  render();
});

function showToast(msg){
  toast.textContent=msg;
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>toast.classList.remove('show'),1800);
}

window.addToCart=function(id){
  cart.push(id);
  localStorage.setItem('everbook-cart',JSON.stringify(cart));
  updateCart();
  showToast('Added to cart');
}

function updateCart(){
  cartCount.textContent=cart.length;
  if(!cart.length){
    cartItems.innerHTML='<div class="empty-state cart-empty">Your cart is empty.<br><small>Add a few books from the collection.</small></div>';
    cartSubtotal.textContent='$0.00';
    return;
  }
  const groups=cart.reduce((m,id)=>(m[id]=(m[id]||0)+1,m),{});
  let total=0;
  cartItems.innerHTML=Object.entries(groups).map(([id,qty])=>{
    const b=books.find(x=>x.id==id);
    total+=b.price*qty;
    return `<div class="cart-item">${imgTag(b)}<div><strong>${escapeHtml(b.title)}</strong><small>${qty} × ${money(b.price)}</small></div><button onclick="removeOne(${b.id})">Remove</button></div>`;
  }).join('');
  cartSubtotal.textContent=money(total);
}

window.removeOne=function(id){
  const i=cart.indexOf(id);
  if(i>-1) cart.splice(i,1);
  localStorage.setItem('everbook-cart',JSON.stringify(cart));
  updateCart();
}

function openCart(){
  cartDrawer.classList.add('open');
  overlay.classList.add('show');
  cartDrawer.setAttribute('aria-hidden','false');
}
function closeCartDrawer(){
  cartDrawer.classList.remove('open');
  overlay.classList.remove('show');
  cartDrawer.setAttribute('aria-hidden','true');
}
cartButton.addEventListener('click',openCart);
closeCart.addEventListener('click',closeCartDrawer);
overlay.addEventListener('click',closeCartDrawer);

window.openBook=function(id){
  const b=books.find(x=>x.id===id);
  dialogBody.innerHTML=`<div class="dialog-layout">
    ${imgTag(b)}
    <div class="dialog-copy">
      <span class="eyebrow">${escapeHtml(b.category)}</span>
      <h2>${escapeHtml(b.title)}</h2>
      <p class="dialog-author">By ${escapeHtml(b.author)}</p>
      <div class="dialog-meta">
        <span><b>Format</b><br>${escapeHtml(b.format)}</span>
        <span><b>ISBN</b><br>${b.isbn}</span>
      </div>
      <p>Selected for the Everbook-info catalog. The cover is requested from Open Library using this edition's ISBN; if unavailable, the site automatically shows the branded local fallback included in the ZIP.</p>
      <div class="dialog-price">${money(b.price)}</div>
      <small>Edition-specific retail/list reference in USD. Retailer pricing and promotions may vary.</small>
      <div class="dialog-actions">
        <button onclick="addToCart(${b.id});document.getElementById('bookDialog').close()">Add to cart</button>
        <a href="${openLibraryUrl(b)}" target="_blank" rel="noopener">View ISBN record</a>
      </div>
    </div>
  </div>`;
  dialog.showModal();
}

document.getElementById('dialogClose').addEventListener('click',()=>dialog.close());
document.getElementById('checkoutBtn').addEventListener('click',()=>showToast('Demo checkout — connect your payment provider before launch'));
document.getElementById('newsletterForm').addEventListener('submit',e=>{e.preventDefault();e.target.reset();showToast('Thanks for joining the Everbook Letter!')});
document.getElementById('copyNumber').addEventListener('click', async function(){
  try{
    await navigator.clipboard.writeText('+1 (202) 555-0147');
    this.textContent='Number copied';
    setTimeout(()=>this.textContent='Copy number',1500);
  }catch{ showToast('Reader advisory: +1 (202) 555-0147'); }
});

render();
updateCart();
