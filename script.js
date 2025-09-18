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



    function newItem() {

        itemContainer.innerHTML = "";

        const random = items[Math.floor(Math.random() * items.length)];

        const el = document.createElement("div");

        el.classList.add("item");

        el.draggable = true;

        el.dataset.type = random.type;

        el.dataset.name = random.name;



        const emoji = document.createElement("div");

        emoji.textContent = random.emoji;

        const label = document.createElement("span");

        label.textContent = random.name;



        el.appendChild(emoji);

        el.appendChild(label);

        itemContainer.appendChild(el);



        el.addEventListener("dragstart", e => {

            e.dataTransfer.setData("type", el.dataset.type);

            e.dataTransfer.setData("name", el.dataset.name);

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

        bin.addEventListener("dragover", e => e.preventDefault());

        bin.addEventListener("drop", e => {

            const type = e.dataTransfer.getData("type");

            const name = e.dataTransfer.getData("name");

            const binName = bin.querySelector("span").textContent;



            if (type === bin.dataset.type) {

                score += 10;

                scoreEl.textContent = "Puntos: " + score;

                message.textContent = `✅ ¡Correcto! ${name} va en ${binName}`;

                message.style.color = "green";

            } else {

                message.textContent = `❌ Incorrecto. ${name} no va en ${binName}. Prueba otro contenedor.`;

                message.style.color = "red";

            }

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
