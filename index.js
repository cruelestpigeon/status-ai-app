// Minimal bootstrap that DOES NOT rely on modules or other files.
// This will prove React + the page are working.
(function(){
  const e = React.createElement;

  function MiniApp(){
    return e('div', {style:{padding:20, fontFamily:'system-ui, -apple-system, "Segoe UI", Roboto'}},
      e('h1', {style:{marginBottom:8}}, 'StatusLocal — Test App'),
      e('p', null, 'If you see this, React is loading correctly from CDN and the site is serving scripts.'),
      e('p', null, 'Next I will help you restore the full app in small steps.')
    );
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(e(MiniApp));
})();
