export function renderProductTable(container, products, { onEdit, onDelete }) {
  const rows = products.map(p => `
    <tr data-id="${p.id}">
      <td>${p.id}</td>
      <td>${escapeHtml(p.name)}</td>
      <td>${escapeHtml(p.sku)}</td>
      <td>₱${Number(p.price).toFixed(2)}</td>
      <td>${p.quantity}</td>
      <td>${p.description ? escapeHtml(p.description) : '-'}</td>
      <td>
        <button class="btn btn-link" data-action="edit">Edit</button>
        <button class="btn btn-link btn-danger-outline" data-action="delete">Delete</button>
      </td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="card table-card">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Description</th>
            <th width="1">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${products.length ? rows : '<tr><td colspan="7" style="text-align:center">No products</td></tr>'}
        </tbody>
      </table>
    </div>
  `;

  // Delegate events
  container.querySelector('tbody').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const tr = btn.closest('tr');
    const id = Number(tr?.dataset?.id);
    if (!id) return;
    if (btn.dataset.action === 'edit') onEdit?.(id);
    if (btn.dataset.action === 'delete') onDelete?.(id);
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
