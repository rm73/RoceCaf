import { useEffect, useState } from 'react'
import './App.css'
import './FigmaDesign.css'
import logoMark from './assets/Subtract-2.svg'
import canMark from './assets/Subtract-1.svg'
import searchIcon from './assets/humbleicons_search.svg'
import bagIcon from './assets/solar_bag-4-linear.svg'
import profileIcon from './assets/profile-picture-svgrepo-com 1.svg'
import starIcon from './assets/Star 6.svg'
import jumpingArt from './assets/figma/jumping.svg'
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
import officePhoto from './assets/Image.png'
import coffeePhoto from './assets/Image-1.png'
import outdoorPhoto from './assets/Image-2.png'
import catMocktailCan from './assets/figma/cat-mocktail-can.png'
import catAmericanoCan from './assets/figma/cat-americano-can.png'
import catMatchaCan from './assets/figma/cat-matcha-can.png'
import catMocktailGrind from './assets/figma/cat-mocktail-grind.png'
import catAmericanoGrind from './assets/figma/cat-americano-grind.png'
import catMatchaGrind from './assets/figma/cat-matcha-grind.png'
import detailMocktail from './assets/figma/detail-mocktail.png'
const assets = {
	heroCan: 'https://www.figma.com/api/mcp/asset/642be10a-39c4-448b-832c-96d2fe68ebc6.png',
	heroCanAlt: 'https://www.figma.com/api/mcp/asset/0325f733-758b-4961-9df0-bc7bbe01c8c5.png',
  	orange: 'https://www.figma.com/api/mcp/asset/cb978cd2-256e-42b6-bf99-39eb2d787a6e.png',
    	office: officePhoto,
	coffee: coffeePhoto,
	life: outdoorPhoto,
}


