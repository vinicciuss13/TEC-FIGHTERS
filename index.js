const canvas = document.querySelector('canvas') //seleciona a tag canvas do html
const c = canvas.getContext('2d') //cria um contexto 2d para desenhar no canvas

canvas.width = 1024 //define a largura e altura do canvas em pixels, é a resolução do jogo
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height) //pinta um retângulo no canvas, nesse caso o fundo do jogo

const gravity = 0.7 //gravidade do jogo 
const background = new Sprite({
    position: {
        x:0,
        y:0
    },
    imageSrc: './img/fundo_rua.png'
})

const player = new Fighter({ //cria um novo objeto da classe Sprite
    position: { //posição inicial do retângulo
    x: 0,
    y: 0
 },
    velocity: { //velocidade inicial do retângulo
    x: 0,
    y: 0
 },
    offset: { 
        x:0,
        y:0
    }
})

const enemy = new Fighter({ //cria um novo objeto da classe Sprite
    position: { //posição inicial do retângulo
    x: 400,
    y: 100
},
    velocity: { //velocidade inicial do retângulo
    x: 0,
    y: 0,
},
    color: 'blue',
    offset: { 
        x: -50,
        y:0
    }
})

console.log(player) // imprime o objeto player e enemy no console
console.log(enemy)    

const keys = {
    a: {
        pressed: false //indica se a tecla 'a' está pressionada ou não
    },
    d: {
        pressed: false //indica se a tecla 'd' está pressionada ou não
    },
    w: {
        pressed: false //indica se a tecla 'w' está pressionada ou não
    },
    ArrowRight: {
        pressed: false //indica se a tecla 'ArrowRight' está pressionada ou não
    },
    ArrowLeft: {
        pressed: false //indica se a tecla 'ArrowLeft' está pressionada ou não
    },
    ArrowUp: {
        pressed: false //indica se a tecla 'ArrowUp' está pressionada ou não
    }
}


decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate) //chama a função animar novamente, criando um loop infinito 
    c.fillStyle = 'black' //cor do fundo do jogo
    c.fillRect(0,0, canvas.width, canvas.height) //pinta o fundo do jogo
    
    background.update() //desenha o fundo do jogo
    player.update() //atualiza a posição do jogador
    enemy.update() //atualiza a posição do inimigo

    player.velocity.x = 0 //zera a velocidade horizontal do jogador
    enemy.velocity.x = 0 //zera a velocidade horizontal do inimigo     

    //MOVIMENTAÇÃO DO JOGADOR

    if(keys.a.pressed && player.lastKey === 'a'){ //se a tecla 'a' estiver pressionada e for a última tecla pressionada
        player.velocity.x = -5 //move o jogador para a esquerda
    } else if (keys.d.pressed && player.lastKey ==='d'){ //mesma lógica para a tecla 'd'
        player.velocity.x = 5
    }
    
    //MOVIMENTAÇÃO DO INIMIGO

    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){ //se a tecla 'ArrowLeft' estiver pressionada e for a última tecla pressionada
        enemy.velocity.x = -5 //move o inimigo para a esquerda
    } else if (keys.ArrowRight.pressed && enemy.lastKey ==='ArrowRight'){ //mesma lógica para a tecla 'ArrowRight'
        enemy.velocity.x = 5
    }

    //Colisão com o inimigo
    if( 
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking) //verifica se a caixa de ataque do jogador colidiu com o inimigo
    {
        player.isAttacking = false //reseta o estado de ataque do jogador
        enemy.health -= 10 
            document.querySelector('#enemyHealth').style.width = enemy.health + "%" //diminui a barra de vida do inimigo
        console.log('player bateu') 
    }
    //Colisão com o jogador
    if( 
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        enemy.isAttacking) //verifica se a caixa de ataque do jogador colidiu com o inimigo
    {
        enemy.isAttacking = false //reseta o estado de ataque do jogador
        player.health -= 10
            document.querySelector('#playerHealth').style.width = player.health + "%" //diminui a barra de vida do jogador
        console.log('inimigo bateu') 
    }

    //condição de vitória por vida
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerID}) // Corrija aqui!
 }
}

animate() //chama a função animar pela primeira vez para iniciar o loop

window.addEventListener('keydown', (event) => { //adiciona um listener para o evento de tecla pressionada
    console.log(event.key) //imprime a tecla pressionada no console
    switch(event.key){ //verifica qual tecla foi pressionada
        case 'd':
            keys.d.pressed = true //se a tecla 'd' foi pressionada, define a propriedade pressed como verdadeiro
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true //mesma lógica para a tecla 'a'
            player.lastKey = 'a'
            break
        case 'w':
            keys.w.pressed = true //o w fará o personagem pular
            player.velocity.y = -20 //define a velocidade vertical do jogador para cima
            break
        case ' ':
            player.attack() 
            break    

        //MOVIMENTAÇÃO DO INIMIGO

        case 'ArrowRight':
            keys.ArrowRight.pressed = true //se a tecla 'ArrowRight' foi pressionada, define a propriedade pressed como verdadeiro
            enemy.lastKey = 'ArrowRight' //isso é pra movimentação do inimgo não substitui a do player
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true //mesma lógica para a tecla 'ArrowRight'
            enemy.lastKey = 'ArrowLeft' //isso é pra movimentação do inimgo não substitui a do player
            break
        case 'ArrowUp':
            enemy.velocity.y = -20 //define a velocidade vertical do inimigo para cima
            break
        case 'ArrowDown':
            enemy.isAttacking = true
            break    
}
        console.log(event.key) //imprime a tecla pressionada no console
})

window.addEventListener('keyup', (event) => { //adiciona um listener para o evento de tecla solta
    switch(event.key){
        case 'd':
            keys.d.pressed = false //se a tecla 'd' foi solta, define a propriedade pressed como false
            break
        case 'a':
            keys.a.pressed = false //mesma lógica para a tecla 'a'
            break
        case 'w':
            keys.w.pressed = false //mesma lógica para a tecla 'w'   
            break 

        //MOVIMENTAÇÃO DO INIMIGO

        case 'ArrowRight':
            keys.ArrowRight.pressed = false //se a tecla 'ArrowRight' foi solta, define a propriedade pressed como false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false //mesma lógica para a tecla 'ArrowLeft'
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false //mesma lógica para a tecla 'ArrowUp'   
            break    
}
        console.log(event.key) //imprime a tecla solta no console
})