document.addEventListener('DOMContentLoaded', () => {
    const inicioSesion = document.getElementById('myForm');
    
    if (!inicioSesion) {
        console.error("No se encontró el formulario con el ID 'myForm'.");
        return;
    }

    inicioSesion.addEventListener('submit', (e) => {
        // 1. Evitar que la página se recargue automáticamente
        e.preventDefault();

        // 2. Capturar los valores de los inputs limpios de espacios
        const usuarioInput = document.getElementById('usuario').value.trim();
        const contraseñaInput = document.getElementById('contraseña').value.trim();

        // Validación de campos vacíos
        if (usuarioInput === "" || contraseñaInput === "") {
            alert("Por favor, rellene todos los campos.");
            return false;
        }

        // 3. Crear la instancia de XMLHttpRequest
        const xhr = new XMLHttpRequest();

        // 4. Configurar la petición (Método GET, Archivo login.json, Asíncrono = true)
        xhr.open('GET', './json/login.json', true);  

        // 5. Definir qué hacer cuando cambie el estado de la petición
        xhr.onreadystatechange = function () {
            // readyState 4 significa que la operación está completa
            if (xhr.readyState === 4) {
                // Status 200 significa que el archivo se ley0 con éxito
                if (xhr.status === 200) {
                    try {
                        // Convertir la respuesta de texto  a Objeto JSON o transformar el texto en un array de usuarios
                        const usuarios = JSON.parse(xhr.responseText);

                        // 6. Buscar si existe un usuario que coincida
                        const usuarioValido = usuarios.find(user => 
                            user.usuario === usuarioInput && user.contraseña === contraseñaInput
                        );

                        // 7. Evaluar el resultado
                        if (usuarioValido) {
                            // Guardar datos de sesión en LocalStorage
                            localStorage.setItem('usuarioActivo', JSON.stringify({
                                nombre: usuarioValido.nombre,
                                rol: usuarioValido.rol,
                                loginTime: new Date().getTime()
                            }));

                            alert(`¡Bienvenido al sistema, ${usuarioValido.nombre}!`);
                            
                            // Redireccionar al panel correspondiente cargado desde el JSON
                            window.location.href = usuarioValido.panel;

                        } else {
                            alert("Usuario o contraseña incorrectos. Inténtelo de nuevo.");
                            document.getElementById('contraseña').value = "";
                        }

                    } catch (error) {
                        console.error("Error al procesar el archivo JSON:", error);
                        alert("Error en el formato de los datos de autenticación.");
                    }
                } else {
                    // Si el archivo no existe o falla el servidor (ej: Error 404 o 500)
                    console.error(`Error del servidor: Código ${xhr.status}`);
                    alert("No se pudo conectar con la base de datos local (login.json).");
                }
            }
        };

        // 8. Manejar fallos de red directos
        xhr.onerror = function () {
            console.error("Error de red al intentar realizar la petición.");
            alert("Ocurrió un error de red al intentar validar tus credenciales.");
        };

        // 9. Enviar la petición
        xhr.send();
    });
});

