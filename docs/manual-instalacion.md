# MANUAL DE INSTALACIÓN — K-PARCHE
### Guía Técnica de Configuración y Despliegue del Sistema

---

**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Framework:** React Native + Expo  
**Plataforma objetivo:** Android / iOS  

---

## TABLA DE CONTENIDO

1. [Introducción](#1-introducción)
2. [Requisitos del Sistema de Desarrollo](#2-requisitos-del-sistema-de-desarrollo)
3. [Herramientas Necesarias](#3-herramientas-necesarias)
4. [Clonar el Repositorio](#4-clonar-el-repositorio)
5. [Instalación de Dependencias](#5-instalación-de-dependencias)
6. [Configuración de Variables de Entorno](#6-configuración-de-variables-de-entorno)
7. [Configuración de Firebase](#7-configuración-de-firebase)
8. [Configuración de Cloudinary](#8-configuración-de-cloudinary)
9. [Configuración de Mapbox](#9-configuración-de-mapbox)
10. [Ejecutar el Proyecto](#10-ejecutar-el-proyecto)
11. [Ejecutar en Dispositivo Físico](#11-ejecutar-en-dispositivo-físico)
12. [Ejecutar en Emulador Android](#12-ejecutar-en-emulador-android)
13. [Compilación para Producción (EAS Build)](#13-compilación-para-producción-eas-build)
14. [Estructura de la Base de Datos (Firestore)](#14-estructura-de-la-base-de-datos-firestore)
15. [Solución de Problemas Comunes](#15-solución-de-problemas-comunes)
16. [Recomendaciones de Mantenimiento](#16-recomendaciones-de-mantenimiento)

---

## 1. Introducción

Este manual describe paso a paso el proceso de instalación, configuración y ejecución del proyecto **K-Parche** en un entorno de desarrollo local. K-Parche es una aplicación móvil desarrollada con **React Native** y **Expo**, que utiliza **Firebase** como backend, **Cloudinary** para almacenamiento de imágenes y **Mapbox** para mapas interactivos.

El presente documento está dirigido a desarrolladores o administradores técnicos que deseen instalar, modificar o mantener el sistema.

---

## 2. Requisitos del Sistema de Desarrollo

El equipo donde se instale el entorno de desarrollo debe cumplir con los siguientes requisitos:

| Requisito | Especificación mínima |
|-----------|----------------------|
| Sistema Operativo | Windows 10/11, macOS 12+, Ubuntu 20.04+ |
| Procesador | Intel Core i5 o equivalente (2 GHz+) |
| RAM | 8 GB (16 GB recomendado) |
| Espacio en disco | 10 GB libres mínimo |
| Conexión a Internet | Requerida para npm y servicios en la nube |

> **Nota:** Para compilar para iOS se requiere un equipo **macOS** con Xcode instalado. En Windows/Linux solo se puede compilar para **Android**.

---

## 3. Herramientas Necesarias

### 3.1 Node.js y npm

Node.js es el entorno de ejecución requerido para Expo y React Native.

**Instalación:**
1. Ir a [https://nodejs.org](https://nodejs.org)
2. Descargar la versión **LTS** (Long Term Support) — se recomienda Node.js 18 o 20.
3. Ejecutar el instalador y seguir los pasos del asistente.
4. Verificar la instalación:

```bash
node --version
# Debe mostrar: v18.x.x o v20.x.x

npm --version
# Debe mostrar: 9.x.x o superior
```

### 3.2 Expo CLI

Expo CLI es la herramienta de línea de comandos para gestionar proyectos Expo.

```bash
npm install -g expo-cli
```

Verificar:
```bash
expo --version
```

### 3.3 EAS CLI (para compilaciones de producción)

EAS (Expo Application Services) permite generar los archivos `.apk` y `.aab` para distribución.

```bash
npm install -g eas-cli
```

### 3.4 Git

Git es necesario para clonar el repositorio y gestionar versiones.

**Instalación:**
- Windows: Descargar desde [https://git-scm.com](https://git-scm.com)
- macOS: Ejecutar `xcode-select --install` en terminal
- Ubuntu: `sudo apt install git`

Verificar:
```bash
git --version
```

### 3.5 Android Studio (opcional — para emulador)

Si se desea probar en un emulador Android sin dispositivo físico:

1. Descargar Android Studio desde [https://developer.android.com/studio](https://developer.android.com/studio).
2. Instalar y abrir Android Studio.
3. Ir a **Tools → AVD Manager → Create Virtual Device**.
4. Seleccionar un dispositivo (recomendado: Pixel 6 con API 33+).
5. Descargar la imagen del sistema y finalizar la creación.

### 3.6 Expo Go (para pruebas rápidas en dispositivo físico)

En el dispositivo móvil:
- **Android:** Buscar "Expo Go" en Google Play Store e instalar.
- **iOS:** Buscar "Expo Go" en App Store e instalar.

---

## 4. Clonar el Repositorio

### 4.1 Clonar desde GitHub

```bash
git clone https://github.com/Juangaviria6/K-Parche.git
```

### 4.2 Ingresar al directorio del proyecto

```bash
cd K-Parche
```

### 4.3 Verificar la estructura del proyecto

Al ingresar al directorio, la estructura principal debe ser la siguiente:

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
├── tsconfig.json
└── eas.json
```

---

## 5. Instalación de Dependencias

Una vez dentro del directorio del proyecto, instalar todas las dependencias de Node.js:

```bash
npm install
```

Este comando lee el archivo `package.json` e instala automáticamente todos los paquetes necesarios, incluyendo:

| Paquete | Versión | Uso |
|---------|---------|-----|
| expo | 54.0.0 | Plataforma principal |
| react | 19.1.0 | Framework de UI |
| react-native | 0.81.5 | Framework móvil |
| firebase | 12.11.0 | Backend y autenticación |
| react-native-maps | 1.20.1 | Mapas interactivos |
| expo-router | ~6.0.23 | Navegación por rutas |
| expo-image-picker | ~17.0.10 | Selector de imágenes |
| expo-linear-gradient | ~15.0.8 | Gradientes visuales |
| crypto-js | 4.2.0 | Encriptación Cloudinary |

> Si aparecen advertencias de dependencias (`npm warn`), generalmente pueden ignorarse. Solo los errores críticos requieren acción.

---

## 6. Configuración de Variables de Entorno

El proyecto usa un archivo `.env` en la raíz del proyecto para almacenar las claves de los servicios externos.

### 6.1 Verificar el archivo .env existente

El repositorio ya incluye un archivo `.env` con las configuraciones públicas necesarias. Verificar que el archivo exista:

```bash
# En Windows
type .env

# En macOS/Linux
cat .env
```

### 6.2 Estructura del archivo .env

El archivo `.env` debe contener las siguientes variables:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key_de_firebase
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Mapbox
EXPO_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...tu_token_publico
MAPBOX_DOWNLOAD_TOKEN=sk.eyJ1...tu_token_secreto

# Cloudinary
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
EXPO_PUBLIC_CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

> **IMPORTANTE:** Las variables que comienzan con `EXPO_PUBLIC_` son accesibles desde el código del cliente. Las que NO tienen ese prefijo (como `CLOUDINARY_API_SECRET`) son solo para builds del servidor y nunca se exponen al cliente.

### 6.3 Crear el archivo .env si no existe

Si el archivo `.env` no existe en el repositorio clonado, crear uno nuevo:

```bash
# En Windows (PowerShell)
New-Item .env -ItemType File

# En macOS/Linux
touch .env
```

Luego agregar las variables usando cualquier editor de texto.

---

## 7. Configuración de Firebase

Firebase es el backend principal de K-Parche. Se usa para autenticación, base de datos y almacenamiento.

### 7.1 Crear un Proyecto en Firebase (si no existe)

1. Ir a [https://console.firebase.google.com](https://console.firebase.google.com).
2. Hacer clic en **Agregar proyecto**.
3. Asignar un nombre al proyecto (ej: `k-parche`).
4. Desactivar Google Analytics si no se requiere y hacer clic en **Crear proyecto**.

### 7.2 Configurar Firebase Authentication

1. En la consola de Firebase, ir a **Authentication → Comenzar**.
2. En la pestaña **Sign-in method**, activar **Correo electrónico/Contraseña**.
3. Guardar los cambios.

### 7.3 Configurar Firestore Database

1. En la consola de Firebase, ir a **Firestore Database → Crear base de datos**.
2. Seleccionar **Iniciar en modo de prueba** (permite lectura/escritura sin restricciones durante 30 días).
3. Seleccionar la ubicación más cercana (recomendado: `us-central1` o `southamerica-east1`).
4. Hacer clic en **Habilitar**.

**Reglas de seguridad recomendadas para producción:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Eventos: cualquiera puede leer, solo usuarios autenticados pueden escribir
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Usuarios: solo el propio usuario puede leer/escribir su perfil
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 7.4 Configurar Firebase Storage

1. En la consola de Firebase, ir a **Storage → Comenzar**.
2. Iniciar en modo de prueba.
3. Hacer clic en **Siguiente** y luego **Listo**.

### 7.5 Obtener las credenciales de Firebase

1. En la consola de Firebase, ir a **Configuración del proyecto** (ícono de engranaje).
2. En la pestaña **General**, desplazarse hasta **Tus apps**.
3. Seleccionar o agregar una app web (ícono `</>`).
4. Copiar el objeto `firebaseConfig` que aparece.
5. Colocar cada valor en el archivo `.env` con el prefijo `EXPO_PUBLIC_FIREBASE_`.

### 7.6 Verificar la conexión en el código

El archivo de configuración de Firebase se encuentra en [config/firebase.ts](config/firebase.ts). Verifica que las variables de entorno se lean correctamente:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

---

## 8. Configuración de Cloudinary

Cloudinary se usa para almacenar y servir las imágenes de los eventos.

### 8.1 Crear una cuenta en Cloudinary

1. Ir a [https://cloudinary.com](https://cloudinary.com) y registrarse (plan gratuito disponible).
2. Desde el **Dashboard**, copiar:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 8.2 Configurar un Upload Preset

1. En Cloudinary, ir a **Settings → Upload → Upload presets**.
2. Hacer clic en **Add upload preset**.
3. Configurar:
   - **Signing mode:** `Unsigned` (para subir desde el cliente sin exponer el secret).
   - **Folder:** `kparche_events` (opcional, para organizar imágenes).
4. Guardar el preset y copiar su nombre.

### 8.3 Agregar credenciales al .env

```env
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
EXPO_PUBLIC_CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

---

## 9. Configuración de Mapbox

Mapbox provee los mapas interactivos de la aplicación.

### 9.1 Crear una cuenta en Mapbox

1. Ir a [https://www.mapbox.com](https://www.mapbox.com) y registrarse (plan gratuito con 50.000 cargas/mes).
2. Desde el **Dashboard → Tokens**, copiar el **Default public token** (comienza con `pk.`).

### 9.2 Crear un Token Secreto (para compilaciones nativas)

1. En Mapbox Dashboard, ir a **Tokens → Create a token**.
2. En los **Secret scopes**, activar `DOWNLOADS:READ`.
3. Hacer clic en **Create token**.
4. Copiar el token secreto generado (comienza con `sk.`).

> **IMPORTANTE:** El token secreto (`sk.`) solo se muestra una vez. Guardarlo en un lugar seguro inmediatamente.

### 9.3 Agregar tokens al .env

```env
EXPO_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...token_publico
MAPBOX_DOWNLOAD_TOKEN=sk.eyJ1...token_secreto
```

### 9.4 Configurar el token de descarga (para Android nativo)

El token secreto de Mapbox se usa durante el proceso de build de Android para descargar las librerías nativas. Se configura en `app.config.js`:

```javascript
// app.config.js
export default {
  // ...
  android: {
    config: {
      googleMaps: { apiKey: process.env.EXPO_PUBLIC_MAPBOX_TOKEN }
    }
  }
};
```

---

## 10. Ejecutar el Proyecto

Con todas las configuraciones en lugar, iniciar el servidor de desarrollo de Expo.

### 10.1 Iniciar el servidor Expo

```bash
npm start
```

O alternativamente:
```bash
npx expo start
```

Al ejecutar este comando, aparece un menú en la terminal con las siguientes opciones:

```
› Press s │ switch to Expo Go
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
› Press r │ reload app
› Press m │ toggle menu
› Press j │ open debugger
```

También se muestra un **código QR** que puede escanearse con Expo Go desde el dispositivo móvil.

### 10.2 Ejecutar en Web (para pruebas rápidas)

```bash
npm run web
```

O desde el menú de Expo, presionar `w`. Se abre automáticamente en el navegador predeterminado.

---

## 11. Ejecutar en Dispositivo Físico

### 11.1 Android

1. En el dispositivo Android, activar las **Opciones de desarrollador**:
   - Ir a **Ajustes → Acerca del teléfono**.
   - Tocar **Número de compilación** 7 veces seguidas.
   - Aparece el mensaje "Ahora eres desarrollador".
2. Ir a **Ajustes → Opciones de desarrollador** y activar **Depuración USB**.
3. Conectar el dispositivo al computador con un cable USB.
4. Aceptar el permiso de depuración que aparece en la pantalla del dispositivo.
5. En la terminal del proyecto, ejecutar:
   ```bash
   npm run android
   ```

### 11.2 iOS (solo macOS)

1. Conectar el dispositivo iOS al Mac con cable USB.
2. Confiar en el computador cuando el dispositivo lo solicite.
3. Ejecutar:
   ```bash
   npm run ios
   ```

### 11.3 Con Expo Go (sin cable)

1. Asegurarse de que el computador y el dispositivo estén en la **misma red Wi-Fi**.
2. Iniciar el servidor con `npm start`.
3. Abrir la app **Expo Go** en el dispositivo.
4. Escanear el código QR que aparece en la terminal.

---

## 12. Ejecutar en Emulador Android

### 12.1 Iniciar el Emulador desde Android Studio

1. Abrir Android Studio.
2. Ir a **Tools → AVD Manager**.
3. Hacer clic en el botón ▶ (Play) junto al dispositivo virtual creado.
4. Esperar a que el emulador inicie completamente.

### 12.2 Conectar Expo al Emulador

Con el emulador corriendo, ejecutar:

```bash
npm run android
```

O desde el menú de Expo en la terminal, presionar `a`.

Expo detectará automáticamente el emulador y desplegará la aplicación.

---

## 13. Compilación para Producción (EAS Build)

Para generar un archivo `.apk` o `.aab` distribuible, se usa EAS Build.

### 13.1 Iniciar sesión en Expo

```bash
eas login
```

Ingresar las credenciales de la cuenta de [expo.dev](https://expo.dev).

### 13.2 Configurar EAS (si es la primera vez)

```bash
eas build:configure
```

Esto configura el archivo `eas.json` con los perfiles de compilación.

### 13.3 Perfiles de Build disponibles

El archivo `eas.json` ya define los siguientes perfiles:

| Perfil | Uso | Comando |
|--------|-----|---------|
| development | Build con cliente de desarrollo | `eas build --profile development --platform android` |
| preview | APK para pruebas internas (sin Play Store) | `eas build --profile preview --platform android` |
| production | Build final para Play Store | `eas build --profile production --platform android` |

### 13.4 Generar APK para pruebas

```bash
eas build --profile preview --platform android
```

El proceso puede tardar entre 10 y 30 minutos. Al finalizar, EAS proporciona un enlace para descargar el archivo `.apk`.

### 13.5 Generar build de producción

```bash
eas build --profile production --platform android
```

Genera un archivo `.aab` (Android App Bundle) listo para subir a Google Play Store.

---

## 14. Estructura de la Base de Datos (Firestore)

### 14.1 Colección: `events`

Cada documento en esta colección representa un evento publicado en K-Parche.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `name` | String | Nombre del evento |
| `place` | String | Lugar o dirección del evento |
| `type` | String | Tipo/categoría del evento |
| `cat` | String | Categoría para filtros (ej: `electronica`, `arte`) |
| `date` | String | Fecha formateada para mostrar (ej: "Sáb 10 de Mayo") |
| `dateISO` | String | Fecha en formato ISO 8601 para ordenamiento |
| `time` | String | Hora del evento (ej: "8:00 PM") |
| `price` | Number | Precio en pesos colombianos. 0 = gratuito |
| `desc` | String | Descripción del evento |
| `img` | String | URL de la imagen en Cloudinary |
| `emoji` | String | Emoji representativo de la categoría |
| `color` | String | Color hexadecimal del marcador en el mapa |
| `latitude` | Number | Latitud de la ubicación del evento |
| `longitude` | Number | Longitud de la ubicación del evento |
| `rating` | Number | Calificación promedio del evento (0.0 - 5.0) |
| `attendees` | Number | Número de asistentes confirmados |
| `createdAt` | Timestamp | Fecha y hora de creación del evento |
| `plan` | String | Visibilidad: `"public"` o identificador de comunidad |

**Ejemplo de documento:**

```json
{
  "name": "Festival de Jazz en el Parque",
  "place": "Parque Explora, Medellín",
  "type": "concierto",
  "cat": "musica",
  "date": "Sáb 15 de Mayo",
  "dateISO": "2026-05-15",
  "time": "6:00 PM",
  "price": 0,
  "desc": "Una noche de jazz bajo las estrellas en el corazón de Medellín.",
  "img": "https://res.cloudinary.com/dlouforsb/image/upload/v1234/kparche_events/jazz.jpg",
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

### 14.2 Colección: `users`

Cada documento corresponde a un usuario registrado. El ID del documento es el UID de Firebase Authentication.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `displayName` | String | Nombre completo del usuario |
| `email` | String | Correo electrónico |
| `photoURL` | String | URL de la foto de perfil |
| `points` | Number | Puntos acumulados por el usuario |

**Ejemplo de documento:**

```json
{
  "displayName": "Juan García",
  "email": "juan@example.com",
  "photoURL": "https://res.cloudinary.com/...",
  "points": 150
}
```

### 14.3 Datos locales (AsyncStorage)

Además de Firestore, la app guarda datos localmente en el dispositivo:

| Clave | Tipo | Contenido |
|-------|------|-----------|
| `@kparche_saved_events` | Array de strings | IDs de eventos guardados por el usuario |
| `@kparche_going_events` | Array de strings | IDs de eventos con asistencia confirmada |

---

## 15. Solución de Problemas Comunes

### Error: `Unable to find expo in this project`

**Solución:** Ejecutar `npm install` nuevamente en el directorio raíz del proyecto.

### Error: `Firebase: Error (auth/invalid-api-key)`

**Causa:** Las variables de entorno de Firebase no están configuradas correctamente.  
**Solución:** Verificar que el archivo `.env` existe y contiene las claves correctas. Reiniciar el servidor con `npm start`.

### Error: `Network request failed` al subir imágenes

**Causa:** Las credenciales de Cloudinary son incorrectas o el preset no está configurado.  
**Solución:** Verificar las credenciales de Cloudinary en `.env` y que el upload preset esté en modo `Unsigned`.

### El mapa no carga o muestra fondo gris

**Causa:** El token de Mapbox es inválido o no tiene los permisos correctos.  
**Solución:** Verificar que `EXPO_PUBLIC_MAPBOX_TOKEN` en `.env` sea el token público correcto (comienza con `pk.`).

### Error en compilación Android: `Mapbox download failed`

**Causa:** El `MAPBOX_DOWNLOAD_TOKEN` no está configurado o es inválido.  
**Solución:** Asegurarse de que el token secreto de Mapbox (comienza con `sk.`) esté en el archivo `.env` como `MAPBOX_DOWNLOAD_TOKEN`.

### La app no carga en Expo Go

**Solución:**
1. Verificar que el dispositivo y el computador estén en la misma red Wi-Fi.
2. Apagar firewalls temporalmente si hay problemas de conectividad.
3. Probar con `expo start --tunnel` para usar un túnel público.

```bash
npx expo start --tunnel
```

### Error: `Metro bundler failed to start`

**Solución:**
```bash
# Limpiar caché de Metro y reiniciar
npx expo start --clear
```

---

## 16. Recomendaciones de Mantenimiento

### Actualizar Dependencias

Verificar actualizaciones de Expo regularmente:

```bash
# Ver dependencias desactualizadas
npx expo install --check

# Actualizar dependencias de Expo
npx expo install --fix
```

### Monitoreo de Firebase

- Revisar periódicamente la cuota de uso en la consola de Firebase.
- El plan gratuito (Spark) incluye: 1 GB de Firestore, 1 GB de Storage, 10.000 Auth/mes.
- Configurar alertas de presupuesto si se migra al plan Blaze.

### Respaldos de Firestore

Realizar exportaciones periódicas de la base de datos:

```bash
# Usando gcloud CLI
gcloud firestore export gs://tu-bucket-de-respaldo
```

### Seguridad

- Rotar las claves de API periódicamente (especialmente las de Cloudinary y Mapbox).
- Revisar y actualizar las reglas de seguridad de Firestore.
- Mantener el archivo `.env` fuera del control de versiones (verificar que esté en `.gitignore`).

### Logs y Depuración

Para ver los logs de la aplicación en tiempo real:

```bash
# Logs de Metro bundler
npm start

# Logs de Android
npx react-native log-android

# Usar el depurador de Expo
# En el menú de Expo presionar 'j' para abrir el debugger en el navegador
```

---

*K-Parche — Manual de Instalación v1.0 | Mayo 2026*  
*Para soporte técnico, contactar al equipo de desarrollo.*
