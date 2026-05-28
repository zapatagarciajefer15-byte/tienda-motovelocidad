/* VeloRace — Tienda de Motovelocidad */

const STORAGE = {
  usuarios: 'velorace_usuarios',
  sesion: 'velorace_sesion',
  productos: 'velorace_productos',
  carrito: 'velorace_carrito'
};

const CATEGORIAS = {
  cascos: 'Cascos',
  trajes: 'Trajes y ropa',
  bicicletas: 'Bicicletas de pista',
  componentes: 'Componentes',
  accesorios: 'Accesorios',
  calzado: 'Calzado'
};

const ICONOS_CATEGORIA = {
  cascos: '🪖',
  trajes: '👕',
  bicicletas: '🚲',
  componentes: '⚙️',
  accesorios: '🧤',
  calzado: '👟'
};

const PRODUCTOS_INICIALES = [
  {
    id: 'p1',
    nombre: 'Casco Aero Track UCI',
    descripcion: 'Casco de pista homologado UCI con aerodinámica optimizada para 200m y 500m.',
    precio: 349.99,
    stock: 15,
    categoria: 'cascos',
    imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    imagenes: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ]
  },
  {
    id: 'p2',
    nombre: 'Traje de piel Sprint Pro',
    descripcion: 'Traje de piel elástico para competición en velódromo, costuras reforzadas.',
    precio: 589.0,
    stock: 8,
    categoria: 'trajes',
    imagen: 'https://images.unsplash.com/photo-1517649763962-0c62306601b7?w=400&h=300&fit=crop'
  },
  {
    id: 'p3',
    nombre: 'Bicicleta Pista Carbono 48',
    descripcion: 'Cuadro de carbono rígido, geometría agresiva para sprint y persecución.',
    precio: 4299.0,
    stock: 3,
    categoria: 'bicicletas',
    imagen: 'https://images.unsplash.com/photo-1485965120188-e220f721d03e?w=400&h=300&fit=crop'
  },
  {
    id: 'p4',
    nombre: 'Rueda Disco Delantera 5 radios',
    descripcion: 'Rueda de disco de fibra de carbono para máxima rigidez lateral en curvas.',
    precio: 1299.0,
    stock: 6,
    categoria: 'componentes',
    imagen: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&h=300&fit=crop'
  },
  {
    id: 'p5',
    nombre: 'Guantes Track Grip',
    descripcion: 'Guantes sin dedos con agarre antideslizante para manillar de pista.',
    precio: 45.99,
    stock: 40,
    categoria: 'accesorios',
    imagen: 'https://images.unsplash.com/photo-1571907480492-451b9fce5965?w=400&h=300&fit=crop'
  },
  {
    id: 'p6',
    nombre: 'Zapatillas SPD Pista',
    descripcion: 'Suela rígida de carbono, cierre BOA, compatible con pedales SPD-SL.',
    precio: 279.0,
    stock: 12,
    categoria: 'calzado',
    imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'
  }
];

let usuarioActual = null;
let modoRegistro = false;
let productoEnEdicion = null;
let productoModal = null;

/* ——— Utilidades ——— */

function generarId() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function formatearPrecio(n) {
  const valor = Number(n);
  if (Number.isNaN(valor)) return 'COP 0';
  // Formato colombiano: $1.234.567 (sin decimales)
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor);
}

function obtenerImagenesProducto(producto) {
  if (!producto) return [];
  if (Array.isArray(producto.imagenes)) {
    return producto.imagenes.map((u) => String(u).trim()).filter(Boolean);
  }
  if (typeof producto.imagen === 'string' && producto.imagen.trim()) {
    return [producto.imagen.trim()];
  }
  return [];
}

function obtenerUsuarios() {
  const data = localStorage.getItem(STORAGE.usuarios);
  if (data) return JSON.parse(data);
  const admin = {
    id: 'admin1',
    nombre: 'Administrador',
    usuario: 'admin',
    email: 'admin@velorace.com',
    password: 'admin123',
    rol: 'admin'
  };
  localStorage.setItem(STORAGE.usuarios, JSON.stringify([admin]));
  return [admin];
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(STORAGE.usuarios, JSON.stringify(usuarios));
}

