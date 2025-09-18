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
        draggedItem = e.target.closest('.item');
        if (!draggedItem) return;

        draggedItemData = {
            type: draggedItem.dataset.type,
            name: draggedItem.dataset.name
        };

        draggedItem.classList.add('dragging');
        draggedItem.style.position = 'absolute';
        draggedItem.style.zIndex = '1000';
        
        if (e.type === 'touchstart') {
            e.preventDefault();
        }

        document.addEventListener("mousemove", dragMove);
        document.addEventListener("touchmove", dragMove);
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("touchend", dragEnd);
    }

    function dragMove(e) {
        if (!draggedItem) return;

        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches
