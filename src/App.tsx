import React, { useState } from 'react';
import './App.css';
import ManageShoppingList from './cmps/ManageShoppintList/ManageShoppingList.cmp';
import OrderSummary from './cmps/OrderSummary/OrderSummary.cmp';

function App() {
  const [summary, setSummary] = useState<boolean>(false);
  return (
    <div className="App">
      {!summary ? <ManageShoppingList moveToSummary={setSummary} /> : <OrderSummary backToShopping={setSummary} />}
    </div>
  );
}

export default App;