function obtenerProductos() {
  const data = localStorage.getItem(STORAGE.productos);
  if (data) return JSON.parse(data);
  localStorage.setItem(STORAGE.productos, JSON.stringify(PRODUCTOS_INICIALES));
  return [...PRODUCTOS_INICIALES];
}

function guardarProductos(productos) {
  localStorage.setItem(STORAGE.productos, JSON.stringify(productos));
}

function obtenerCarrito() {
  const key = usuarioActual ? `${STORAGE.carrito}_${usuarioActual.id}` : STORAGE.carrito;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function guardarCarrito(carrito) {
  const key = usuarioActual ? `${STORAGE.carrito}_${usuarioActual.id}` : STORAGE.carrito;
  localStorage.setItem(key, JSON.stringify(carrito));
}

function mostrarModal(mensaje) {
  document.getElementById('modal-mensaje').textContent = mensaje;
  document.getElementById('modal').hidden = false;
}

/* ——— Autenticación ——— */

function iniciarSesion(usuario, password) {
  const usuarios = obtenerUsuarios();
  const encontrado = usuarios.find(
    (u) =>
      (u.usuario === usuario || u.email === usuario) && u.password === password
  );
  if (!encontrado) return false;
  usuarioActual = { id: encontrado.id, nombre: encontrado.nombre, rol: encontrado.rol, usuario: encontrado.usuario };
  localStorage.setItem(STORAGE.sesion, JSON.stringify(usuarioActual));
  return true;
}

function registrarUsuario(datos) {
  const usuarios = obtenerUsuarios();
  if (usuarios.some((u) => u.usuario === datos.usuario)) {
    return { ok: false, error: 'Ese nombre de usuario ya existe.' };
  }
  if (usuarios.some((u) => u.email === datos.email)) {
    return { ok: false, error: 'Ese correo ya está registrado.' };
  }
  const nuevo = {
    id: 'u' + Date.now(),
    nombre: datos.nombre,
    usuario: datos.usuario,
    email: datos.email,
    password: datos.password,
    rol: 'cliente'
  };
  usuarios.push(nuevo);
  guardarUsuarios(usuarios);
  return { ok: true };
}

function cerrarSesion() {
  usuarioActual = null;
  localStorage.removeItem(STORAGE.sesion);
  document.getElementById('app').hidden = true;
  document.getElementById('pantalla-login').classList.add('activa');
  document.getElementById('form-login').reset();
}

function restaurarSesion() {
  const data = localStorage.getItem(STORAGE.sesion);
  if (!data) return false;
  usuarioActual = JSON.parse(data);
  return true;
}

function mostrarApp() {
  document.getElementById('pantalla-login').classList.remove('activa');
  document.getElementById('app').hidden = false;
  document.getElementById('nombre-usuario').textContent = usuarioActual.nombre;
  const rolBadge = document.getElementById('rol-badge');
  const esAdmin = usuarioActual.rol === 'admin';
  rolBadge.textContent = esAdmin ? 'Administrador' : 'Cliente';
  rolBadge.classList.toggle('admin', esAdmin);
  document.querySelector('.nav-admin').hidden = !esAdmin;
  renderizarTodo();
  navegarA('inicio');
}

function toggleAuth() {
  modoRegistro = !modoRegistro;
  document.getElementById('form-login').hidden = modoRegistro;
  document.getElementById('form-registro').hidden = !modoRegistro;
  document.getElementById('texto-toggle').textContent = modoRegistro
    ? '¿Ya tienes cuenta?'
    : '¿No tienes cuenta?';
  document.getElementById('btn-toggle-auth').textContent = modoRegistro
    ? 'Inicia sesión'
    : 'Regístrate aquí';
  document.getElementById('login-error').hidden = true;
  document.getElementById('reg-error').hidden = true;
}

/* ——— Navegación ——— */

function navegarA(seccion) {
  document.querySelectorAll('.seccion').forEach((s) => s.classList.remove('activa'));
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('activo'));
  const sec = document.getElementById(`seccion-${seccion}`);
  if (sec) sec.classList.add('activa');
  const btn = document.querySelector(`.nav-btn[data-nav="${seccion}"]`);
  if (btn) btn.classList.add('activo');
  if (seccion === 'carrito') renderizarCarrito();
  if (seccion === 'admin') renderizarTablaAdmin();
}

