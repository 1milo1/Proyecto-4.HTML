// Registro de usuario
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        alert('Registro exitoso');
    } else {
        alert('Error en el registro');
    }
});

// Inicio de sesión
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    if (response.ok) {
        localStorage.setItem('token', result.token);  // Guarda el token en localStorage
        alert('Inicio de sesión exitoso');
    } else {
        alert(result.message || 'Error en el inicio de sesión');
    }
});