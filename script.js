document.addEventListener('DOMContentLoaded', () => {

    // --- CÓDIGO DEL JUEGO ---
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
    let draggedItemData = null;

    function newItem() {
        itemContainer.innerHTML = "";
        const random = itemsData[Math.floor(Math.random() * itemsData.length)];
        const el = document.createElement("div");
        el.classList.add("item");
        el.dataset.type = random.type;
        el.dataset.name = random.name;
        el.dataset.emoji = random.emoji;
        el.draggable = true; // Permite el arrastre nativo en escritorio

        const emoji = document.createElement("div");
        emoji.textContent = random.emoji;
        const label = document.createElement("span");
        label.textContent = random.name;

        el.appendChild(emoji);
        el.appendChild(label);
        itemContainer.appendChild(el);

        el.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("type", e.target.dataset.type);
            draggedItemData = {
                type: e.target.dataset.type,
                name: e.target.dataset.name
            };
            e.dataTransfer.setDragImage(el, 0, 0); // Oculta la imagen fantasma

            // Manejo de touch para móvil
            el.addEventListener("touchstart", (e) => {
                e.preventDefault();
                draggedItemData = {
                    type: e.target.closest('.item').dataset.type,
                    name: e.target.closest('.item').dataset.name
                };
                draggedItem = e.target.closest('.item');
                draggedItem.style.position = 'absolute';
                draggedItem.style.zIndex = '1000';
                draggedItem.classList.add('dragging');
                document.addEventListener('touchmove', dragMove);
                document.addEventListener('touchend', dragEndTouch);
            });
        });

        // Eventos para arrastre y soltado en escritorio
        bins.forEach(bin => {
            bin.addEventListener("dragover", e => e.preventDefault());
            bin.addEventListener("drop", (e) => {
                const type = e.dataTransfer.getData("type");
                if (type === bin.dataset.type) {
                    checkRecycling({
                        bin,
                        type,
                        name: itemsData.find(item => item.type === type).name
                    });
                } else {
                    message.textContent = `❌ Incorrecto.`;
                    message.style.color = "red";
                }
                newItem();
            });
        });
    }

    function checkRecycling({ bin, type, name }) {
        score += 10;
        scoreEl.textContent = "Puntos: " + score;
        message.textContent = `✅ ¡Correcto! ${name} va en ${bin.querySelector("span").textContent}.`;
        message.style.color = "green";
        updateLevel();
    }

    // Funciones para arrastre en móvil
    function dragMove(e) {
        if (!draggedItem) return;
        const touch = e.touches[0];
        draggedItem.style.left = `${touch.clientX - draggedItem.offsetWidth / 2}px`;
        draggedItem.style.top = `${touch.clientY - draggedItem.offsetHeight / 2}px`;
    }

    function dragEndTouch(e) {
        if (!draggedItem) return;
        const touch = e.changedTouches[0];
        const droppedBin = getDroppedBin(touch.clientX, touch.clientY);
        
        if (droppedBin && draggedItemData.type === droppedBin.dataset.type) {
            score += 10;
            scoreEl.textContent = "Puntos: " + score;
            message.textContent = `✅ ¡Correcto! ${draggedItemData.name} va en ${droppedBin.querySelector("span").textContent}.`;
            message.style.color = "green";
            updateLevel();
            newItem();
        } else {
            message.textContent = `❌ Incorrecto.`;
            message.style.color = "red";
            resetItemPosition();
        }
        
        draggedItem.classList.remove('dragging');
        draggedItem.style.position = 'relative';
        draggedItem.style.top = '0';
        draggedItem.style.left = '0';
        draggedItem = null;
        document.removeEventListener('touchmove', dragMove);
        document.removeEventListener('touchend', dragEndTouch);
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
    
    // ... (otras funciones como updateLevel, restartBtn)
    
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
