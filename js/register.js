// Registarse HTML index
let app = new App()

// Evento cuando quiero crear usuario
document.querySelector('#registrarse').addEventListener('submit', (e)=> {
    e.preventDefault()

    let datos_anteriores = document.querySelector('#anuncio p')

    //Si anuncio anterior, lo borro
    if (datos_anteriores !== null) {
        datos_anteriores.remove()
    }

    // Guardo los valores que ingresaron
    let usuario = document.querySelector('#nuevoUsuario').value
    let contrasenia = document.querySelector('#nuevaContrasenia').value

    // Dejo de mostrarlos en la UI
    document.querySelector('#nuevoUsuario').value = '' 
    document.querySelector('#nuevaContrasenia').value = '' 

    // Si el usuario tiene valores, ejecuto la función
    if (usuario.length > 0 && contrasenia.length > 0) {
    app.ingresar_usuario(usuario,contrasenia)

    // Sino, mensaje de error
    } else {
        let ingrese_datos = document.createElement('p')
        ingrese_datos.innerText = 'Ingrese los datos'
        anuncio.append(ingrese_datos)
    }
}
)