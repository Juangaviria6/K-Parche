# MANUAL DE USUARIO — K-PARCHE
### Sistema de Descubrimiento y Publicación de Eventos en Medellín

---

**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Plataforma:** Android / iOS  
**Desarrollado por:** Equipo K-Parche  

---

## TABLA DE CONTENIDO

1. [Introducción](#1-introducción)
2. [Requisitos del Dispositivo](#2-requisitos-del-dispositivo)
3. [Instalación de la Aplicación](#3-instalación-de-la-aplicación)
4. [Acceso y Autenticación](#4-acceso-y-autenticación)
5. [Interfaz Principal — Explorar](#5-interfaz-principal--explorar)
6. [Módulo de Universidades](#6-módulo-de-universidades)
7. [Módulo de Eventos Guardados](#7-módulo-de-eventos-guardados)
8. [Publicar un Evento](#8-publicar-un-evento)
9. [Perfil de Usuario](#9-perfil-de-usuario)
10. [Detalle de Eventos](#10-detalle-de-eventos)
11. [Sistema de Puntos y Niveles](#11-sistema-de-puntos-y-niveles)
12. [Mis Boletas](#12-mis-boletas)
13. [Notificaciones](#13-notificaciones)
14. [Soporte](#14-soporte)
15. [Recomendaciones de Uso](#15-recomendaciones-de-uso)

---

## 1. Introducción

**K-Parche** es una aplicación móvil diseñada para conectar a los habitantes de Medellín y su área metropolitana con los eventos culturales, académicos, gastronómicos y de entretenimiento que suceden a su alrededor. La plataforma permite a los usuarios descubrir planes mediante un mapa interactivo, publicar sus propios eventos, guardar favoritos y acumular puntos por participación.

### Objetivo de la Aplicación

K-Parche resuelve el problema de baja visibilidad que tienen los eventos locales, especialmente universitarios y comunitarios, brindando un espacio centralizado donde organizadores y asistentes se encuentran fácilmente.

### Tipos de Usuario

| Tipo | Descripción |
|------|-------------|
| **Usuario General** | Cualquier persona registrada que desea descubrir y asistir a eventos |
| **Estudiante** | Usuario con correo institucional (`.edu.co`) que accede a eventos universitarios e InterU |
| **Organización** | Empresa o grupo que publica eventos en la plataforma |

---

## 2. Requisitos del Dispositivo

Para utilizar K-Parche correctamente, el dispositivo debe cumplir los siguientes requisitos mínimos:

| Requisito | Mínimo |
|-----------|--------|
| Sistema Operativo | Android 8.0 (Oreo) o iOS 13 |
| Almacenamiento disponible | 150 MB |
| RAM | 2 GB |
| Conexión a Internet | Requerida (Wi-Fi o datos móviles) |
| GPS / Ubicación | Recomendado para mapa interactivo |
| Cámara / Galería | Requerida para publicar eventos |

---

## 3. Instalación de la Aplicación

### Opción A — Dispositivos Android (APK directo)

1. Descargar el archivo `.apk` desde el enlace proporcionado por el administrador.
2. En el dispositivo Android, ir a **Ajustes → Seguridad → Orígenes desconocidos** y activar la opción para permitir instalaciones externas.
3. Abrir el archivo `.apk` descargado y tocar **Instalar**.
4. Esperar a que finalice la instalación y tocar **Abrir**.

### Opción B — Expo Go (entorno de desarrollo)

1. Instalar la aplicación **Expo Go** desde Google Play Store o App Store.
2. Escanear el código QR proporcionado por el desarrollador desde la terminal (`expo start`).
3. La aplicación se cargará automáticamente en Expo Go.

> **Nota:** La versión de producción estará disponible en Google Play Store bajo el nombre **K-Parche**.

---

## 4. Acceso y Autenticación

### 4.1 Pantalla de Bienvenida (Splash)

Al abrir la aplicación por primera vez, se muestra la pantalla de carga con el logo de K-Parche durante aproximadamente 2.5 segundos, después de lo cual se redirige automáticamente a la pantalla de inicio de sesión.

### 4.2 Pantalla de Login

La pantalla de autenticación ofrece tres modos de acceso según el tipo de usuario:

- **Usuario** — Acceso con correo electrónico común y contraseña.
- **Estudiante** — Acceso con correo institucional que termine en `.edu.co`.
- **Organización** — Acceso para empresas o grupos organizadores de eventos.

### 4.3 Crear una Cuenta

1. En la pantalla de login, seleccionar el tipo de usuario correspondiente.
2. Tocar el botón **Crear cuenta** o **Registrarse**.
3. Completar los campos requeridos:
   - Nombre completo
   - Correo electrónico
   - Contraseña (mínimo 6 caracteres)
4. Tocar **Registrarse**.
5. El sistema crea el perfil en Firebase Authentication y redirige automáticamente al mapa principal.

### 4.4 Iniciar Sesión

1. Ingresar el correo electrónico y contraseña registrados.
2. Tocar **Iniciar sesión**.
3. Si las credenciales son correctas, se accede directamente al mapa de exploración.

### 4.5 Cerrar Sesión

Desde la pantalla de **Perfil**, al final de la página se encuentra el botón **Cerrar sesión**. Al tocarlo, el usuario vuelve a la pantalla de login.

---

## 5. Interfaz Principal — Explorar

La pantalla principal de K-Parche es un **mapa interactivo** que muestra los eventos disponibles en Medellín y el área metropolitana mediante marcadores visuales.

### 5.1 Componentes del Mapa

| Elemento | Función |
|----------|---------|
| Marcadores de color | Indican la ubicación de cada evento. El color varía según la categoría |
| Pin seleccionado | Al tocar un marcador, aparece una tarjeta emergente con información del evento |
| Botón de ubicación | Centra el mapa en la posición actual del usuario |

### 5.2 Filtros de Búsqueda

En la parte superior de la pantalla se encuentran los filtros disponibles:

**Filtro por Categoría (píldoras horizontales):**

| Categoría | Descripción |
|-----------|-------------|
| Todos | Muestra todos los eventos disponibles |
| Electrónica | Eventos de música electrónica |
| Gastronomía | Festivales y eventos de comida |
| Concierto | Shows y presentaciones musicales |
| Arte | Exposiciones, galerías y eventos artísticos |
| Académico | Conferencias, charlas y eventos universitarios |
| Integración | Eventos sociales y de networking |
| Música | Eventos musicales variados |

**Filtro por Precio:**

| Opción | Descripción |
|--------|-------------|
| Todos | Sin restricción de precio |
| Gratis | Solo eventos gratuitos |
| Hasta $25.000 | Eventos con entrada hasta $25.000 COP |
| Hasta $50.000 | Eventos con entrada hasta $50.000 COP |

### 5.3 Usar los Filtros

1. Deslizar horizontalmente las píldoras de categoría para ver todas las opciones.
2. Tocar una categoría para filtrar los marcadores en el mapa.
3. Tocar el botón de precio para filtrar por rango económico.
4. Los filtros son combinables (categoría + precio al mismo tiempo).
5. Tocar **Todos** para restablecer los filtros.

### 5.4 Ver un Evento desde el Mapa

1. Tocar cualquier marcador en el mapa.
2. Aparece una tarjeta emergente con: nombre, categoría, precio y hora del evento.
3. Tocar la tarjeta para ver el **Detalle completo** del evento.

---

## 6. Módulo de Universidades

Accesible desde la barra de navegación inferior (ícono de birrete universitario).

### 6.1 Pestañas Disponibles

**Pestaña Uni:**
- Muestra las universidades disponibles en la plataforma.
- Cada tarjeta universitaria incluye: nombre, descripción, número de eventos activos y fotografía.
- Tocar una tarjeta para ver el **Detalle de la Universidad** con sus eventos asociados.

**Pestaña InterU:**
- Sección exclusiva para **estudiantes** verificados (correo `.edu.co`).
- Muestra eventos colaborativos entre múltiples universidades.
- Fomenta la integración estudiantil y el networking universitario.

### 6.2 Filtrar Eventos Universitarios

Dentro de la sección Uni, los eventos pueden filtrarse por:
- Categoría (académico, integración, etc.)
- Precio

---

## 7. Módulo de Eventos Guardados

Accesible desde la barra de navegación inferior (ícono de marcador o corazón).

### 7.1 Guardar un Evento

1. Al ver el detalle de cualquier evento, tocar el botón de guardar (ícono de corazón o marcador).
2. El evento queda almacenado localmente en el dispositivo.
3. Una notificación visual confirma que el evento fue guardado.

### 7.2 Ver Eventos Guardados

1. Ir a la pestaña **Guardados** en la barra de navegación inferior.
2. Se listan todos los eventos previamente guardados.
3. Tocar cualquier evento guardado para ver su detalle completo.

### 7.3 Eliminar un Evento Guardado

1. En la pantalla de detalle del evento guardado, tocar nuevamente el botón de guardar.
2. El evento se elimina de la lista de guardados.

---

## 8. Publicar un Evento

Accesible desde la barra de navegación inferior (ícono de más "+").

El proceso de publicación consta de **3 pasos** guiados.

### Paso 1 — Información Básica

| Campo | Descripción |
|-------|-------------|
| Nombre del evento | Título que verán los usuarios en el mapa |
| Lugar | Nombre del establecimiento o dirección del evento |
| Imagen | Fotografía principal del evento (desde galería o cámara) |
| Tipo de evento | Seleccionar la categoría correspondiente |

**Para agregar una imagen:**
1. Tocar el área de imagen o el botón de cámara.
2. Seleccionar entre **Galería** o **Cámara**.
3. Elegir o capturar la fotografía.
4. La imagen se sube automáticamente a Cloudinary.

### Paso 2 — Detalles del Evento

| Campo | Descripción |
|-------|-------------|
| Fecha | Seleccionar del calendario |
| Hora | Indicar hora de inicio |
| Precio | En pesos colombianos (COP). Ingresar 0 si es gratuito |
| Descripción | Texto descriptivo del evento (máximo recomendado: 300 caracteres) |
| Ubicación en mapa | Tocar el mapa para fijar las coordenadas exactas del evento |
| Plan de visibilidad | Seleccionar si el evento es **Público** o solo para una comunidad específica |

### Paso 3 — Confirmación y Publicación

1. Revisar el resumen con toda la información ingresada.
2. Si todo es correcto, tocar **Publicar**.
3. El evento se guarda en Firestore y aparece en el mapa para todos los usuarios.
4. Si hay algún error, usar el botón **Atrás** para corregir la información.

> **Recomendación:** Usar imágenes de alta calidad (mínimo 800x600 px) y descripciones claras para atraer más asistentes.

---

## 9. Perfil de Usuario

Accesible desde la barra de navegación inferior (ícono de persona).

### 9.1 Información Visible en el Perfil

| Sección | Contenido |
|---------|-----------|
| Foto de perfil | Imagen de avatar del usuario |
| Nombre | Nombre completo registrado |
| Correo | Dirección de correo electrónico |
| Nivel | Nivel actual según puntos acumulados |
| Puntos | Total de puntos K-Parche acumulados |
| Mis planes | Eventos creados por el usuario |

### 9.2 Opciones Disponibles en el Perfil

- **Mis boletas** — Ver los eventos confirmados y sus boletas digitales.
- **Beneficios** — Ver los beneficios disponibles según el nivel actual.
- **Actividad** — Historial de eventos visitados y acciones realizadas.
- **Notificaciones** — Configurar y revisar notificaciones.
- **Soporte** — Acceder al canal de ayuda.
- **Cerrar sesión** — Salir de la cuenta actual.

### 9.3 Editar Perfil

Actualmente la edición de perfil se realiza directamente desde la sección de perfil. Tocar el ícono de edición junto a la foto o nombre para actualizar la información.

---

## 10. Detalle de Eventos

Al tocar cualquier evento (desde el mapa, guardados o universidades), se abre la pantalla de detalle.

### 10.1 Información Mostrada

| Campo | Descripción |
|-------|-------------|
| Imagen del evento | Foto principal a tamaño completo |
| Nombre | Título del evento |
| Fecha y hora | Cuándo se realiza |
| Lugar | Nombre y dirección |
| Categoría | Tipo de evento con emoji representativo |
| Precio | Valor de entrada (o "Gratis") |
| Descripción | Información detallada del evento |
| Mapa integrado | Mini mapa mostrando la ubicación exacta |
| Calificación | Rating del evento (estrellas) |
| Asistentes | Número de usuarios que confirmaron asistencia |

### 10.2 Acciones Disponibles en el Detalle

| Botón | Función |
|-------|---------|
| Guardar (corazón) | Añadir/quitar el evento de favoritos |
| Confirmar asistencia | Registrar que el usuario asistirá (+50 puntos) |
| Compartir | Compartir el evento con otras personas |

### 10.3 Confirmar Asistencia

1. En la pantalla de detalle, tocar **Confirmar asistencia** o **Voy a ir**.
2. El sistema registra la asistencia y otorga **50 puntos** al usuario.
3. El evento aparece en la sección **Mis boletas** del perfil.
4. Una animación o mensaje confirma la acción exitosamente.

---

## 11. Sistema de Puntos y Niveles

K-Parche cuenta con un sistema de gamificación que premia la participación activa de los usuarios.

### 11.1 Cómo Ganar Puntos

| Acción | Puntos |
|--------|--------|
| Confirmar asistencia a un evento | +50 puntos |

### 11.2 Niveles de Usuario

| Nivel | Puntos Requeridos | Descripción |
|-------|-------------------|-------------|
| Nuevo Parche | 0 – 99 puntos | Usuario recién llegado a la plataforma |
| Parche Regular | 100 – 299 puntos | Usuario activo con varios eventos confirmados |
| Parche VIP | 300 – 499 puntos | Usuario frecuente con acceso a beneficios especiales |
| Embajador | 500+ puntos | Nivel máximo, representante de la comunidad K-Parche |

### 11.3 Ver Beneficios por Nivel

1. Ir a **Perfil → Beneficios**.
2. Se muestran los beneficios actuales según el nivel del usuario.
3. Los beneficios pueden incluir descuentos, accesos exclusivos o reconocimientos en la plataforma.

---

## 12. Mis Boletas

Accesible desde **Perfil → Mis boletas**.

Esta sección muestra los eventos en los que el usuario confirmó asistencia. Cada boleta contiene:

- Nombre del evento
- Fecha y hora
- Lugar
- Código de confirmación (referencia de asistencia)

Las boletas pueden usarse como comprobante de registro para ingresar al evento en algunos casos.

---

## 13. Notificaciones

Accesible desde **Perfil → Notificaciones**.

Desde esta sección el usuario puede:

- Ver el historial de notificaciones recibidas.
- Activar o desactivar tipos de notificaciones.
- Recibir alertas sobre eventos guardados próximos a realizarse.

---

## 14. Soporte

Accesible desde **Perfil → Soporte**.

K-Parche ofrece soporte disponible las 24 horas. Desde esta sección el usuario puede:

- Consultar preguntas frecuentes (FAQ).
- Enviar un mensaje al equipo de soporte.
- Reportar un problema con un evento o con la aplicación.

---

## 15. Recomendaciones de Uso

### Para Asistentes

- Mantener la ubicación GPS activa para ver eventos cercanos correctamente.
- Guardar eventos de interés antes de que se agoten los cupos.
- Confirmar asistencia solo a eventos a los que realmente se va a asistir.
- Revisar la pestaña **InterU** si se es estudiante para acceder a eventos exclusivos.

### Para Organizadores

- Subir imágenes de alta calidad para aumentar la visibilidad del evento.
- Completar todos los campos del formulario para mejorar la experiencia del usuario.
- Publicar con al menos 3 días de anticipación para maximizar el alcance.
- Verificar que las coordenadas en el mapa sean precisas para facilitar la llegada de los asistentes.

### Seguridad y Privacidad

- No compartir las credenciales de acceso con terceros.
- Reportar cualquier evento o contenido inapropiado a través del módulo de Soporte.
- La aplicación solo usa la ubicación del dispositivo para mostrar el mapa; no almacena coordenadas del usuario en servidores externos.

---

*K-Parche — Encuentra tu próximo plan en Medellín*  
*Versión 1.0 | Mayo 2026*
