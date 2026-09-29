const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// ---------------- SUPPLIERS ----------------
app.post('/addSupplier', (req, res) => {
    const { supplier_id, name, contact, location } = req.body;
    const sql = "INSERT INTO suppliers VALUES (?, ?, ?, ?)";
    db.query(sql, [supplier_id, name, contact, location], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Supplier added ✅");
    });
});

app.get('/suppliers', (req, res) => {
    const sql = "SELECT SupplierID, Name, Contact, FarmLocation FROM suppliers";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.put('/updateSupplier/:id', (req, res) => {
    const { name, contact, location } = req.body;
    const sql = "UPDATE suppliers SET Name=?, Contact=?, FarmLocation=? WHERE SupplierID=?";
    db.query(sql, [name, contact, location, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Supplier updated ✅");
    });
});

app.delete('/deleteSupplier/:id', (req, res) => {
    const sql = "DELETE FROM suppliers WHERE SupplierID=?";
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Supplier deleted ❌");
    });
});

// ---------------- CROPS ----------------
app.post('/addCrop', (req, res) => {
    const { crop_id, crop_name, season, price } = req.body;
    const sql = "INSERT INTO crops VALUES (?, ?, ?, ?)";
    db.query(sql, [crop_id, crop_name, season, price], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Crop added ✅");
    });
});

app.get('/crops', (req, res) => {
    const sql = "SELECT CropID, CropName, GrowingSeason, PricePerUnit FROM crops";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.put('/updateCrop/:id', (req, res) => {
    const { crop_name, season, price } = req.body;
    const sql = "UPDATE crops SET CropName=?, GrowingSeason=?, PricePerUnit=? WHERE CropID=?";
    db.query(sql, [crop_name, season, price, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Crop updated ✅");
    });
});

app.delete('/deleteCrop/:id', (req, res) => {
    const sql = "DELETE FROM crops WHERE CropID=?";
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Crop deleted ❌");
    });
});

// ---------------- ORDERS ----------------
app.post('/addOrder', (req, res) => {
    const { order_id, customer_name, crop_id, quantity, total_amount } = req.body;
    const sql = "INSERT INTO orders VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [order_id, customer_name, crop_id, quantity, total_amount], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Order placed ✅");
    });
});

app.get('/orders', (req, res) => {
    const sql = "SELECT OrderID, BuyerName, CropID, Quantity, TotalCost FROM orders";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.put('/updateOrder/:id', (req, res) => {
    const { customer_name, crop_id, quantity, total_amount } = req.body;
    const sql = "UPDATE orders SET BuyerName=?, CropID=?, Quantity=?, TotalCost=? WHERE OrderID=?";
    db.query(sql, [customer_name, crop_id, quantity, total_amount, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Order updated ✅");
    });
});

app.delete('/deleteOrder/:id', (req, res) => {
    const sql = "DELETE FROM orders WHERE OrderID=?";
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Order deleted ❌");
    });
});

// ---------------- PAYMENTS ----------------
app.post('/addPayment', (req, res) => {
    const { payment_id, order_id, payment_mode, payment_status } = req.body;
    const sql = "INSERT INTO payments VALUES (?, ?, ?, ?)";
    db.query(sql, [payment_id, order_id, payment_mode, payment_status], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Payment recorded ✅");
    });
});

app.get('/payments', (req, res) => {
    const sql = "SELECT PaymentID, OrderID, PaymentMethod, PaymentStatus FROM payments";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.put('/updatePayment/:id', (req, res) => {
    const { order_id, payment_mode, payment_status } = req.body;
    const sql = "UPDATE payments SET OrderID=?, PaymentMethod=?, PaymentStatus=? WHERE PaymentID=?";
    db.query(sql, [order_id, payment_mode, payment_status, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Payment updated ✅");
    });
});

app.delete('/deletePayment/:id', (req, res) => {
    const sql = "DELETE FROM payments WHERE PaymentID=?";
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Payment deleted ❌");
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