/* ——— Productos ——— */

function crearTarjetaProducto(producto) {
  const icono = ICONOS_CATEGORIA[producto.categoria] || '🏁';
  const imagenes = obtenerImagenesProducto(producto);
  const imgHtml = imagenes[0]
    ? `<img src="${imagenes[0]}" alt="${producto.nombre}" loading="lazy">`
    : `<span class="placeholder">${icono}</span>`;
  const sinStock = producto.stock <= 0;
  return `
    <article class="tarjeta-producto" data-id="${producto.id}">
      <div class="tarjeta-imagen">${imgHtml}</div>
      <div class="tarjeta-cuerpo">
        <span class="tarjeta-categoria">${CATEGORIAS[producto.categoria] || producto.categoria}</span>
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <div class="tarjeta-pie">
          <span class="precio">${formatearPrecio(producto.precio)}</span>
          <button class="btn btn-primario btn-sm btn-agregar" data-id="${producto.id}" ${sinStock ? 'disabled' : ''}>
            ${sinStock ? 'Agotado' : 'Agregar'}
          </button>
        </div>
        ${producto.stock <= 5 && producto.stock > 0 ? '<span class="stock-bajo">¡Últimas unidades!</span>' : ''}
      </div>
    </article>
  `;
}

function renderizarGrid(contenedorId, productos, limite) {
  const grid = document.getElementById(contenedorId);
  const lista = limite ? productos.slice(0, limite) : productos;
  grid.innerHTML = lista.map(crearTarjetaProducto).join('');
  grid.querySelectorAll('.btn-agregar').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      agregarAlCarrito(btn.dataset.id);
    });
  });

  grid.querySelectorAll('.tarjeta-producto').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const producto = obtenerProductos().find((p) => p.id === id);
      if (producto) abrirModalProducto(producto);
    });
  });
}

function filtrarProductos() {
  const busqueda = document.getElementById('buscar-producto').value.toLowerCase().trim();
  const categoria = document.getElementById('filtro-categoria').value;
  let productos = obtenerProductos();
  if (categoria) productos = productos.filter((p) => p.categoria === categoria);
  if (busqueda) {
    productos = productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(busqueda) ||
        p.descripcion.toLowerCase().includes(busqueda)
    );
  }
  const sinResultados = document.getElementById('sin-resultados');
  sinResultados.hidden = productos.length > 0;
  renderizarGrid('grid-catalogo', productos);
}

function renderizarCatalogo() {
  filtrarProductos();
}

function renderizarDestacados() {
  renderizarGrid('grid-destacados', obtenerProductos(), 4);
}

/* ——— Modal producto ——— */

function cerrarModalProducto() {
  productoModal = null;
  const modal = document.getElementById('modal-producto');
  if (modal) modal.hidden = true;
}

function abrirModalProducto(producto) {
  productoModal = producto;
  const modal = document.getElementById('modal-producto');

  document.getElementById('modal-producto-titulo').textContent = producto.nombre;
  document.getElementById('modal-producto-descripcion').textContent = producto.descripcion || '';
  document.getElementById('modal-producto-precio').textContent = formatearPrecio(producto.precio);
  document.getElementById('modal-producto-stock').textContent = producto.stock;

  const imagenes = obtenerImagenesProducto(producto);
  const principal = document.getElementById('modal-producto-imagen-principal');
  const sinImagen = document.getElementById('modal-producto-sin-imagen');
  const thumbs = document.getElementById('modal-producto-thumbs');

  const imagenPrincipal = imagenes[0] || '';
  principal.src = imagenPrincipal;

  if (imagenes.length > 0) {
    sinImagen.hidden = true;
  } else {
    sinImagen.hidden = false;
  }

  const agregarBtn = document.getElementById('modal-producto-agregar');
  agregarBtn.disabled = producto.stock <= 0;
  agregarBtn.dataset.id = producto.id;

  if (!imagenes.length) {
    thumbs.innerHTML = '';
  } else {
    thumbs.innerHTML = imagenes
      .map(
        (url, idx) => `
          <button type="button" class="thumb-btn ${idx === 0 ? 'activa' : ''}" data-index="${idx}">
            <img src="${url}" alt="${producto.nombre}">
          </button>
        `
      )
      .join('');

    thumbs.querySelectorAll('.thumb-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.index);
        principal.src = imagenes[idx] || '';
        thumbs.querySelectorAll('.thumb-btn').forEach((b) => {
          b.classList.toggle('activa', b === btn);
        });
      });
    });
  }

  if (modal) modal.hidden = false;
}

