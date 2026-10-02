# Sources & Data Notes

## Book covers

Book-cover images are requested at runtime from the **Open Library Covers API** using each edition's ISBN.

Documentation:
- https://openlibrary.org/dev/docs/api/covers
- https://openlibrary.org/dev/docs/api/books

Open Library documents the ISBN cover URL format and recommends using `covers.openlibrary.org` for public-facing book-cover images.

## Price references

Catalog prices are stored as **edition-specific retail/list reference prices in USD**. Retailers can change prices at any time, so the storefront labels them as reference prices rather than guaranteeing a live checkout price.

Examples used to validate the pricing approach:
- Penguin Random House — *1984*, ISBN 9780451524935 — $12.00 mass market paperback
- Penguin Random House — *Pride and Prejudice*, ISBN 9780141439518 — $9.00 paperback
- Simon & Schuster — *The Great Gatsby*, ISBN 9780743273565 — $17.00 trade paperback
- Simon & Schuster — *Fahrenheit 451*, ISBN 9781451673319 — $17.00 trade paperback
- Hachette / Orbit — *The Fifth Season*, ISBN 9780316229296 — $19.99 trade paperback

For production commerce, connect a live retailer, distributor, inventory, or commerce API so price and stock are updated automatically.

## Rights

Book titles, author names, cover artwork, publisher marks, and related intellectual property remain the property of their respective rights holders.

The Everbook-info logo and local fallback covers are included as project assets.
