# Everbook-info

A polished, responsive demo storefront for **Everbook-info**, an online bookstore focused on clean discovery and well-organized categories.

## Included

- 28 featured books across 7 categories
- Search, category filters, and price/title sorting
- Real book-cover requests by ISBN through Open Library Covers, with local offline fallbacks
- Reference retail/list prices in USD for specific editions
- Book detail modal
- Working demo shopping cart using localStorage
- Responsive desktop, tablet, and mobile layouts
- Reader advisory contact section
- Newsletter UI
- Local optimized Everbook-info logo

## Run locally

Open `index.html` in a browser, or use a simple local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Pricing note

Prices in the catalog are reference retail/list prices for the listed formats/editions and can change by retailer, promotion, region, and date. Before launching a real store, connect the catalog to your inventory or commerce provider for live pricing and stock.

## Cover images

The storefront requests book cover art by ISBN from the public Open Library Covers service. If a cover cannot load, a local Everbook-info fallback cover is displayed automatically so the page never shows a broken image.

## Advisory number

The included `+1 (202) 555-0147` number is an example/reserved-style placeholder for layout purposes. Replace it with your actual customer advisory number before launch.

## Important

This project is a front-end storefront demo. Checkout is intentionally not connected to a payment processor. Do not place secret keys or payment credentials in the repository.
