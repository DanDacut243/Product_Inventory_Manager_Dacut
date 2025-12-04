// React UMD + Pure JS (no JSX) app for Laravel 7
(function () {
  var h = React.createElement;
  var useState = React.useState;
  var useEffect = React.useEffect;

  var apiBase = '/api';

  function Alert(props) {
    if (!props.message) return null;
    return h('div', { className: 'alert' }, props.message);
  }

  function Toolbar(props) {
    return h('div', { className: 'card', style: { marginBottom: '16px' } },
      h('div', { className: 'toolbar' },
        h('input', {
          placeholder: 'Search products...',
          value: props.value,
          onChange: function (e) { props.onChange(e.target.value); }
        }),
        h('button', { className: 'btn', onClick: function () { props.onSearch(); } }, 'Search'),
        h('button', { className: 'btn btn-ghost', onClick: function () { props.onReset(); } }, 'Reset')
      )
    );
  }

  function ProductForm(props) {
    var form = props.form;

    function onInput(key) {
      return function (e) {
        props.setForm(Object.assign({}, form, { [key]: e.target.value }));
      };
    }

    var isEdit = !!form.id;

    return h('div', { className: 'card', style: { marginBottom: '16px' } },
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' } },
        h('h2', { style: { margin: 0, fontSize: '18px' } }, isEdit ? 'Edit Product' : 'Add Product'),
        h('button', { className: 'btn btn-ghost', onClick: props.onCancel, type: 'button' }, 'Close')
      ),
      h('form', {
        onSubmit: function (e) { e.preventDefault(); props.onSubmit(); }
      },
        h('div', { className: 'form-grid' },
          h('div', { className: 'col-4' },
            h('label', null, 'Name'),
            h('input', { required: true, value: form.name || '', onChange: onInput('name') })
          ),
          h('div', { className: 'col-3' },
            h('label', null, 'SKU'),
            h('input', { required: true, value: form.sku || '', onChange: onInput('sku') })
          ),
          h('div', { className: 'col-2' },
            h('label', null, 'Price'),
            h('input', { required: true, type: 'number', min: 0, step: '0.01', value: form.price === 0 ? 0 : (form.price || ''), onChange: onInput('price') })
          ),
          h('div', { className: 'col-3' },
            h('label', null, 'Quantity'),
            h('input', { required: true, type: 'number', min: 0, step: '1', value: form.quantity === 0 ? 0 : (form.quantity || ''), onChange: onInput('quantity') })
          ),
          h('div', { className: 'col-12' },
            h('label', null, 'Description'),
            h('textarea', { rows: 2, value: form.description || '', onChange: onInput('description') })
          ),
          h('div', { className: 'col-12 form-actions' },
            h('button', { className: 'btn btn-primary', type: 'submit', disabled: !!props.loading }, isEdit ? 'Update' : 'Add'),
            isEdit ? h('button', { className: 'btn btn-ghost', type: 'button', onClick: props.onCancel }, 'Cancel') : null
          )
        )
      )
    );
  }

  function ProductTable(props) {
    var rows = props.products.map(function (p) {
      return h('tr', { key: p.id },
        h('td', null, String(p.id)),
        h('td', null, p.name),
        h('td', null, p.sku),
        h('td', null, '₱' + Number(p.price).toFixed(2)),
        h('td', null, String(p.quantity)),
        h('td', null, p.description ? p.description : '-'),
        h('td', null,
          h('button', { className: 'btn btn-link', onClick: function () { props.onEdit(p.id); } }, 'Edit'),
          h('button', { className: 'btn btn-link btn-danger-outline', onClick: function () { props.onDelete(p.id); } }, 'Delete')
        )
      );
    });

    return h('div', { className: 'card table-card' },
      h('table', { className: 'table' },
        h('thead', null,
          h('tr', null,
            h('th', null, 'ID'),
            h('th', null, 'Name'),
            h('th', null, 'SKU'),
            h('th', null, 'Price'),
            h('th', null, 'Quantity'),
            h('th', null, 'Description'),
            h('th', { width: '1' }, 'Actions')
          )
        ),
        h('tbody', null,
          props.products.length ? rows : h('tr', null, h('td', { colSpan: 7, style: { textAlign: 'center' } }, 'No products'))
        )
      )
    );
  }

  function App() {
    var _useState = useState([]), products = _useState[0], setProducts = _useState[1];
    var _useState2 = useState(false), loading = _useState2[0], setLoading = _useState2[1];
    var _useState3 = useState(''), error = _useState3[0], setError = _useState3[1];
    var _useState4 = useState(''), filter = _useState4[0], setFilter = _useState4[1];
    var _useState5 = useState(false), showForm = _useState5[0], setShowForm = _useState5[1];
    var _useState6 = useState({ id: null, name: '', sku: '', price: '', quantity: '', description: '' }), form = _useState6[0], setForm = _useState6[1];

    function setErrorMsg(msg) { setError(msg || ''); }

    function load(name) {
      setLoading(true); setErrorMsg('');
      var url = new URL(apiBase + '/products', window.location.origin);
      if (name && String(name).trim()) url.searchParams.set('name', String(name).trim());
      return fetch(url.toString(), { headers: { 'Accept': 'application/json' } })
        .then(function (res) { return res.json().then(function (d) { return { ok: res.ok, data: d }; }); })
        .then(function (r) {
          if (!r.ok) throw new Error(r.data && r.data.message ? r.data.message : 'Failed to load products');
          setProducts(r.data);
        })
        .catch(function (e) { setErrorMsg(e.message); })
        .finally(function () { setLoading(false); });
    }

    function handleAddOrUpdate() {
      setLoading(true); setErrorMsg('');
      var isEdit = !!form.id;
      var url = isEdit ? (apiBase + '/products/' + form.id) : (apiBase + '/products');
      var method = isEdit ? 'PUT' : 'POST';
      var payload = {
        name: String(form.name || '').trim(),
        sku: String(form.sku || '').trim(),
        price: Number(form.price),
        quantity: Number(form.quantity),
        description: String(form.description || '').trim() || null
      };
      return fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json().then(function (d) { return { ok: res.ok, data: d }; }); })
        .then(function (r) {
          if (!r.ok) throw new Error(r.data && r.data.message ? r.data.message : 'Request failed');
          if (isEdit) {
            setProducts(function (arr) { return arr.map(function (p) { return p.id === r.data.id ? r.data : p; }); });
          } else {
            setProducts(function (arr) { return [r.data].concat(arr); });
          }
          setForm({ id: null, name: '', sku: '', price: '', quantity: '', description: '' });
          setShowForm(false);
        })
        .catch(function (e) { setErrorMsg(e.message); })
        .finally(function () { setLoading(false); });
    }

    function handleDelete(id) {
      if (!window.confirm('Delete this product?')) return;
      setLoading(true); setErrorMsg('');
      return fetch(apiBase + '/products/' + id, { method: 'DELETE', headers: { 'Accept': 'application/json' } })
        .then(function (res) { if (!res.ok) throw new Error('Delete failed'); })
        .then(function () {
          setProducts(function (arr) { return arr.filter(function (x) { return x.id !== id; }); });
          if (form.id === id) setForm({ id: null, name: '', sku: '', price: '', quantity: '', description: '' });
        })
        .catch(function (e) { setErrorMsg(e.message); })
        .finally(function () { setLoading(false); });
    }

    function handleEdit(id) {
      var p = products.find(function (x) { return x.id === id; });
      if (!p) return;
      setForm({ id: p.id, name: p.name, sku: p.sku, price: p.price, quantity: p.quantity, description: p.description || '' });
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleAddClick() { setForm({ id: null, name: '', sku: '', price: '', quantity: '', description: '' }); setShowForm(true); }
    function handleCancel() { setShowForm(false); setForm({ id: null, name: '', sku: '', price: '', quantity: '', description: '' }); }

    useEffect(function () { load(''); }, []);

    return h('div', { className: 'container' },
      h('div', { className: 'page-header' },
        h('h1', { className: 'page-title' }, 'PRODUCT INVENTORY MANAGER'),
        h('button', { className: 'btn btn-primary', onClick: handleAddClick }, 'Add Product')
      ),
      error ? h(Alert, { message: error }) : null,
      showForm ? h(ProductForm, { form: form, setForm: setForm, onCancel: handleCancel, onSubmit: handleAddOrUpdate, loading: loading }) : null,
      h(Toolbar, {
        value: filter,
        onChange: setFilter,
        onSearch: function () { load(filter); },
        onReset: function () { setFilter(''); load(''); }
      }),
      loading ? h('div', { id: 'loading' }, 'Loading...') : null,
      h('div', { id: 'table' }, h(ProductTable, { products: products, onEdit: handleEdit, onDelete: handleDelete }))
    );
  }

  function mount() {
    var root = document.getElementById('root');
    if (!root) return;
    ReactDOM.render(h(App), root);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
