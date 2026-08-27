# RoceCaf

RoceCaf is an Product Website that displays catalogs and branding to appeal for office workers, this site features, shop landing, catalog, product details, cart, and a simple admin catalog.

## Cart: client-side until checkout


## 1. Overview

| Surface | What it does |
| --- | --- |
| Landing | Figma-based hero (rotating flavors), story, reviews |
| Catalog | Search, category filter, product cards |
| Product details | Image, price, stock, add to cart |
| Cart overlay | Qty (+ / − / typed), checkout, receipt overlay |
| Admin | Open from the header profile icon (no login). Create / edit / delete products and stock |

Frontend: `RoceCaf/` (Vite + React). Backend: `backend/` (Laravel + SQLite).

---

## 2. Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| UI | React 19 | Component shop UI, cart context, overlays |
| Bundler | Vite 8 | Proxies `/api`, `/products`, `/storage` to Laravel |
| Styling | Plain CSS (`FigmaDesign.css`) | Mathing Figma Original Design |
| API | Laravel 13 + PHP 8.3 | Products, stock, checkout, and others |
| DB | SQLite | Local Demo |
| Cart | `localStorage` + React context | No server load until checkout |

---
## From this point downwards, it's helped by AI to explain how this website works
---
## 3. Run locally

Need **Node.js**, **PHP 8.3+**, and **Composer**.

### Backend

```bash
cd backend
copy .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

`--seed` creates:

- Admin user `admin@rocecaf.com` / `password` (login API exists; the UI admin page does not use it)
- Categories: **Cans**, **Grind**
- Six products (Mocktail / Americano / Matcha × can & grind) with stock and `/products/...` images

Optional env (defaults already match local serve):

```
APP_URL=http://127.0.0.1:8000
DB_CONNECTION=sqlite
```

### Frontend

```bash
cd RoceCaf
npm install
npm run dev
```

Vite is typically `http://localhost:5173` or `5174`. Optional:

```
VITE_API_URL=http://127.0.0.1:8000/api
VITE_API_ORIGIN=http://127.0.0.1:8000
```

If unset, those same URLs are the defaults. Dev proxy forwards `/api`, `/products`, and `/storage` to port 8000.

Open the shop in the browser, add items (client-only), then **Check Out** to hit the API and see the receipt.

---

## 4. API endpoints

Base URL: `http://127.0.0.1:8000/api`

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/login` | — | Sanctum token (not used by the current UI) |
| `GET` | `/categories` | public | List categories |
| `GET` | `/products` | public | List products + category |
| `GET` | `/products/{id}` | public | One product |
| `POST` | `/products` | public | Create (JSON or multipart images) |
| `POST` / `PUT` / `PATCH` | `/products/{id}` | public | Update (`POST` used for multipart edit) |
| `DELETE` | `/products/{id}` | public | Delete |
| `POST` | `/checkout` | public | Create order, decrement stock (`lockForUpdate`) |

Images: `GET /products/{file}` and `GET /storage/products/{file}` (web routes, not under `/api`).

### Examples

**List products**

```http
GET /api/products
```

```json
[
  {
    "id": 1,
    "slug": "mocktail-can",
    "name": "Mocktail coffee",
    "title": "Mocktail",
    "price": 20000,
    "stock": 120,
    "image": "/products/cat-mocktail-can.png",
    "hero_image": "/products/detail-mocktail.png",
    "category": { "id": 1, "name": "Cans" }
  }
]
```

**Checkout**

```http
POST /api/checkout
Content-Type: application/json
```

```json
{
  "items": [{ "product_id": 1, "qty": 2 }]
}
```

**201**

```json
{
  "id": 1,
  "status": "paid",
  "total": 40000,
  "items": [
    { "product_id": 1, "qty": 2, "price": 20000 }
  ]
}
```

**400 / 422** if qty exceeds stock, e.g. `"Only 3 of Mocktail coffee left in stock."`

**Create product (JSON)**

```json
{
  "category_id": 1,
  "name": "Mocktail coffee",
  "title": "Mocktail",
  "price": 20000,
  "stock": 10,
  "description": "Citrus office can."
}
```

Multipart: fields plus files `image` and/or `hero_image`. Frontend maps uploads to `/products/{hash}`.

---

## 5. Known limitations

- **Admin has no login.** Profile icon opens `/admin/catalog`. Product write APIs are public.
- **Cart is not on the server** until checkout. Another tab/device does not share the cart; stock is only reserved at checkout (race possible between two buyers until `lockForUpdate` runs).
- **Checkout is not a real payment.** Order is stored as `paid` immediately; no gateway, email, or shipping.
- **`POST /login` and Sanctum** are unused by the React app (`rocecaf-token` is read but never set in the UI).
- **PDP Details / Packaging** accordions were removed; fields may still exist in admin/API.
- **No guest accounts, order history, or inventory dashboard** beyond the catalog grid.
- **Hero / motion** is a simplified Figma-inspired cycle, not a 1:1 Framer export.
- **Frontend has no automated tests;** time went to UI and checkout.
- **`axios` is in `package.json` but the client uses `fetch`.**
- Product images must exist under `backend/public/products` (or the image controller fallback). A missing file shows a broken image until re-uploaded.
- **Vercel hosts the Vite app only.** Laravel is not deployed with this frontend. Online, the shop uses bundled dummy products (and `localStorage` after the first visit) unless you set `VITE_API_URL` to a hosted API.

---

## 6. Deploy on Vercel

Vercel runs the React app in `RoceCaf/`. The dummy catalog images live in `RoceCaf/public/products/` so they load without PHP.

1. Push the repo to GitHub (GitHub.com → New repository, then from the project root: `git add`, `git commit`, `git remote add origin …`, `git push -u origin main`).
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. **Add New… → Project** and import this repository.
4. Set **Root Directory** to `RoceCaf` (not the repo root that also contains `backend/`).
5. Framework Preset should be **Vite**. Build Command `npm run build`, Output `dist`. Leave Install as `npm install`.
6. Do **not** set `VITE_API_URL` unless you have a public Laravel URL. If it is unset, visitors get the dummy Mocktail / Americano / Matcha products, stored in `localStorage` as `rocecaf-catalog`.
7. Click **Deploy**. After it succeeds, open the `.vercel.app` URL.
8. Check **landing**, **Catalog**, a product page, **cart**, and **admin** (profile icon). Headers stay at the top while you scroll. Catalog cards should show the dummy cans/grind photos.
9. If `/catalog` 404s on refresh, confirm `vercel.json` in `RoceCaf/` was uploaded (it rewrites SPA routes to `index.html`).

Optional later: host Laravel (Railway, Render, a VPS), put that API’s CORS and `APP_URL` in order, then add Vercel env `VITE_API_URL=https://your-api.example/api` and `VITE_API_ORIGIN=https://your-api.example`, and redeploy.
