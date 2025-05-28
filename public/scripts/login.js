    document.getElementById('showPassword').addEventListener('change', function(e) {
        const passwordField = document.querySelector('input[type="password"]');
        passwordField.type = e.target.checked ? 'text' : 'password';
    });

    document.getElementById('registerLink').addEventListener('click', function(e) {
        e.preventDefault();
        const container = document.querySelector('.main-container');
        const target = this.href;
        
        container.classList.add('exit-animation');
        
        setTimeout(() => {
            window.location.href = target;
        }, 600);
    });