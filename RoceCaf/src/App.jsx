import { createContext, useContext, useEffect, useRef, useState } from 'react'
import './App.css'
import './FigmaDesign.css'
import logoMark from './assets/Subtract-2.svg'
import canMark from './assets/Subtract-1.svg'
import searchIcon from './assets/humbleicons_search.svg'
import bagIcon from './assets/solar_bag-4-linear.svg'
import profileIcon from './assets/profile-picture-svgrepo-com 1.svg'
import starIcon from './assets/Star 6.svg'
import jumpingArt from './assets/figma/jumping.svg'
import chillingArt from './assets/figma/chilling.svg'
import sittingArt from './assets/figma/sitting.svg'
import logoAsus from './assets/figma/logo-1.svg'
import logoNike from './assets/figma/logo-2.svg'
import logoFord from './assets/figma/logo-3.svg'
import logoDiscord from './assets/figma/logo-4.svg'
import logoX from './assets/figma/logo-5.svg'
import logoAudi from './assets/figma/logo-6.svg'
import logoExtra from './assets/figma/logo-7.svg'
import avatarCaitery from './assets/Ellipse 6.svg'
import avatarIchsan from './assets/Ellipse 6-1.svg'
import avatarBahagi from './assets/Ellipse 6-2.svg'
import canBody from './assets/can 2.png'
import leaves from './assets/image 6.png'
import orangeSlice from './assets/image 4.png'
import flowers from './assets/half-juicy-orange-close-up-isolated_269543-1387-transformed 1.png'
import chocolate from './assets/chocolate.png'
import pepper from './assets/pepper.png'
import peanut from './assets/peanut.png'
import matchaLeaf from './assets/matcha.png'
import matchaPowder from './assets/matchapowder.png'
import officePhoto from './assets/Image.png'
import coffeePhoto from './assets/Image-1.png'
import outdoorPhoto from './assets/Image-2.png'
import galleryAddIcon from './assets/figma/gallery-add.svg'
import { api, apiEnabled, mapProduct } from './api'
import { SEED_CATEGORIES, SEED_PRODUCTS } from './seedCatalog'
const HERO_FLAVORS = [
	{ name: 'Mocktail', tag: 'Sip and Lock In', bg: '#ffefda', word: '#ffd399', art: jumpingArt, deco: [leaves, orangeSlice, flowers] },
	{ name: 'Americano', tag: 'A bold way to enjoy work', bg: '#d4b795', word: 'rgba(140, 97, 61, 0.6)', art: chillingArt, deco: [chocolate, pepper, peanut] },
	{ name: 'Matcha', tag: 'You can never have enough', bg: '#e4ffc0', word: '#b7ec73', art: sittingArt, deco: [leaves, matchaLeaf, matchaPowder] },
]
const assets = {
	heroCan: 'https://www.figma.com/api/mcp/asset/642be10a-39c4-448b-832c-96d2fe68ebc6.png',
	heroCanAlt: 'https://www.figma.com/api/mcp/asset/0325f733-758b-4961-9df0-bc7bbe01c8c5.png',
	orange: 'https://www.figma.com/api/mcp/asset/cb978cd2-256e-42b6-bf99-39eb2d787a6e.png',
	office: officePhoto,
	coffee: coffeePhoto,
	life: outdoorPhoto,
}





