let productos = [];
let carrito = [];

const productosContainer = document.getElementById("productos-container");
const verCarritoBtn = document.getElementById("ver-carrito");
const cantidadCarrito = document.getElementById("cantidad-carrito");

// Cargar productos desde JSON
fetch("../data/productos.json")
  .then((res) => res.json())
  .then((data) => {
    productos = data;
    renderizarProductos();
    cargarCarritoDesdeStorage();
  })
  .catch((error) => {
    console.error("Error al cargar productos:", error);
    Swal.fire("Error", "No se pudieron cargar los productos.", "error");
  });

// Renderizar productos en el DOM
function renderizarProductos() {
  productosContainer.innerHTML = "";

  productos.forEach((producto) => {
    const card = document.createElement("div");
    card.classList.add("producto-card");
    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio}</p>
      <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
    `;
    productosContainer.appendChild(card);
  });
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  const enCarrito = carrito.find((item) => item.id === id);

  if (enCarrito) {
    enCarrito.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarritoEnStorage();
  actualizarCantidadCarrito();

  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Producto agregado",
    showConfirmButton: false,
    timer: 1000,
  });
}

// Mostrar carrito con SweetAlert
verCarritoBtn.addEventListener("click", () => {
  if (carrito.length === 0) {
    Swal.fire("Tu carrito está vacío");
    return;
  }

  let contenido = carrito
    .map(
      (item) =>
        `${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}`
    )
    .join("\n");

  Swal.fire({
    title: "Carrito de Compras",
    icon: "info",
    html: `<pre style="text-align:left;">${contenido}</pre>`,
    showCancelButton: true,
    confirmButtonText: "Finalizar compra",
    cancelButtonText: "Seguir comprando",
  }).then((result) => {
    if (result.isConfirmed) {
      finalizarCompra();
    }
  });
});

// Finalizar compra
function finalizarCompra() {
  carrito = [];
  guardarCarritoEnStorage();
  actualizarCantidadCarrito();

  Swal.fire("¡Gracias por tu compra!", "Tu pedido fue procesado.", "success");
}

// LocalStorage
function guardarCarritoEnStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarritoDesdeStorage() {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCantidadCarrito();
  }
}

function actualizarCantidadCarrito() {
  const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  cantidadCarrito.textContent = total;
}
