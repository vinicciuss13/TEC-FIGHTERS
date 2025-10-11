const canvas = document.querySelector('canvas') //seleciona a tag canvas do html
const c = canvas.getContext('2d') //cria um contexto 2d para desenhar no canvas

canvas.width = 1024 //define a largura e altura do canvas em pixels, é a resolução do jogo
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height) //pinta um retângulo no canvas, nesse caso o fundo do jogo

const gravity = 0.2 

class Sprite {
    constructor({position, velocity, color = 'red'}){
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.lastKey
        this.attackbox = {
            position: this.position,
            width: 100,
            height: 50
        }
        this.color = color
    }
    desenho(){
        c.fillStyle = this.color //cor do retângulo
        c.fillRect(this.position.x, this.position.y, 50, this.height) //desenha o retângulo na posição x e y do objeto

        // attack box
        c.fillStyle= 'green'
        c.fillRect(this.attackbox.position.x, this.attackbox.position.y, this.attackbox.width, this.attackbox.height)
    }

    update(){
        this.desenho()
         
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
      
        if(this.position.y + this.height + this.velocity.y >=canvas.height)
        {
            this.velocity.y = 0
        } else this.velocity.y += gravity
    }
}

const player = new Sprite({
    position: {
    x: 0,
    y: 0
},
    velocity: {
    x: 0,
    y: 0
}})



const enemy = new Sprite({
    position: {
    x: 400,
    y: 100
},
    velocity: {
    x: 0,
    y: 0,
},
    color: 'blue'
})

console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    }
}
let lastKey

function animate(){
    window.requestAnimationFrame(animate) //chama a função animar novamente, criando um loop infinito 
    c.fillStyle = 'black'
    c.fillRect(0,0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0

    if(keys.a.pressed && lastKey === 'a'){
        player.velocity.x = -2
    } else if (keys.d.pressed && lastKey ==='d'){
        player.velocity.x = 2
    }

    //Colisão com o inimigo
    if(player.attackbox.position.x + player.attackbox.width >= enemy.position.x)
    {
        console.log(go);
    }
}

animate() //chama a função animar pela primeira vez para iniciar o loop

window.addEventListener('keydown', (event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = true 
            lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
}
        console.log(event.key)
})

window.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
}
        console.log(event.key)
})