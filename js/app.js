let usuarioNuevo = true
let USERS = JSON.parse(localStorage.getItem('usuarios')) || []
const url = 'data.json'

// Crear usuarios, ingresar al sistema
class App {
    constructor() {
        this.usuarios = []
        this.usuario_actual 
    }

    usuario_existente (usuario) {
        USERS.forEach((elm) => {if (elm.usuario == usuario) {
            // Setteo a variable para saber que no es un usuario nuevo
            usuarioNuevo = false
            // Lo defino como usuario actual
            this.usuario_actual = elm

        }})
    }

    // Función para crear un nuevo usuario
    ingresar_usuario (usuario,contrasenia) {
        this.usuario_existente(usuario)

        if (usuarioNuevo) {
                this.usuarios.push(new Usuario(usuario,contrasenia))
                //Cuando crean un usuario, ya los dejo logueados como usuario actual
                this.usuario_actual = this.usuarios.find((elm)=> elm.usuario == usuario) 
        
                // Si habia algo guardado, vuelvo a guardar todo, porque sino solo se me guarda el usuario que estoy creando ahora
                if (USERS != []) {
                    USERS.forEach(elm => this.usuarios.push(new Usuario(elm.usuario,elm.contrasenia)))
                }
        
                // Guardo todo en el storage --> esto es lo que voy a querer modificar con fetch y node.js
                localStorage.setItem('usuarios',JSON.stringify(this.usuarios)) //Guardo el usuario creado en la memoria local


                //Acá guardo en el datos.json
                

                // Lo guardo en la session storage para saber cuál es el usuario actual
                sessionStorage.setItem('usuario_activo',JSON.stringify(this.usuario_actual))
                
                // Mando al juego
                location.href="./pages/juego.html"
            } else {
                // Si existe, muestro el mensaje en pantalla
                let usuario_existente = document.createElement('p')
                usuario_existente.innerText = 'El usuario ya existe, inicie sesión'
                anuncio.append(usuario_existente)
            }
    }

    // Función para iniciar sesión si ya tengo usuario
    iniciar_sesion (usuario,contrasenia) {
        let usuario_activo
        this.usuario_existente(usuario)

        // Si ya estaba mostrando un mensaje lo borro para que no se me acumulen
        let datos_anteriores = document.querySelector('#anuncio p')
        if (datos_anteriores !== null) {
            datos_anteriores.remove()
        }

        //Si el usuario no existe, muestro mensaje de error
        if (usuarioNuevo == true) { 
            let usuario_inexistente = document.createElement('p')
            usuario_inexistente.innerText = 'El usuario no existe, por favor registrese.'
            anuncio.append(usuario_inexistente)
        // Si existe, me fijo si la contraseña es correcta, si lo es, los logueo y mando al juego
        } else if (contrasenia == this.usuario_actual.contrasenia) {
                sessionStorage.setItem('usuario_activo',JSON.stringify(this.usuario_actual))
                usuario_activo = this.usuario_actual.usuario
                // Redirigo al juego
                location.href="./juego.html"
        // Si contraseña incorrecta, error!
        } else {
            let contrasenia_incorrecta = document.createElement('p')
            contrasenia_incorrecta.innerText = 'Contraseña incorrecta'
            anuncio.append(contrasenia_incorrecta)
                
        }
    }
}
