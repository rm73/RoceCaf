const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

export function apiEnabled() {
	if (import.meta.env.VITE_API_URL) return true
	if (typeof window === 'undefined') return false
	return /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)
}

export function mediaUrl(src) {
	if (!src) return ''
	if (/^(https?:|data:|blob:)/i.test(src)) return src
	const origin = import.meta.env.VITE_API_ORIGIN
	if (origin) return `${String(origin).replace(/\/$/, '')}${src.startsWith('/') ? src : `/${src}`}`
	return src.startsWith('/') ? src : `/${src}`
}

export function mapProduct(product) {
	const category = product.category?.name || ''
	const form = /grind/i.test(category) ? 'Grind' : /can/i.test(category) ? 'Cans' : category
	return {
		dbId: product.id,
		id: product.slug || String(product.id),
		slug: product.slug || String(product.id),
		title: product.title || product.name,
		name: product.name,
		form,
		type: category,
		categoryId: product.category_id,
		price: Number(product.price) || 0,
		stock: Math.max(0, Number(product.stock) || 0),
		image: mediaUrl(product.image),
		hero: mediaUrl(product.hero_image || product.image),
		blurb: product.description || '',
		details: product.details || product.description || '',
		packaging: product.packaging || '',
		raw: product,
	}
}

export async function api(path, options = {}) {
	const token = localStorage.getItem('rocecaf-token')
	const body = options.body
	const isForm = typeof FormData !== 'undefined' && body instanceof FormData
	const headers = {
		Accept: 'application/json',
		...(body && !isForm ? { 'Content-Type': 'application/json' } : {}),
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...options.headers,
	}
	const response = await fetch(`${API}${path}`, {
		...options,
		headers,
		body,
		signal: options.signal || AbortSignal.timeout(5000),
	})
	const data = await response.json().catch(() => ({}))
	if (!response.ok) {
		const message = data.message || Object.values(data.errors || {}).flat()[0] || 'Request failed'
		throw Object.assign(new Error(message), { status: response.status, body: data })
	}
	return data
}
