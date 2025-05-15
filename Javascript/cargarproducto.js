document.addEventListener("DOMContentLoaded", () => {
  fetch("/Base de datos/BD.json")
    .then(response => response.json())
    .then(BD => {
      const contenedor = document.getElementById("contenedor-productos");
      contenedor.innerHTML = "";

      // Filtrar productos disponibles
      const productosDisponibles = BD.filter(p => p.Disponible === true).slice(0, 8);

      productosDisponibles.forEach((producto, index) => {
        const card = document.createElement("div");
        card.classList.add("cards");

        const imagenes = producto.Imagenes || [];

        const slides = imagenes.map(imagen => `
          <li class="splide__slide">
            <img src="${imagen}" alt="Imagen de ${producto.Marca}">
          </li>
        `).join("");

        const carruselHtml = `
          <div id="splide-${index}" class="splide">
            <div class="splide__track">
              <ul class="splide__list">
                ${slides}
              </ul>
            </div>
          </div>
        `;

        card.innerHTML = `
          ${carruselHtml}
          <div class="info">
            <h2>${producto.Marca}</h2> <br>
            <p>${producto.Descripcion}</p> <br>
            <p>
              <strong>Precio:</strong> $${producto.Precio}<br>
              ${producto.Medida ? `<br><strong>Medida:</strong> ${producto.Medida}` : ""}
            </p>

            <br>
            <div class="botones">
              <button>Agregar al carrito</button>
            </div>
          </div>
        `;

        contenedor.appendChild(card);

        new Splide(`#splide-${index}`, {
          type: 'fade',
          rewind: true,
          pagination: false,
          arrows: imagenes.length > 1,
        }).mount();
      });
    })
    .catch(error => {
      console.error("Error al cargar los productos:", error);
    });
});
