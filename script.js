document.addEventListener('DOMContentLoaded', () => {
    const items = [
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
    let draggedItemData = null;

    function newItem() {
        itemContainer.innerHTML = "";
        const random = items[Math.floor(Math.random() * items.length)];
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
        el.style.position = 'relative';
    }

    function dragStart(e) {
        // PREVIENE la selección de texto y el comportamiento de arrastre nativo
        e.preventDefault(); 
        
        draggedItem = e.target.closest('.item');
        if (!draggedItem) return;

        draggedItemData = {
            type: draggedItem.dataset.type,
            name: draggedItem.dataset.name
        };

        draggedItem.classList.add('dragging');
        draggedItem.style.position = 'absolute';
        draggedItem.style.zIndex = '1000';
        
        document.addEventListener("mousemove", dragMove);
        document.addEventListener("touchmove", dragMove);
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("touchend", dragEnd);
    }

    function dragMove(e) {
        if (!draggedItem) return;

        // PREVIENE la selección de texto mientras se mueve el mouse
        e.preventDefault();

        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        draggedItem.style.left = `${clientX - draggedItem.offsetWidth / 2}px`;
        draggedItem.style.top = `${clientY - draggedItem.offsetHeight / 2}px`;
    }

    function dragEnd(e) {
        if (!draggedItem) return;

        const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
        const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);

        const droppedBin = getDroppedBin(clientX, clientY);

        if (droppedBin) {
            checkRecycling(droppedBin);
        } else {
            message.textContent = `❌ Incorrecto. Vuelve a intentar con otro contenedor.`;
            message.style.color = "red";
            resetItemPosition();
        }

        draggedItem.classList.remove('dragging');
        draggedItem.style.zIndex = 'auto';
        draggedItem = null;

        // Elimina los event listeners para evitar problemas
        document.removeEventListener("mousemove", dragMove);
        document.removeEventListener("touchmove", dragMove);
        document.removeEventListener("mouseup", dragEnd);
        document.removeEventListener("touchend", dragEnd);
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
        if (draggedItemData.type === bin.dataset.type) {
            score += 10;
            scoreEl.textContent = "Puntos: " + score;
            message.textContent = `✅ ¡Correcto! ${draggedItemData.name} va en ${bin.querySelector("span").textContent}.`;
            message.style.color = "green";
            resetItemPosition();
            updateLevel();
            setTimeout(newItem, 500); 
        } else {
            message.textContent = `❌ Incorrecto. ${draggedItemData.name} no va en ${bin.querySelector("span").textContent}.`;
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
