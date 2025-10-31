class Sprite {
    constructor({position, imageSrc, scale= 1, framesMax = 1, offset = {x: 0 , y: 0}}){ //construtor da classe Sprite, que recebe um objeto com as propriedades position e velocity
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }

    desenho() {
        // Se for fundo (framesMax == 1), desenhe a imagem ocupando todo o canvas
        if (this.image.src.includes('fundo_rua.png')) {
            c.drawImage(
                this.image,
                0,
                0,
                canvas.width,
                canvas.height
            )
        } else {
            // Sprite animado (personagem)
            c.drawImage(
                this.image,
                this.framesCurrent * (this.image.width / this.framesMax),
                0,
                this.image.width / this.framesMax,
                this.image.height,
                this.position.x - this.offset.x,
                this.position.y - this.offset.y, 
                (this.image.width / this.framesMax) * this.scale,
                this.image.height * this.scale
            )
        }
    }
      
    animateFrames(){
        this.framesElapsed++

        if(this.framesElapsed % this.framesHold === 0){
            if(this.framesCurrent < this.framesMax -1){
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
}

    update(){
        this.desenho() //desenha o retângulo na tela
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = {x:0, y:0},
        sprites
    }) { //construtor da classe Fighter, que recebe um objeto com as propriedades position e velocity
        super({
            position,
            imageSrc, 
            scale,
            framesMax,
            offset
            
        })

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
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites

        for (const sprite in this.sprites){
            sprite[sprites].image = new Image()
            sprite[sprites].image.src = sprite[sprites].imageSrc
    }
        console.log(this.sprites)
}
    update(){
        this.desenho() //desenha o retângulo na tela
        this.animateFrames()
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