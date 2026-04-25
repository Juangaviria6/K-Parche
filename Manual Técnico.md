Manual Técnico: K´Parche
1. Descripción General del Proyecto
K´Parche es una aplicación móvil desarrollada para la ciudad de Medellín con el objetivo de solucionar la baja visibilidad y gestión de diferentes eventos, fiestas, ferias y actividades de entretenimiento locales. Consiste en una plataforma en la que los usuarios pueden descubrir eventos posicionados en un mapa y los organizadores pueden registrar y publicar sus eventos.
2. Arquitectura del Sistema
La arquitectura del sistema está dividida en varios componentes principales que interactúan entre sí:
•	Aplicación Móvil (Frontend / Client-Side): El punto de interacción con el usuario final. Creada con React Native usando Expo, e implementa navegación por pestañas y enrutamiento basado en archivos.
•	Backend as a Service (BaaS): Se emplea Firebase como el pilar principal de backend en la nube, proporcionando autenticación de usuarios (Firebase Auth) y la persistencia de datos de los eventos, universidades y usuarios (Firestore).
•	Servicio de Moderación (kparche-moderation-service): Un microservicio REST independiente (Node.js + Express + TypeScript) que intercepta y valida las cargas útiles (payloads) de los eventos. Se encarga de aplicar reglas de negocio y aprobar el contenido antes de registrarlo oficialmente usando el Firebase Admin SDK.
•	Gestión Multimedia: Integración con Cloudinary para carga, alojamiento y optimización de imágenes asociadas a los eventos, asegurando alta disponibilidad de los recursos multimedia, optimizando el rendimiento de Firestore.
________________________________________
3. Stack Tecnológico
3.1 Frontend (Aplicación Móvil)
•	Framework Core: React Native (v0.81.5) a través de Expo (v54).
•	Lenguaje: TypeScript (v5.9).
•	Enrutamiento: Expo Router (v6) para navegación basada en sistema de archivos (File-based routing).
•	Mapas y Geolocalización: @rnmapbox/maps (v10.3) para el renderizado del mapa principal, marcas de eventos interactivos y renderizado de ubicaciones de alta calidad.
•	Notificaciones Push: expo-notifications, expo-device y configuración con túneles de desarrollo local mediante Ngrok.
•	Gestión de Estado Core: React Context API (ubicado en context/).
•	Almacenamiento Local: @react-native-async-storage/async-storage.
3.2 Backend y Servicios Nube
•	Bases de datos en tiempo real: Firebase Firestore (v12).
•	Proveedores IAM: Firebase Authentication.
•	Servicios Cloud Externos: Cloudinary.
3.3 Herramientas de Pruebas (Testing y QA)
•	Framework Base: Jest (v29).
•	Librerías RN: @testing-library/react-native, jest-expo.
________________________________________
4. Estructura del Repositorio Móvil
El proyecto sigue una arquitectura predecible optimizada para Expo Router:
text
K-Parche/
├── app/                  # (Expo Router) Pantallas principales de la aplicación.
│   ├── (tabs)/           # Layout y pantallas de la navegación por menús inferiores (bottom-tabs).
│   ├── _layout.tsx       # Root Layout del proyecto, envoltura del contexto o estado global.
│   ├── index.tsx         # Pantalla inicial root o splash lógico.
│   ├── login.tsx         # Pantalla principal de autenticación.
│   ├── event-detail.tsx  # Pantalla de detalle profundo para eventos.
│   └── university-detail.tsx # Pantalla para información asociada a centros universitarios.
├── assets/               # Recursos de imagen locales (Iconos, splashes).
├── components/           # Componentes atómicos/UI reutilizables (Botones, form fields).
├── config/               # Archivos de configuración central (ej. inicialización de firebase).
├── constants/            # Valores inmutables u objetos de temas (Paletas de colores, strings).
├── context/              # Contexto de React para proveedores de estado (Auth Provider, etc).
├── hooks/                # Custom hooks de React (ej. useAuth, useLoadEvents).
├── testing/              # Definición de pruebas unitarias (jest, register.test.tsx, etc).
├── .env                  # Variables de configuración de entorno local.
├── app.json              # Configuración y metadatos explícitos del proyecto Expo.
└── package.json          # Dependencias y scripts del proyecto npm.
________________________________________
5. Casos de Uso Críticos del Sistema
1.	Publicación y Subida de Eventos:
•	Los promotores envían la información del evento, adjuntan imágenes (procesadas y subidas a Cloudinary).
•	La información interceptada por el backend valida los metadatos. El servicio de moderación lo evalúa.
•	El evento se publica en Firestore y se refleja en tiempo real en los mapas de los usuarios.
2.	Autenticación y Seguridad: Firebase asegura las transacciones, y Firebase Rules gestiona los permisos de lecto-escritura en producción. En el cliente, Jest evalúa los tests para los flujos de login y register.
3.	Visualización Espacial (Mapbox): Los usuarios navegan por Medellín, los eventos son extraídos geográficamente y presentados con pines en @rnmapbox/maps.
4.	Sistema de Notificaciones: Expo envía localmente notificaciones a través de los receptores (configurados e iterados usando Ngrok en su fase de desarrollo).
________________________________________
6. Comandos de Operación
Scripts configurados dentro del proyecto (npm / yarn):
•	npm start: Levanta el bundler global (Expo Go).
•	npm run android: Inicia el emulador/app en Android de forma prioritaria.
•	npm run ios: Inicia la aplicación usando iOS Simulator.
•	npm run test: Ejecuta la suite completa de pruebas utilizando Jest.
