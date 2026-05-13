# MANUAL DE INSTALACIÓN — K-PARCHE
### Guía Técnica de Configuración y Despliegue del Sistema

---

**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Framework:** React Native + Expo  
**Plataforma objetivo:** iOS (iPhone con Expo Go)  

---

## TABLA DE CONTENIDO

1. [Introducción](#1-introducción)
2. [Requisitos Previos](#2-requisitos-previos)
3. [Herramientas Necesarias](#3-herramientas-necesarias)
4. [Clonar el Repositorio](#4-clonar-el-repositorio)
5. [Instalación de Dependencias](#5-instalación-de-dependencias)
6. [Variables de Entorno](#6-variables-de-entorno)
7. [Ejecutar el Proyecto](#7-ejecutar-el-proyecto)
8. [Estructura de la Base de Datos (Firestore)](#8-estructura-de-la-base-de-datos-firestore)
9. [Servicios Externos Utilizados](#9-servicios-externos-utilizados)
10. [Solución de Problemas Comunes](#10-solución-de-problemas-comunes)
11. [Recomendaciones de Mantenimiento](#11-recomendaciones-de-mantenimiento)

---

## 1. Introducción

Este manual describe el proceso de instalación y ejecución del proyecto **K-Parche** en un entorno de desarrollo local. K-Parche es una aplicación móvil desarrollada con **React Native** y **Expo**, visualizada en un dispositivo iPhone a través de la aplicación **Expo Go**.

El proceso de ejecución no requiere compilación nativa, emuladores ni herramientas adicionales más allá de Node.js y la app Expo Go en el dispositivo.

---

## 2. Requisitos Previos

### En el computador (máquina de desarrollo)

| Requisito | Descripción |
|-----------|-------------|
| Sistema Operativo | Windows 10/11, macOS o Linux |
| Node.js | Versión 18 o 20 (LTS) |
| npm | Incluido con Node.js |
| Git | Para clonar el repositorio |
| Conexión a Internet | Requerida durante la instalación |

### En el dispositivo móvil

| Requisito | Descripción |
|-----------|-------------|
| Dispositivo | iPhone con iOS 13 o superior |
| Aplicación | **Expo Go** instalada desde el App Store |
| Red Wi-Fi | El dispositivo y el computador deben estar en la misma red |

---

## 3. Herramientas Necesarias

### 3.1 Node.js y npm

Node.js es el entorno de ejecución necesario para gestionar las dependencias del proyecto e iniciar el servidor de desarrollo.

**Pasos de instalación:**

1. Ir a [https://nodejs.org](https://nodejs.org).
2. Descargar la versión **LTS** (recomendado: Node.js 20).
3. Ejecutar el instalador y seguir el asistente.
4. Verificar la instalación abriendo una terminal y ejecutando:

```bash
node --version
npm --version
```

Ambos comandos deben mostrar un número de versión sin errores.

### 3.2 Git

Git permite clonar el repositorio desde GitHub.

**Instalación:**
- **Windows:** Descargar desde [https://git-scm.com](https://git-scm.com) y ejecutar el instalador.
- **macOS:** Ejecutar `xcode-select --install` en la terminal.
- **Linux (Ubuntu):** `sudo apt install git`

Verificar:
```bash
git --version
```

### 3.3 Expo Go (en el iPhone)

Expo Go es la aplicación que permite visualizar el proyecto directamente en el dispositivo sin necesidad de compilar ni instalar un `.ipa`.

1. Abrir el **App Store** en el iPhone.
2. Buscar **"Expo Go"**.
3. Instalar la aplicación gratuita de Expo.

---

## 4. Clonar el Repositorio

Abrir una terminal en el computador y ejecutar:

```bash
git clone https://github.com/Juangaviria6/K-Parche.git
```

Luego ingresar al directorio del proyecto:

```bash
cd K-Parche
```

Al ingresar, la estructura principal del proyecto es la siguiente:

```
K-Parche/
├── app/
│   ├── (tabs)/
│   ├── index.tsx
│   ├── login.tsx
│   ├── event-detail.tsx
│   └── _layout.tsx
├── components/
├── config/
│   └── firebase.ts
├── constants/
├── context/
├── hooks/
├── assets/
├── .env
├── app.config.js
├── package.json
└── tsconfig.json
```

---

## 5. Instalación de Dependencias

Dentro del directorio del proyecto, ejecutar:

```bash
npm i
```

Este comando lee el archivo `package.json` e instala automáticamente todos los paquetes requeridos. El proceso puede tardar entre 1 y 3 minutos dependiendo de la velocidad de la conexión.

Al finalizar, aparece un mensaje similar a:

```
added 1200 packages in 90s
```

Los paquetes principales que se instalan son:

| Paquete | Versión | Uso |
|---------|---------|-----|
| expo | 54.0.0 | Plataforma principal |
| react | 19.1.0 | Framework de UI |
| react-native | 0.81.5 | Framework móvil |
| firebase | 12.11.0 | Autenticación y base de datos |
| react-native-maps | 1.20.1 | Mapa interactivo |
| expo-router | ~6.0.23 | Navegación entre pantallas |
| expo-image-picker | ~17.0.10 | Acceso a galería y cámara |
| expo-linear-gradient | ~15.0.8 | Efectos visuales de gradiente |
| crypto-js | 4.2.0 | Firma de imágenes para Cloudinary |

> Si aparecen advertencias (`npm warn`) durante la instalación, generalmente pueden ignorarse. Solo los errores (`npm error`) requieren atención.

---

## 6. Variables de Entorno

El proyecto utiliza un archivo `.env` en la raíz para almacenar las credenciales de los servicios externos (Firebase, Mapbox, Cloudinary). Este archivo ya está incluido en el repositorio con las configuraciones del proyecto.

El archivo `.env` contiene las siguientes variables:

```env
# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...

# Mapbox
EXPO_PUBLIC_MAPBOX_TOKEN=...
MAPBOX_DOWNLOAD_TOKEN=...

# Cloudinary
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=...
EXPO_PUBLIC_CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

> No es necesario modificar este archivo para ejecutar el proyecto en modo desarrollo. Las claves ya están configuradas para el entorno de K-Parche.

---

## 7. Ejecutar el Proyecto

### Paso 1 — Iniciar el servidor de desarrollo

En la terminal, dentro del directorio del proyecto, ejecutar:

```bash
npm start
```

Expo iniciará el servidor y mostrará en la terminal un **código QR** junto a un menú de opciones:

```
Metro waiting on exp://192.168.x.x:8081

  › Using Expo Go
  › Press s │ switch to development build
  › Press a │ open Android
  › Press w │ open web
  › Press r │ reload app
  › Press m │ toggle menu
  › Press ? │ show all commands
```

### Paso 2 — Escanear el código QR desde el iPhone

1. Asegurarse de que el iPhone y el computador estén conectados a la **misma red Wi-Fi**.
2. Abrir la **cámara** del iPhone y apuntar al código QR que aparece en la terminal.
3. Tocar la notificación que aparece en la pantalla para abrir en **Expo Go**.
4. La aplicación K-Parche cargará en el dispositivo en pocos segundos.

> Alternativamente, abrir directamente la app **Expo Go** en el iPhone, ir a la pestaña **"Scan QR Code"** y escanear desde allí.

### Resumen del proceso completo

```
1. npm i          ← Instalar dependencias
2. npm start      ← Iniciar servidor Expo
3. Escanear QR    ← Abrir en iPhone con Expo Go
```

---

## 8. Estructura de la Base de Datos (Firestore)

K-Parche usa **Firebase Firestore** como base de datos NoSQL en la nube. Los datos se organizan en dos colecciones principales.

### 8.1 Colección: `events`

Cada documento representa un evento publicado en la plataforma.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `name` | String | Nombre del evento |
| `place` | String | Lugar o dirección |
| `cat` | String | Categoría (ej: `electronica`, `arte`, `academico`) |
| `date` | String | Fecha formateada (ej: "Sáb 15 de Mayo") |
| `dateISO` | String | Fecha ISO 8601 para ordenamiento |
| `time` | String | Hora del evento (ej: "8:00 PM") |
| `price` | Number | Precio en COP. 0 = gratuito |
| `desc` | String | Descripción del evento |
| `img` | String | URL de la imagen en Cloudinary |
| `emoji` | String | Emoji de la categoría |
| `color` | String | Color hexadecimal del marcador en el mapa |
| `latitude` | Number | Latitud de la ubicación |
| `longitude` | Number | Longitud de la ubicación |
| `rating` | Number | Calificación promedio (0.0 – 5.0) |
| `attendees` | Number | Número de asistentes confirmados |
| `createdAt` | Timestamp | Fecha de publicación |
| `plan` | String | Visibilidad: `"public"` o comunidad específica |

**Ejemplo de documento:**

```json
{
  "name": "Festival de Jazz en el Parque",
  "place": "Parque Explora, Medellín",
  "cat": "musica",
  "date": "Sáb 15 de Mayo",
  "dateISO": "2026-05-15",
  "time": "6:00 PM",
  "price": 0,
  "desc": "Una noche de jazz bajo las estrellas.",
  "img": "https://res.cloudinary.com/dlouforsb/image/upload/...",
  "emoji": "🎷",
  "color": "#7C3AED",
  "latitude": 6.2630,
  "longitude": -75.5673,
  "rating": 4.8,
  "attendees": 245,
  "createdAt": "2026-05-01T10:00:00Z",
  "plan": "public"
}
```

### 8.2 Colección: `users`

Cada documento corresponde a un usuario registrado. El ID del documento es el UID generado por Firebase Authentication.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `displayName` | String | Nombre completo del usuario |
| `email` | String | Correo electrónico |
| `photoURL` | String | URL de la foto de perfil |
| `points` | Number | Puntos acumulados |

### 8.3 Datos locales (AsyncStorage)

La app también guarda información en el dispositivo para funcionamiento sin consultas innecesarias a Firestore:

| Clave | Contenido |
|-------|-----------|
| `@kparche_saved_events` | IDs de eventos guardados como favoritos |
| `@kparche_going_events` | IDs de eventos con asistencia confirmada |

---

## 9. Servicios Externos Utilizados

| Servicio | Uso | Plan |
|---------|-----|------|
| **Firebase Auth** | Autenticación de usuarios con correo y contraseña | Gratuito (Spark) |
| **Firestore** | Base de datos de eventos y usuarios | Gratuito (1 GB) |
| **Firebase Storage** | Almacenamiento de archivos | Gratuito (1 GB) |
| **Cloudinary** | Subida y servicio de imágenes de eventos | Gratuito |
| **Mapbox** | Mapas interactivos y geolocalización | Gratuito (50.000 cargas/mes) |

---

## 10. Solución de Problemas Comunes

### La app no aparece en el iPhone al escanear el QR

- Verificar que el iPhone y el computador estén en la **misma red Wi-Fi**.
- Asegurarse de que la app **Expo Go** esté instalada y actualizada.
- Si el problema persiste, ejecutar el servidor con túnel público:

```bash
npx expo start --tunnel
```

### Error: `Unable to find expo in this project`

Ejecutar `npm i` nuevamente y luego `npm start`.

### Error: `Firebase: Error (auth/invalid-api-key)`

Verificar que el archivo `.env` existe en la raíz del proyecto y que contiene todas las variables de Firebase. Reiniciar el servidor después de cualquier cambio al `.env`.

### El mapa aparece en gris o no carga

Verificar que la variable `EXPO_PUBLIC_MAPBOX_TOKEN` en el archivo `.env` sea correcta (debe comenzar con `pk.`).

### Error al subir imágenes al publicar un evento

Verificar las credenciales de Cloudinary en el archivo `.env`. El `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` debe coincidir con el nombre de la cuenta de Cloudinary.

### Error: `Metro bundler failed to start`

Limpiar la caché y reiniciar:

```bash
npx expo start --clear
```

---

## 11. Recomendaciones de Mantenimiento

### Mantener dependencias actualizadas

```bash
# Verificar dependencias desactualizadas
npx expo install --check

# Actualizar dependencias compatibles con la versión de Expo
npx expo install --fix
```

### Monitoreo de Firebase

- Revisar periódicamente el uso en la **consola de Firebase** para no superar los límites del plan gratuito.
- El plan gratuito (Spark) incluye: 1 GB de Firestore, 1 GB de Storage y 10.000 autenticaciones por mes.

### Seguridad

- Mantener el archivo `.env` en el `.gitignore` si se trabaja con credenciales sensibles en otros entornos.
- Revisar las reglas de seguridad de Firestore para que usuarios no autenticados no puedan escribir datos.

---

*K-Parche — Manual de Instalación v1.0 | Mayo 2026*  
*Para soporte técnico, contactar al equipo de desarrollo.*
