# Guia de Sustentacion - ConectaTIC

---

## 1. GUION DE PRESENTACION (5-7 minutos)

### Introduccion (1 minuto)

> "Buenos dias. Nuestro proyecto se llama **ConectaTIC**, es una aplicacion educativa disenada para las comunidades indigenas que buscan aprender a usar tecnologias digitales. El problema que resolvemos es la brecha digital que enfrentan estas comunidades, quienes muchas veces no tienen acceso a capacitaciones tecnologicas accesibles y adaptadas a sus necesidades."

### Objetivos (1 minuto)

> "El objetivo principal es desarrollar una plataforma educativa multiplataforma (movil y web) que permita a las comunidades indigenas aprender a usar herramientas digitales como el celular, WhatsApp, correo electronico e internet, de forma interactiva y en su propio ritmo."

> "Los objetivos especificos son:
> 1. Crear una aplicacion movil con contenido educativo estructurado en modulos
> 2. Desarrollar un backend seguro con autenticacion y persistencia de datos
> 3. Implementar una version web para acceso desde cualquier navegador
> 4. Garantizar seguridad en los datos de los usuarios"

### Arquitectura Tecnologica (1.5 minutos)

> "El proyecto utiliza un stack moderno y 100% gratuito:"

> "**Frontend:** Flutter, que nos permite compilar una sola vez y ejecutar en Android, iOS y Web. Usamos Provider para el manejo de estado, GoRouter para la navegacion, y SharedPreferences para almacenamiento local."

> "**Backend:** Express.js con Node.js, que expone una API REST. La base de datos es PostgreSQL en Supabase, con autenticacion JWT y encriptacion de contraseñas con bcrypt."

> "**Infraestructura:** Todo desplegado en Vercel de forma gratuita. El frontend como archivos estaticos y el backend como funciones serverless."

### Seguridad (30 segundos)

> "En cuanto a seguridad, implementamos: hash de contraseñas con bcrypt (10 rounds), tokens JWT con expiracion de 7 dias, rate limiting para prevenir fuerza bruta, CORS restringido, headers de seguridad con Helmet.js, y validacion rigurosa de inputs."

### Resultados (1 minuto)

> "El proyecto cuenta con 67 tests automatizados pasando, una base de datos persistente con 5 tablas, 4 modulos educativos con contenido y ejercicios, y esta disponible tanto como APK para Android como en la web."

---

## 2. FLUJO DE DEMOSTRACION EN VIVO (5 minutos)

### Paso 1: Mostrar la URL web (30 seg)
- Abrir **https://conectatic-frontend.vercel.app** en el navegador
- Mostrar que carga la pantalla de login

### Paso 2: Crear cuenta (1 min)
- Hacer clic en "Crear cuenta"
- Llenar formulario:
  - Nombre: (cualquier nombre)
  - Correo: (cualquier email)
  - Contraseña: `MiPass123!` (minimo 8 caracteres, mayuscula, minuscula, numero, simbolo)
- Mostrar que se crea exitosamente y redirige al home

### Paso 3: Explorar modulos (1 min)
- Mostrar los 4 modulos educativos:
  1. Uso del celular
  2. WhatsApp
  3. Correo electronico
  4. Internet
- Entrar a un modulo (ej: "Uso del celular")
- Mostrar que tiene descripcion, video introductorio y lecciones

### Paso 4: Ver leccion (1 min)
- Entrar a una leccion
- Mostrar el contenido educativo (titulo, texto, icono)
- Avanzar a un ejercicio
- Responder un ejercicio (seleccion multiple)
- Mostrar retroalimentacion (correcto/incorrecto)

### Paso 5: Mostrar progreso (30 seg)
- Volver al home
- Mostrar que la barra de progreso se actualizo
- Explicar que el progreso se guarda en la base de datos

### Paso 6 (Opcional): Mostrar APK (30 seg)
- Si hay celular disponible, mostrar el APK instalado
- Escanear el QR de descarga
- Mostrar que la app movil tiene la misma funcionalidad

---

## 3. RESUMEN TECNICO

### Stack de Tecnologias

| Capa | Tecnologia | Funcion |
|------|-----------|---------|
| Frontend | Flutter 3.24 | UI multiplataforma |
| Estado | Provider | Gestion de estado global |
| Navegacion | GoRouter | Rutas declarativas |
| Backend | Express.js | API REST |
| BD | PostgreSQL (Supabase) | Persistencia de datos |
| Auth | JWT + bcrypt | Autenticacion y seguridad |
| Deploy | Vercel | Hosting gratuito |
| Tests | Mocha + Chai | 67 tests automatizados |

### Endpoints de la API

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | /api/auth/register | Crear cuenta |
| POST | /api/auth/login | Iniciar sesion |
| GET | /api/usuarios | Listar usuarios |
| PUT | /api/usuarios/progreso | Actualizar progreso |
| GET | /api/modulos | Obtener modulos educativos |
| GET | /api | Health check |

### Base de Datos (5 tablas)

| Tabla | Registros | Descripcion |
|-------|-----------|-------------|
| usuarios | 6+ | Usuarios registrados |
| modulos | 4 | Modulos educativos |
| lecciones | 12+ | Contenido de cada modulo |
| ejercicios | 24+ | Evaluaciones interactivas |
| progreso_usuario | - | Progreso por usuario |

### Seguridad Implementada

- Contraseñas hasheadas (bcrypt, 10 rounds)
- Tokens JWT (expiracion 7 dias)
- Rate limiting (5 intentos/15 min en auth)
- CORS restringido a dominios permitidos
- Headers de seguridad (Helmet.js)
- Validacion de inputs en backend
- SQL injection prevention (parametrized queries)
- HTTPS forzado en produccion

### URLs de Produccion

- **Frontend Web:** https://conectatic-frontend.vercel.app
- **Backend API:** https://conecta-tic.vercel.app/api
- **GitHub:** https://github.com/Navas20/ConectaTIC
- **APK:** Google Drive (QR disponible)

---

## 4. PREGUNTAS FRECUENTES DE SUSTENTACION

**P: Por que Flutter y no React Native?**
R: Flutter permite compilar para web, Android e iOS con una sola base de codigo. Ademas, su rendimiento es superior y la comunidad esta en crecimiento.

**P: Por que Supabase y no Firebase?**
R: Supabase ofrece PostgreSQL (mas potente que Firestore), es open source, y el plan gratuito es mas generoso. Ademas, nos da control total sobre la base de datos.

**P: Como escalaria la aplicacion?**
R: Vercel escala automaticamente. La BD en Supabase soporta miles de conexiones. Para un escenario mayor, se migraria a un plan de pago o se usaria un cluster de BD.

**P: Que pasa si se cae el servidor?**
R: Vercel tiene 99.99% de uptime. El backend usa serverless, por lo que se recupera automaticamente. Los datos persisten en Supabase (no se pierden).

**P: Cuanto cuesta mantener la app?**
R: $0. Todo usa planes gratuitos: Vercel (frontend + backend), Supabase (BD), GitHub (codigo fuente).

---

## 5. CREDENCIALES DE PRUEBA

| Campo | Valor |
|-------|-------|
| Correo | testweb@test.com |
| Contraseña | Test1234!@ |

---

**Preparado por:** ConectaTIC Team
**Fecha:** 10 de Junio 2026