const knockoutCache = new Map()
function useTransparentCutout(src, skip) {
	const [url, setUrl] = useState(() => (skip ? src : knockoutCache.get(src) || src))
	useEffect(() => {
		if (skip) {
			setUrl(src)
			return
		}
		const cached = knockoutCache.get(src)
		if (cached) {
			setUrl(cached)
			return
		}
		let alive = true
		const image = new Image()
		const paint = () => {
			if (!image.naturalWidth) return
			const canvas = document.createElement('canvas')
			canvas.width = image.naturalWidth
			canvas.height = image.naturalHeight
			const ctx = canvas.getContext('2d', { willReadFrequently: true })
			try {
				ctx.drawImage(image, 0, 0)
				const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
				const data = pixels.data
				for (let i = 0; i < data.length; i += 4) {
					const r = data[i]
					const g = data[i + 1]
					const b = data[i + 2]
					if (r < 28 && g < 28 && b < 28) data[i + 3] = 0
					else if (r > 220 && g > 220 && b > 220) data[i + 3] = 0
				}
				ctx.putImageData(pixels, 0, 0)
				const next = canvas.toDataURL('image/png')
				knockoutCache.set(src, next)
				if (alive) setUrl(next)
			} catch {
				if (alive) setUrl(src)
			}
		}
		image.onload = paint
		image.src = src
		if (image.complete && image.naturalWidth) paint()
		return () => { alive = false }
	}, [src, skip])
	return skip ? src : url
}
function HeroCutout({ className, src, skipKnockout }) {
	return <img className={className} src={useTransparentCutout(src, skipKnockout)} alt="" />
}
const ProductContext = createContext(null)
function useProducts() {
	return useContext(ProductContext) || { products: [], categories: [], loading: true, error: '', refresh: async () => {}, saveLocal: async () => {}, removeLocal: async () => {}, applyStock() {} }
}
function useCart() {
	return useContext(CartContext) || { add() {}, setQty() {}, checkout() {}, open: false, setOpen() {}, notice: null, receipt: null, setReceipt() {}, checkoutError: '', count: 0, lines: [], subtotal: 0, busy: false }
}
const CATALOG_KEY = 'rocecaf-catalog'
const CATEGORY_KEY = 'rocecaf-categories'
const STOCK_REV = 'rocecaf-stock-rev'
function loadStoredCatalog() {
	try {
		const products = JSON.parse(localStorage.getItem(CATALOG_KEY) || 'null')
		const categories = JSON.parse(localStorage.getItem(CATEGORY_KEY) || 'null')
		if (Array.isArray(products) && products.length) {
			return { products, categories: Array.isArray(categories) && categories.length ? categories : SEED_CATEGORIES }
		}
	} catch { /* use seed */ }
	return { products: SEED_PRODUCTS, categories: SEED_CATEGORIES }
}
function persistCatalog(products, categories) {
	localStorage.setItem(CATALOG_KEY, JSON.stringify(products))
	localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories))
}
function pingStock() {
	localStorage.setItem(STOCK_REV, String(Date.now()))
}
function ProductProvider({ children }) {
	const [products, setProducts] = useState([])
	const [categories, setCategories] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const applyRows = (productRows, categoryRows, store = true) => {
		const cats = categoryRows?.length ? categoryRows : SEED_CATEGORIES
		const rows = productRows?.length ? productRows : SEED_PRODUCTS
		setCategories(cats)
		setProducts(rows.map(mapProduct))
		if (store) persistCatalog(rows, cats)
	}
	const refresh = async () => {
		if (!apiEnabled()) {
			const stored = loadStoredCatalog()
			applyRows(stored.products, stored.categories)
			setError('')
			setLoading(false)
			return
		}
		try {
			const [productRows, categoryRows] = await Promise.all([api('/products'), api('/categories')])
			applyRows(productRows, categoryRows)
			setError('')
		} catch {
			const stored = loadStoredCatalog()
			applyRows(stored.products, stored.categories)
			setError('')
		} finally {
			setLoading(false)
		}
	}
	const saveLocal = async (payload, editingId, image) => {
		const stored = loadStoredCatalog()
		const cats = stored.categories
		const category = cats.find((row) => Number(row.id) === Number(payload.category_id)) || cats[0]
		const nextId = editingId || Math.max(0, ...stored.products.map((row) => Number(row.id) || 0)) + 1
		const raw = {
			id: nextId,
			slug: payload.slug || `product-${nextId}`,
			category_id: Number(payload.category_id) || category?.id,
			title: payload.title || payload.name,
			name: payload.name,
			description: payload.description || '',
			details: payload.details || '',
			packaging: payload.packaging || '',
			price: Math.max(0, Number(payload.price) || 0),
			stock: Math.max(0, Number(payload.stock) || 0),
			image: image || payload.image || '',
			hero_image: image || payload.hero_image || payload.image || '',
			category,
		}
		const products = editingId
			? stored.products.map((row) => Number(row.id) === Number(editingId) ? { ...row, ...raw, id: Number(editingId) } : row)
			: [...stored.products, raw]
		applyRows(products, cats)
	}
	const removeLocal = async (id) => {
		const stored = loadStoredCatalog()
		applyRows(stored.products.filter((row) => Number(row.id) !== Number(id)), stored.categories)
	}
	const applyStock = (sold) => {
		const stored = loadStoredCatalog()
		const products = stored.products.map((row) => {
			const hit = sold.find((item) => Number(item.product_id) === Number(row.id) || item.id === row.slug)
			if (!hit) return row
			return { ...row, stock: Math.max(0, Number(row.stock) - Number(hit.qty)) }
		})
		applyRows(products, stored.categories)
	}
	useEffect(() => { refresh() }, [])
	useEffect(() => {
		const onStock = (event) => {
			if (event.key === STOCK_REV || event.key === CATALOG_KEY) refresh()
		}
		const onVisible = () => {
			if (document.visibilityState === 'visible') refresh()
		}
		window.addEventListener('storage', onStock)
		document.addEventListener('visibilitychange', onVisible)
		return () => {
			window.removeEventListener('storage', onStock)
			document.removeEventListener('visibilitychange', onVisible)
		}
	}, [])
	return <ProductContext.Provider value={{ products, categories, loading, error, refresh, saveLocal, removeLocal, applyStock }}>{children}</ProductContext.Provider>
}
function rupiah(value) {
	return `Rp${Number(value || 0).toLocaleString('id-ID')},00`
}
function go(path) { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo(0, 0) }
const CartContext = createContext(null)
const CART_KEY = 'rocecaf-cart'
function loadCart() {
	try {
		const parsed = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
		if (!Array.isArray(parsed)) return []
		return parsed.flatMap((item) => {
			const id = item?.id
			const qty = Math.max(0, Number(item?.qty) || 0)
			return id && qty > 0 ? [{ id, qty }] : []
		})
	} catch {
		return []
	}
}
function CartProvider({ children }) {
	const { products, refresh } = useProducts()
	const [items, setItems] = useState(loadCart)
	const [open, setOpen] = useState(false)
	const [notice, setNotice] = useState(null)
	const [receipt, setReceipt] = useState(null)
	const [checkoutError, setCheckoutError] = useState('')
	const [busy, setBusy] = useState(false)
	useEffect(() => {
		localStorage.setItem(CART_KEY, JSON.stringify(items))
	}, [items])
	useEffect(() => {
		if (!notice) return
		const timer = window.setTimeout(() => setNotice(null), 2800)
		return () => window.clearTimeout(timer)
	}, [notice])
	useEffect(() => {
		if (!products.length) return
		setItems((current) => current.flatMap((item) => {
			const product = products.find((entry) => entry.id === item.id)
			if (!product || product.stock < 1) return []
			return [{ ...item, qty: Math.min(item.qty, product.stock) }]
		}))
	}, [products])
	const stockFor = (id) => products.find((entry) => entry.id === id)?.stock ?? 0
	const openCart = (next) => {
		const shouldOpen = typeof next === 'boolean' ? next : !open
		setOpen(shouldOpen)
		if (shouldOpen) refresh()
	}
	const add = (product, qty = 1) => {
		if (!product || product.stock < 1) {
			setNotice({ name: product?.name || 'Sold out', qty: 0 })
			return
		}
		const have = items.find((item) => item.id === product.id)?.qty || 0
		const next = Math.min(product.stock, have + Math.max(1, qty))
		const added = next - have
		if (added < 1) {
			setNotice({ name: product.name, image: product.image, qty: 0 })
			openCart(true)
			return
		}
		setItems((current) => {
			const found = current.find((item) => item.id === product.id)
			if (found) return current.map((item) => item.id === product.id ? { ...item, qty: next } : item)
			return [...current, { id: product.id, qty: next }]
		})
		setNotice({ id: product.id, name: product.name, image: product.image, qty: added })
		openCart(true)
	}
	const setQty = (id, qty) => {
		const stock = stockFor(id)
		setItems((current) => current.flatMap((item) => {
			if (item.id !== id) return [item]
			if (qty < 1) return []
			return [{ ...item, qty: Math.min(stock, qty) }]
		}))
	}
	const checkout = async () => {
		if (!items.length || busy) return
		setBusy(true)
		setCheckoutError('')
		try {
			const snapshot = {
				when: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
				lines: lines.map((line) => ({ id: line.id, title: line.product.title, qty: line.qty, lineTotal: line.lineTotal })),
				subtotal,
			}
			const payload = items.map((item) => {
				const product = products.find((entry) => entry.id === item.id)
				return { product_id: product?.dbId, qty: item.qty }
			}).filter((item) => item.product_id)
			if (!payload.length) throw new Error('Could not verify stock with the server.')
			await api('/checkout', { method: 'POST', body: JSON.stringify({ items: payload }) })
			await refresh()
			pingStock()
			setItems([])
			setOpen(false)
			setReceipt(snapshot)
		} catch (err) {
			const raw = String(err.message || '')
			const message = /timeout|network|failed to fetch|abort/i.test(raw)
				? 'Could not reach the server to verify stock.'
				: raw || 'Not enough stock to check out.'
			setCheckoutError(message)
			setNotice({ name: message, qty: 0 })
			await refresh()
			pingStock()
		} finally {
			setBusy(false)
		}
	}
	const count = items.reduce((sum, item) => sum + item.qty, 0)
	const lines = items.map((item) => {
		const product = products.find((entry) => entry.id === item.id)
		return { ...item, product, lineTotal: (product?.price || 0) * item.qty }
	}).filter((line) => line.product)
	const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0)
	return <CartContext.Provider value={{ add, setQty, checkout, open, setOpen: openCart, notice, receipt, setReceipt, checkoutError, count, lines, subtotal, busy }}>
		{children}
		<CartNotice />
		<ReceiptOverlay />
		<CartOverlay />
	</CartContext.Provider>
}
function CartNotice() {
	const { notice } = useCart()
	if (!notice) return null
	return <div className="cart-notice" role="status">
		{notice.image && <img src={notice.image} alt="" width={48} height={52} />}
		<div>
			<strong>{notice.name}</strong>
			<p>{notice.image ? (notice.qty ? `Added ${notice.qty} to cart` : 'Not enough stock') : (notice.qty ? 'Thanks — your cart is checked out.' : notice.name)}</p>
		</div>
	</div>
}
function CartQty({ id, qty, stock, setQty }) {
	const [value, setValue] = useState(String(qty))
	useEffect(() => { setValue(String(qty)) }, [qty])
	const commit = () => {
		const next = Number.parseInt(value, 10)
		if (!Number.isFinite(next) || next < 1) {
			setQty(id, 0)
			return
		}
		setQty(id, next)
	}
	return <div className="cart-qty" aria-label="Quantity">
		<button type="button" onClick={() => setQty(id, qty + 1)} disabled={qty >= stock} aria-label="Increase quantity">+</button>
		<input
			inputMode="numeric"
			value={value}
			aria-label="Edit quantity"
			onChange={(event) => setValue(event.target.value.replace(/[^\d]/g, ''))}
			onBlur={commit}
			onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur() }}
		/>
		<button type="button" onClick={() => setQty(id, qty - 1)} aria-label="Decrease quantity">−</button>
	</div>
}
function ReceiptOverlay() {
	const { receipt, setReceipt } = useCart()
	if (!receipt) return null
	return <>
		<div className="receipt-backdrop" />
		<div className="receipt-card" role="dialog" aria-label="Receipt">
			<p className="receipt-title">Receipt</p>
			<p className="receipt-when">{receipt.when}</p>
			<ul className="receipt-lines">
				{receipt.lines.map((line) => (
					<li key={line.id}>
						<span>{line.title} × {line.qty}</span>
						<strong>{rupiah(line.lineTotal)}</strong>
					</li>
				))}
			</ul>
			<div className="receipt-total">
				<span>Total</span>
				<strong>{rupiah(receipt.subtotal)}</strong>
			</div>
			<button type="button" className="receipt-ok" onClick={() => setReceipt(null)}>OK</button>
		</div>
	</>
}
function CartOverlay() {
	const { open, setOpen, lines, subtotal, setQty, checkout, busy, checkoutError } = useCart()
	const panelRef = useRef(null)
	useEffect(() => {
		if (!open) return
		const align = () => {
			const header = document.querySelector('.figma-header')
			const panel = panelRef.current
			if (!header || !panel) return
			const box = header.getBoundingClientRect()
			panel.style.top = `${Math.round(box.bottom + 12)}px`
			panel.style.right = `${Math.max(0, Math.round(document.documentElement.clientWidth - box.right))}px`
		}
		align()
		window.addEventListener('resize', align)
		window.addEventListener('scroll', align, { passive: true })
		return () => {
			window.removeEventListener('resize', align)
			window.removeEventListener('scroll', align)
		}
	}, [open])
	if (!open) return null
	return <>
		<button type="button" className="cart-backdrop" aria-label="Close cart" onClick={() => setOpen(false)} />
		<div className="cart-panel" ref={panelRef} role="dialog" aria-label="Cart">
			<p className="cart-title">Cart</p>
			{lines.length === 0 ? <p className="cart-empty">Your cart is empty.</p> : <div className="cart-lines">
				{lines.map((line) => (
					<div className="cart-row" key={line.id}>
						<img src={line.product.image} alt="" width={77} height={82} />
						<div className="cart-row-copy">
							<p>{line.product.title}</p>
							<strong>{rupiah(line.lineTotal)}</strong>
						</div>
						<CartQty id={line.id} qty={line.qty} stock={line.product.stock} setQty={setQty} />
					</div>
				))}
			</div>}
			<div className="cart-foot">
				<div className="cart-subtotal">
					<p>Subtotal</p>
					<strong>{rupiah(subtotal)}</strong>
				</div>
				{checkoutError && <p className="cart-error" role="alert">{checkoutError}</p>}
				<button type="button" className="cart-checkout" onClick={checkout} disabled={!lines.length || busy}>{busy ? 'Checking out…' : 'Check Out'}</button>
			</div>
		</div>
	</>
}
function goHomeSection(id) {
	if (window.location.pathname === '/' || window.location.pathname === '') {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
		return
	}
	go(`/#${id}`)
}
function FigmaHeader({ onReviews, onAbout, query, onQuery }) {
	const [localQuery, setLocalQuery] = useState('')
	const { open, setOpen, count } = useCart()
	const searchValue = onQuery ? query : localQuery
	return <div className="figma-header-stick">
		<header className="figma-header">
		<button className="figma-logo" onClick={() => go('/')}><img src={logoMark} alt="" width={40} height={40} />RoceCaf</button>
		<nav>
			<button onClick={() => go('/catalog')}>Catalog</button>
			<button onClick={onAbout || (() => goHomeSection('what-we-do'))}>About Us</button>
			<button onClick={onReviews || (() => goHomeSection('office-notes'))}>Reviews</button>
		</nav>
		<div className="figma-header-tools">
			<form className="figma-search" onSubmit={(event) => { event.preventDefault(); if (window.location.pathname !== '/catalog') go('/catalog') }}>
				<input type="search" placeholder="Search" aria-label="Search" value={searchValue} onChange={(event) => onQuery ? onQuery(event.target.value) : setLocalQuery(event.target.value)} />
				<button type="submit" aria-label="Submit search"><img src={searchIcon} alt="" width={30} height={30} /></button>
			</form>
			<div className="cart-anchor">
				<button className="figma-icon" type="button" onClick={() => setOpen(!open)} aria-label="Cart" aria-expanded={open}><img src={bagIcon} alt="" width={30} height={30} /></button>
				{count > 0 && <span className="cart-badge">{count}</span>}
			</div>
			<button className="figma-icon profile" onClick={() => go('/admin/catalog')} aria-label="Account"><img src={profileIcon} alt="" width={29} height={29} /></button>
		</div>
		</header>
	</div>
}
function Header({ admin = false }) {
	return <header className="site-header">
		<button className="brand" onClick={() => go('/')} aria-label="RoceCaf home"><span className="brand-mark">◉</span> RoceCaf</button>
		<nav><button className="nav-link" onClick={() => go('/')}>Design</button><button className="nav-link" onClick={() => go('/catalog')}>Catalog</button><button className="nav-link" onClick={() => go('/classic')}>Classic</button><button className={`nav-link ${admin ? 'active' : ''}`} onClick={() => go('/admin/catalog')}>Admin</button></nav>
		<button className="circle-button" onClick={() => go('/catalog')} aria-label="Open catalog">↗</button>
	</header>
}
function ProductCard({ product, admin = false }) {
	return <article className={`product-card ${product.color}`}><div className="product-visual"><span className="product-orbit" /><img src={product.image} alt={product.name} /></div><div className="product-info"><div><span className="eyebrow">{product.type}</span><h3>{product.name}</h3></div><strong>{rupiah(product.price)}</strong></div>{admin ? <div className="card-actions"><button className="text-button">Edit</button><button className="text-button danger">Archive</button></div> : <button className="card-link" onClick={() => go(`/product/${product.id}`)}>View product <span>↗</span></button>}</article>
}
function Landing() {
	return <><Header /><main className="landing"><section className="hero-section"><div className="hero-copy"><p className="eyebrow">Better breaks, brighter days</p><h1>More chill.<br /><em>More life.</em></h1><p className="hero-description">Refreshment made for the rhythm of real work. Bright coffee, clean ingredients, and a little more energy in every can.</p><button className="lime-button" onClick={() => go('/catalog')}>Shop the collection <span>↗</span></button></div><div className="hero-art"><span className="leaf">✦</span><img src={assets.orange} alt="Orange slice" className="hero-orange" /><img src={assets.heroCan} alt="RoceCaf Citrus Cold Brew can" className="hero-can" /><span className="sparkle">✳</span></div><div className="hero-ribbon">YOUR OFFICE PARTNER</div></section><section className="story-section"><div className="story-intro"><p className="eyebrow">What we do differently</p><h2>Clean calories.<br />Zero-guilt<br />100% natural.</h2><p>Thoughtfully brewed, lightly sweetened, and made to keep you moving. RoceCaf brings café-level flavor to your everyday pause.</p></div><div className="story-images"><img src={assets.office} alt="Enjoying a RoceCaf drink" /><img src={assets.coffee} alt="Coffee cherries growing" /><img src={assets.life} alt="A RoceCaf break at work" /></div></section><section className="support-section"><div className="support-copy"><p className="eyebrow">Supports local-grown coffee beans</p><h2>Bring the<br /><em>life</em> from works</h2><p>From growers to makers, every can helps keep good work going. Take a brighter break and pass it on.</p><button className="lime-button" onClick={() => go('/catalog')}>Try one now <span>↗</span></button></div><div className="support-note">Our coffee is sourced with care<br />and brewed for momentum.</div></section><section className="social-proof"><p className="eyebrow">So we heard from the office:</p><div className="quotes"><blockquote>“Refreshing, hits harder after staring at monitors 24/7.”<cite>Ichsan Rasyid Maulana<br /><b>Full Stack Developer</b></cite></blockquote><blockquote>“Their energy is replenished and ready to sprint progress.”<cite>Bahagi Adansu Kses<br /><b>Human Capital</b></cite></blockquote><blockquote>“The cleanest cup of joe I have had at work.”<cite>Caitery Makerjob<br /><b>Product Designer</b></cite></blockquote></div><div className="trusted"><span>Trusted by:</span><div className="trusted-logos"><b>ASUS</b><b>NIKE</b><b>Ford</b><b>◉</b><b>𝕏</b><b>AUDI</b></div></div></section><footer className="brand-footer">RoceCaf</footer></main></>
}
function Catalog() {
	const { products, categories, loading, error } = useProducts()
	const [query, setQuery] = useState('')
	const [categoryOpen, setCategoryOpen] = useState(true)
	const [forms, setForms] = useState({})
	useEffect(() => {
		setForms((current) => {
			const next = {}
			categories.forEach((category) => {
				const label = /grind/i.test(category.name) ? 'Grind' : /can/i.test(category.name) ? 'Cans' : category.name
				next[label] = current[label] ?? true
			})
			return next
		})
	}, [categories])
	const visible = products.filter((product) => {
		const matchForm = forms[product.form] !== false
		const haystack = `${product.name} ${product.title} ${product.form} ${product.type}`.toLowerCase()
		return matchForm && haystack.includes(query.trim().toLowerCase())
	})
	const toggleForm = (form) => setForms((current) => ({ ...current, [form]: !current[form] }))
	return <div className="shop-page">
		<FigmaHeader query={query} onQuery={setQuery} />
		<main className="shop-main">
			<h1 className="shop-title">A TASTE WORTH THE WORK</h1>
			{error && <p className="shop-error">{error}</p>}
			<div className="shop-layout">
				<aside className="admin-filter-card">
					<form className="shop-search" onSubmit={(event) => event.preventDefault()}>
						<input type="search" placeholder="Search" aria-label="Search catalog" value={query} onChange={(event) => setQuery(event.target.value)} />
						<button type="submit" aria-label="Search"><img src={searchIcon} alt="" width={24} height={24} /></button>
					</form>
					<button className="shop-filter-toggle" type="button" onClick={() => setCategoryOpen((open) => !open)} aria-expanded={categoryOpen}>
						<span>Category</span>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d={categoryOpen ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4'} stroke="#1e1e1e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
					</button>
					{categoryOpen && <div className="shop-checks">
						{Object.keys(forms).map((form) => (
							<label key={form}><input type="checkbox" checked={forms[form]} onChange={() => toggleForm(form)} /><span>{form}</span></label>
						))}
					</div>}
				</aside>
				<section className="admin-grid">
					{loading && <p>Loading catalog…</p>}
					{visible.map((product) => (
						<button key={product.id} className="admin-card" type="button" onClick={() => go(`/product/${product.slug}`)}>
							<div className="admin-card-media"><img src={product.image} alt="" /></div>
							<h2>{product.name}</h2>
							<span className="admin-chip">{product.form}</span>
							<strong>{rupiah(product.price)}</strong>
						</button>
					))}
				</section>
			</div>
		</main>
	</div>
}
function Details({ id }) {
	const { products, loading } = useProducts()
	const product = products.find((item) => item.slug === id || String(item.dbId) === String(id))
	const [qty, setQty] = useState(1)
	const { add } = useCart()
	useEffect(() => { setQty(1) }, [id])
	useEffect(() => {
		if (product) setQty((value) => Math.min(Math.max(1, value), Math.max(1, product.stock)))
	}, [product])
	const back = <button type="button" className="pdp-back" onClick={() => go('/catalog')}>
		<svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
		Back
	</button>
	if (loading && !product) return <div className="shop-page pdp-page"><FigmaHeader /><main className="pdp">{back}<p className="pdp-blurb">Loading product…</p></main></div>
	if (!product) return <div className="shop-page pdp-page"><FigmaHeader /><main className="pdp">{back}<p className="pdp-blurb">This product is no longer available.</p></main></div>
	const atMax = qty >= product.stock
	return <div className="shop-page pdp-page">
		<FigmaHeader />
		<main className="pdp">
			{back}
			<section className="pdp-gallery">
				<img src={product.hero} alt={product.name} />
			</section>
			<section className="pdp-info">
				<h1>{product.title}</h1>
				<p className="pdp-blurb">{product.blurb}</p>
				<span className="shop-tag">{product.form}</span>
				<p className="pdp-price">{rupiah(product.price)}<span>/Item</span></p>
				<div className="pdp-buy">
					<div className="pdp-qty" aria-label="Quantity">
						<button type="button" onClick={() => setQty((value) => Math.min(product.stock, value + 1))} disabled={atMax || product.stock < 1} aria-label="Increase quantity">+</button>
						<span>{product.stock < 1 ? 0 : qty}</span>
						<button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">−</button>
					</div>
					<button type="button" className="pdp-cart" onClick={() => add(product, qty)} disabled={product.stock < 1}>{product.stock < 1 ? 'Sold Out' : 'Add To Cart'}</button>
				</div>
				<p className="pdp-stock">Stok: {product.stock}</p>
			</section>
		</main>
	</div>
}
function emptyForm(categories) {
	return { category_id: categories[0]?.id || '', slug: '', title: '', name: '', description: '', details: '', packaging: '', price: '', stock: 1, image: '', hero_image: '' }
}
function categoryChoices(categories) {
	const seen = new Set()
	return categories.filter((category) => {
		const key = /grind/i.test(category.name) ? 'grind' : /can/i.test(category.name) ? 'can' : String(category.id)
		if (seen.has(key)) return false
		seen.add(key)
		return true
	})
}
function categoryChip(category) {
	return /grind/i.test(category.name) ? 'Grind' : /can/i.test(category.name) ? 'Can' : category.name
}
function AdminCatalog() {
	const { products, categories, loading, error, refresh, saveLocal, removeLocal } = useProducts()
	const [query, setQuery] = useState('')
	const [categoryOpen, setCategoryOpen] = useState(true)
	const [forms, setForms] = useState({})
	const [form, setForm] = useState(emptyForm(categories))
	const [editing, setEditing] = useState(null)
	const [panel, setPanel] = useState(false)
	const [status, setStatus] = useState('')
	const [photoFile, setPhotoFile] = useState(null)
	const [photoPreview, setPhotoPreview] = useState('')
	const types = categoryChoices(categories)
	useEffect(() => {
		setForms((current) => {
			const next = {}
			categories.forEach((category) => {
				const label = /grind/i.test(category.name) ? 'Grind' : /can/i.test(category.name) ? 'Cans' : category.name
				next[label] = current[label] ?? true
			})
			return next
		})
	}, [categories])
	useEffect(() => { setForm((current) => ({ ...current, category_id: current.category_id || categories[0]?.id || '' })) }, [categories])
	const visible = products.filter((product) => {
		const matchForm = forms[product.form] !== false
		const haystack = `${product.name} ${product.title} ${product.form} ${product.type}`.toLowerCase()
		return matchForm && haystack.includes(query.trim().toLowerCase())
	})
	const toggleForm = (formName) => setForms((current) => ({ ...current, [formName]: !current[formName] }))
	const closePanel = () => {
		setPanel(false)
		setEditing(null)
		setPhotoFile(null)
		setPhotoPreview('')
		setStatus('')
	}
	const openNew = () => {
		setEditing(null)
		setForm(emptyForm(categories))
		setPhotoFile(null)
		setPhotoPreview('')
		setStatus('')
		setPanel(true)
	}
	const openEdit = (product) => {
		setEditing(product.dbId)
		setForm({
			category_id: product.categoryId,
			slug: product.slug,
			title: product.title,
			name: product.name,
			description: product.blurb,
			details: product.details,
			packaging: product.packaging,
			price: product.price,
			stock: Math.max(0, product.stock),
			image: product.raw?.image || '',
			hero_image: product.raw?.hero_image || '',
		})
		setPhotoFile(null)
		setPhotoPreview(product.image || '')
		setStatus('')
		setPanel(true)
	}
	const resetForm = () => {
		if (editing) {
			const product = products.find((row) => row.dbId === editing)
			if (product) {
				openEdit(product)
				setPanel(true)
				return
			}
		}
		setForm(emptyForm(categories))
		setPhotoFile(null)
		setPhotoPreview('')
		setStatus('')
	}
	const pickPhoto = (event) => {
		const file = event.target.files?.[0]
		event.target.value = ''
		if (!file) return
		const okType = /\.(jpe?g|png|bmp|tiff?|webp)$/i.test(file.name)
		if (!okType) {
			setStatus('Only .jpg, .png, .bmp, .tif, or .webp')
			return
		}
		if (file.size > 10 * 1024 * 1024) {
			setStatus('Image must be under 10mb')
			return
		}
		setStatus('')
		setPhotoFile(file)
		setPhotoPreview(URL.createObjectURL(file))
	}
	const save = async (event) => {
		event.preventDefault()
		const payload = {
			...form,
			title: form.title || form.name,
			category_id: Number(form.category_id),
			price: Math.max(0, Number(form.price) || 0),
			stock: Math.max(0, Number(form.stock) || 0),
		}
		try {
			if (apiEnabled()) {
				if (photoFile) {
					const body = new FormData()
					Object.entries(payload).forEach(([key, value]) => {
						if (key === 'image' || key === 'hero_image') return
						if (value !== undefined && value !== null) body.append(key, String(value))
					})
					body.append('image', photoFile)
					body.append('hero_image', photoFile)
					if (editing) await api(`/products/${editing}`, { method: 'POST', body })
					else await api('/products', { method: 'POST', body })
				} else if (editing) {
					await api(`/products/${editing}`, { method: 'PUT', body: JSON.stringify(payload) })
				} else {
					await api('/products', { method: 'POST', body: JSON.stringify(payload) })
				}
				await refresh()
			} else {
				let image = payload.image
				if (photoFile) {
					image = await new Promise((resolve, reject) => {
						const reader = new FileReader()
						reader.onload = () => resolve(String(reader.result || ''))
						reader.onerror = () => reject(new Error('Could not read image'))
						reader.readAsDataURL(photoFile)
					})
				}
				await saveLocal(payload, editing, image)
			}
			closePanel()
			setForm(emptyForm(categories))
		} catch (err) {
			try {
				let image = payload.image
				if (photoFile) {
					image = await new Promise((resolve) => {
						const reader = new FileReader()
						reader.onload = () => resolve(String(reader.result || ''))
						reader.onerror = () => resolve(payload.image || '')
						reader.readAsDataURL(photoFile)
					})
				}
				await saveLocal(payload, editing, image)
				closePanel()
				setForm(emptyForm(categories))
			} catch {
				setStatus(err.message)
			}
		}
	}
	const remove = async () => {
		if (!editing || !window.confirm('Delete this product?')) return
		try {
			if (apiEnabled()) {
				await api(`/products/${editing}`, { method: 'DELETE' })
				await refresh()
			} else {
				await removeLocal(editing)
			}
			closePanel()
		} catch (err) {
			await removeLocal(editing)
			closePanel()
			setStatus(err.message)
		}
	}
	return <div className="shop-page admin-shop">
		<FigmaHeader query={query} onQuery={setQuery} />
		<main className="shop-main">
			<h1 className="shop-title admin-title">A TASTE WORTH THE WORK</h1>
			{error && <p className="shop-error">{error}</p>}
			<div className="shop-layout">
				<aside className="admin-filter-card">
					<form className="shop-search" onSubmit={(event) => event.preventDefault()}>
						<input type="search" placeholder="Search" aria-label="Search catalog" value={query} onChange={(event) => setQuery(event.target.value)} />
						<button type="submit" aria-label="Search"><img src={searchIcon} alt="" width={24} height={24} /></button>
					</form>
					<button className="shop-filter-toggle" type="button" onClick={() => setCategoryOpen((open) => !open)} aria-expanded={categoryOpen}>
						<span>Category</span>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d={categoryOpen ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4'} stroke="#1e1e1e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
					</button>
					{categoryOpen && <div className="shop-checks">
						{Object.keys(forms).map((formName) => (
							<label key={formName}><input type="checkbox" checked={forms[formName]} onChange={() => toggleForm(formName)} /><span>{formName}</span></label>
						))}
					</div>}
				</aside>
				<section className="admin-grid">
					<button type="button" className="admin-card admin-add" onClick={openNew}>
						<div className="admin-add-art"><span>+</span></div>
						<h2>Add New Product</h2>
						<p>Create, Edit, or Delete a Product</p>
					</button>
					{loading && <p>Loading catalog…</p>}
					{visible.map((product) => (
						<button key={product.dbId} type="button" className="admin-card" onClick={() => openEdit(product)}>
							<div className="admin-card-media"><img src={product.image} alt="" /></div>
							<h2>{product.name}</h2>
							<span className="admin-chip">{product.form}</span>
							<strong>{rupiah(product.price)}</strong>
						</button>
					))}
				</section>
			</div>
		</main>
		{panel && <>
			<button type="button" className="cart-backdrop" aria-label="Close editor" onClick={closePanel} />
			<form className="admin-editor" onSubmit={save}>
				<button type="button" className="admin-editor-close" aria-label="Close editor" onClick={closePanel}>×</button>
				<h2>{editing ? 'Edit Product' : 'Add New Product'}</h2>
				<div className="admin-editor-grid">
					<div className="admin-editor-fields">
						<input className="admin-field" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
						<textarea className="admin-field admin-field-desc" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
						<input className="admin-field" placeholder="Price" type="number" min="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
						<div className="admin-stock">
							<span>Stock Available</span>
							<div className="admin-qty">
								<button type="button" onClick={() => setForm({ ...form, stock: Number(form.stock || 0) + 1 })}>+</button>
								<span>{Math.max(0, Number(form.stock) || 0)}</span>
								<button type="button" onClick={() => setForm({ ...form, stock: Math.max(0, Number(form.stock || 0) - 1) })}>−</button>
							</div>
						</div>
					</div>
					<div className="admin-photo">
						<label className="admin-photo-drop">
							{photoPreview ? <img className="admin-photo-preview" src={photoPreview} alt="" /> : <>
								<img src={galleryAddIcon} alt="" width={72} height={72} />
								<p>Only .jpg, .png, .bmp, .tif, or .webp<br />And Under 10mb</p>
							</>}
							<input type="file" accept=".jpg,.jpeg,.png,.bmp,.tif,.tiff,.webp,image/*" hidden onChange={pickPhoto} />
						</label>
						<label className="admin-upload">
							Upload Photo
							<input type="file" accept=".jpg,.jpeg,.png,.bmp,.tif,.tiff,.webp,image/*" hidden onChange={pickPhoto} />
						</label>
					</div>
				</div>
				<div className="admin-category">
					<span>Category</span>
					<div className="admin-category-line" />
					<div className="admin-category-chips">
						{types.map((category) => (
							<button type="button" key={category.id} className={String(form.category_id) === String(category.id) ? 'is-on' : ''} onClick={() => setForm({ ...form, category_id: category.id })}>{categoryChip(category)}</button>
						))}
					</div>
				</div>
				{editing && <div className="admin-editor-extra">
					<input className="admin-field" placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
					<textarea className="admin-field" placeholder="Details" value={form.details} onChange={(event) => setForm({ ...form, details: event.target.value })} />
					<textarea className="admin-field" placeholder="Packaging" value={form.packaging} onChange={(event) => setForm({ ...form, packaging: event.target.value })} />
				</div>}
				{status && <p className="shop-error">{status}</p>}
				<div className="admin-editor-actions">
					<button type="submit" className="admin-create">{editing ? 'Save Product' : 'Create Product'}</button>
					{editing ? <button type="button" className="admin-delete" onClick={remove}>Delete</button> : <button type="button" className="admin-reset" onClick={resetForm}>Reset</button>}
				</div>
			</form>
		</>}
	</div>
}
function Stars() {
	return <div className="figma-stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, index) => <img key={index} src={starIcon} alt="" />)}</div>
}
function Quote({ quote, name, role, avatar, delay = 0 }) {
	return <blockquote className="figma-quote reveal" style={{ '--d': `${delay}ms` }}><Stars /><p>{quote}</p><footer><img src={avatar} alt="" width={61} height={61} /><cite><span>{name}</span><b>{role}</b></cite></footer></blockquote>
}
function FigmaDesignPage() {
	const [flavor, setFlavor] = useState(0)
	const [spin, setSpin] = useState('')
	const slide = HERO_FLAVORS[flavor]
	const quotes = [
		{ name: 'Caitery Makerjob', role: 'Product Designer', avatar: avatarCaitery, quote: '“I didn’t expect that Coffee could have that refreshing taste, I would always assume it would be same old cup of joe. But this one is very refreshing, hits harder after staring at monitors 24/7 haha”' },
		{ name: 'Ichsan Rasyid Maulana', role: 'Full Stack Developer', avatar: avatarIchsan, quote: '“I didn’t expect that Coffee could have that refreshing taste, I would always assume it would be same old cup of joe. But this one is very refreshing, hits harder after staring at monitors 24/7 haha”' },
		{ name: 'Bahagi Adansu Kses', role: 'Human Capital', avatar: avatarBahagi, quote: '“We would bring the mocktail and matcha for all of the coworkers because they really like it, I could see that their energy are replenished and ready to sprint progress while doing manual labor”' },
	]
	const brands = [logoAsus, logoNike, logoFord, logoDiscord, logoX, logoAudi, logoExtra]
	useEffect(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		const hash = window.location.hash.replace('#', '')
		if (hash) window.requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }))
		const page = document.querySelector('.figma-page')
		const header = document.querySelector('.figma-header')
		const hero = document.querySelector('.figma-hero')
		const items = [...document.querySelectorAll('.figma-page .reveal')]
		const show = (el) => el.classList.add('in')
		const isVisible = (el) => {
			const box = el.getBoundingClientRect()
			return box.bottom > 80 && box.top < window.innerHeight - 40
		}
		items.forEach((item) => { if (isVisible(item)) show(item) })
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return
				show(entry.target)
				observer.unobserve(entry.target)
			})
		}, { threshold: 0.01, rootMargin: '0px 0px -8% 0px' })
		items.forEach((item) => { if (!item.classList.contains('in')) observer.observe(item) })
		page?.classList.add('io')
		const onMove = (event) => {
			if (reduced || !hero) return
			const box = hero.getBoundingClientRect()
			const mx = ((event.clientX - box.left) / box.width - 0.5).toFixed(3)
			const my = ((event.clientY - box.top) / box.height - 0.5).toFixed(3)
			hero.style.setProperty('--mx', mx)
			hero.style.setProperty('--my', my)
		}
		const onScroll = () => {
			header?.classList.toggle('is-scrolled', window.scrollY > 24)
			if (reduced || !hero) return
			hero.style.setProperty('--sy', Math.min(window.scrollY / 520, 1).toFixed(3))
		}
		hero?.addEventListener('mousemove', onMove)
		window.addEventListener('scroll', onScroll, { passive: true })
		onScroll()
		return () => {
			observer.disconnect()
			hero?.removeEventListener('mousemove', onMove)
			window.removeEventListener('scroll', onScroll)
		}
	}, [])
	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
		const id = window.setInterval(() => {
			setFlavor((n) => {
				setSpin(n === 1 ? 'right' : 'left')
				return (n + 1) % HERO_FLAVORS.length
			})
		}, 4800)
		return () => window.clearInterval(id)
	}, [])
	return <main className="figma-page">
		<svg className="figma-filters" aria-hidden="true">
			<filter id="knockout-black" colorInterpolationFilters="sRGB">
				<feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1.2 1.2 1.2 0 -0.1" />
			</filter>
		</svg>
		<FigmaHeader
			onReviews={() => document.getElementById('office-notes')?.scrollIntoView({ behavior: 'smooth' })}
			onAbout={() => document.getElementById('what-we-do')?.scrollIntoView({ behavior: 'smooth' })}
		/>
		<section className="figma-hero" data-flavor={slide.name.toLowerCase()} data-spin={spin} style={{ background: slide.bg }}>
			<div className="figma-hero-word" key={slide.name} style={{ color: slide.word }}>{slide.name}</div>
			<HeroCutout key={`${slide.name}-a`} className="figma-cutout figma-leaves" src={slide.deco[0]} skipKnockout={slide.name === 'Americano'} />
			<HeroCutout key={`${slide.name}-b`} className="figma-cutout figma-orange" src={slide.deco[1]} />
			<HeroCutout key={`${slide.name}-c`} className="figma-cutout figma-flowers" src={slide.deco[2]} skipKnockout={slide.name === 'Mocktail'} />
			<div className="figma-can-wrap">
				<div className="figma-can-float">
					<img className="figma-can" src={canBody} alt={`RoceCaf ${slide.name} can`} />
					<div className={`figma-can-copy${spin ? ` is-spin-${spin}` : ''}`} key={slide.name}>
						<div className="figma-can-brand"><img src={canMark} alt="" width={36} height={31} /><span>RoceCaf</span></div>
						<img className="figma-can-art" src={slide.art} alt="" />
						<strong>{slide.name}</strong>
						<small>{slide.tag}</small>
					</div>
				</div>
			</div>
			<h1>YOUR OFFICE PARTNER</h1>
		</section>
		<section className="figma-story" id="what-we-do">
			<div className="figma-story-pin">
				<p className="figma-kicker figma-story-kicker">What We Do Different:</p>
				<div className="figma-story-row">
					<article className="reveal" style={{ '--d': '0ms' }}>
						<h2>CLEAN CALORIES<br />ZERO-GUILT<br />100% NATURAL</h2>
						<p>We believe that a drink is worth on what it can give. So ours give you a very low calorie coffee for less than 5 Cal. This is possible without the use of any harmful chemicals, we also use all-natural ingredients to enhance the freshness like never before.</p>
					</article>
					<figure className="reveal" style={{ '--d': '40ms' }}><img src={outdoorPhoto} alt="A person enjoying RoceCaf outdoors" /></figure>
				</div>
				<div className="figma-story-row">
					<article className="reveal" style={{ '--d': '80ms' }}>
						<h2>SUPPORTS<br />LOCAL-GROWN<br />COFFEE BEANS</h2>
						<p>For every purchase of RoceCaf, you contribute to helping the hard working farmers. Because we care about workers no matter their job, and you deserve a local taste from the very place you work for.</p>
					</article>
					<figure className="reveal" style={{ '--d': '120ms' }}><img src={coffeePhoto} alt="Coffee cherries being harvested" /></figure>
				</div>
			</div>
			<div className="figma-story-row figma-story-life">
				<article className="reveal" style={{ '--d': '160ms' }}>
					<h2>Bring out<br />THE LIFE<br />From works</h2>
					<p>Fatigue and mediocrity KILLS productivity. So we bring you a solution to those declining statistics and the morning lazy haze in the office.</p>
					<button className="figma-cta" onClick={() => go('/catalog')}>Try One Now</button>
				</article>
				<figure className="reveal" style={{ '--d': '200ms' }}><img src={officePhoto} alt="RoceCaf at work" /></figure>
			</div>
		</section>
		<section className="figma-testimonials" id="office-notes">
			<p className="figma-kicker reveal">So we heard from the office:</p>
			<div className="figma-quotes">{quotes.map((item, index) => <Quote key={item.name} delay={index * 90} {...item} />)}</div>
			<p className="figma-kicker reveal">Trusted by:</p>
			<div className="figma-marquee" aria-label="Trusted brands">
				<div className="figma-marquee-track">
					{[...brands, ...brands].map((logo, index) => <img key={index} src={logo} alt="" width={187} height={72} />)}
				</div>
			</div>
		</section>
		<footer className="figma-footer"><span>RoceCaf</span></footer>
	</main>
}

export default function App() {
	const [path, setPath] = useState(window.location.pathname)
	useEffect(() => {
		const update = () => setPath(window.location.pathname)
		window.addEventListener('popstate', update)
		return () => window.removeEventListener('popstate', update)
	}, [])
	let page = <FigmaDesignPage />
	if (path === '/catalog') page = <Catalog />
	else if (path.startsWith('/product/')) page = <Details id={path.split('/')[2]} />
	else if (path === '/admin/catalog' || path === '/admin') page = <AdminCatalog />
	else if (path === '/classic') page = <Landing />
	return <ProductProvider><CartProvider>{page}</CartProvider></ProductProvider>
}