const books = window.BOOKS;
const grid = document.getElementById('bookGrid');
const categoryWrap = document.getElementById('categories');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const resultsCount = document.getElementById('resultsCount');
const clearFilters = document.getElementById('clearFilters');
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
let cart = JSON.parse(localStorage.getItem('everbook-cart') || '[]');

const categories = ['All', ...new Set(books.map(b => b.category))];
categoryWrap.innerHTML = categories.map(c => `<button class="${c==='All'?'active':''}" data-category="${c}">${c}</button>`).join('');

function coverUrl(book){ return `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`; }
function fallbackUrl(book){ return `assets/fallbacks/${book.isbn}.webp`; }
function imgTag(book, cls=''){ return `<img class="${cls}" src="${coverUrl(book)}" alt="Cover of ${book.title}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${fallbackUrl(book)}'">`; }
function money(v){ return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v); }
function filtered(){
  const q=searchInput.value.trim().toLowerCase();
  let list=books.filter(b=>(activeCategory==='All'||b.category===activeCategory)&&(!q||`${b.title} ${b.author}`.toLowerCase().includes(q)));
  if(sortSelect.value==='price-asc') list.sort((a,b)=>a.price-b.price);
  if(sortSelect.value==='price-desc') list.sort((a,b)=>b.price-a.price);
  if(sortSelect.value==='title') list.sort((a,b)=>a.title.localeCompare(b.title));
  return list;
}
function render(){
  const list=filtered();
  resultsCount.textContent=`${list.length} ${list.length===1?'book':'books'}`;
  grid.innerHTML=list.length?list.map(b=>`<article class="book-card">
    <div class="cover-wrap">${imgTag(b)}<span class="badge">${b.badge}</span></div>
    <div class="book-info"><span class="category">${b.category}</span><h3>${b.title}</h3><p class="author">${b.author}</p><p class="meta">${b.format} · ISBN ${b.isbn}</p>
    <div class="book-bottom"><div class="price"><strong>${money(b.price)}</strong><small>reference price</small></div><div class="card-actions"><button class="icon-btn" aria-label="View details" onclick="openBook(${b.id})">＋</button><button class="add-btn" onclick="addToCart(${b.id})">Add</button></div></div></div>
  </article>`).join(''):'<div class="empty-state"><strong>No books found.</strong><br>Try another title, author, or category.</div>';
}
categoryWrap.addEventListener('click',e=>{if(!e.target.matches('button'))return; activeCategory=e.target.dataset.category; [...categoryWrap.children].forEach(x=>x.classList.toggle('active',x===e.target)); render();});
searchInput.addEventListener('input',render);sortSelect.addEventListener('change',render);
clearFilters.addEventListener('click',()=>{activeCategory='All';searchInput.value='';sortSelect.value='featured';[...categoryWrap.children].forEach(x=>x.classList.toggle('active',x.dataset.category==='All'));render();});
function showToast(msg){toast.textContent=msg;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1700)}
window.addToCart=function(id){cart.push(id);localStorage.setItem('everbook-cart',JSON.stringify(cart));updateCart();showToast('Added to cart');}
function updateCart(){
  cartCount.textContent=cart.length;
  if(!cart.length){cartItems.innerHTML='<div class="empty-state" style="padding:40px 10px">Your cart is empty.</div>';cartSubtotal.textContent='$0.00';return}
  const groups=cart.reduce((m,id)=>(m[id]=(m[id]||0)+1,m),{}); let total=0;
  cartItems.innerHTML=Object.entries(groups).map(([id,qty])=>{const b=books.find(x=>x.id==id);total+=b.price*qty;return `<div class="cart-item">${imgTag(b)}<div><strong>${b.title}</strong><small>${qty} × ${money(b.price)}</small></div><button onclick="removeOne(${b.id})">Remove</button></div>`}).join('');
  cartSubtotal.textContent=money(total);
}
window.removeOne=function(id){const i=cart.indexOf(id);if(i>-1)cart.splice(i,1);localStorage.setItem('everbook-cart',JSON.stringify(cart));updateCart();}
function openCart(){cartDrawer.classList.add('open');overlay.classList.add('show');cartDrawer.setAttribute('aria-hidden','false')}
function closeCartDrawer(){cartDrawer.classList.remove('open');overlay.classList.remove('show');cartDrawer.setAttribute('aria-hidden','true')}
cartButton.addEventListener('click',openCart);closeCart.addEventListener('click',closeCartDrawer);overlay.addEventListener('click',closeCartDrawer);
window.openBook=function(id){const b=books.find(x=>x.id===id);dialogBody.innerHTML=`<div class="dialog-layout">${imgTag(b)}<div class="dialog-copy"><span class="eyebrow">${b.category}</span><h2>${b.title}</h2><p>By ${b.author}</p><div class="dialog-meta"><span><b>Format</b><br>${b.format}</span><span><b>ISBN</b><br>${b.isbn}</span></div><p>A featured Everbook-info selection. Cover imagery is loaded from a public book-cover service using this edition's ISBN.</p><div class="dialog-price">${money(b.price)}</div><small>Reference retail/list price in USD; retailer pricing may vary.</small><br><button onclick="addToCart(${b.id});document.getElementById('bookDialog').close()">Add to cart</button></div></div>`;dialog.showModal();}
document.getElementById('dialogClose').addEventListener('click',()=>dialog.close());
document.getElementById('checkoutBtn').addEventListener('click',()=>showToast('Demo checkout — connect your payment provider to go live'));
document.getElementById('newsletterForm').addEventListener('submit',e=>{e.preventDefault();e.target.reset();showToast('Thanks for joining the Everbook Letter!')});
render();updateCart();
