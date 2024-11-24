document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/reservas')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const messageElement = document.getElementById('reservationMessage');
            if (data && data.reservas && data.reservas.length > 0) {
                const reservasTable = document.getElementById('reservas-table').getElementsByTagName('tbody')[0];
                reservasTable.innerHTML = ''; // Limpiar tabla antes de llenarla
                data.reservas.forEach(reserva => {
                    const row = reservasTable.insertRow();
                    row.insertCell(0).textContent = reserva.ID;
                    row.insertCell(1).textContent = reserva.Usuario || 'Sin Usuario';
                    row.insertCell(2).textContent = reserva.Entrenador || 'Sin Entrenador';
                    row.insertCell(3).textContent = reserva.FechaHora;

                    // Añadir celda de acciones
                    const actionCell = row.insertCell(4);
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Editar';
                    editButton.onclick = () => editReservation(reserva.ID);
                    actionCell.appendChild(editButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Eliminar';
                    deleteButton.onclick = () => deleteReservation(reserva.ID);
                    actionCell.appendChild(deleteButton);
                });

                if (messageElement) {
                    messageElement.innerHTML = ''; // Limpiar cualquier mensaje previo
                }
            } else {
                console.error('No se encontraron reservas');
                if (messageElement) {
                    messageElement.innerHTML = 'No se encontraron reservas.';
                } else {
                    console.error("Couldn't find element with ID 'reservationMessage'");
                }
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
});

// Función para editar una reserva
function editReservation(id) {
    console.log('Editar reserva con ID:', id);
    // Aquí puedes implementar la lógica para editar la reserva
}

// Función para eliminar una reserva
function deleteReservation(id) {
    fetch(`/reservas/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Reserva eliminada:', data.message);
            location.reload(); // Recargar la página para actualizar la lista de reservas
        } else {
            console.error('Error al eliminar reserva:', data.message);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
}
