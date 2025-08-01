// ===== FUNCIONALIDAD PRINCIPAL =====
    
// Función para cambiar entre formularios
function toggleForms(sectionToShow) {
    const loginSection = document.getElementById('loginSection');
    const recoverySection = document.getElementById('recoverySection');
    const idVerificationSection = document.getElementById('idVerificationSection');
    
    // Ocultar todas las secciones
    loginSection.style.display = 'none';
    recoverySection.style.display = 'none';
    idVerificationSection.style.display = 'none';
    document.getElementById('idError').style.display = 'none';
    
    // Mostrar la sección solicitada
    if (sectionToShow === 'login') {
        loginSection.style.display = 'block';
        document.querySelector('.cevam-title').textContent = "Centro Venezolano Americano de Mérida";
    } else if (sectionToShow === 'recovery') {
        recoverySection.style.display = 'block';
        document.querySelector('.cevam-title').textContent = "Recuperación de Contraseña";
    } else if (sectionToShow === 'idVerification') {
        idVerificationSection.style.display = 'block';
        document.querySelector('.cevam-title').textContent = "Verificación de Identidad";
    }
    
    // Animación de transición
    document.querySelector('.main-container').style.animation = 'slideIn 0.5s ease';
    setTimeout(() => {
        document.querySelector('.main-container').style.animation = '';
    }, 500);
}

// ===== FUNCIONES DE INICIALIZACIÓN =====

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    // Ocultar secciones no principales
    document.getElementById('recoverySection').style.display = 'none';
    document.getElementById('idVerificationSection').style.display = 'none';
    document.getElementById('idError').style.display = 'none';
    
    // Agregar efecto hover a los iconos sociales
    const socialIcons = document.querySelectorAll('.social-icons-container a');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.15)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// ===== FUNCIÓN PARA MOSTRAR/OCULTAR CONTRASEÑA =====
document.getElementById('showPassword').addEventListener('change', function(e) {
    const passwordField = document.getElementById('passwordField');
    
    if (e.target.checked) {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
});

// ===== FUNCIÓN PARA MOSTRAR SECCIÓN DE VERIFICACIÓN DE CÉDULA =====
document.getElementById('registerLink').addEventListener('click', function(e) {
    e.preventDefault();
    toggleForms('idVerification');
});

// ===== VALIDACIÓN DEL FORMULARIO DE LOGIN (CORREGIDO) =====
document.getElementById('loginForm').addEventListener('submit', function(e) {
    // Obtener los valores de los campos
    const email = this.querySelector('input[name="email"]').value;
    const password = this.querySelector('input[name="password"]').value;
    const submitButton = this.querySelector('.btn-theme');
    
    // Validación básica de campos
    if (!email || !password) {
        e.preventDefault(); // Solo prevenir si hay error
        alert('Por favor complete todos los campos');
        return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        e.preventDefault(); // Solo prevenir si hay error
        alert('Por favor ingrese una dirección de email válida');
        return;
    }
    
    // Mostrar spinner de carga
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Procesando...';
    submitButton.disabled = true;
    
    
});

// ===== FUNCIONALIDAD COMPLETA PARA RECUPERACIÓN DE CONTRASEÑA =====

// Botón para volver al login
document.getElementById('backToLogin').addEventListener('click', function() {
    toggleForms('login');
});

// Botón para volver al login desde mensaje de éxito
document.getElementById('backToLoginSuccess').addEventListener('click', function() {
    toggleForms('login');
    document.getElementById('recoverySuccess').style.display = 'none';
    document.getElementById('recoveryForm').style.display = 'block';
});

// Validación del formulario de recuperación
document.getElementById('recoveryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('recoveryEmail').value;
    const submitButton = document.getElementById('recoverySubmit');
    
    if (!email) {
        alert('Por favor ingrese su dirección de email');
        return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor ingrese una dirección de email válida');
        return;
    }
    
    // Mostrar spinner de carga
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Enviando...';
    submitButton.disabled = true;
    
    // Simular envío de instrucciones (espera 2 segundos)
    setTimeout(() => {
        // Restaurar botón
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Ocultar formulario y mostrar mensaje de éxito
        document.getElementById('recoveryForm').style.display = 'none';
        document.getElementById('recoverySuccess').style.display = 'block';
        document.getElementById('sentEmail').textContent = email;
    }, 2000);
});

// ===== VALIDACIÓN DE CÉDULA PARA REGISTRO =====

// Botón para volver al login desde verificación de cédula
document.getElementById('backToLoginFromVerification').addEventListener('click', function() {
    toggleForms('login');
});

// Validación del formulario de verificación de cédula
document.getElementById('idVerificationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const idNumber = document.getElementById('idNumber').value;
    const verifyButton = document.getElementById('verifyIdButton');
    const idError = document.getElementById('idError');
    
    // Validar que el campo no esté vacío
    if (!idNumber) {
        idError.style.display = 'block';
        return;
    }
    
    // Validar que sea un número
    if (isNaN(idNumber)) {
        idError.style.display = 'block';
        return;
    }
    
    // Validar longitud (6-10 dígitos)
    if (idNumber.length < 6 || idNumber.length > 10) {
        idError.style.display = 'block';
        return;
    }
    
    // Ocultar mensaje de error si existe
    idError.style.display = 'none';
    
    // Mostrar spinner de carga
    const originalText = verifyButton.innerHTML;
    verifyButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Verificando...';
    verifyButton.disabled = true;
    
    // Simular verificación de cédula (espera 1.5 segundos)
    setTimeout(() => {
        // Restaurar botón
        verifyButton.innerHTML = originalText;
        verifyButton.disabled = false;
        
        // Aplicar animación de éxito
        document.getElementById('idVerificationSection').classList.add('pulse-animation');
        
        // Redirigir a registro.html después de la animación
        setTimeout(() => {
            alert('Cédula validada correctamente. Redirigiendo a registro...');
            window.location.href = '/register';
        }, 600);
    }, 1500);
});