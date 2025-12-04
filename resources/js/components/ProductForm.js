export function renderProductForm(container, form, { onSubmit, onCancel, loading }) {
  const isEdit = Boolean(form?.id);
  container.innerHTML = `
    <form id="productForm" class="form-grid">
      <div class="col-4">
        <label>Name</label>
        <input id="f-name" required value="${escapeAttr(form.name || '')}" />
      </div>
      <div class="col-3">
        <label>SKU</label>
        <input id="f-sku" required value="${escapeAttr(form.sku || '')}" />
      </div>
      <div class="col-2">
        <label>Price</label>
        <input id="f-price" required type="number" min="0" step="0.01" value="${escapeAttr(form.price ?? '')}" />
      </div>
      <div class="col-3">
        <label>Quantity</label>
        <input id="f-qty" required type="number" min="0" step="1" value="${escapeAttr(form.quantity ?? '')}" />
      </div>
      <div class="col-12">
        <label>Description</label>
        <textarea id="f-desc" rows="2">${escapeHtml(form.description || '')}</textarea>
      </div>
      <div class="col-12 form-actions">
        <button id="btnSubmit" class="btn btn-primary" ${loading ? 'disabled' : ''} type="submit">${isEdit ? 'Update' : 'Add'}</button>
        ${isEdit ? '<button id="btnCancel" class="btn btn-ghost" type="button">Cancel</button>' : ''}
      </div>
    </form>
  `;

  const formEl = container.querySelector('#productForm');
  const btnSubmit = container.querySelector('#btnSubmit');
  const btnCancel = container.querySelector('#btnCancel');

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    btnSubmit.disabled = true;
    try {
      const payload = {
        name: container.querySelector('#f-name').value.trim(),
        sku: container.querySelector('#f-sku').value.trim(),
        price: Number(container.querySelector('#f-price').value),
        quantity: Number(container.querySelector('#f-qty').value),
        description: container.querySelector('#f-desc').value.trim() || null,
      };
      await onSubmit?.(payload);
    } finally {
      btnSubmit.disabled = false;
    }
  });

  if (btnCancel) {
    btnCancel.addEventListener('click', () => onCancel?.());
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttr(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
