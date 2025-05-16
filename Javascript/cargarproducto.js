cargarProductos({
  contenedorId: "contenedor-productos-skate",
  tiposPermitidos: ["Tabla", "Rodamientos", "Lija", "Llave", "Pivot"]
});

cargarProductos({
  contenedorId: "contenedor-productos-accesorios",
  tiposPermitidos: ["Cadena"]
});

cargarProductos({
  contenedorId: "contenedor-productos-stickers",
  tiposPermitidos: ["Sticker"]
});

cargarProductos({
  contenedorId: "contenedor-productos-ropa",
  tiposPermitidos: ["Ropa"]
});


function cargarProductos({ contenedorId, tiposPermitidos }) {
  fetch("/Base de datos/BD.json")
    .then(response => response.json())
    .then(BD => {
      const contenedor = document.getElementById(contenedorId);
      contenedor.innerHTML = "";

      const productosFiltrados = BD.filter(p =>
        p.Disponible === true && tiposPermitidos.includes(p.Tipo)
      ).slice(0, 4);

      productosFiltrados.forEach((producto, index) => {
        const card = document.createElement("div");
        card.classList.add("cards");

        const imagenes = producto.Imagenes || [];

        const slides = imagenes.map(imagen => `
          <li class="splide__slide">
            <img src="${imagen}" alt="Imagen de ${producto.Marca}">
          </li>
        `).join("");

        const carruselHtml = `
          <div id="splide-${contenedorId}-${index}" class="splide">
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
            crearModalCarrusel(imagenes);
          });
        });

        new Splide(`#splide-${contenedorId}-${index}`, {
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
}





function crearModalCarrusel(imagenes) {
  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");

  const modal = document.createElement("div");
  modal.classList.add("modal-carrusel");

  const cerrarBtn = document.createElement("button");
  cerrarBtn.textContent = "✖";
  cerrarBtn.classList.add("cerrar-modal");
  cerrarBtn.addEventListener("click", () => overlay.remove());

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
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Previene que el clic dentro del modal cierre el overlay
  modal.addEventListener("click", (e) => e.stopPropagation());

  // Cierra si se hace clic fuera del modal
  overlay.addEventListener("click", () => overlay.remove());

  new Splide(`#${carruselId}`, {
    type: 'loop',
    pagination: true,
    arrows: true,
  }).mount();
}


