import { renderProductForm } from './components/ProductForm.js'
import { renderProductTable } from './components/ProductTable.js'

const apiBase = '/api'

const state = {
  products: [],
  loading: false,
  error: '',
  filterName: '',
  form: { id: null, name: '', sku: '', price: '', quantity: '', description: '' },
}

const els = {
  alert: document.getElementById('alert'),
  formCard: document.getElementById('formCard'),
  formTitle: document.getElementById('formTitle'),
  formBody: document.getElementById('formBody'),
  table: document.getElementById('table'),
  loading: document.getElementById('loading'),
  filter: document.getElementById('filter'),
  btnSearch: document.getElementById('btnSearch'),
  btnReset: document.getElementById('btnReset'),
  btnAdd: document.getElementById('btnAdd'),
  btnCloseForm: document.getElementById('btnCloseForm'),
}

function setLoading(v) {
  state.loading = v
  if (els.loading) els.loading.style.display = v ? 'block' : 'none'
}

function setError(msg) {
  state.error = msg || ''
  if (!els.alert) return
  if (state.error) {
    els.alert.textContent = state.error
    els.alert.style.display = 'block'
  } else {
    els.alert.style.display = 'none'
    els.alert.textContent = ''
  }
}

function resetForm() {
  state.form = { id: null, name: '', sku: '', price: '', quantity: '', description: '' }
  renderForm()
}

function showForm(mode = 'add') {
  if (els.formCard) els.formCard.style.display = 'block'
  if (els.formTitle) els.formTitle.textContent = mode === 'edit' ? 'Edit Product' : 'Add Product'
}

function hideForm() {
  if (els.formCard) els.formCard.style.display = 'none'
}

async function load(name = '') {
  try {
    setLoading(true); setError('')
    const url = new URL(apiBase + '/products', window.location.origin)
    if (name && name.trim()) url.searchParams.set('name', name.trim())
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.message || 'Failed to load products')
    state.products = data
    renderTable()
  } catch (e) {
    setError(e.message)
  } finally {
    setLoading(false)
  }
}

function renderForm() {
  renderProductForm(els.formBody, state.form, {
    loading: state.loading,
    onCancel: () => { resetForm(); hideForm() },
    onSubmit: async (payload) => {
      try {
        setLoading(true); setError('')
        const isEdit = !!state.form.id
        const url = isEdit ? `${apiBase}/products/${state.form.id}` : `${apiBase}/products`
        const method = isEdit ? 'PUT' : 'POST'
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.message || 'Request failed')
        if (isEdit) {
          state.products = state.products.map(p => p.id === data.id ? data : p)
        } else {
          state.products = [data, ...state.products]
        }
        resetForm(); hideForm()
        renderTable()
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
  })
}

function renderTable() {
  renderProductTable(els.table, state.products, {
    onEdit: (id) => {
      const p = state.products.find(x => x.id === id)
      if (!p) return
      state.form = { id: p.id, name: p.name, sku: p.sku, price: p.price, quantity: p.quantity, description: p.description || '' }
      renderForm(); showForm('edit')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    onDelete: async (id) => {
      if (!confirm('Delete this product?')) return
      try {
        setLoading(true); setError('')
        const res = await fetch(`${apiBase}/products/${id}`, { method: 'DELETE', headers: { 'Accept': 'application/json' } })
        if (!res.ok) {
          let msg = 'Delete failed'
          try { const d = await res.json(); if (d?.message) msg = d.message } catch {}
          throw new Error(msg)
        }
        state.products = state.products.filter(p => p.id !== id)
        if (state.form.id === id) resetForm()
        renderTable()
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
  })
}

function bindActions() {
  if (els.btnAdd) {
    els.btnAdd.addEventListener('click', () => { resetForm(); showForm('add') })
  }
  if (els.btnCloseForm) {
    els.btnCloseForm.addEventListener('click', () => { hideForm() })
  }
  if (els.btnSearch) {
    els.btnSearch.addEventListener('click', () => {
      state.filterName = els.filter.value
      load(state.filterName)
    })
  }
  if (els.btnReset) {
    els.btnReset.addEventListener('click', () => {
      state.filterName = ''
      if (els.filter) els.filter.value = ''
      load('')
    })
  }
}

function init() {
  bindActions()
  load('')
}

document.addEventListener('DOMContentLoaded', init)