/* ——— Carrito ——— */

function agregarAlCarrito(productoId) {
  const productos = obtenerProductos();
  const producto = productos.find((p) => p.id === productoId);
  if (!producto || producto.stock <= 0) return;

  let carrito = obtenerCarrito();
  const existente = carrito.find((item) => item.productoId === productoId);
  const cantidadActual = existente ? existente.cantidad : 0;
  if (cantidadActual >= producto.stock) {
    mostrarModal(`Solo hay ${producto.stock} unidad(es) disponibles.`);
    return;
  }

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ productoId, cantidad: 1 });
  }
  guardarCarrito(carrito);
  actualizarBadgeCarrito();
  mostrarModal(`"${producto.nombre}" agregado al carrito.`);
}

function actualizarBadgeCarrito() {
  const carrito = obtenerCarrito();
  const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  document.getElementById('badge-carrito').textContent = total;
}

function cambiarCantidad(productoId, delta) {
  let carrito = obtenerCarrito();
  const productos = obtenerProductos();
  const producto = productos.find((p) => p.id === productoId);
  const item = carrito.find((i) => i.productoId === productoId);
  if (!item) return;

  item.cantidad += delta;
  if (item.cantidad > producto.stock) {
    item.cantidad = producto.stock;
    mostrarModal(`Stock máximo: ${producto.stock}`);
  }
  if (item.cantidad <= 0) {
    carrito = carrito.filter((i) => i.productoId !== productoId);
  }
  guardarCarrito(carrito);
  renderizarCarrito();
}

function eliminarDelCarrito(productoId) {
  let carrito = obtenerCarrito().filter((i) => i.productoId !== productoId);
  guardarCarrito(carrito);
  renderizarCarrito();
}

function vaciarCarrito() {
  if (!confirm('¿Vaciar todo el carrito?')) return;
  guardarCarrito([]);
  renderizarCarrito();
}

function renderizarCarrito() {
  const carrito = obtenerCarrito();
  const productos = obtenerProductos();
  const vacio = document.getElementById('carrito-vacio');
  const contenido = document.getElementById('carrito-contenido');
  const lista = document.getElementById('lista-carrito');

  actualizarBadgeCarrito();

  if (carrito.length === 0) {
    vacio.hidden = false;
    contenido.hidden = true;
    return;
  }

  vacio.hidden = true;
  contenido.hidden = false;

  let subtotal = 0;
  lista.innerHTML = carrito
    .map((item) => {
      const producto = productos.find((p) => p.id === item.productoId);
      if (!producto) return '';
      const linea = producto.precio * item.cantidad;
      subtotal += linea;
      const icono = ICONOS_CATEGORIA[producto.categoria] || '🏁';
      const imagenesProducto = obtenerImagenesProducto(producto);
      const imgHtml = imagenesProducto[0]
        ? `<img src="${imagenesProducto[0]}" alt="">`
        : icono;
      return `
        <div class="item-carrito" data-id="${producto.id}">
          <div class="item-carrito-imagen">${imgHtml}</div>
          <div class="item-carrito-info">
            <h4>${producto.nombre}</h4>
            <span class="precio-unit">${formatearPrecio(producto.precio)} c/u</span>
          </div>
          <div class="item-carrito-cantidad">
            <button type="button" class="btn-menos" data-id="${producto.id}">−</button>
            <span>${item.cantidad}</span>
            <button type="button" class="btn-mas" data-id="${producto.id}">+</button>
          </div>
          <span class="item-carrito-total">${formatearPrecio(linea)}</span>
          <button type="button" class="btn-eliminar-item" data-id="${producto.id}" title="Eliminar">✕</button>
        </div>
      `;
    })
    .join('');

  const envio = subtotal > 100 ? 0 : 15;
  const total = subtotal + envio;

  document.getElementById('carrito-subtotal').textContent = formatearPrecio(subtotal);
  document.getElementById('carrito-envio').textContent =
    envio === 0 ? 'Gratis' : formatearPrecio(envio);
  document.getElementById('carrito-total').textContent = formatearPrecio(total);

  lista.querySelectorAll('.btn-menos').forEach((btn) => {
    btn.addEventListener('click', () => cambiarCantidad(btn.dataset.id, -1));
  });
  lista.querySelectorAll('.btn-mas').forEach((btn) => {
    btn.addEventListener('click', () => cambiarCantidad(btn.dataset.id, 1));
  });
  lista.querySelectorAll('.btn-eliminar-item').forEach((btn) => {
    btn.addEventListener('click', () => eliminarDelCarrito(btn.dataset.id));
  });
}

