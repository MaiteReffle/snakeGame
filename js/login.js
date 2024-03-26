// Loguearse, HTML login
let app = new App()

// Evento submit
document.querySelector('#iniciarSesion').addEventListener('submit', (e)=> {
    e.preventDefault()

    // Guardo los valores que ingresaron en variables
    let usuario = document.querySelector('#usuario').value
    let contrasenia = document.querySelector('#contrasenia').value

    // Dejo de mostrarlos en la UI
    document.querySelector('#usuario').value = '' 
    document.querySelector('#contrasenia').value = '' 

    // Ejecuto la función
    app.iniciar_sesion(usuario,contrasenia)

}
)