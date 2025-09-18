document.addEventListener('DOMContentLoaded', () => {
    // Evita selección de texto
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

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
    // Añadir estilo necesario al contenedor para que los items aparezcan bien
    itemContainer.style.position = 'relative';
    itemContainer.style.height = '150px';  // tamaño visible para los items
    itemContainer.style.border = '1px solid #ccc'; // opcional, para ver el contenedor

    const bins = document.querySelectorAll(".bin");
    const message = document.getElementById("message");
    const scoreEl = document.getElementById("score");
    const levelEl = document.getElementById("level");
    const restartBtn = document.getElementById("restart");

    let score = 0;
    let level = 1;
    let draggedItem = null;
    let draggedItemData = null;
    let offsetX = 0;
    let offsetY = 0;

    function newItem() {
        itemContainer.innerHTML = "";

        const random = itemsData[Math.floor(Math.random() * itemsData.length)];
        const el = document.createElement("div");
        el.classList.add("item");
        el.dataset.type = random.type;
        el.dataset.name = random.name;
        el.dataset.emoji = random.emoji;

        el.innerHTML = `
            <div style="font-size: 32px;">${random.emoji}</div>
            <span>${random.name}</span>
        `;

        el.style.position = 'absolute';
        // Ajustar posición para que quede centrado en el contenedor
        el.style.left = `calc(50% - 50px)`;  // Asumiendo ancho aprox 100px
        el.style.top = '20px';
        el.style.cursor = 'grab';
        el.style.zIndex = '1';
        el.style.width = '100px';  // tamaño fijo para facilitar posicionamiento
        el.style.textAlign = 'center';
        el.style.backgroundColor = '#f0f0f0';
        el.style.borderRadius = '8px';
        el.style.padding = '5px';
        el.style.userSelect = 'none';

        itemContainer.appendChild(el);

        el.addEventListener('mousedown', dragStart);
        el.addEventListener('touchstart', dragStart, { passive: false });
    }

    function dragStart(e) {
        e.preventDefault();
        draggedItem = e.target.closest(".item");
        if (!draggedItem) return;

        const rect = draggedItem.getBoundingClientRect();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        offsetX = clientX - rect.left;
        offsetY = clientY - rect.top;

        draggedItem.style.zIndex = '1000';
        draggedItem.style.cursor = 'grabbing';

        draggedItemData = {
            type: draggedItem.dataset.type,
            name: draggedItem.dataset.name
        };

        document.addEventListener("mousemove", dragMove);
        document.addEventListener("touchmove", dragMove, { passive: false });
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("touchend", dragEnd);
    }

    function dragMove(e) {
        if (!draggedItem) return;
        e.preventDefault();

        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        // Limitar para que no se salga del contenedor padre (opcional)
        const containerRect = itemContainer.getBoundingClientRect();
        let newLeft = clientX - offsetX;
        let newTop = clientY - offsetY;

        // Opcional: limitar dentro de la ventana
        if(newLeft < 0) newLeft = 0;
        if(newTop < 0) newTop = 0;

        draggedItem.style.left = `${newLeft}px`;
        draggedItem.style.top = `${newTop}px`;
        draggedItem.style.transform = 'none';
    }

    function dragEnd(e) {
        if (!draggedItem) return;

        const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
        const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);

        const droppedBin = getDroppedBin(clientX, clientY);

        if (droppedBin) {
            checkRecycling(droppedBin);
        } else {
            message.textContent = `❌ Vuelve a intentarlo.`;
            message.style.color = "red";
            resetItemPosition();
            setTimeout(newItem, 600);
        }

        draggedItem.style.zIndex = '1';
        draggedItem.style.cursor = 'grab';
        draggedItem = null;

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
            updateLevel();
        } else {
            message.textContent = `❌ Incorrecto. ${draggedItemData.name} no va en ${bin.querySelector("span").textContent}.`;
            message.style.color = "red";
        }

        setTimeout(newItem, 600);
    }

    function resetItemPosition() {
        if (draggedItem) {
            draggedItem.style.left = `calc(50% - 50px)`;
            draggedItem.style.top = '20px';
            draggedItem.style.transform = 'none';
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
