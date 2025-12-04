/* global React, ReactDOM */

function App() {
  return (
    <div style={{ padding: '16px' }}>
      <h1>PRODUCT INVENTORY MANAGER</h1>
      <p>React (CDN) + Babel Standalone. No npm build required.</p>
    </div>
  );
}

const root = document.getElementById('root');
if (root) {
  ReactDOM.render(<App />, root);
}
