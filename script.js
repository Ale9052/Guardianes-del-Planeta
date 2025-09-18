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
    let currentItem = null;

    function newItem() {
        itemContainer.innerHTML = "";
        const random = items[Math.floor(Math.random() * items.length)];
        const el = document.createElement("div");
        el.classList.add("item");
        el.dataset.type = random.type;
        el.dataset.name = random.name;
        el.dataset.emoji = random.emoji; // Guardar el emoji también

        const emoji = document.createElement("div");
        emoji.textContent = random.emoji;
        const label = document.createElement("span");
        label.textContent = random.name;

        el.appendChild(emoji);
        el.appendChild(label);
        itemContainer.appendChild(el);

        // Almacenar el ítem actual y agregar un evento de clic
        currentItem = el;
        currentItem.addEventListener("click", () => {
            message.textContent = `Seleccionaste "${currentItem.dataset.name}". Ahora haz clic en el contenedor correcto.`;
            message.style.color = "blue";
            // Resalta el objeto seleccionado
            currentItem.classList.add('selected');
        });
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

    bins.forEach(bin => {
        bin.addEventListener("click", e => {
            // Asegúrate de que haya un objeto seleccionado
            if (!currentItem) {
                message.textContent = "¡Primero selecciona un objeto para reciclar!";
                message.style.color = "red";
                return;
            }

            const type = currentItem.dataset.type;
            const name = currentItem.dataset.name;
            const binType = bin.dataset.type;
            const binName = bin.querySelector("span").textContent;

            if (type === binType) {
                score += 10;
                scoreEl.textContent = "Puntos: " + score;
                message.textContent = `✅ ¡Correcto! ${name} va en ${binName}`;
                message.style.color = "green";
            } else {
                message.textContent = `❌ Incorrecto. ${name} no va en ${binName}. Prueba otro contenedor.`;
                message.style.color = "red";
            }
            
            // Elimina la clase de seleccionado
            currentItem.classList.remove('selected');
            
            updateLevel();
            newItem();
        });
    });

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
