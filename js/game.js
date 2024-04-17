//Declaro vairables, preparo elementos que voy a necesitar
let usuario_activo = JSON.parse(sessionStorage.getItem('usuario_activo')) //Pongo en el html el nombre de usuario y la puntuación máxima almacenada en el storage
let $puntuacion_maxima = document.createElement('div')
$puntuacion_maxima.innerText = `High Score: ${usuario_activo.puntuacionMaxima}`
details.append($puntuacion_maxima)
let $nombre_usuario = document.createElement('h1')
$nombre_usuario.innerText = `Bienvenido, ${usuario_activo.usuario}!`
welcome.append($nombre_usuario)

// Elementos que voy a necesitar para la funcionalidad del juego
let $playBoard = document.querySelector('.play-board')
let $scoreElement = document.querySelector('.score')
let $levelEelement = document.querySelector('.level')
let $mensaje = document.querySelector('#message')
let gameOver = false
let foodX, foodY
let snakeBody = []
let snakeX = 5, snakeY = 10
let velocityX = 0, velocityY = 0 
let setInvervalId
let score = 0
let level = 0
let velocity = 1
let gameInterval
let gameSpeedDelay = 160

//Lo que pasa cuando perdemos
function handleGameOver() {  //Lo que pasa cuando perdemos
    clearInterval(setIntervalId)
    //Si la puntuación es mayor a la que está en storage, la guardo
    if (score > usuario_activo.puntuacionMaxima) {
        usuario_activo.puntuacionMaxima = score
        USERS.forEach((elm) => {
            elm.usuario == usuario_activo.usuario && (elm.puntuacionMaxima = score)
        })
        localStorage.setItem('usuarios',JSON.stringify(USERS))
        //Tambien la guardo en la session por si quiere seguir jugando, para que ya me actualice la UI
        sessionStorage.setItem('usuario_activo',JSON.stringify(usuario_activo)) 

    }

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: `Perdiste, tu puntaje fue de ${score}`,
        text: "Volver a intentarlo?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí!",
        cancelButtonText: "Salir :(",
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Preparate!",
            text: "Volverás a jugar",
            icon: "success"
          }).then(()=> {
            location.reload()
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Saliste de la sesión",
            text: "Nos vemos la próxima :)",
            icon: "success"
          }).then(()=> {
            window.location.href = "../index.html"
          });
        }
      });
    }

//Función para randomizar la posición de la food en la pantalla
function foodPosition() {
    foodX = Math.floor(Math.random() * 30) + 1 // Número random de 0 a 30 - si quiero cambiar tamaño de grid cambio el 30
    foodY = Math.floor(Math.random() * 30) + 1 // Número random de 0 a 30
}

//Función para que la snake se vaya moviendo a medida que el jugador usa las flechas
function snakeDirection(e) {
    if (e.key === 'ArrowDown') {
        if (velocityY != -1) {
            velocityX = 0 
            velocityY = 1
        }
 
    } else if (e.key === 'ArrowUp') {
        if (velocityY != 1) {
            velocityX = 0 
            velocityY = -1 
        }
        

    } else if (e.key === 'ArrowRight') {
        if (velocityX != -1) {
            velocityX = 1
            velocityY = 0 
        }
        

    } else if (e.key === 'ArrowLeft') {
        if (velocityX != 1) { 
            velocityX = -1
            velocityY = 0
        }
    //Si apreta algo que no sean las felchas, doy mensaje de error
    } else { 
        $mensaje.innerText = 'Utilice las flechas para jugar!'
    }
}

//Función ppal de todo el juego
const initGame = () => {
    //Si gameOver = true que ejecute funcion (if con operador &&)
    gameOver && handleGameOver() 
    
    //Div que hace que aparezca la food
    let juego = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`

    //Cuando la snake pasa por la food, ejecuto la función que randomiza la posición de la food y agrego posición al array del snake body
    if (snakeX === foodX && snakeY === foodY) { 
        foodPosition()
        snakeBody.push([snakeX,snakeY])
        //Tambien aumento el score en uno y actualizo el score en la UI
        score ++
        fetch('../json/data.json')
          .then((res) => res.json())
          .then((data) => {
            data.forEach((e)=>{
              if (e.score === score) {
                level = e.level
                velocity = e.velocity
                increaseSpeed(velocity)
              }
            })
          })
        clearInterval(setIntervalId)
        setIntervalId = setInterval(initGame,gameSpeedDelay)
        $scoreElement.innerHTML = `Score: ${score}`
        $levelEelement.innerHTML = `Level: ${level}`
    }

    //Le voy agregando mas longitud ATRÁS de la ppal por cada vez que pasa por la food, esto lo hago en la longitud del array que fui armando
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody [i - 1] 
    }

    //Donde arranca mi snake, en las coordenadas iniciales
    snakeBody[0] = [snakeX,snakeY]

    //Despues la voy cambiando
    snakeX += velocityX 
    snakeY += velocityY 

    
    //Si salgo de los límites tengo que perder (reiniciar)
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) { 
        gameOver = true
    }

    // Agrego divs cada vez que pasa por comida (se alarga el cuerpo de la snake)
    for (let i = 0; i < snakeBody.length; i++) { 
        //Le concateno al div anterior el div del cuerpo de la snake
        juego += `<div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>` 
        // Tengo que chequear no tocar el snakeBody con ninguna parte de mi snake, sino GAME OVER
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) { 
            gameOver = true
        }
    }
    
    // Agrego todos los divs
    $playBoard.innerHTML = juego
}

// Posición random inicial
foodPosition()

// Ejecuto el juego
setIntervalId = setInterval(initGame,gameSpeedDelay)

// Evento para detectar movimientos del jugador
document.addEventListener("keydown", snakeDirection)
// nivel()

function increaseSpeed(e) {
  gameSpeedDelay = gameSpeedDelay / e
}