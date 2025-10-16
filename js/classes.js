class Sprite {
    constructor({position, imageSrc}){ //construtor da classe Sprite, que recebe um objeto com as propriedades position e velocity
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
    }

    desenho() {
        c.drawImage(this.image, 0, 0, canvas.width, canvas.height)
    }
      

    update(){
        this.desenho() //desenha o retângulo na tela
    }
}

class Fighter {
    constructor({position, velocity, color = 'red', offset}){ //construtor da classe Sprite, que recebe um objeto com as propriedades position e velocity
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey //ultima tecla pressionada
        this.attackbox = { //hitbox
            position:{
                x:this.position.x,
                y:this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color 
        this.isAttacking 
        this.health = 100
    }

    desenho(){
        c.fillStyle = this.color //cor do retângulo
        c.fillRect(this.position.x, this.position.y, this.width, this.height) //desenha o retângulo na posição x e y do objeto

        // hitbox
        if(this.isAttacking){//se o personagem estiver atacando, desenha a hitbox
        c.fillStyle= 'green'
        c.fillRect(
        this.attackbox.position.x,
         this.attackbox.position.y
         , this.attackbox.width,
          this.attackbox.height)
       }
    }

    update(){
        this.desenho() //desenha o retângulo na tela
        this.attackbox.position.x = this.position.x + this.attackbox.offset.x //atualiza a posição da hitbox com a posição do retângulo
        this.attackbox.position.y = this.position.y //atualiza a posição da hitbox com a posição do retângulo
        
        this.position.x += this.velocity.x //atualiza a posição do retângulo com base na velocidade
        this.position.y += this.velocity.y //atualiza a posição do retângulo com base na velocidade
      
        if(this.position.y + this.height + this.velocity.y >=canvas.height - 40) //impede que o retângulo caia infinitamente
        {
            this.velocity.y = 0 //para a queda
        } else this.velocity.y += gravity //aplica a gravidade
    }

    attack(){
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}