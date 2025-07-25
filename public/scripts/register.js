document.addEventListener('DOMContentLoaded', function() {
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(t => new bootstrap.Tooltip(t));

    const form = document.getElementById('registroForm');
    const password = document.getElementById('password');
    
    // Elementos de seguridad de contraseña
    const barraSeguridad = document.getElementById('barra-seguridad');
    const etiquetaSeguridad = document.getElementById('etiqueta-seguridad');
    const reqLongitud = document.getElementById('req-longitud');
    const reqMayuscula = document.getElementById('req-mayuscula');
    const reqNumero = document.getElementById('req-numero');
    const reqEspecial = document.getElementById('req-especial');
        
    
    // Validación de contraseña en tiempo real
    password.addEventListener('input', function() {
        const pass = password.value;
        let fortaleza = 0;
        
        // Verificar requisitos
        const tieneLongitud = pass.length >= 8;
        const tieneMayuscula = /[A-Z]/.test(pass);
        const tieneNumero = /\d/.test(pass);
        const tieneEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
        
        // Actualizar iconos de requisitos
        actualizarRequisito(reqLongitud, tieneLongitud);
        actualizarRequisito(reqMayuscula, tieneMayuscula);
        actualizarRequisito(reqNumero, tieneNumero);
        actualizarRequisito(reqEspecial, tieneEspecial);
        
        // Calcular fortaleza
        if (tieneLongitud) fortaleza += 25;
        if (tieneMayuscula) fortaleza += 25;
        if (tieneNumero) fortaleza += 25;
        if (tieneEspecial) fortaleza += 25;
        
        // Actualizar barra de seguridad
        barraSeguridad.style.width = `${fortaleza}%`;
        
        // Actualizar colores y etiqueta
        if (fortaleza === 0) {
            barraSeguridad.style.backgroundColor = '#dc3545';
            etiquetaSeguridad.textContent = 'Contraseña insegura';
            etiquetaSeguridad.style.color = '#dc3545';
        } else if (fortaleza <= 50) {
            barraSeguridad.style.backgroundColor = '#ffc107';
            etiquetaSeguridad.textContent = 'Contraseña débil';
            etiquetaSeguridad.style.color = '#ffc107';
        } else if (fortaleza <= 75) {
            barraSeguridad.style.backgroundColor = '#17a2b8';
            etiquetaSeguridad.textContent = 'Contraseña aceptable';
            etiquetaSeguridad.style.color = '#17a2b8';
        } else {
            barraSeguridad.style.backgroundColor = '#28a745';
            etiquetaSeguridad.textContent = 'Contraseña segura';
            etiquetaSeguridad.style.color = '#28a745';
        }
    });
    
    function actualizarRequisito(elemento, cumple) {
        if (cumple) {
            elemento.classList.add('cumplido');
            elemento.classList.remove('no-cumplido');
            elemento.innerHTML = elemento.innerHTML.replace('bi-dash-circle', 'bi-check-circle');
        } else {
            elemento.classList.add('no-cumplido');
            elemento.classList.remove('cumplido');
            elemento.innerHTML = elemento.innerHTML.replace('bi-check-circle', 'bi-dash-circle');
        }
    }

    form.addEventListener('submit', function(e) {
        let isValid = true;
        let errorMessage = '';
        
        // Validar contraseña
        if(!/(?=.*[A-Z])(?=.*\d).{8,}/.test(password.value)) {
            isValid = false;
            errorMessage = 'La contraseña debe contener al menos 8 caracteres, una mayúscula y un número';
        }

        if(!document.getElementById('terminos').checked) {
            isValid = false;
            errorMessage = 'Debes aceptar los términos y condiciones';
        }

        if(!isValid) {
            e.preventDefault();
            showError(errorMessage);
        } else {
            // Animación de éxito
            const boton = document.querySelector('.boton-principal');
            boton.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Registro exitoso!';
            boton.style.backgroundColor = '#28a745';
            boton.style.borderColor = '#28a745';
            
            setTimeout(() => {
                boton.innerHTML = '<i class="bi bi-person-plus-fill me-2"></i>Registrarse Ahora';
                boton.style.backgroundColor = '';
                boton.style.borderColor = '';
            }, 2000);
        }
    });

    document.querySelectorAll('#backLink, #backLinkBottom').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const container = document.querySelector('.contenedor-principal');
            const target = this.href;
            
            container.classList.add('exit-animation');
            
            setTimeout(() => {
                window.location.href = target;
            }, 600);
        });
    });

    function showError(message) {
        // Eliminar alertas anteriores
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) existingAlert.remove();
        
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger mt-3';
        alertDiv.innerHTML = `<i class="bi bi-exclamation-triangle me-2"></i>${message}`;
        form.prepend(alertDiv);
        
        setTimeout(() => alertDiv.remove(), 5000);
    }

    const boton = document.querySelector('.boton-principal');
    boton.addEventListener('mousedown', () => {
        boton.style.transform = 'translateY(2px)';
    });
    
    boton.addEventListener('mouseup', () => {
        boton.style.transform = 'translateY(-3px)';
    });
    
    // Animación para iconos de redes sociales
    const redesIcons = document.querySelectorAll('.redes-sociales a');
    redesIcons.forEach((icon, index) => {
        setTimeout(() => {
            icon.style.animation = `bounce 0.6s ${index * 0.2}s`;
        }, 500);
    });
});