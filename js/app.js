// Crear usuarios, ingresar al sistema
class App {
    constructor() {
        this.usuarios = []
        this.usuario_actual 
    }

    // Función para crear un nuevo usuario
    ingresar_usuario (usuario,contrasenia) {
        let usuarioNuevo = true
        // Me busco los anteriores del storage para no sobreescribirlos
        let usuariosAnteriores = JSON.parse(localStorage.getItem('usuarios')) 
        // Si hay algo guardado, me fijo si el usuario que están intentando crear ya existe
        if (usuariosAnteriores !== null) {
            usuariosAnteriores.forEach((elm) => {if (elm.usuario == usuario) {
                // Si existe, muestro el mensaje en pantalla
                let usuario_existente = document.createElement('p')
                usuario_existente.innerText = 'El usuario ya existe, inicie sesión'
                anuncio.append(usuario_existente)
                // Setteo a false para que no se cree el usuario
                usuarioNuevo = false
            }})
            
        }
        if (usuarioNuevo) {
                this.usuarios.push(new Usuario(usuario,contrasenia))
                //Cuando crean un usuario, ya los dejo logueados como usuario actual
                this.usuario_actual = this.usuarios.find((elm)=> elm.usuario == usuario) 
        
                // Si habia algo guardado, vuelvo a guardar todo, porque sino solo se me guarda el usuario que estoy creando ahora
                if (usuariosAnteriores !== null) {
                    usuariosAnteriores.forEach(elm => this.usuarios.push(new Usuario(elm.usuario,elm.contrasenia)))
                }
        
                // Guardo todo en el storage
                localStorage.setItem('usuarios',JSON.stringify(this.usuarios)) //Guardo el usuario creado en la memoria local
                sessionStorage.setItem('usuario_activo',JSON.stringify(this.usuario_actual)) //acá tendría que redirigirlo a la página del juego
                
                // Mando al juego
                location.href="./pages/juego.html"
            }
    }

    // Función para iniciar sesión si ya tengo usuario
    iniciar_sesion (usuario,contrasenia) {
        // Me busco los usuarios del storage
        let usuarios = JSON.parse(localStorage.getItem('usuarios'))
        let usuario_activo

        // Me fijo si cual es el usuario que se está intentando loguear
        usuarios.forEach(elm => {
        if (elm.usuario == usuario) {
            this.usuario_actual = elm
        }
        });

        // Si ya estaba mostrando un mensaje lo borro para que no se me acumulen
        let datos_anteriores = document.querySelector('#anuncio p')
        if (datos_anteriores !== null) {
            datos_anteriores.remove()
        }

        //Si el usuario no existe, muestro mensaje de error
        if (this.usuario_actual == undefined) { 
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
    