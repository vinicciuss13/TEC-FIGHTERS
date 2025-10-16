function rectangularCollision({rectangle1, rectangle2}){ //função que verifica se dois retângulos estão colidindo
    return(
        rectangle1.attackbox.position.x + rectangle1.attackbox.width >=rectangle2.position.x && 
        rectangle1.attackbox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackbox.position.y + rectangle1.attackbox.height >= rectangle2.position.y &&
        rectangle1.attackbox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({player, enemy, timerID}){
    clearTimeout(timerID) //cancela o timer
    document.querySelector('#displayText').style.display = 'flex' //exibe o texto de vitória
    if (player.health === enemy.health){ 
        document.querySelector('#displayText').innerHTML = 'Empate'
    }  else if (player.health > enemy.health){
        document.querySelector('#displayText').innerHTML = 'Jogador 1 Venceu'
    } else if (enemy.health > player.health){
        document.querySelector('#displayText').innerHTML = 'Jogador 2 Venceu'
    } 
}

let timer = 60
let timerID
function decreaseTimer(){
    if(timer > 0){
        timerID = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if (timer === 0){
        document.querySelector('#displayText').style.display = 'flex'
        determineWinner({player, enemy, timerID})
    } 
}   