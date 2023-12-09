const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const obrasSelect = document.getElementById('obras');
const buyButton = document.getElementById('buyButton');
const resetButton = document.getElementById('resetButton');


let purchasedSeats = [];

populateUI();
let ticketPrice = +obrasSelect.value;

function setObrasData(obrasIndex, obrasPrice) {
    localStorage.setItem('selectedObrasIndex', obrasIndex);
    localStorage.setItem('selectedObrasPrice', obrasPrice);
}

function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    const selectedSeatsCount = selectedSeats.length;

    localStorage.setItem('selectedSeats', JSON.stringify([...selectedSeats].map(seat => [...seats].indexOf(seat))));

    count.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;
}

function populateUI() {
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
    if (selectedSeats !== null && selectedSeats.length > 0) {
        seats.forEach((seat, index) => {
            if (selectedSeats.indexOf(index) > -1) {
                seat.classList.add('selected');
            }
        });
    }

    const selectedObrasIndex = localStorage.getItem('selectedObrasIndex');

    if (selectedObrasIndex !== null) {
        obrasSelect.selectedIndex = selectedObrasIndex;
    }

    purchasedSeats = JSON.parse(localStorage.getItem('purchasedSeats')) || [];
    purchasedSeats.forEach((index) => {
        seats[index].classList.add('occupied', 'purchased');
    });
}

obrasSelect.addEventListener('change', (e) => {
    ticketPrice = +e.target.value;
    setObrasData(e.target.selectedIndex, e.target.value);
    updateSelectedCount();
});

container.addEventListener('click', (e) => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
        updateSelectedCount();
    }
});

async function handleBuyButtonClick() {
    try {
        const selectedSeats = document.querySelectorAll('.row .seat.selected');
        if (selectedSeats.length === 0) {
            alert('Por favor, selecciona al menos un asiento antes de comprar.');
            return;
        }

        const obraName = document.getElementById('obras').options[document.getElementById('obras').selectedIndex].text;
        const seatPrice = +obrasSelect.value;

        const response = await fetch('http://localhost:3000/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                seats: [...selectedSeats].map(seat => [...seats].indexOf(seat)),
                obraName,
                seatPrice,
            }),
        });

        if (response.ok) {
            selectedSeats.forEach((seat) => {
                seat.classList.remove('selected');
                seat.classList.add('occupied', 'purchased');
                purchasedSeats.push([...seats].indexOf(seat));
            });

            localStorage.setItem('purchasedSeats', JSON.stringify(purchasedSeats));

            updateSelectedCount();

            openEmailPopup();
        } else {
            alert('Error al realizar la compra.');
        }
    } catch (error) {
        console.error('Error al realizar la solicitud fetch:', error);
    }
}

function openEmailPopup() {
    const emailPopup = document.getElementById('emailPopup');
    emailPopup.style.display = 'flex';
}

function submitEmail() {
    const emailInputValue = document.getElementById('emailInput').value;

    if (!emailInputValue) {
        alert('Por favor, ingresa tu correo electrónico.');
        return;
    }
    localStorage.setItem('userEmail', emailInputValue);
    alert(`Correo electrónico ingresado: ${emailInputValue}`);
    closeEmailPopup();
}

function closeEmailPopup() {
    const emailPopup = document.getElementById('emailPopup');
    emailPopup.style.display = 'none';
}

async function handleResetButtonClick() {
    try {
        const response = await fetch('http://localhost:3000/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        if (response.ok) {
            alert('Asientos reseteados con éxito!');

            seats.forEach(seat => seat.classList.remove('selected', 'occupied', 'purchased'));

            updateSelectedCount();

            purchasedSeats = [];
            localStorage.removeItem('selectedSeats');
            localStorage.removeItem('purchasedSeats');
        } else {
            alert('Error al resetear los asientos.');
        }
    } catch (error) {
        console.error('Error al realizar la solicitud fetch:', error);
    }
}

const viewReservationsButton = document.getElementById('viewReservationsButton');

viewReservationsButton.addEventListener('click', () => {
    const reservedSeats = document.querySelectorAll('.row .seat.purchased');

    if (reservedSeats.length === 0) {

    } else {
        const reservedSeatNumbers = [...reservedSeats].map((seat) => [...seats].indexOf(seat) + 1);

    }
});

buyButton.addEventListener('click', handleBuyButtonClick);
resetButton.addEventListener('click', handleResetButtonClick);
