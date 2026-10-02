# 📚 Everbook-info

**Discover Your Next Great Read**

Everbook-info is a polished, responsive online bookstore demo with a broad catalog, clear category organization, real book-cover requests by ISBN, edition-specific reference prices, search, sorting, product details, and a working browser-side shopping cart.

## ✨ What is included

- **96 curated books**
- **12 categories**
- Search by **title, author, ISBN, or category**
- Category filters and category discovery cards
- Sort by featured order, price, title, or author
- Progressive **Load more** catalog browsing
- Shopping cart stored in `localStorage`
- Responsive desktop, tablet, and mobile layout
- Product detail modal
- Everbook-info logo in the header, hero, about section, footer, and favicon
- Reader advisory section
- Newsletter demo form
- Local branded fallback cover for every book
- External real-cover requests through Open Library's Covers API using ISBN

## 📚 Categories

1. Classics
2. Mystery & Thriller
3. Fantasy
4. Science Fiction
5. Romance
6. Horror
7. Self-Development
8. Business & Finance
9. Biography & Memoir
10. Kids & Young Readers
11. Young Adult
12. History & Society

Each category contains **8 selected titles**.

## 🖼️ Book covers

The website requests cover images from Open Library using the ISBN of the selected edition:

`https://covers.openlibrary.org/b/isbn/ISBN-M.jpg?default=false`

If a cover is unavailable or the visitor is offline, the website automatically displays a local Everbook-info fallback cover included inside `assets/fallbacks/`.

## 💵 Pricing

Prices in the catalog are **edition-specific retail/list reference prices in USD**. Book prices can change by retailer, promotion, format, and date, so production stores should connect a live catalog or commerce backend before taking orders.

## ☎️ Reader advisory

The demo uses the reserved fictional North American number:

**+1 (202) 555-0147**

Replace it with the real Everbook-info business number before launch.

## 📁 Structure

```text
everbook-info-store/
├── index.html
├── README.md
├── SOURCES.md
├── preview.png
└── assets/
    ├── app.js
    ├── data.js
    ├── styles.css
    ├── img/
    │   └── everbook-logo.webp
    └── fallbacks/
        └── [96 local fallback covers]
```

## 🚀 Run locally

Open `index.html` in a modern browser, or serve the folder using a simple local web server.

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## ⚠️ Demo storefront notice

The checkout button is intentionally a demo and is **not connected to a payment processor**. Before launch, connect a secure payment provider, real inventory, shipping, tax, customer support, and order-management systems.

---

Made for **Everbook-info**.
