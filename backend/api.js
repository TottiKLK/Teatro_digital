const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const reservationsFilePath = 'backend/reservations.json';

let reservations = loadReservations();

app.get('/reservations', (req, res) => {
  res.json(reservations);
});

app.post('/reservations', (req, res) => {
  const { seats, obraName, seatPrice } = req.body;

  if (!seats || !Array.isArray(seats) || seats.length === 0 || !obraName || !seatPrice) {
    return res.status(400).json({ error: 'Invalid request. Please provide valid data.' });
  }

  const reservedSeats = seats.map(seatIndex => ({
    number: seatIndex + 1,
    obraName,
    seatPrice,
  }));

  reservations.push(...reservedSeats);

  saveReservations();

  res.json(reservedSeats);
});

app.post('/reset', (req, res) => {
  reservations = [];
  saveReservations();
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

function loadReservations() {
  try {
    const data = fs.readFileSync(reservationsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveReservations() {
  const data = JSON.stringify(reservations);
  fs.writeFileSync(reservationsFilePath, data, 'utf8');
}
