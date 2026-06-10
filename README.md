#  VeloRace - Tienda de Motovelocidad


 Descripción

**VeloRace** es una plataforma web de comercio electrónico especializada en la venta de equipamiento para **motovelocidad**. Permite a los usuarios explorar un catálogo de productos, ver detalles con galería de imágenes, gestionar un carrito de compras y simular el proceso de pago. Además, incluye un **panel de administración** para gestionar el inventario.

Características

-  Autenticación de usuarios (registro e inicio de sesión)
- Roles diferenciados: Cliente / Administrador
- Catálogo de productos con filtros por categoría y búsqueda
-  Modal de producto con galería de múltiples imágenes
-  Carrito de compras con actualización en tiempo real
-  Panel de administración (CRUD completo de productos)
-  Diseño responsivo
- Persistencia de datos con LocalStorage

 Tecnologías utilizadas

| Tecnología | Propósito |
|------------|-----------|
| HTML5 | Estructura semántica |
| CSS3 | Estilos y diseño responsivo |
| JavaScript (ES6) | Lógica de la aplicación |
| LocalStorage | Persistencia de datos |
| Google Fonts | Fuentes tipográficas |

 Estructura del proyecto


velorace/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
├── README.md           # Este archivo
└── imagenes/           # Imágenes de productos
    ├── KYT KX-1 Race GP.jpg
    ├── KYT KX-1 Race GP2.jpg
    ├── PISTA GP.jpg.webp
    ├── PISTA GP2.jpg
    ├── guantes alpinestar.jpg
    ├── guantes aplinestar2.jpg
    ├── Botas ventiladas Supertech R.jpg
    └── Botas ventiladas Supertech R2.jpg


 Instrucciones de ejecución

 Requisitos previos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- No se necesita servidor web

 Pasos para ejecutar

1. Clonar el repositorio**

   bash
   git clone https://github.com/TU-USUARIO/velorace.git
   

3. Acceder al directorio**
   bash
   cd velorace
   

4. Abrir el archivo index.html
   - Haz doble clic en `index.html`
   - O arrastra el archivo a tu navegador

### Credenciales de prueba

| Rol: Administrador| Usuario: admin| Contraseña: admin123

|  Cliente | (regístrate con una cuenta nueva) | (la que elijas) |

Capturas de pantalla

Pantalla de inicio de sesión
<img width="500" height="532" alt="image" src="https://github.com/user-attachments/assets/fd2cd21a-7cad-414b-a7bc-8dee13f147dc" />

 Pantalla de inicio
<img width="921" height="431" alt="image" src="https://github.com/user-attachments/assets/b2f4ffcc-2a99-4042-b5a5-5e8b96839f73" />


 Catálogo de productos
<img width="921" height="395" alt="image" src="https://github.com/user-attachments/assets/53b98d03-261c-434b-b309-92ffa586448c" />


 Modal de detalle de producto
<img width="420" height="512" alt="image" src="https://github.com/user-attachments/assets/6d2e0b57-3247-4496-a6e3-6a0dac785c80" />


Carrito de compras
<img width="921" height="391" alt="image" src="https://github.com/user-attachments/assets/d9a7afe6-02ed-479f-84cb-2de8e611cdec" />


Panel de administración
<img width="921" height="423" alt="image" src="https://github.com/user-attachments/assets/ae431afe-21d6-4ebb-bd9e-74a095a9a6b4" />


Manual de usuario rápido

### Registro / Inicio de sesión
1. En la pantalla inicial, haz clic en **"Regístrate aquí"**
2. Completa nombre, usuario, correo y contraseña
3. O usa las credenciales de prueba

### Comprar productos
1. Ve a **Catálogo** o **Inicio**
2. Haz clic en **"Agregar"**
3. Ve al **Carrito** para revisar
4. Presiona **"Proceder al pago"**

### Administración (solo admin)
1. Ve a la pestaña **"Administración"**
2. Agrega, edita o elimina productos

##  Mejoras futuras

- [ ] Integración con backend real (Node.js + MongoDB)
- [ ] Pasarela de pago real
- [ ] Historial de pedidos por usuario
- [ ] Valoraciones y reseñas

##  Autor

**Jefferson Steven Zapata Garcia**  
Proyecto final - Programación web  
Fundación Universitaria Comfamiliar Risaralda  
Fecha: 09/06/2026

---

⭐ ¡Gracias por visitar este proyecto!

Add README.md
