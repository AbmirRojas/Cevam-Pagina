document.addEventListener('DOMContentLoaded', function() {
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(t => new bootstrap.Tooltip(t));

    const form = document.getElementById('registroForm');
    const password = document.getElementById('password');
    const passwordConfirmation = document.getElementById('passwordConfirmation');
    
    form.addEventListener('submit', function(e) {
        let isValid = true;
        
        if(!/(?=.*[A-Z])(?=.*\d).{8,}/.test(password.value)) {
            isValid = false;
            showError('La contraseña debe contener al menos 8 caracteres, una mayúscula y un número');
        }

        if(!document.getElementById('terminos').checked) {
            isValid = false;
            showError('Debes aceptar los términos y condiciones');
        }

        if (!comparePasswords(password.value, passwordConfirmation.value)) {
            isValid = false;
        }

        if(!isValid) {
            e.preventDefault();
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

    function comparePasswords(password1, password2) {
        if (password1 !== password2) {
            showError('Las contraseñas no coinciden');
            return false;
        }
        return true;
    }

    function showError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger mt-3';
        alertDiv.textContent = message;
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
});