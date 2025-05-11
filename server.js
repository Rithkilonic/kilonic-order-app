const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const ordersFile = path.join(__dirname, 'orders.json');
let orders = [];
if (fs.existsSync(ordersFile)) {
  orders = JSON.parse(fs.readFileSync(ordersFile));
}

app.post('/submit-order', (req, res) => {
  const order = req.body;
  order.timestamp = new Date().toISOString();
  orders.push(order);
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  res.json({ success: true, message: 'Order saved successfully.' });
});

app.get('/sales-summary', (req, res) => {
  const summary = {};
  for (const order of orders) {
    const influencer = order.influencer || "NONE";
    summary[influencer] = (summary[influencer] || 0) + parseFloat(order.total);
  }
  res.json(summary);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
