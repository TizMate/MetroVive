// Datos de ejemplo. En producción vendrán de PostgreSQL vía API REST.

export const eventos = [
  {
    id: 'junior-vs-nacional',
    nombre: 'Junior FC vs. Atlético Nacional',
    imagen: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop',
    fecha: '2026-08-14',
    hora: '20:00',
    tipo: 'Fútbol · Liga BetPlay',
    estado: 'Confirmado',
    organizador: 'Junior de Barranquilla',
    ubicacion: 'Cancha principal',
    descripcion: 'Clásico de la fecha 6 del todos contra todos. Se espera lleno total en la tribuna Norte.',
    recomendaciones: 'Llega con 90 min de anticipación por el volumen de hinchada. Usa la puerta asignada en tu boleta.',
    permitido: ['Banderas sin palo metálico', 'Cámaras compactas', 'Sombrillas plegables'],
    prohibido: ['Objetos punzantes', 'Bengalas y pirotecnia', 'Bebidas en envase de vidrio'],
    apertura: '17:30',
    ingreso: '18:00 – 19:45',
    cierre: '22:30',
    seguridad: 'Requisa obligatoria en todas las puertas. Menores de 12 años deben ir acompañados.',
  },
  {
    id: 'carnaval-metropolitano',
    nombre: 'Carnaval Metropolitano — Concierto de Orquestas',
    imagen: 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?q=80&w=800&auto=format&fit=crop',
    fecha: '2026-02-20',
    hora: '19:00',
    tipo: 'Concierto · Festival',
    estado: 'Boletería abierta',
    organizador: 'Fundación Carnaval de Barranquilla',
    ubicacion: 'Escenario central + graderías',
    descripcion: 'Noche de orquestas tropicales como cierre de la agenda oficial del Carnaval.',
    recomendaciones: 'Evento familiar. Zona de hidratación gratuita en las graderías Sur y Occidental.',
    permitido: ['Sillas plegables bajas', 'Protector solar', 'Cámaras compactas'],
    prohibido: ['Drones', 'Parlantes portátiles', 'Envases de vidrio'],
    apertura: '16:00',
    ingreso: '16:30 – 18:45',
    cierre: '23:00',
    seguridad: 'Puntos de hidratación e hidratación reforzada por temporada de calor.',
  },
  {
    id: 'seleccion-colombia',
    nombre: 'Selección Colombia — Eliminatorias',
    imagen: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=800&auto=format&fit=crop',
    fecha: '2026-09-09',
    hora: '18:30',
    tipo: 'Fútbol · Selección',
    estado: 'Próximamente',
    organizador: 'Federación Colombiana de Fútbol',
    ubicacion: 'Cancha principal',
    descripcion: 'Partido de local de la Selección Colombia rumbo a la clasificación.',
    recomendaciones: 'Aforo máximo esperado. Se recomienda transporte público por alta congestión vehicular.',
    permitido: ['Banderas sin palo', 'Instrumentos de percusión de mano'],
    prohibido: ['Bengalas', 'Objetos cortopunzantes', 'Bebidas alcohólicas externas'],
    apertura: '15:00',
    ingreso: '15:30 – 18:00',
    cierre: '21:00',
    seguridad: 'Operativo especial de Policía y Bomberos. Rutas de evacuación señalizadas en cada gradería.',
  },
]

export const restaurantes = [
  { nombre: 'Fritos La 84', tipo: 'Comida costeña / fritos', ubicacion: 'Concourse Norte, local 12' },
  { nombre: 'Arepa Bar', tipo: 'Arepas y antojos', ubicacion: 'Concourse Sur, local 4' },
  { nombre: 'Jugos del Caribe', tipo: 'Jugos naturales y bebidas', ubicacion: 'Concourse Oriental, local 7' },
  { nombre: 'Pizza Tribuna', tipo: 'Pizza rápida', ubicacion: 'Concourse Occidental, local 2' },
]

export const parqueaderos = [
  { nombre: 'Parqueadero Norte', capacidad: '~450 vehículos', distancia: '3 min caminando a Puerta 1–3' },
  { nombre: 'Parqueadero Sur', capacidad: '~600 vehículos', distancia: '5 min caminando a Puerta 7–9' },
  { nombre: 'Parqueadero VIP Oriental', capacidad: '~120 vehículos', distancia: '2 min caminando a Puerta 5' },
]

export const transporte = [
  { modo: 'Transmetro', detalle: 'Estación Metropolitano, línea troncal Murillo. Servicio extendido en días de evento.' },
  { modo: 'Buses urbanos', detalle: 'Rutas que conectan con Circunvalar y Murillo con parada frente al estadio.' },
  { modo: 'Taxis', detalle: 'Puntos de embarque señalizados en Puerta 2 y Puerta 8 al finalizar el evento.' },
  { modo: 'Plataformas de transporte', detalle: 'Zona de recogida designada junto al Parqueadero Sur.' },
]

