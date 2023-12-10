document.addEventListener('DOMContentLoaded', async () => {
    const reservasLista = document.getElementById('reservas-lista');
    const totalAsientosElemento = document.getElementById('total-asientos');
    const precioTotalElemento = document.getElementById('precio-total');
    const userEmailElemento = document.getElementById('userEmailDisplay');
    const userEmail = localStorage.getItem('userEmail');

    if (userEmail) {
        userEmailElemento.innerText = userEmail;
    } else {
        userEmailElemento.innerText = 'Correo no disponible';
    }

    const compras = await obtenerCompras();

    if (compras.length > 0) {
        const reservas = await obtenerReservas();

        const reservasRelacionadas = reservas.filter(reserva => {
            return compras.some(compra => compra.obraName === reserva.obraName);
        });

        let numeroTotalAsientos = 0;
        let precioTotal = 0;

        if (reservasRelacionadas.length > 0) {
            reservasRelacionadas.forEach(reserva => {
                const reservaElemento = document.createElement('div');
                reservaElemento.classList.add('reserva-item');

                reservaElemento.innerHTML = `
                    <p>Obra: ${reserva.obraName}</p>
                    <p>Asiento: ${reserva.number}</p>
                    <p>Precio: $${reserva.seatPrice}</p>
                `;

                reservasLista.appendChild(reservaElemento);

                numeroTotalAsientos++;
                precioTotal += reserva.seatPrice;
            });
        } else {
            const mensajeSinReservas = document.createElement('p');
            mensajeSinReservas.innerText = 'No hay reservas relacionadas con tus compras.';
            reservasLista.appendChild(mensajeSinReservas);
        }

        totalAsientosElemento.innerText = numeroTotalAsientos;
        precioTotalElemento.innerText = precioTotal;
    } else {
        const mensajeSinCompras = document.createElement('p');
        mensajeSinCompras.innerText = 'No has realizado ninguna compra.';
        reservasLista.appendChild(mensajeSinCompras);
    }
});

async function obtenerCompras() {
    try {
        const response = await fetch('http://54.82.24.123/reservations');
        if (response.ok) {
            const compras = await response.json();
            return compras;
        } else {
            console.error('Error al obtener compras');
            return [];
        }
    } catch (error) {
        console.error('Error al realizar la solicitud fetch:', error);
        return [];
    }
}

async function obtenerReservas() {
    try {
        const response = await fetch('http://54.82.24.123/reservations');
        if (response.ok) {
            const reservas = await response.json();
            return reservas;
        } else {
            console.error('Error al obtener reservas');
            return [];
        }
    } catch (error) {
        console.error('Error al realizar la solicitud fetch:', error);
        return [];
    }
}
