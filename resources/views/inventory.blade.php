<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Product Inventory Manager</title>
  <link rel="stylesheet" href="/assets/css/inventory.css">
  <!-- Pure JS version: no React, no Babel -->
</head>
<body>
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">PRODUCT INVENTORY MANAGER</h1>
      <button id="btnAdd" class="btn btn-primary">Add Product</button>
    </div>

    <div id="alert" class="alert" style="display:none"></div>

    <!-- Form Card (hidden by default) -->
    <div id="formCard" class="card" style="display:none; margin-bottom: 16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <h2 id="formTitle" style="margin:0;font-size:18px">Add Product</h2>
        <button id="btnCloseForm" class="btn btn-ghost">Close</button>
      </div>
      <div id="formBody"></div>
    </div>

    <!-- Search Toolbar -->
    <div class="card" style="margin-bottom: 16px;">
      <div class="toolbar">
        <input id="filter" placeholder="Search products..." />
        <button id="btnSearch" class="btn">Search</button>
        <button id="btnReset" class="btn btn-ghost">Reset</button>
      </div>
    </div>

    <div id="loading" style="display:none">Loading...</div>

    <div id="table"></div>
  </div>

  <script type="module" src="/assets/js/app.js"></script>
</body>
</html>
