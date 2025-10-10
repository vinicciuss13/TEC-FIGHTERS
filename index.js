const canvas = document.querySelector('canvas') //seleciona a tag canvas do html
const c = canvas.getContext('2d') //cria um contexto 2d para desenhar no canvas

canvas.width = 1024 //define a largura e altura do canvas em pixels, é a resolução do jogo
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height) //pinta um retângulo no canvas, nesse caso o fundo do jogo

class Sprite {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
    }
    desenho(){
        c.fillStyle = 'red' //cor do retângulo
        c.fillRect(this.position.x, this.position.y, 50, 150) //desenha o retângulo na posição x e y do objeto
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

player.desenho() //chama a função desenho do objeto player para desenhar o retângulo no canvas

const enemy = new Sprite({
    position: {
    x: 400,
    y: 100
},
    velocity: {
    x: 0,
    y: 0
}})

enemy.desenho()
console.log(enemy) //mostra o objeto enemy no console do navegador, so pra ver se ta funcionando
console.log(player) //mostra o objeto player no console do navegador

function animate(){
    window.requestAnimationFrame(animate) //chama a função animar novamente, criando um loop infinito 
    console.log('AI AI AII') //mostra no console do navegador que a função animar ta sendo chamada         
}

animate() //chama a função animar pela primeira vez para iniciar o loop