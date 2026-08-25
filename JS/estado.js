const indicadorEstado = document.getElementById('indicador-estado');
const textoEstado = document.querySelector('.texto-estado');

if (indicadorEstado && textoEstado) {
    fetch('/health', { cache: 'no-store' })
        .then((response) => {
            if (!response.ok) {
                throw new Error('El servidor no esta disponible');
            }
            return response.json();
        })
        .then((data) => {
            const activo = data.status === 'ok';
            indicadorEstado.classList.add(activo ? 'activo' : 'inactivo');
            textoEstado.classList.add(activo ? 'activo' : 'inactivo');
            textoEstado.textContent = activo ? 'Activo' : 'Inactiva';
        })
        .catch(() => {
            indicadorEstado.classList.add('inactivo');
            textoEstado.classList.add('inactivo');
            textoEstado.textContent = 'Inactiva';
        });
}
