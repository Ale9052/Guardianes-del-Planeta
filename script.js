document.addEventListener('DOMContentLoaded', () => {
    const itemsData = [
        { emoji: "🗞️", type: "paper", name: "Periódico" },
        { emoji: "📦", type: "paper", name: "Caja" },
        { emoji: "📒", type: "paper", name: "Cuaderno" },
        { emoji: "🥤", type: "plastic", name: "Vaso de plástico" },
        { emoji: "🧸", type: "plastic", name: "Juguete de plástico" },
        { emoji: "🚿", type: "plastic", name: "Botella de champú" },
        { emoji: "🍎", type: "organic", name: "Manzana podrida" },
        { emoji: "🍂", type: "organic", name: "Hojas secas" },
        { emoji: "🍄", type: "organic", name: "Setas" },
        { emoji: "🍾", type: "glass", name: "Botella de vidrio" },
        { emoji: "💡", type: "glass", name: "Foco" },
        { emoji: "🖼️", type: "glass", name: "Marco con vidrio" },
        { emoji: "⚙️", type: "inorganic", name: "Engranaje" },
        { emoji: "🔋", type: "inorganic", name: "Pila usada" },
        { emoji: "🔩", type: "inorganic", name: "Tornillo" },
        { emoji: "🗝️", type: "inorganic", name: "Llave antigua" }
    ];

    const itemContainer = document.getElementById("items");
    const bins = document.querySelectorAll(".bin");
    const message = document.getElementById("message");
    const scoreEl = document.getElementById("score");
    const levelEl = document.getElementById("level");
    const restartBtn = document.getElementById("restart");

    let score = 0;
    let level = 1;
    let draggedItem = null; 

    function newItem() {
        itemContainer.innerHTML = "";
        const random = itemsData[Math.floor(Math.random() * itemsData.length)];
        const el = document.createElement("div");
        el.classList.add("item");
        el.dataset.type = random.type;
        el.dataset.name = random.name;
        el.dataset.emoji = random.emoji;

        const emoji = document.createElement("div");
        emoji.textContent = random.emoji;
        const label = document.createElement("span");
        label.textContent = random.name;

        el.appendChild(emoji);
        el.appendChild(label);
        itemContainer.appendChild(el);

        el.addEventListener("mousedown", dragStart);
        el.addEventListener("touchstart", dragStart);
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("touchend", dragEnd);
        document.addEventListener("mousemove", dragMove);
        document.addEventListener("touchmove", dragMove);

        el.style.position = 'relative';
    }

    function dragStart(e) {
        draggedItem = e.target.closest('.item');
        if (!draggedItem) return;

        draggedItem.classList.add('dragging');
        draggedItem.style.position = 'absolute';
        draggedItem.style.zIndex = '1000'; // Asegura que esté en la capa superior
        
        if (e.type === 'touchstart') {
            e.preventDefault();
        }
    }

    function dragMove(e) {
        if (!draggedItem) return;

        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        draggedItem.style.left = `${clientX - draggedItem.offsetWidth / 2}px`;
        draggedItem.style.top = `${clientY - draggedItem.offsetHeight / 2}px`;
    }

    function dragEnd(e) {
        if (!draggedItem) return;

        const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
        const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);

        const bin = getDroppedBin(clientX, clientY);

        if (bin) {
            checkRecycling(bin);
        } else {
            message.textContent = `❌ Incorrecto. Vuelve a intentar con otro contenedor.`;
            message.style.color = "red";
            resetItemPosition();
        }

        draggedItem.classList.remove('dragging');
        draggedItem.style.zIndex = 'auto'; // Restablece el z-index
        draggedItem = null;
    }

    function getDroppedBin(x, y) {
        let droppedBin = null;
        bins.forEach(bin => {
            const rect = bin.getBoundingClientRect();
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                droppedBin = bin;
            }
        });
        return droppedBin;
    }

    function checkRecycling(bin) {
        if (draggedItem.dataset.type === bin.dataset.type) {
            score += 10;
            scoreEl.textContent = "Puntos: " + score;
            message.textContent = `✅ ¡Correcto! ${draggedItem.dataset.name} va en ${bin.querySelector("span").textContent}.`;
            message.style.color = "green";
            resetItemPosition();
            updateLevel();
            setTimeout(newItem, 500); 
        } else {
            message.textContent = `❌ Incorrecto. ${draggedItem.dataset.name} no va en ${bin.querySelector("span").textContent}.`;
            message.style.color = "red";
            resetItemPosition();
        }
    }

    function resetItemPosition() {
        if (draggedItem) {
            draggedItem.style.position = 'relative';
            draggedItem.style.top = '0';
            draggedItem.style.left = '0';
        }
    }

    function updateLevel() {
        let newLevel = Math.floor(score / 50) + 1;
        if (newLevel !== level) {
            level = newLevel;
            levelEl.textContent = "Nivel: " + level;
            message.textContent = `🎉 ¡Subiste al nivel ${level}!`;
            message.style.color = "blue";
        }
    }

    restartBtn.addEventListener("click", () => {
        score = 0;
        level = 1;
        scoreEl.textContent = "Puntos: " + score;
        levelEl.textContent = "Nivel: " + level;
        message.textContent = "";
        newItem();
    });

    newItem();
});