const products = [
	{ id: 'mocktail-can', title: 'Mocktail', name: 'Mocktail coffee', form: 'Cans', type: 'Mocktail', price: 20000, stock: 120, color: 'orange', image: catMocktailCan, hero: detailMocktail, blurb: 'Arabica Americano with the lingering taste of citrus, jasmine, and mint.', details: 'A bright office mocktail with natural citrus, jasmine, and mint. Under 5 Cal, no harsh additives.', packaging: 'Recyclable aluminum can. Best served chilled.' },
	{ id: 'americano-can', title: 'Americano', name: 'Americano coffee', form: 'Cans', type: 'Coffee', price: 20000, stock: 86, color: 'yellow', image: catAmericanoCan, hero: catAmericanoCan, blurb: 'A clean americano with chocolate depth and a smooth office-ready finish.', details: 'Roasted for daily work: bold, low-sugar, and easy to sip between meetings.', packaging: 'Recyclable aluminum can. Best served chilled.' },
	{ id: 'matcha-can', title: 'Matcha', name: 'Matcha', form: 'Cans', type: 'Matcha', price: 20000, stock: 64, color: 'lime', image: catMatchaCan, hero: catMatchaCan, blurb: 'Creamy matcha with a calm lift — made for long hours without the crash.', details: 'Stone-ground matcha, lightly sweetened, packed for the workday.', packaging: 'Recyclable aluminum can. Shake gently before opening.' },
	{ id: 'mocktail-grind', title: 'Mocktail', name: 'Mocktail coffee', form: 'Grind', type: 'Mocktail', price: 20000, stock: 40, color: 'orange', image: catMocktailGrind, hero: catMocktailGrind, blurb: 'Citrus-jasmine grind for brewing a brighter cup at the desk.', details: 'Locally sourced beans with citrus and jasmine notes. Grind for pour-over or drip.', packaging: 'Stand-up pouch. Reseal after opening. 200g.' },
	{ id: 'americano-grind', title: 'Americano', name: 'Americano coffee', form: 'Grind', type: 'Coffee', price: 20000, stock: 52, color: 'yellow', image: catAmericanoGrind, hero: catAmericanoGrind, blurb: 'Classic americano grind with a chocolate finish for everyday brewing.', details: 'Medium-dark roast for a reliable office brew.', packaging: 'Stand-up pouch. Reseal after opening. 200g.' },
	{ id: 'matcha-grind', title: 'Matcha', name: 'Matcha coffee', form: 'Grind', type: 'Matcha', price: 20000, stock: 33, color: 'lime', image: catMatchaGrind, hero: catMatchaGrind, blurb: 'Matcha-forward grind for a green, focused cup.', details: 'Blend of matcha and coffee grind for a calm, earthy brew.', packaging: 'Stand-up pouch. Reseal after opening. 200g.' },
]
function rupiah(value) {
	return `Rp${value.toLocaleString('id-ID')},00`
}
function go(path) { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo(0, 0) }
function FigmaHeader({ onPromos, onAbout, query, onQuery }) {
	const [localQuery, setLocalQuery] = useState('')
	const searchValue = onQuery ? query : localQuery
	return <header className="figma-header">
		<button className="figma-logo" onClick={() => go('/')}><img src={logoMark} alt="" width={9} height={41} />RoceCaf</button>
		<nav>
			<button onClick={() => go('/catalog')}>Catalog</button>
			<button onClick={onPromos || (() => go('/'))}>Promotions</button>
			<button onClick={onAbout || (() => go('/'))}>About Us</button>
		</nav>
		<div className="figma-header-tools">
			<form className="figma-search" onSubmit={(event) => { event.preventDefault(); if (window.location.pathname !== '/catalog') go('/catalog') }}>
				<input type="search" placeholder="Search" aria-label="Search" value={searchValue} onChange={(event) => onQuery ? onQuery(event.target.value) : setLocalQuery(event.target.value)} />
				<button type="submit" aria-label="Submit search"><img src={searchIcon} alt="" width={30} height={30} /></button>
			</form>
			<button className="figma-icon" onClick={() => go('/catalog')} aria-label="Bag"><img src={bagIcon} alt="" width={30} height={30} /></button>
			<button className="figma-icon profile" onClick={() => go('/admin/catalog')} aria-label="Account"><img src={profileIcon} alt="" width={29} height={29} /></button>
		</div>
	</header>
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
	const [query, setQuery] = useState('')
	const [categoryOpen, setCategoryOpen] = useState(true)
	const [forms, setForms] = useState({ Cans: true, Grind: true })
	const visible = products.filter((product) => {
		const matchForm = forms[product.form]
		const haystack = `${product.name} ${product.title} ${product.form} ${product.type}`.toLowerCase()
		return matchForm && haystack.includes(query.trim().toLowerCase())
	})
	const toggleForm = (form) => setForms((current) => ({ ...current, [form]: !current[form] }))
	return <div className="shop-page">
		<FigmaHeader query={query} onQuery={setQuery} />
		<main className="shop-main">
			<h1 className="shop-title">A TASTE WORTH THE WORK</h1>
			<div className="shop-layout">
				<aside className="shop-filters">
					<form className="shop-search" onSubmit={(event) => event.preventDefault()}>
						<input type="search" placeholder="Search" aria-label="Search catalog" value={query} onChange={(event) => setQuery(event.target.value)} />
						<button type="submit" aria-label="Search"><img src={searchIcon} alt="" width={24} height={24} /></button>
					</form>
					<button className="shop-filter-toggle" type="button" onClick={() => setCategoryOpen((open) => !open)} aria-expanded={categoryOpen}>
						<span>Category</span>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d={categoryOpen ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4'} stroke="#1e1e1e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
					</button>
					{categoryOpen && <div className="shop-checks">
						<label><input type="checkbox" checked={forms.Cans} onChange={() => toggleForm('Cans')} /><span>Cans</span></label>
						<label><input type="checkbox" checked={forms.Grind} onChange={() => toggleForm('Grind')} /><span>Grind</span></label>
					</div>}
				</aside>
				<section className="shop-grid">
					{visible.map((product) => (
						<button key={product.id} className="shop-card" type="button" onClick={() => go(`/product/${product.id}`)}>
							<div className="shop-card-media"><img src={product.image} alt="" /></div>
							<div className="shop-card-copy">
								<h2>{product.name}</h2>
								<div className="shop-card-meta">
									<span className="shop-tag">{product.form}</span>
									<strong>{rupiah(product.price)}</strong>
								</div>
							</div>
						</button>
					))}
				</section>
			</div>
		</main>
	</div>
}
function Details({ id }) {
	const product = products.find((item) => item.id === id) || products[0]
	const [qty, setQty] = useState(1)
	const [open, setOpen] = useState({ details: false, packaging: false })
	return <div className="shop-page pdp-page">
		<FigmaHeader />
		<main className="pdp">
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
						<button type="button" onClick={() => setQty((value) => value + 1)} aria-label="Increase quantity">+</button>
						<span>{qty}</span>
						<button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">−</button>
					</div>
					<button type="button" className="pdp-cart">Add To Cart</button>
				</div>
				<p className="pdp-stock">Stok: {product.stock}</p>
				<div className="pdp-accordions">
					<button type="button" className="pdp-acc" onClick={() => setOpen((current) => ({ ...current, details: !current.details }))}>
						<span>Details</span>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d={open.details ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4'} stroke="#1e1e1e" strokeWidth="1.5" strokeLinecap="round" /></svg>
					</button>
					{open.details && <p className="pdp-acc-body">{product.details}</p>}
					<button type="button" className="pdp-acc" onClick={() => setOpen((current) => ({ ...current, packaging: !current.packaging }))}>
						<span>Packaging</span>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d={open.packaging ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4'} stroke="#1e1e1e" strokeWidth="1.5" strokeLinecap="round" /></svg>
					</button>
					{open.packaging && <p className="pdp-acc-body">{product.packaging}</p>}
				</div>
			</section>
		</main>
	</div>
}
function AdminCatalog() { return <><Header admin /><main className="page admin-page"><div className="admin-heading"><div><p className="eyebrow">Workspace / catalog</p><h1>Product<br /><em>inventory.</em></h1></div><button className="dark-button">+ Add product</button></div><div className="admin-stats"><div><span>Live products</span><strong>06</strong></div><div><span>Low stock</span><strong>02</strong></div><div><span>Monthly orders</span><strong>1,284</strong></div></div><section className="admin-table"><div className="table-head"><span>Product</span><span>Category</span><span>Price</span><span>Status</span><span /></div>{products.map((product) => <div className="table-row" key={product.id}><div className="table-product"><img src={product.image} alt="" /><strong>{product.name}</strong></div><span>{product.form}</span><span>{rupiah(product.price)}</span><span className="status"><i /> Active</span><button className="more-button" aria-label={`More options for ${product.name}`}>•••</button></div>)}</section></main></> }
function Stars() {
	return <div className="figma-stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, index) => <img key={index} src={starIcon} alt="" />)}</div>
}
function Quote({ quote, name, role, avatar, delay = 0 }) {
	return <blockquote className="figma-quote reveal" style={{ '--d': `${delay}ms` }}><Stars /><p>{quote}</p><footer><img src={avatar} alt="" width={61} height={61} /><cite><span>{name}</span><b>{role}</b></cite></footer></blockquote>
}
function FigmaDesignPage() {

	const quotes = [
		{ name: 'Caitery Makerjob', role: 'Product Designer', avatar: avatarCaitery, quote: '“I didn’t expect that Coffee could have that refreshing taste, I would always assume it would be same old cup of joe. But this one is very refreshing, hits harder after staring at monitors 24/7 haha”' },
		{ name: 'Ichsan Rasyid Maulana', role: 'Full Stack Developer', avatar: avatarIchsan, quote: '“I didn’t expect that Coffee could have that refreshing taste, I would always assume it would be same old cup of joe. But this one is very refreshing, hits harder after staring at monitors 24/7 haha”' },
		{ name: 'Bahagi Adansu Kses', role: 'Human Capital', avatar: avatarBahagi, quote: '“We would bring the mocktail and matcha for all of the coworkers because they really like it, I could see that their energy are replenished and ready to sprint progress while doing manual labor”' },
	]
	const brands = [logoAsus, logoNike, logoFord, logoDiscord, logoX, logoAudi, logoExtra]
	useEffect(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
	return <main className="figma-page">
		<svg className="figma-filters" aria-hidden="true">
			<filter id="knockout-black" colorInterpolationFilters="sRGB">
				<feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1.2 1.2 1.2 0 -0.1" />
			</filter>
		</svg>
		<FigmaHeader
			onPromos={() => document.getElementById('office-notes')?.scrollIntoView({ behavior: 'smooth' })}
			onAbout={() => document.getElementById('what-we-do')?.scrollIntoView({ behavior: 'smooth' })}
		/>
		<section className="figma-hero">
			<div className="figma-hero-word">Mocktail</div>
			<img className="figma-cutout figma-leaves" src={leaves} alt="" />
			<img className="figma-cutout figma-orange" src={orangeSlice} alt="" />
			<img className="figma-cutout figma-flowers" src={flowers} alt="" />
			<div className="figma-can-wrap">
				<div className="figma-can-float">
					<img className="figma-can" src={canBody} alt="RoceCaf Mocktail can" />
					<div className="figma-can-copy">
						<div className="figma-can-brand"><img src={canMark} alt="" width={36} height={31} /><span>RoceCaf</span></div>
						<img className="figma-can-art" src={jumpingArt} alt="" />
						<strong>Mocktail</strong>
						<small>Sip and Lock In</small>
					</div>
				</div>
			</div>
			<h1>YOUR OFFICE PARTNER</h1>
		</section>
		<section className="figma-story" id="what-we-do">
			<div className="figma-story-copy">
				<p className="figma-kicker">What We Do Different:</p>
				<article className="reveal" style={{ '--d': '0ms' }}>
					<h2>CLEAN CALORIES<br />ZERO-GUILT<br />100% NATURAL</h2>
					<p>We believe that a drink is worth on what it can give. So ours give you a very low calorie coffee for less than 5 Cal. This is possible without the use of any harmful chemicals, we also use all-natural ingredients to enhance the freshness like never before.</p>
				</article>
				<article className="reveal figma-story-shift" style={{ '--d': '80ms' }}>
					<h2>SUPPORTS<br />LOCAL-GROWN<br />COFFEE BEANS</h2>
					<p>For every purchase of RoceCaf, you contribute to helping the hard working farmers. Because we care about workers no matter their job, and you deserve a local taste from the very place you work for.</p>
				</article>
				<article className="reveal figma-story-shift" style={{ '--d': '160ms' }}>
					<h2>Bring the out<br />THE LIFE<br />From works</h2>
					<p>Fatigue and mediocracy KILLS productivity. So we bring you a solution to those declining statistics and the morning lazy haze in the office.</p>
					<button className="figma-cta" onClick={() => go('/catalog')}>Try One Now</button>
				</article>
			</div>
			<div className="figma-story-images">
				<figure className="reveal" style={{ '--d': '40ms' }}><img src={outdoorPhoto} alt="A person enjoying RoceCaf outdoors" /></figure>
				<figure className="reveal" style={{ '--d': '120ms' }}><img src={coffeePhoto} alt="Coffee cherries being harvested" /></figure>
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

export default function App() { const [path, setPath] = useState(window.location.pathname); useEffect(() => { const update = () => setPath(window.location.pathname); window.addEventListener('popstate', update); return () => window.removeEventListener('popstate', update) }, []); if (path === '/catalog') return <Catalog />; if (path.startsWith('/product/')) return <Details id={path.split('/')[2]} />; if (path === '/admin/catalog') return <AdminCatalog />; if (path === '/classic') return <Landing />; return <FigmaDesignPage /> }