export const emergencias = {
  primerosAuxilios: 'Puestos médicos en graderías Norte, Sur, Oriental y Occidental.',
  policia: 'Comando de Policía Metropolitana ubicado en Puerta 1.',
  bomberos: 'Unidad de Bomberos en espera junto al Parqueadero Norte.',
  salidas: ['Puerta 1 – Norte', 'Puerta 4 – Oriental', 'Puerta 7 – Sur', 'Puerta 10 – Occidental'],
  protocolo: 'Ante cualquier emergencia, dirígete con calma a la salida señalizada más cercana y sigue las instrucciones del personal de logística.',
}

// ---------------------------------------------------------------
// Datos de soporte para el chatbot (Módulo 1, 2 y 3 de StadiumAI).
// En producción esto vendría de PostgreSQL + PostGIS; aquí son
// reglas estáticas suficientes para que el asistente responda con
// datos reales del recinto en vez de texto genérico.
// ---------------------------------------------------------------

// Módulo 1 — Orientación Inteligente: puertas por tribuna.
export const puertas = {
  NORTE: { puertas: ['Puerta 1', 'Puerta 2', 'Puerta 3'], salidaEmergencia: 'Puerta 1' },
  SUR: { puertas: ['Puerta 7', 'Puerta 8', 'Puerta 9'], salidaEmergencia: 'Puerta 7' },
  ORIENTAL: { puertas: ['Puerta 4', 'Puerta 5', 'Puerta 6'], salidaEmergencia: 'Puerta 4' },
  OCCIDENTAL: { puertas: ['Puerta 10', 'Puerta 11', 'Puerta 12'], salidaEmergencia: 'Puerta 10' },
}

// Módulo 1 — Puntos de interés por tribuna (baños, primeros auxilios, tiendas, salidas).
export const pois = [
  { nombre: 'Baño Concourse Norte', categoria: 'BATHROOM', stand: 'NORTE', distancia: '40 m' },
  { nombre: 'Baño Concourse Sur', categoria: 'BATHROOM', stand: 'SUR', distancia: '35 m' },
  { nombre: 'Baño Concourse Oriental', categoria: 'BATHROOM', stand: 'ORIENTAL', distancia: '50 m' },
  { nombre: 'Baño Concourse Occidental', categoria: 'BATHROOM', stand: 'OCCIDENTAL', distancia: '45 m' },
  { nombre: 'Puesto de primeros auxilios Norte', categoria: 'FIRST_AID', stand: 'NORTE', distancia: '60 m' },
  { nombre: 'Puesto de primeros auxilios Sur', categoria: 'FIRST_AID', stand: 'SUR', distancia: '55 m' },
  { nombre: 'Puesto de primeros auxilios Oriental', categoria: 'FIRST_AID', stand: 'ORIENTAL', distancia: '70 m' },
  { nombre: 'Puesto de primeros auxilios Occidental', categoria: 'FIRST_AID', stand: 'OCCIDENTAL', distancia: '65 m' },
  { nombre: 'Fritos La 84', categoria: 'CONCESSION', stand: 'NORTE', distancia: '30 m' },
  { nombre: 'Arepa Bar', categoria: 'CONCESSION', stand: 'SUR', distancia: '25 m' },
  { nombre: 'Jugos del Caribe', categoria: 'CONCESSION', stand: 'ORIENTAL', distancia: '20 m' },
  { nombre: 'Pizza Tribuna', categoria: 'CONCESSION', stand: 'OCCIDENTAL', distancia: '30 m' },
  { nombre: 'Puerta 1 – Norte', categoria: 'EXIT', stand: 'NORTE', distancia: '80 m' },
  { nombre: 'Puerta 7 – Sur', categoria: 'EXIT', stand: 'SUR', distancia: '75 m' },
  { nombre: 'Puerta 4 – Oriental', categoria: 'EXIT', stand: 'ORIENTAL', distancia: '90 m' },
  { nombre: 'Puerta 10 – Occidental', categoria: 'EXIT', stand: 'OCCIDENTAL', distancia: '85 m' },
]

// Módulo 2 — Servicio desde el Asiento: catálogo de productos.
export const productos = [
  { id: 'agua', nombre: 'Agua 500ml', categoria: 'Bebida', precio: 4000 },
  { id: 'gaseosa', nombre: 'Gaseosa 400ml', categoria: 'Bebida', precio: 6000 },
  { id: 'cerveza', nombre: 'Cerveza', categoria: 'Bebida', precio: 9000 },
  { id: 'perro', nombre: 'Perro caliente', categoria: 'Snack', precio: 12000 },
  { id: 'nachos', nombre: 'Nachos con queso', categoria: 'Snack', precio: 14000 },
  { id: 'arepa', nombre: 'Arepa de huevo', categoria: 'Snack', precio: 10000 },
]

// Módulo 3 — Movilidad Inteligente: congestión por puerta (simulada) y recomendación.
export const congestionPuertas = {
  'Puerta 1': 'alta',
  'Puerta 2': 'media',
  'Puerta 3': 'baja',
  'Puerta 4': 'alta',
  'Puerta 5': 'media',
  'Puerta 6': 'baja',
  'Puerta 7': 'media',
  'Puerta 8': 'baja',
  'Puerta 9': 'baja',
  'Puerta 10': 'baja',
  'Puerta 11': 'media',
  'Puerta 12': 'baja',
}
