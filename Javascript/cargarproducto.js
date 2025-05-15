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

        card.querySelectorAll(".splide__slide img").forEach(img => {
          img.addEventListener("click", () => {
            crearModalCarrusel(imagenes); // usa las imágenes del producto
          });
        });
        

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


function crearModalCarrusel(imagenes) {
  const modal = document.createElement("div");
  modal.classList.add("modal-carrusel");

  const cerrarBtn = document.createElement("button");
  cerrarBtn.textContent = "✖";
  cerrarBtn.classList.add("cerrar-modal");
  cerrarBtn.addEventListener("click", () => modal.remove());

  const carruselId = `modal-splide-${Date.now()}`;
  const slides = imagenes.map(img => `
    <li class="splide__slide">
      <img src="${img}" alt="Imagen ampliada">
    </li>
  `).join("");

  modal.innerHTML = `
    <div id="${carruselId}" class="splide">
      <div class="splide__track">
        <ul class="splide__list">
          ${slides}
        </ul>
      </div>
    </div>
  `;

  modal.appendChild(cerrarBtn);
  document.body.appendChild(modal);

  new Splide(`#${carruselId}`, {
    type: 'loop',
    pagination: true,
    arrows: true,
  }).mount();
}