function procesarCheckout() {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) return;
  mostrarModal('¡Gracias por tu compra! (Simulación completada)');
  guardarCarrito([]);
  renderizarCarrito();
}

/* ——— Administración ——— */

function guardarProducto(e) {
  e.preventDefault();
  const id = document.getElementById('producto-id').value;
  const rawImagenes = document.getElementById('prod-imagen').value.trim();
  const imagenes = rawImagenes
    ? rawImagenes.split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  const datos = {
    nombre: document.getElementById('prod-nombre').value.trim(),
    descripcion: document.getElementById('prod-descripcion').value.trim(),
    precio: parseFloat(document.getElementById('prod-precio').value),
    stock: parseInt(document.getElementById('prod-stock').value, 10),
    categoria: document.getElementById('prod-categoria').value,
    imagenes,
    imagen: imagenes[0] || ''
  };

  let productos = obtenerProductos();
  if (id) {
    productos = productos.map((p) => (p.id === id ? { ...p, ...datos } : p));
    mostrarModal('Producto actualizado correctamente.');
  } else {
    productos.push({ id: generarId(), ...datos });
    mostrarModal('Producto agregado al catálogo.');
  }
  guardarProductos(productos);
  limpiarFormProducto();
  renderizarTablaAdmin();
  renderizarDestacados();
  renderizarCatalogo();
}

function limpiarFormProducto() {
  document.getElementById('form-producto').reset();
  document.getElementById('producto-id').value = '';
  document.getElementById('titulo-form-producto').textContent = 'Agregar producto';
  document.getElementById('btn-guardar-producto').textContent = 'Guardar producto';
  document.getElementById('btn-cancelar-edicion').hidden = true;
  productoEnEdicion = null;
}

function editarProducto(id) {
  const producto = obtenerProductos().find((p) => p.id === id);
  if (!producto) return;
  productoEnEdicion = id;
  document.getElementById('producto-id').value = id;
  document.getElementById('prod-nombre').value = producto.nombre;
  document.getElementById('prod-descripcion').value = producto.descripcion;
  document.getElementById('prod-precio').value = producto.precio;
  document.getElementById('prod-stock').value = producto.stock;
  document.getElementById('prod-categoria').value = producto.categoria;
  document.getElementById('prod-imagen').value = obtenerImagenesProducto(producto).join(', ');
  document.getElementById('titulo-form-producto').textContent = 'Editar producto';
  document.getElementById('btn-guardar-producto').textContent = 'Actualizar producto';
  document.getElementById('btn-cancelar-edicion').hidden = false;
  document.getElementById('prod-nombre').focus();
}

function eliminarProducto(id) {
  if (!confirm('¿Eliminar este producto del catálogo?')) return;
  const productos = obtenerProductos().filter((p) => p.id !== id);
  guardarProductos(productos);
  let carrito = obtenerCarrito().filter((i) => i.productoId !== id);
  guardarCarrito(carrito);
  renderizarTablaAdmin();
  renderizarDestacados();
  renderizarCatalogo();
  actualizarBadgeCarrito();
  mostrarModal('Producto eliminado.');
}

