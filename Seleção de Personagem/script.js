    const chars = document.querySelectorAll('.char');
    const imgP1 = document.getElementById('imgP1');
    const imgP2 = document.getElementById('imgP2');
    const nameP1 = document.getElementById('nameP1');
    const nameP2 = document.getElementById('nameP2');
    const confirmP1 = document.getElementById('confirmP1');
    const confirmP2 = document.getElementById('confirmP2');
    const instruction = document.getElementById('instruction');
    const footer = document.getElementById('footer');

    let selectedP1 = null;
    let selectedP2 = null;
    let p1Confirmed = false;
    let p2Confirmed = false;

    chars.forEach(char => {
      char.addEventListener('click', () => {
        const imgSrc = char.querySelector('img').src;
        const imgAlt = char.querySelector('img').alt;

        if (!p1Confirmed && !p2Confirmed) {
          // PLAYER 1 escolhendo
          if (selectedP1) selectedP1.classList.remove('selected-1p');
          char.classList.add('selected-1p');
          imgP1.src = imgSrc;
          imgP1.alt = imgAlt;
          nameP1.textContent = imgAlt;
          selectedP1 = char;
          confirmP1.disabled = false;
          instruction.textContent = "Clique em Confirmar o PLAYER 1";
        } 
        else if (p1Confirmed && !p2Confirmed) {
          // PLAYER 2 escolhendo
          if (selectedP2) selectedP2.classList.remove('selected-2p');
          char.classList.add('selected-2p');
          imgP2.src = imgSrc;
          imgP2.alt = imgAlt;
          nameP2.textContent = imgAlt;
          selectedP2 = char;
          confirmP2.disabled = false;
          instruction.textContent = "Clique em Confirmar o PLAYER 2";
        }
      });
    });

    confirmP1.addEventListener('click', () => {
      if (selectedP1) {
        p1Confirmed = true;
        selectedP1.classList.add('confirmed');
        confirmP1.disabled = true;
        instruction.textContent = "PLAYER 1 confirmado! Agora escolha o personagem do PLAYER 2.";
      }
    });

    confirmP2.addEventListener('click', () => {
      if (selectedP2 && p1Confirmed) {
        p2Confirmed = true;
        selectedP2.classList.add('confirmed');
        confirmP2.disabled = true;
        instruction.textContent = "Ambos confirmaram! Lutadores prontos!";
        footer.textContent = `🔥 ${nameP1.textContent.toUpperCase()} VS ${nameP2.textContent.toUpperCase()} 🔥`;
      }
    });