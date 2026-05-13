# MODELO DE ANÁLISIS — K-PARCHE
### Documento de Análisis y Diseño del Sistema

---

**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Metodología:** Orientada a Objetos  
**Notación:** UML (Unified Modeling Language)  

---

## TABLA DE CONTENIDO

1. [Descripción General del Sistema](#1-descripción-general-del-sistema)
2. [Objetivos del Sistema](#2-objetivos-del-sistema)
3. [Actores del Sistema](#3-actores-del-sistema)
4. [Casos de Uso](#4-casos-de-uso)
5. [Modelo de Clases](#5-modelo-de-clases)
6. [Diagrama de Estados](#6-diagrama-de-estados)
7. [Modelo de Datos (Firestore)](#7-modelo-de-datos-firestore)
8. [Diagrama de Componentes](#8-diagrama-de-componentes)
9. [Diagrama de Arquitectura](#9-diagrama-de-arquitectura)
10. [Requisitos Funcionales](#10-requisitos-funcionales)
11. [Requisitos No Funcionales](#11-requisitos-no-funcionales)
12. [Restricciones del Sistema](#12-restricciones-del-sistema)

---

## 1. Descripción General del Sistema

**K-Parche** es una aplicación móvil multiplataforma (Android e iOS) destinada a centralizar y visibilizar los eventos culturales, académicos, gastronómicos y de entretenimiento en Medellín y su área metropolitana. La aplicación actúa como un marketplace de eventos, conectando a organizadores y asistentes a través de un mapa interactivo y un sistema de publicación abierto.

### Contexto del Problema

La ciudad de Medellín posee una vibrante oferta cultural y de entretenimiento, sin embargo, la falta de un canal unificado de difusión genera baja asistencia a eventos pequeños y medianos. Las redes sociales, aunque útiles, no ofrecen geolocalización ni filtrado eficiente por categoría, precio o proximidad. Las comunidades universitarias, en particular, carecen de una plataforma dedicada para sus eventos.

### Solución Propuesta

K-Parche integra:
- **Geolocalización y mapas** para descubrir eventos cercanos de forma visual.
- **Sistema de publicación** abierto para cualquier organizador registrado.
- **Módulo universitario** exclusivo para la comunidad estudiantil.
- **Gamificación** mediante puntos y niveles para incentivar la participación.

---

## 2. Objetivos del Sistema

### Objetivo General

Desarrollar una aplicación móvil que permita a los usuarios de Medellín descubrir, guardar y confirmar asistencia a eventos locales, y a los organizadores publicar y gestionar sus eventos de manera sencilla.

### Objetivos Específicos

| # | Objetivo |
|---|---------|
| OE-01 | Proveer un mapa interactivo que muestre la ubicación georreferenciada de los eventos disponibles |
| OE-02 | Implementar un sistema de autenticación con tres perfiles de usuario: General, Estudiante y Organización |
| OE-03 | Permitir la publicación de eventos con información detallada, imagen y localización exacta |
| OE-04 | Ofrecer un módulo universitario con eventos exclusivos para estudiantes verificados |
| OE-05 | Implementar un sistema de puntos y niveles que incentive la participación activa |
| OE-06 | Almacenar los eventos de interés del usuario para consulta futura sin conexión |

---

## 3. Actores del Sistema

### 3.1 Definición de Actores

```
┌─────────────────────────────────────────────────────────────────┐
│                     ACTORES DEL SISTEMA                         │
├─────────────────┬───────────────────────────────────────────────┤
│ Actor           │ Descripción                                    │
├─────────────────┼───────────────────────────────────────────────┤
│ Usuario General │ Persona registrada que descubre y asiste a     │
│                 │ eventos sin restricciones de tipo.              │
├─────────────────┼───────────────────────────────────────────────┤
│ Estudiante      │ Usuario con correo institucional (.edu.co)      │
│                 │ que accede a módulos universitarios exclusivos. │
├─────────────────┼───────────────────────────────────────────────┤
│ Organización    │ Empresa o grupo que publica y gestiona eventos  │
│                 │ en la plataforma.                               │
├─────────────────┼───────────────────────────────────────────────┤
│ Administrador   │ Gestiona usuarios, eventos y configuración      │
│ (Firebase)      │ del sistema desde Firebase Console.            │
├─────────────────┼───────────────────────────────────────────────┤
│ Sistema         │ Servicios externos: Firebase, Cloudinary,       │
│ (Externo)       │ Mapbox. Procesan datos y proveen servicios.    │
└─────────────────┴───────────────────────────────────────────────┘
```

### 3.2 Jerarquía de Actores

```
                    ┌──────────────┐
                    │   Usuario    │  ← Actor base
                    │   Registrado │
                    └──────┬───────┘
                           │ hereda
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │  Usuario    │  │ Estudiante  │  │Organización │
   │  General    │  │(.edu.co)    │  │             │
   └─────────────┘  └─────────────┘  └─────────────┘
```

---

## 4. Casos de Uso

### 4.1 Diagrama General de Casos de Uso

```
┌──────────────────────────────────────────────────────────────────────┐
│                        SISTEMA K-PARCHE                              │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                   Gestión de Autenticación                  │    │
│  │  ○ Registrarse          ○ Iniciar sesión    ○ Cerrar sesión │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                   Exploración de Eventos                    │    │
│  │  ○ Ver mapa de eventos  ○ Filtrar por categoría             │    │
│  │  ○ Filtrar por precio   ○ Ver detalle de evento             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                   Gestión Personal                          │    │
│  │  ○ Guardar evento       ○ Confirmar asistencia              │    │
│  │  ○ Ver mis boletas      ○ Ver mis puntos                    │    │
│  │  ○ Ver beneficios                                           │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                   Publicación de Eventos                    │    │
│  │  ○ Crear evento         ○ Subir imagen                      │    │
│  │  ○ Geolocalizar evento  ○ Publicar evento                   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              Módulo Universitario (Estudiantes)             │    │
│  │  ○ Ver eventos universitarios   ○ Ver eventos InterU        │    │
│  │  ○ Ver detalle de universidad                               │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 4.2 Especificación de Casos de Uso Principales

---

#### CU-01: Registrarse en el Sistema

| Campo | Descripción |
|-------|-------------|
| **ID** | CU-01 |
| **Nombre** | Registrarse en el sistema |
| **Actor principal** | Usuario (cualquier tipo) |
| **Precondición** | El usuario no tiene cuenta registrada |
| **Postcondición** | Se crea un perfil en Firebase Auth y Firestore |

**Flujo Principal:**
1. El usuario abre la aplicación.
2. El sistema muestra la pantalla de login.
3. El usuario selecciona el tipo de cuenta (General / Estudiante / Organización).
4. El usuario ingresa nombre, correo electrónico y contraseña.
5. El usuario toca **Registrarse**.
6. El sistema valida que el correo no esté registrado y que la contraseña tenga al menos 6 caracteres.
7. El sistema crea el usuario en Firebase Authentication.
8. El sistema crea el documento de perfil en Firestore (`users/{uid}`).
9. El sistema redirige al usuario al mapa principal.

**Flujos Alternativos:**
- **FA-01:** El correo ya está registrado → El sistema muestra el mensaje "Este correo ya está en uso".
- **FA-02:** La contraseña es muy corta → El sistema muestra "La contraseña debe tener al menos 6 caracteres".
- **FA-03:** El estudiante usa un correo que no termina en `.edu.co` → El sistema muestra un mensaje de validación.

---

#### CU-02: Explorar Eventos en el Mapa

| Campo | Descripción |
|-------|-------------|
| **ID** | CU-02 |
| **Nombre** | Explorar eventos en el mapa |
| **Actor principal** | Usuario Registrado |
| **Precondición** | El usuario está autenticado |
| **Postcondición** | El usuario visualiza los eventos disponibles |

**Flujo Principal:**
1. El usuario accede a la pestaña **Explorar**.
2. El sistema carga los eventos desde Firestore en tiempo real.
3. El sistema muestra los eventos como marcadores en el mapa interactivo de Mapbox.
4. El usuario puede desplazarse por el mapa y hacer zoom.
5. El usuario toca un marcador para ver la tarjeta resumen del evento.
6. El usuario toca la tarjeta para ver el detalle completo.

**Flujos Alternativos:**
- **FA-01:** No hay eventos disponibles → El mapa se muestra sin marcadores.
- **FA-02:** Sin conexión → El sistema muestra un mensaje de error de conexión.

---

#### CU-03: Publicar un Evento

| Campo | Descripción |
|-------|-------------|
| **ID** | CU-03 |
| **Nombre** | Publicar un evento |
| **Actor principal** | Usuario Registrado (principalmente Organización) |
| **Precondición** | El usuario está autenticado |
| **Postcondición** | El evento se crea en Firestore y aparece en el mapa |

**Flujo Principal:**
1. El usuario accede a la pestaña **Publicar**.
2. **Paso 1 — Información Básica:**
   - Ingresa nombre del evento.
   - Ingresa lugar.
   - Selecciona imagen desde galería o cámara.
   - Selecciona categoría.
3. **Paso 2 — Detalles:**
   - Selecciona fecha y hora.
   - Ingresa precio (0 si es gratis).
   - Ingresa descripción.
   - Toca el mapa para fijar la ubicación exacta.
   - Selecciona visibilidad (Público / Comunidad).
4. **Paso 3 — Confirmación:**
   - Revisa el resumen completo.
   - Toca **Publicar**.
5. El sistema sube la imagen a Cloudinary.
6. El sistema guarda el evento en Firestore.
7. El sistema redirige al mapa donde el nuevo evento ya es visible.

**Flujos Alternativos:**
- **FA-01:** Error al subir imagen → El sistema muestra un mensaje de error y permite reintentar.
- **FA-02:** Campos obligatorios vacíos → El sistema resalta los campos faltantes.

---

#### CU-04: Confirmar Asistencia a un Evento

| Campo | Descripción |
|-------|-------------|
| **ID** | CU-04 |
| **Nombre** | Confirmar asistencia |
| **Actor principal** | Usuario Registrado |
| **Precondición** | El usuario está autenticado y visualiza el detalle de un evento |
| **Postcondición** | Se registra la asistencia, se suman 50 puntos al usuario y el evento aparece en "Mis boletas" |

**Flujo Principal:**
1. El usuario abre el detalle de un evento.
2. El usuario toca **Confirmar asistencia**.
3. El sistema registra el ID del evento en AsyncStorage (`@kparche_going_events`).
4. El sistema suma 50 puntos al usuario en Firestore (`users/{uid}.points`).
5. El sistema muestra una confirmación visual.
6. El evento aparece en **Mis boletas** en el perfil del usuario.

**Flujos Alternativos:**
- **FA-01:** El usuario ya confirmó asistencia previamente → El sistema muestra el estado "Ya confirmaste".

---

#### CU-05: Acceder a Eventos Universitarios (InterU)

| Campo | Descripción |
|-------|-------------|
| **ID** | CU-05 |
| **Nombre** | Acceder a eventos InterU |
| **Actor principal** | Estudiante |
| **Precondición** | El usuario está autenticado con correo `.edu.co` |
| **Postcondición** | El usuario visualiza los eventos InterU disponibles |

**Flujo Principal:**
1. El usuario navega a la pestaña **Uni**.
2. El usuario selecciona la pestaña **InterU**.
3. El sistema verifica que el correo del usuario termina en `.edu.co`.
4. El sistema muestra los eventos inter-universitarios disponibles.
5. El usuario puede tocar cualquier evento para ver su detalle.

**Flujos Alternativos:**
- **FA-01:** El usuario no tiene correo `.edu.co` → El sistema muestra un mensaje indicando que esta sección es exclusiva para estudiantes.

---

## 5. Modelo de Clases

### 5.1 Diagrama de Clases Principal

```
┌─────────────────────────────┐
│           Usuario           │
├─────────────────────────────┤
│ - uid: string               │
│ - displayName: string       │
│ - email: string             │
│ - photoURL: string          │
│ - points: number            │
│ - tipoUsuario: TipoUsuario  │
├─────────────────────────────┤
│ + registrarse(): void       │
│ + iniciarSesion(): void     │
│ + cerrarSesion(): void      │
│ + obtenerNivel(): string    │
│ + guardarEvento(id): void   │
│ + confirmarAsistencia(): void│
└──────────────┬──────────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
┌─────────┐ ┌──────────┐ ┌──────────────┐
│Usuario  │ │Estudiante│ │Organización  │
│General  │ ├──────────┤ ├──────────────┤
└─────────┘ │correoEdu │ │nombreOrg     │
            │:string   │ │descripcion   │
            ├──────────┤ └──────────────┘
            │accederIU()│
            └──────────┘

┌───────────────────────────────┐
│            Evento             │
├───────────────────────────────┤
│ - id: string                  │
│ - name: string                │
│ - place: string               │
│ - cat: CategoriaEvento        │
│ - date: string                │
│ - dateISO: string             │
│ - time: string                │
│ - price: number               │
│ - desc: string                │
│ - img: string (URL)           │
│ - emoji: string               │
│ - color: string               │
│ - latitude: number            │
│ - longitude: number           │
│ - rating: number              │
│ - attendees: number           │
│ - createdAt: Date             │
│ - plan: string                │
├───────────────────────────────┤
│ + publicar(): Promise<void>   │
│ + obtenerDetalles(): Evento   │
└───────────────────────────────┘

┌───────────────────────────────┐
│          Universidad          │
├───────────────────────────────┤
│ - id: string                  │
│ - nombre: string              │
│ - descripcion: string         │
│ - imagen: string              │
│ - eventos: Evento[]           │
├───────────────────────────────┤
│ + obtenerEventos(): Evento[]  │
└───────────────────────────────┘

┌──────────────────────────────┐
│  <<enumeration>>             │
│    CategoriaEvento           │
├──────────────────────────────┤
│  TODOS                       │
│  ELECTRONICA                 │
│  GASTRONOMIA                 │
│  CONCIERTO                   │
│  ARTE                        │
│  ACADEMICO                   │
│  INTEGRACION                 │
│  MUSICA                      │
└──────────────────────────────┘

┌──────────────────────────────┐
│  <<enumeration>>             │
│    TipoUsuario               │
├──────────────────────────────┤
│  GENERAL                     │
│  ESTUDIANTE                  │
│  ORGANIZACION                │
└──────────────────────────────┘

┌──────────────────────────────┐
│  <<enumeration>>             │
│    NivelUsuario              │
├──────────────────────────────┤
│  NUEVO_PARCHE (0-99)         │
│  PARCHE_REGULAR (100-299)    │
│  PARCHE_VIP (300-499)        │
│  EMBAJADOR (500+)            │
└──────────────────────────────┘
```

### 5.2 Relaciones entre Clases

| Relación | Descripción | Multiplicidad |
|---------|-------------|---------------|
| Usuario — Evento | Un usuario puede guardar muchos eventos | 1 a * |
| Usuario — Evento | Un usuario puede confirmar asistencia a muchos eventos | 1 a * |
| Organización — Evento | Una organización puede publicar muchos eventos | 1 a * |
| Universidad — Evento | Una universidad puede tener muchos eventos | 1 a * |
| Estudiante — Universidad | Un estudiante pertenece a una universidad | * a 1 |

---

## 6. Diagrama de Estados

### 6.1 Estados de la Sesión de Usuario

```
        ┌─────────┐
        │  INICIO │ ← App abierta
        └────┬────┘
             │ splash (2.5s)
             ▼
      ┌──────────────┐
      │  NO AUTENT.  │ ← Pantalla de login
      └──────┬───────┘
             │ login exitoso
             ▼
      ┌──────────────┐
      │  AUTENTICADO │ ← Mapa principal
      └──────┬───────┘
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
┌───────┐ ┌──────┐ ┌──────┐
│EXPLOR.│ │PERFIL│ │PUBLICAR│
└───────┘ └──┬───┘ └──────┘
             │ cerrar sesión
             ▼
      ┌──────────────┐
      │  NO AUTENT.  │
      └──────────────┘
```

### 6.2 Estados de un Evento (desde perspectiva del usuario)

```
        ┌──────────────────┐
        │   DESCUBIERTO    │ ← Usuario ve el marcador en el mapa
        └────────┬─────────┘
                 │ toca el evento
                 ▼
        ┌──────────────────┐
        │  DETALLE VISTO   │ ← Usuario lee la información completa
        └───────┬──────────┘
                │
      ┌─────────┼──────────┐
      ▼         ▼          ▼
  ┌───────┐ ┌──────────┐ ┌──────────┐
  │NINGUNA│ │  GUARDADO │ │ASISTENCIA│
  │ACCIÓN │ │(favorito) │ │CONFIRMADA│
  └───────┘ └──────────┘ └────┬─────┘
                               │
                               ▼
                       ┌──────────────┐
                       │  EN MIS      │
                       │  BOLETAS     │ (+50 puntos)
                       └──────────────┘
```

### 6.3 Estados del Proceso de Publicación

```
  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
  │  PASO 1  │ →  │  PASO 2  │ →  │  PASO 3  │ →  │PUBLICADO │
  │Info básica│    │ Detalles │    │Confirmac.│    │(Firestore)│
  └──────────┘    └──────────┘    └──────────┘    └──────────┘
       ↑               ↑               ↑
       │               │               │
       └───────────────┴───────────────┘
              (puede retroceder con "Atrás")
```

---

## 7. Modelo de Datos (Firestore)

### 7.1 Esquema Entidad-Relación Conceptual

```
┌───────────────────┐         ┌───────────────────────┐
│      USUARIO      │         │        EVENTO          │
├───────────────────┤         ├───────────────────────┤
│ uid (PK)          │         │ id (PK)               │
│ displayName       │         │ name                  │
│ email             │ guarda  │ place                 │
│ photoURL          │─────────│ cat                   │
│ points            │ confirma│ date / dateISO         │
└───────────────────┘         │ time                  │
                              │ price                 │
                              │ desc                  │
                              │ img (URL Cloudinary)   │
                              │ latitude / longitude  │
                              │ rating                │
                              │ attendees             │
                              │ createdAt             │
                              │ plan                  │
                              └───────────────────────┘

┌───────────────────────────────────────────────────────┐
│                ALMACENAMIENTO LOCAL                    │
│              (AsyncStorage del dispositivo)            │
├───────────────────────────────────────────────────────┤
│ @kparche_saved_events  →  [ "eventId1", "eventId2" ]  │
│ @kparche_going_events  →  [ "eventId3", "eventId4" ]  │
└───────────────────────────────────────────────────────┘
```

### 7.2 Modelo de Datos de Firestore

```
Firestore Database
│
├── 📁 events/
│   ├── 📄 {eventId_1}
│   │   ├── name: "Festival de Jazz"
│   │   ├── place: "Parque Explora"
│   │   ├── cat: "musica"
│   │   ├── date: "Sáb 15 de Mayo"
│   │   ├── dateISO: "2026-05-15"
│   │   ├── time: "6:00 PM"
│   │   ├── price: 0
│   │   ├── desc: "Descripción del evento..."
│   │   ├── img: "https://res.cloudinary.com/..."
│   │   ├── emoji: "🎷"
│   │   ├── color: "#7C3AED"
│   │   ├── latitude: 6.2630
│   │   ├── longitude: -75.5673
│   │   ├── rating: 4.8
│   │   ├── attendees: 245
│   │   ├── createdAt: Timestamp
│   │   └── plan: "public"
│   └── 📄 {eventId_2} ...
│
└── 📁 users/
    ├── 📄 {uid_1}
    │   ├── displayName: "Juan García"
    │   ├── email: "juan@example.com"
    │   ├── photoURL: "https://..."
    │   └── points: 150
    └── 📄 {uid_2} ...
```

---

## 8. Diagrama de Componentes

### 8.1 Componentes de la Aplicación

```
┌──────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                      │
│                     (React Native / Expo)                    │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Splash   │  │  Login   │  │  Tabs    │  │ Modales  │   │
│  │ Screen   │  │  Screen  │  │ Layout   │  │(Detalles)│   │
│  └──────────┘  └──────────┘  └────┬─────┘  └──────────┘   │
│                                   │                          │
│              ┌────────────────────┼────────────────────┐    │
│              ▼           ▼        ▼       ▼            ▼    │
│         ┌────────┐ ┌──────────┐ ┌───────┐ ┌──────┐ ┌─────┐│
│         │Explorar│ │   Uni   │ │Guardad│ │Public│ │Perfil││
│         │(Mapa)  │ │         │ │os     │ │ar    │ │      ││
│         └────────┘ └──────────┘ └───────┘ └──────┘ └─────┘│
└──────────────────────────────────────────────────────────────┘
                            │
                  ┌─────────▼──────────┐
                  │    CAPA DE LÓGICA  │
                  │    (Context / Hooks)│
                  │                    │
                  │ ┌──────────────┐   │
                  │ │ AuthContext  │   │
                  │ └──────────────┘   │
                  │ ┌──────────────┐   │
                  │ │ SavedContext │   │
                  │ └──────────────┘   │
                  │ ┌──────────────┐   │
                  │ │useFilteredEv.│   │
                  │ └──────────────┘   │
                  │ ┌──────────────┐   │
                  │ │useEventsByIds│   │
                  │ └──────────────┘   │
                  └─────────┬──────────┘
                            │
                  ┌─────────▼──────────┐
                  │   CAPA DE DATOS    │
                  │                    │
                  │ ┌──────────────┐   │
                  │ │   Firebase   │   │
                  │ │   (Auth,     │   │
                  │ │   Firestore, │   │
                  │ │   Storage)   │   │
                  │ └──────────────┘   │
                  │ ┌──────────────┐   │
                  │ │AsyncStorage  │   │
                  │ │(Local Cache) │   │
                  │ └──────────────┘   │
                  └─────────┬──────────┘
                            │
                  ┌─────────▼──────────┐
                  │  SERVICIOS EXTERNOS│
                  │                    │
                  │ ┌──────┐ ┌───────┐ │
                  │ │Cloud-│ │Mapbox │ │
                  │ │inary │ │(Mapas)│ │
                  │ └──────┘ └───────┘ │
                  └────────────────────┘
```

### 8.2 Componentes Reutilizables

| Componente | Ubicación | Función |
|-----------|-----------|---------|
| `EventCard` | components/EventCard.tsx | Tarjeta visual de evento (orientación vertical y horizontal) |
| `CategoryPill` | components/CategoryPill.tsx | Botón de filtro de categoría con accesibilidad |
| `MapPinMarker` | components/MapPinMarker.tsx | Marcador personalizado en el mapa de Mapbox |
| `UniCard` | components/UniCard.tsx | Tarjeta de universidad para el módulo Uni |

---

## 9. Diagrama de Arquitectura

### 9.1 Arquitectura General del Sistema

```
╔═══════════════════════════════════════════════════════════════╗
║                    CLIENTE MÓVIL                             ║
║                  (React Native + Expo)                       ║
║                                                              ║
║   ┌──────────────────────────────────────────────────────┐  ║
║   │                  Expo Router (Navegación)            │  ║
║   │  /index → /login → /(tabs)/* → /event-detail         │  ║
║   └──────────────────────────────────────────────────────┘  ║
║                                                              ║
║   ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  ║
║   │ AuthContext│  │SavedContext│  │   React Native Maps  │  ║
║   │(Firebase   │  │(AsyncStore │  │   (Mapbox SDK)       │  ║
║   │  Auth)     │  │+ Firestore)│  │                      │  ║
║   └────────────┘  └────────────┘  └──────────────────────┘  ║
╚═══════════════════════╤═══════════════════════════════════════╝
                        │ HTTPS / REST / WebSocket
          ┌─────────────┼──────────────────┐
          ▼             ▼                  ▼
╔══════════════╗ ╔══════════════╗ ╔═══════════════╗
║   FIREBASE   ║ ║  CLOUDINARY  ║ ║    MAPBOX     ║
║              ║ ║              ║ ║               ║
║ ┌──────────┐ ║ ║  Almacena y  ║ ║  Tiles de     ║
║ │   Auth   │ ║ ║  transforma  ║ ║  mapa,        ║
║ └──────────┘ ║ ║  imágenes    ║ ║  geocodif.    ║
║ ┌──────────┐ ║ ║              ║ ║               ║
║ │Firestore │ ║ ╚══════════════╝ ╚═══════════════╝
║ │(NoSQL DB)│ ║
║ └──────────┘ ║
║ ┌──────────┐ ║
║ │ Storage  │ ║
║ └──────────┘ ║
╚══════════════╝
```

### 9.2 Patrón de Arquitectura

K-Parche sigue una arquitectura **MVVM simplificada** adaptada a React:

| Capa | Tecnología | Responsabilidad |
|------|-----------|-----------------|
| **View (V)** | Componentes React Native + Pantallas Expo Router | Renderizado de UI e interacción con el usuario |
| **ViewModel (VM)** | React Context + Custom Hooks | Gestión de estado, lógica de presentación |
| **Model (M)** | Firebase SDK + AsyncStorage | Persistencia de datos local y en la nube |

---

## 10. Requisitos Funcionales

| ID | Módulo | Descripción | Prioridad |
|----|--------|-------------|-----------|
| RF-01 | Autenticación | El sistema debe permitir el registro de usuarios con correo y contraseña | Alta |
| RF-02 | Autenticación | El sistema debe validar correos `.edu.co` para el perfil de Estudiante | Alta |
| RF-03 | Mapa | El sistema debe mostrar los eventos en un mapa interactivo georreferenciado | Alta |
| RF-04 | Mapa | El sistema debe permitir filtrar eventos por categoría y por rango de precio | Alta |
| RF-05 | Eventos | El sistema debe mostrar información detallada de cada evento al seleccionarlo | Alta |
| RF-06 | Eventos | El sistema debe permitir guardar eventos en favoritos localmente | Media |
| RF-07 | Eventos | El sistema debe registrar la confirmación de asistencia y otorgar 50 puntos | Alta |
| RF-08 | Publicación | El sistema debe permitir publicar eventos con imagen, categoría, fecha y ubicación | Alta |
| RF-09 | Publicación | El sistema debe subir imágenes a Cloudinary y guardar la URL en Firestore | Alta |
| RF-10 | Universidades | El sistema debe mostrar una sección de eventos universitarios | Media |
| RF-11 | Universidades | El sistema debe mostrar eventos InterU solo a usuarios con correo `.edu.co` | Media |
| RF-12 | Gamificación | El sistema debe calcular el nivel del usuario según los puntos acumulados | Media |
| RF-13 | Perfil | El sistema debe mostrar los eventos confirmados como boletas en el perfil | Media |
| RF-14 | Soporte | El sistema debe proveer un canal de soporte al usuario | Baja |

---

## 11. Requisitos No Funcionales

| ID | Categoría | Descripción |
|----|-----------|-------------|
| RNF-01 | **Rendimiento** | La aplicación debe cargar el mapa con marcadores en menos de 3 segundos con conexión 4G |
| RNF-02 | **Disponibilidad** | Firebase garantiza 99.95% de disponibilidad en sus servicios |
| RNF-03 | **Usabilidad** | La interfaz debe seguir principios de diseño móvil (botones táctiles mínimo 44x44 dp) |
| RNF-04 | **Seguridad** | Las contraseñas se gestionan exclusivamente a través de Firebase Auth (nunca almacenadas en texto plano) |
| RNF-05 | **Seguridad** | Las claves API sensibles no deben exponerse en el código fuente del cliente |
| RNF-06 | **Escalabilidad** | Firestore escala automáticamente para soportar el crecimiento en número de eventos y usuarios |
| RNF-07 | **Compatibilidad** | La aplicación debe funcionar en Android 8.0+ e iOS 13+ |
| RNF-08 | **Mantenibilidad** | El código debe usar TypeScript con tipado estricto para facilitar el mantenimiento |
| RNF-09 | **Accesibilidad** | Los componentes de UI deben incluir `accessibilityRole` y `accessibilityLabel` |
| RNF-10 | **Portabilidad** | El proyecto debe poder compilarse tanto para Android como para iOS desde el mismo código fuente |

---

## 12. Restricciones del Sistema

| # | Restricción | Descripción |
|---|-------------|-------------|
| R-01 | **Conectividad** | La mayoría de las funciones requieren conexión a internet activa |
| R-02 | **Plataforma iOS** | La compilación para iOS solo puede realizarse desde un equipo macOS |
| R-03 | **GPS** | La geolocalización del usuario requiere que el permiso de ubicación esté activado |
| R-04 | **Imágenes** | El tamaño máximo de imagen para eventos es de 10 MB (limitación de Cloudinary en plan gratuito) |
| R-05 | **Firebase gratuito** | El plan Spark de Firebase limita: 1 GB Firestore, 1 GB Storage, 10.000 autenticaciones/mes |
| R-06 | **Mapbox gratuito** | El plan gratuito de Mapbox incluye 50.000 cargas de mapa por mes |
| R-07 | **TypeScript** | Todo el código debe estar tipado con TypeScript; no se permiten tipos `any` explícitos |
| R-08 | **Correo `.edu.co`** | La verificación de estudiante depende del dominio del correo; no se realiza verificación documental |

---

*K-Parche — Modelo de Análisis v1.0 | Mayo 2026*