function renderizarTablaAdmin() {
  const productos = obtenerProductos();
  const tbody = document.getElementById('tabla-productos');
  document.getElementById('total-productos').textContent = productos.length;

  tbody.innerHTML = productos
    .map(
      (p) => `
    <tr>
      <td><strong>${p.nombre}</strong></td>
      <td>${CATEGORIAS[p.categoria] || p.categoria}</td>
      <td>${formatearPrecio(p.precio)}</td>
      <td>${p.stock}</td>
      <td class="acciones">
        <button type="button" class="btn-icono btn-editar" data-id="${p.id}">Editar</button>
        <button type="button" class="btn-icono btn-eliminar" data-id="${p.id}">Eliminar</button>
      </td>
    </tr>
  `
    )
    .join('');

  tbody.querySelectorAll('.btn-editar').forEach((btn) => {
    btn.addEventListener('click', () => editarProducto(btn.dataset.id));
  });
  tbody.querySelectorAll('.btn-eliminar').forEach((btn) => {
    btn.addEventListener('click', () => eliminarProducto(btn.dataset.id));
  });
}

function renderizarTodo() {
  renderizarDestacados();
  renderizarCatalogo();
  actualizarBadgeCarrito();
  if (usuarioActual?.rol === 'admin') renderizarTablaAdmin();
}

/* ——— Eventos ——— */

function init() {
  document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const usuario = document.getElementById('login-usuario').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    if (iniciarSesion(usuario, password)) {
      errorEl.hidden = true;
      mostrarApp();
    } else {
      errorEl.textContent = 'Usuario o contraseña incorrectos.';
      errorEl.hidden = false;
    }
  });

  document.getElementById('form-registro').addEventListener('submit', (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('reg-error');
    const resultado = registrarUsuario({
      nombre: document.getElementById('reg-nombre').value.trim(),
      usuario: document.getElementById('reg-usuario').value.trim(),
      email: document.getElementById('reg-email').value.trim(),
      password: document.getElementById('reg-password').value
    });
    if (!resultado.ok) {
      errorEl.textContent = resultado.error;
      errorEl.hidden = false;
      return;
    }
    errorEl.hidden = true;
    iniciarSesion(document.getElementById('reg-usuario').value.trim(), document.getElementById('reg-password').value);
    mostrarApp();
    mostrarModal('¡Cuenta creada! Bienvenido a VeloRace.');
  });

  document.getElementById('btn-toggle-auth').addEventListener('click', toggleAuth);
  document.getElementById('btn-cerrar-sesion').addEventListener('click', cerrarSesion);

  document.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navegarA(el.dataset.nav);
    });
  });

  document.getElementById('buscar-producto').addEventListener('input', filtrarProductos);
  document.getElementById('filtro-categoria').addEventListener('change', filtrarProductos);
  document.getElementById('btn-vaciar-carrito').addEventListener('click', vaciarCarrito);
  document.getElementById('btn-checkout').addEventListener('click', procesarCheckout);
  document.getElementById('form-producto').addEventListener('submit', guardarProducto);
  document.getElementById('btn-cancelar-edicion').addEventListener('click', limpiarFormProducto);
  document.getElementById('modal-cerrar').addEventListener('click', () => {
    document.getElementById('modal').hidden = true;
  });

  document.getElementById('modal-producto-cerrar').addEventListener('click', cerrarModalProducto);
  document.getElementById('modal-producto-agregar').addEventListener('click', () => {
    if (!productoModal) return;
    agregarAlCarrito(productoModal.id);
    cerrarModalProducto();
  });

  const modalProducto = document.getElementById('modal-producto');
  modalProducto.addEventListener('click', (e) => {
    if (e.target === modalProducto) cerrarModalProducto();
  });

  if (restaurarSesion()) {
    mostrarApp();
  }
}

document.addEventListener('DOMContentLoaded', init);

