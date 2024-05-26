const express = require('express');
const mysql = require('mysql2/promise'); // mysql2/promise kullanılarak Promise tabanlı MySQL kütüphanesi kullanılıyor
require('dotenv').config()
const cors = require('cors');
const app = express();

app.use(cors());

// MySQL connection configuration
const pool = mysql.createPool({ // createPool kullanılarak bağlantı havuzu oluşturuluyor
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DBNAME,
  connectionLimit: 10, // Bağlantı havuzundaki maksimum bağlantı sayısı
  waitForConnections: true, // Maksimum bağlantı sayısına ulaşıldığında yeni bağlantılar için bekleme
});

// Define a route for fetching data
app.get('/data', async (req, res) => {
  try {
    const connection = await pool.getConnection(); // Bağlantı alınıyor
    const [rows, fields] = await connection.query('SELECT * FROM gallery_img'); // Veri tabanından veri çekiliyor
    connection.release(); // Bağlantı serbest bırakılıyor
    res.json(rows);
  } catch (error) {
    console.error('Error querying MySQL: ' + error.stack);
    res.status(500).send('Error fetching data from the database');
  }
});

// Start the server
const PORT = process.env.PORT || 8001; // PORT değişkenini .env dosyasında belirtilen değerden veya varsayılan olarak 8001'den alıyor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
