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

- Admin doens't require login
- No guest accounts
- No order history
- Not optimizing and overlapping code
- Figma implementation doesn't fully implemented
- Little error handling
- Vercel hosts the Vite app only.

---

## 6. Deploy on Vercel

Vercel runs the React app in `RoceCaf/`. The dummy catalog images live in `RoceCaf/public/products/` so they load without PHP.

A `404: NOT_FOUND` on the `.vercel.app` URL usually means Vercel published the **repo root** (README + `backend/`) instead of the Vite `dist` folder. There is no `index.html` at the repo root.

**Fix an existing project**

1. Push the latest files (`vercel.json` at the repo root, and `RoceCaf/vercel.json`).
2. In Vercel: **Project → Settings → General → Root Directory** → `RoceCaf` → Save.
3. **Settings → Build and Deployment**: Framework **Vite**, Build `npm run build`, Output **`dist`** (not `public`).
4. **Deployments → … on the latest → Redeploy** (or push a new commit).

Alternatively, leave Root Directory empty. The **repo-root** `vercel.json` now builds `RoceCaf` and publishes `RoceCaf/dist`.

**New project**

1. Push the repo to GitHub.
2. Vercel → **Add New… → Project** → import the repo.
3. Set **Root Directory** to `RoceCaf`.
4. Framework **Vite**. Build `npm run build`. Output `dist`.
5. Do **not** set `VITE_API_URL` unless you have a public Laravel URL.
6. Deploy, then check landing, Catalog, a product page, cart, and admin.

Optional later: host Laravel (Railway, Render, a VPS), put that API’s CORS and `APP_URL` in order, then add Vercel env `VITE_API_URL=https://your-api.example/api` and `VITE_API_ORIGIN=https://your-api.example`, and redeploy.
