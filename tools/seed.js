import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Tabla modulos
    await client.query(`
      CREATE TABLE IF NOT EXISTS modulos (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(100) NOT NULL,
        descripcion TEXT,
        icono VARCHAR(50),
        color VARCHAR(7),
        video_path VARCHAR(200),
        orden INT DEFAULT 0
      );
    `);
    console.log('✅ Tabla modulos creada');

    // Tabla lecciones (cards de contenido)
    await client.query(`
      CREATE TABLE IF NOT EXISTS lecciones (
        id SERIAL PRIMARY KEY,
        modulo_id INT NOT NULL REFERENCES modulos(id) ON DELETE CASCADE,
        titulo VARCHAR(200) NOT NULL,
        contenido TEXT,
        icono VARCHAR(50),
        orden INT DEFAULT 0
      );
    `);
    console.log('✅ Tabla lecciones creada');

    // Tabla ejercicios
    await client.query(`
      CREATE TABLE IF NOT EXISTS ejercicios (
        id SERIAL PRIMARY KEY,
        modulo_id INT NOT NULL REFERENCES modulos(id) ON DELETE CASCADE,
        tipo VARCHAR(20) NOT NULL,
        pregunta TEXT NOT NULL,
        opciones TEXT,
        correcto INT,
        orden_palabras TEXT,
        orden_correcto TEXT,
        explicacion TEXT,
        orden INT DEFAULT 0
      );
    `);
    console.log('✅ Tabla ejercicios creada');

    // Tabla progreso_usuario
    await client.query(`
      CREATE TABLE IF NOT EXISTS progreso_usuario (
        id SERIAL PRIMARY KEY,
        usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        modulo_id INT NOT NULL REFERENCES modulos(id) ON DELETE CASCADE,
        leccion_actual INT DEFAULT 0,
        leccion_completada BOOLEAN DEFAULT FALSE,
        quiz_completado BOOLEAN DEFAULT FALSE,
        ultimo_acceso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(usuario_id, modulo_id)
      );
    `);
    console.log('✅ Tabla progreso_usuario creada');

    // Insertar modulos
    await client.query(`DELETE FROM modulos`);
    await client.query(`
      INSERT INTO modulos (titulo, descripcion, icono, color, video_path, orden) VALUES
        ('Uso del celular', 'Aprende a usar tu celular desde cero', 'phone_android', '#58CC02', 'assets/videos/modulo1.mp4', 1),
        ('WhatsApp', 'Enviar mensajes, fotos y notas de voz', 'chat_bubble', '#25D366', 'assets/videos/modulo2.mp4', 2),
        ('Correo electrónico', 'Crear, leer y responder correos', 'email', '#1CB0F6', NULL, 3),
        ('Internet', 'Buscar información de forma segura', 'language', '#FFC800', NULL, 4)
      RETURNING id
    `);
    console.log('✅ Módulos insertados');

    // Insertar lecciones
    await client.query(`DELETE FROM lecciones`);
    await client.query(`
      INSERT INTO lecciones (modulo_id, titulo, contenido, icono, orden) VALUES
        (1, 'El botón de Power', 'El botón de power está en el lateral del celular. Presiónalo para encender o apagar.', 'power_settings_new_rounded', 1),
        (1, 'Ajustes del celular', 'En ajustes puedes cambiar el volumen, brillo, WiFi y más. Busca el ícono de la rueda.', 'settings_rounded', 2),
        (1, 'Hacer llamadas', 'Abre la aplicación de teléfono, marca el número y presiona el botón verde para llamar.', 'call_rounded', 3),
        (1, 'La cámara', 'Abre la cámara para tomar fotos. Apunta y toca el botón circular para capturar.', 'camera_alt_rounded', 4),
        (2, '¿Qué es WhatsApp?', 'WhatsApp es una aplicación para enviar mensajes, fotos, videos y notas de voz a otras personas.', 'chat_bubble_rounded', 1),
        (2, 'Enviar un mensaje', 'Abre un chat, escribe tu mensaje en la caja de texto y toca enviar (la flecha verde).', 'send_rounded', 2),
        (2, 'Enviar fotos', 'Toca el ícono de cámara o adjunta para seleccionar una foto de tu galería y envíala.', 'photo_library_rounded', 3),
        (2, 'Notas de voz', 'Mantén presionado el micrófono, habla y suelta para enviar un mensaje de voz.', 'mic_rounded', 4),
        (3, '¿Qué es un correo?', 'El correo electrónico es como una carta digital. Se envía a través de internet.', 'email_rounded', 1),
        (3, 'Escribir un correo', 'Abre Gmail, toca "+" para nuevo correo. Escribe el destinatario, el asunto y el mensaje.', 'edit_rounded', 2),
        (3, 'Leer un correo', 'Toca un correo en tu bandeja de entrada para leerlo. Desliza para ver los siguientes.', 'inbox_rounded', 3),
        (3, 'Responder un correo', 'Abre un correo y toca "Responder" para escribir una contestación.', 'reply_rounded', 4),
        (4, '¿Qué es internet?', 'Internet es una red mundial que conecta millones de computadoras y celulares.', 'language_rounded', 1),
        (4, 'El navegador', 'El navegador (Chrome, Safari) es una app para ver páginas web y buscar información.', 'search_rounded', 2),
        (4, 'Buscar en internet', 'Abre el navegador, escribe lo que quieres buscar en la barra y toca buscar.', 'find_in_page_rounded', 3),
        (4, 'El WiFi', 'El WiFi te conecta a internet sin cables. Actívalo en ajustes y conecta a una red.', 'wifi_rounded', 4)
    `);
    console.log('✅ Lecciones insertadas');

    // Insertar ejercicios
    await client.query(`DELETE FROM ejercicios`);
    await client.query(`
      INSERT INTO ejercicios (modulo_id, tipo, pregunta, opciones, correcto, orden_palabras, orden_correcto, explicacion, orden) VALUES
        (1, 'multiple_choice', '¿Qué botón enciende el celular?', '["Cámara","Power","Volumen","Menú"]', 1, NULL, NULL, 'El botón de power enciende y apaga el celular.', 1),
        (1, 'true_false', 'El botón de volumen controla el sonido.', '["Verdadero","Falso"]', 0, NULL, NULL, 'El botón de volumen sirve para subir o bajar el sonido.', 2),
        (1, 'order', 'Ordena: Apagar celular', NULL, NULL, '["Apagar","celular","Power"]', '[2,0,1]', 'Primero presiona Power, luego selecciona Apagar.', 3),
        (1, 'multiple_choice', '¿Dónde están los ajustes del celular?', '["En la cámara","En ajustes","En llamadas","En mensajes"]', 1, NULL, NULL, 'Todos los ajustes están en la aplicación de Ajustes.', 4),
        (1, 'true_false', 'Se puede hacer llamadas desde el celular.', '["Verdadero","Falso"]', 0, NULL, NULL, 'El celular sirve principalmente para hacer llamadas.', 5),
        (1, 'multiple_choice', '¿Para qué sirve la cámara?', '["Para llamar","Para fotos","Para mensajes","Para internet"]', 1, NULL, NULL, 'La cámara sirve para tomar fotos y videos.', 6),
        (2, 'multiple_choice', '¿Qué es WhatsApp?', '["Un juego","Una app de mensajes","Un correo","Un navegador"]', 1, NULL, NULL, 'WhatsApp es una aplicación de mensajería instantánea.', 1),
        (2, 'true_false', 'Por WhatsApp se pueden enviar fotos.', '["Verdadero","Falso"]', 0, NULL, NULL, 'WhatsApp permite enviar fotos, videos y documentos.', 2),
        (2, 'order', 'Ordena: Enviar mensaje', NULL, NULL, '["Escribir","mensaje","Abrir","Enviar"]', '[2,0,1,3]', 'Abre el chat, escribe el mensaje y presiona enviar.', 3),
        (2, 'multiple_choice', '¿Qué es una nota de voz?', '["Un texto","Un mensaje de audio","Una foto","Un video"]', 1, NULL, NULL, 'La nota de voz es un mensaje grabado con tu voz.', 4),
        (2, 'true_false', 'WhatsApp es gratis.', '["Verdadero","Falso"]', 0, NULL, NULL, 'WhatsApp es completamente gratuito.', 5),
        (2, 'multiple_choice', '¿Cómo saber si alguien leyó tu mensaje?', '["Por el sonido","Por las palomitas","Por el color","Por la hora"]', 1, NULL, NULL, 'Las palomitas azules indican que el mensaje fue leído.', 6),
        (3, 'multiple_choice', '¿Qué es un correo electrónico?', '["Una carta digital","Un mensaje de texto","Una llamada","Una foto"]', 0, NULL, NULL, 'El correo electrónico es como una carta pero digital.', 1),
        (3, 'true_false', 'Gmail es un servicio de correo.', '["Verdadero","Falso"]', 0, NULL, NULL, 'Gmail es el servicio de correo de Google.', 2),
        (3, 'order', 'Ordena: Escribir correo', NULL, NULL, '["Nuevo","escribir","destinatario","enviar"]', '[0,2,1,3]', 'Presiona nuevo, escribe destinatario, redacta y envía.', 3),
        (3, 'multiple_choice', '¿Qué es el destinatario?', '["El que recibe","El que envía","El mensaje","El correo"]', 0, NULL, NULL, 'El destinatario es la persona que recibe el correo.', 4),
        (3, 'true_false', 'Se pueden agregar archivos a un correo.', '["Verdadero","Falso"]', 0, NULL, NULL, 'Puedes adjuntar fotos, documentos y más a un correo.', 5),
        (3, 'multiple_choice', '¿Qué es responder un correo?', '["Reenviar","Escribir de vuelta","Borrar","Guardar"]', 1, NULL, NULL, 'Responder es escribir un correo de vuelta a quien te escribió.', 6),
        (4, 'multiple_choice', '¿Qué es internet?', '["Una red mundial","Un programa","Un cable","Una pantalla"]', 0, NULL, NULL, 'Internet es una red que conecta computadoras en todo el mundo.', 1),
        (4, 'true_false', 'El navegador sirve para buscar información.', '["Verdadero","Falso"]', 0, NULL, NULL, 'El navegador te permite buscar y ver páginas web.', 2),
        (4, 'order', 'Ordena: Buscar en internet', NULL, NULL, '["Navegador","escribir","búsqueda","abrir"]', '[0,3,1,2]', 'Abre el navegador, escribe lo que buscas y presiona buscar.', 3),
        (4, 'multiple_choice', '¿Qué es el WiFi?', '["Un cable","Una conexión inalámbrica","Un botón","Una app"]', 1, NULL, NULL, 'El WiFi conecta a internet sin necesidad de cables.', 4),
        (4, 'true_false', 'Se puede ver videos por internet.', '["Verdadero","Falso"]', 0, NULL, NULL, 'En internet puedes ver videos, leer noticias y más.', 5),
        (4, 'multiple_choice', '¿Qué es una página web?', '["Un programa","Un sitio con información","Una imagen","Un video"]', 1, NULL, NULL, 'Una página web es un sitio en internet con información.', 6)
    `);
    console.log('✅ Ejercicios insertados');

    await client.query('COMMIT');
    console.log('🎉 Base de datos poblada exitosamente');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error poblando base de datos:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

await seed();
await pool.end();
