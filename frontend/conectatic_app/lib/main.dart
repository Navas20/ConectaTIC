import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const ConectaTICApp());
}

class ConectaTICApp extends StatelessWidget {
  const ConectaTICApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ConectaTIC',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF0D47A1),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0D47A1),
        ),
        scaffoldBackgroundColor: const Color(0xFFF4F6FB),
        useMaterial3: true,
      ),
      home: const SplashScreen(),
    );
  }
}

/// 📱 Pantalla 1: Bienvenida
class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.phone_android_rounded,
                size: 90,
              ),
              const SizedBox(height: 16),
              const Text(
                'ConectaTIC',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Aprende a usar tu celular, WhatsApp, correo e Internet paso a paso.',
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const RegisterUserScreen(),
                    ),
                  );
                },
                child: const Text('Comenzar'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// 👤 Pantalla 2: Registro de usuario (llama a tu backend)
class RegisterUserScreen extends StatefulWidget {
  const RegisterUserScreen({super.key});

  @override
  State<RegisterUserScreen> createState() => _RegisterUserScreenState();
}

class _RegisterUserScreenState extends State<RegisterUserScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nombreController = TextEditingController();
  final _correoController = TextEditingController();
  final _contrasenaController = TextEditingController();
  bool _loading = false;
  String? _mensaje;

  Future<void> _registrarUsuario() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _loading = true;
      _mensaje = null;
    });

    try {
      // ⚠️ IMPORTANTE:
      // - Si usas EMULADOR Android: http://10.0.2.2:3000
      // - Si usas CELULAR físico: usa la IP de tu PC, ej: http://192.168.0.10:3000
      final url = Uri.parse('http://10.0.2.2:3000/api/usuarios');

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'nombre': _nombreController.text,
          'correo': _correoController.text,
          'contrasena': _contrasenaController.text,
        }),
      );

      if (response.statusCode == 201) {
        setState(() {
          _mensaje = 'Usuario registrado correctamente';
        });

        if (!mounted) return;
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => const MainMenuScreen(),
          ),
        );
      } else {
        setState(() {
          _mensaje =
              'Error al registrar usuario (${response.statusCode}): ${response.body}';
        });
      }
    } catch (e) {
      setState(() {
        _mensaje = 'Error de conexión con el servidor: $e';
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  void dispose() {
    _nombreController.dispose();
    _correoController.dispose();
    _contrasenaController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Registro rápido'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const Text(
              'Antes de empezar, cuéntanos quién eres.',
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 16),
            Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    controller: _nombreController,
                    decoration: const InputDecoration(
                      labelText: 'Nombre completo',
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) =>
                        value == null || value.isEmpty ? 'Ingresa tu nombre' : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _correoController,
                    decoration: const InputDecoration(
                      labelText: 'Correo (si tienes)',
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) =>
                        value == null || value.isEmpty ? 'Ingresa un correo' : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _contrasenaController,
                    obscureText: true,
                    decoration: const InputDecoration(
                      labelText: 'Contraseña sencilla',
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) => value == null || value.length < 3
                        ? 'Mínimo 3 caracteres'
                        : null,
                  ),
                  const SizedBox(height: 16),
                  if (_mensaje != null)
                    Text(
                      _mensaje!,
                      style: TextStyle(
                        color: _mensaje!.contains('Error') ? Colors.red : Colors.green,
                      ),
                    ),
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _loading ? null : _registrarUsuario,
                      child: _loading
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text('Guardar y continuar'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// 🧭 Pantalla 3: Menú principal
class MainMenuScreen extends StatelessWidget {
  const MainMenuScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final modulos = [
      {'titulo': 'Uso del celular', 'descripcion': 'Botones, ajustes y funciones básicas.'},
      {'titulo': 'WhatsApp', 'descripcion': 'Enviar mensajes, notas de voz y fotos.'},
      {'titulo': 'Correo electrónico', 'descripcion': 'Crear y usar tu correo.'},
      {'titulo': 'Internet', 'descripcion': 'Buscar información de forma segura.'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('ConectaTIC – Menú principal'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: modulos.length,
        itemBuilder: (context, index) {
          final modulo = modulos[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              title: Text(modulo['titulo']!),
              subtitle: Text(modulo['descripcion']!),
              trailing: const Icon(Icons.arrow_forward_ios, size: 18),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => ModuleDetailScreen(
                      titulo: modulo['titulo']!,
                      descripcion: modulo['descripcion']!,
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => const ProgressScreen(),
            ),
          );
        },
        icon: const Icon(Icons.bar_chart),
        label: const Text('Ver progreso'),
      ),
    );
  }
}

/// 📚 Pantalla 4: Detalle de módulo educativo
class ModuleDetailScreen extends StatelessWidget {
  final String titulo;
  final String descripcion;

  const ModuleDetailScreen({
    super.key,
    required this.titulo,
    required this.descripcion,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(titulo),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              titulo,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Text(
              descripcion,
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 24),
            const Text(
              'Ejemplo práctico:',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            const Text(
              'Imagina que quieres enviar un mensaje a un familiar. '
              'Primero abres WhatsApp, luego buscas su nombre en la lista y '
              'tocas su chat. Escribes el mensaje y presionas el botón de enviar.',
            ),
            const SizedBox(height: 24),
            Center(
              child: ElevatedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('¡Muy bien! Has completado este módulo.'),
                    ),
                  );
                },
                icon: const Icon(Icons.check_circle_outline),
                label: const Text('Marcar como entendido'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// 📈 Pantalla 5: Progreso del usuario (simulado)
class ProgressScreen extends StatelessWidget {
  const ProgressScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final progreso = 0.4; // 40% simulado

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mi progreso'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Tu avance en ConectaTIC',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            LinearProgressIndicator(
              value: progreso,
              minHeight: 12,
              borderRadius: BorderRadius.circular(8),
            ),
            const SizedBox(height: 8),
            Text('${(progreso * 100).round()}% completado'),
            const SizedBox(height: 24),
            const Text(
              'A medida que completes más módulos, este porcentaje aumentará. '
              'La idea es que puedas ver tu propio avance y motivarte a seguir aprendiendo.',
            ),
          ],
        ),
      ),
    );
  }
}
