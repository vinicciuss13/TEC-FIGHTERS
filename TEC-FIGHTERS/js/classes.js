// classes.js - versão com suporte a múltiplas animações e auto-detect frames
class Sprite {
    constructor({ position = { x: 0, y: 0 }, imageSrc = '', scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.scale = scale
        this.offset = offset || { x: 0, y: 0 }

        this.image = new Image()
        this.imageSrc = imageSrc || ''
        this.imageLoaded = false

        // frames
        this.framesMax = framesMax || 1
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 6

        this.isBackground = typeof this.imageSrc === 'string' && this.imageSrc.includes('fundo_rua')

        if (this.imageSrc) {
            this.image.onload = () => {
                this.imageLoaded = true
                // se framesMax for "auto" ou inválido, tenta estimar
                if (!this.framesMax || this.framesMax === 'auto') {
                    const est = Math.round(this.image.width / (this.image.height || 1))
                    this.framesMax = est >= 1 ? est : 1
                }
            }
            this.image.onerror = () => {
                console.warn('Erro ao carregar imagem:', this.imageSrc)
            }
            this.image.src = this.imageSrc
        }
    }

    desenho() {
        // fundo:
        if (this.isBackground) {
            if (!this.imageLoaded) return
            c.drawImage(this.image, 0, 0, canvas.width, canvas.height)
            return
        }

        if (!this.imageLoaded) return

        const frameWidth = this.image.width / Math.max(1, this.framesMax)

        c.drawImage(
            this.image,
            this.framesCurrent * frameWidth,
            0,
            frameWidth,
            this.image.height,
            this.position.x - (this.offset.x || 0),
            this.position.y - (this.offset.y || 0),
            frameWidth * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames() {
        if (!this.imageLoaded) return
        if (!this.framesMax || this.framesMax <= 1) return
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) this.framesCurrent++
            else this.framesCurrent = 0
        }
    }

    update() {
        this.desenho()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({ position = { x: 0, y: 0 }, velocity = { x: 0, y: 0 }, color = 'red', imageSrc = '', scale = 1, framesMax = 1, offset = { x: 0, y: 0 }, sprites = {} }) {
        super({ position, imageSrc, scale, framesMax, offset })

        this.velocity = velocity
        this.color = color
        this.isAttacking = false
        this.health = 100

        // Inicializa attackbox para evitar erros em utilidades.js
        // attackbox.offset irá receber o `offset` passado ao construtor (ou fallback)
        this.attackbox = {
            position: { x: this.position.x, y: this.position.y },
            offset: offset || { x: 0, y: 0 },
            width: 100,
            height: 50
        }

        // animações extras: { idle: { imageSrc, framesMax, framesHold }, run: {...}, attack: {...} }
        this.sprites = sprites || {}
        this.currentAnimation = null

        // pré-carrega imagens de sprites
        for (const key in this.sprites) {
            const s = this.sprites[key]
            if (s && s.imageSrc) {
                s.image = new Image()
                s.image.onload = () => {
                    // se framesMax for 'auto' tenta estimar
                    if (!s.framesMax || s.framesMax === 'auto') {
                        const est = Math.round(s.image.width / (s.image.height || 1))
                        s.framesMax = est >= 1 ? est : 1
                    }
                }
                s.image.onerror = () => console.warn('Erro ao carregar sprite:', s.imageSrc)
                s.image.src = s.imageSrc
            }
        }

        // inicia com "idle" se existir ou com imageSrc padrão
        if (this.sprites.idle && this.sprites.idle.imageSrc) {
            this.setAnimation('idle')
        } else if (imageSrc) {
            // já foi configurado pelo super()
            this.currentAnimation = 'base'
        }
    }

    setAnimation(name) {
        // evita resetar se já estiver na mesma animação
        if (this.currentAnimation === name) return
        const s = this.sprites[name]
        if (!s) {
            console.warn('Animação não encontrada:', name)
            return
        }
        // troca image e parâmetros
        if (s.image && s.image.complete) {
            this.image = s.image
            this.imageSrc = s.imageSrc
            this.imageLoaded = true
        } else {
            this.image = new Image()
            this.image.onload = () => { this.imageLoaded = true }
            this.image.onerror = () => console.warn('Erro ao carregar imagem de animação:', s.imageSrc)
            this.image.src = s.imageSrc
        }
        this.framesMax = s.framesMax || 1
        this.framesHold = typeof s.framesHold === 'number' ? s.framesHold : 6
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.currentAnimation = name
    }

    update() {
        this.desenho()
        this.animateFrames()
        if (this.attackbox && this.attackbox.offset) {
            this.attackbox.position.x = this.position.x + (this.attackbox.offset.x || 0)
            this.attackbox.position.y = this.position.y
        }
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // usa window.GROUND_OFFSET (padrão 40) para permitir configuração da altura do "chão" / hitbox
        const groundOffset = (typeof window.GROUND_OFFSET === 'number') ? window.GROUND_OFFSET : 40

        if (this.position.y + this.height + (this.velocity.y || 0) >= canvas.height - groundOffset) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }
    }

    attack() {
        this.isAttacking = true
        // quando atacar, troca pra animação "attack" se existir
        if (this.sprites.attack) this.setAnimation('attack')
        setTimeout(() => {
            this.isAttacking = false
            // volta para idle (ou run) depois do ataque
            if (this.velocity.x !== 0 && this.sprites.run) this.setAnimation('run')
            else if (this.sprites.idle) this.setAnimation('idle')
        }, 300)
    }
}
