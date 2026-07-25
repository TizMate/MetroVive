# STADIUMAI — CLAUDE SYSTEM CONTEXT & TECHNICAL DEVELOPMENT SKILL

> **Document Type:** AI Agent Context / System Prompt / Engineering Specification
> **Target LLM/Agent:** Claude 3.5 Sonnet / Claude 3 Opus
> **Project:** StadiumAI — Estadio Metropolitano Roberto Meléndez (Barranquilla, Colombia)
> **Role:** Lead Architect & Principal Software Engineer
> **Version:** 1.0.0 (MVP & Scaling Specification)

---

## 1. PROJECT OVERVIEW & DOMAIN CONTEXT

### 1.1 Mission & Vision
**StadiumAI** is a smart venue platform designed to transform the event experience at the **Estadio Metropolitano Roberto Meléndez** in Barranquilla, Colombia (capacity ~46,000+ spectators). The system combines natural language AI orchestration, geospatial venue mapping, real-time logistics, and smart crowd mobility management to solve high-density crowd bottlenecks.

### 1.2 Core Domain Challenges
1. **Massive Cellular Saturation:** During peak match hours, 4G/5G networks experience heavy congestion. All critical operations (seat lookup, offline map rendering, cached order state) MUST work with minimal bandwidth consumption.
2. **High Concurrency Order Spikes:** Half-time (15-minute window) creates extreme order volume. Ordering workflows must be asynchronous, queued, and deterministically dispatched to nearest runners.
3. **Geospatial Precision:** Estadio Metropolitano is structured into 4 main stands (*Occidental, Oriental, Norte, Sur*), split into *Alta* (Upper) and *Baja* (Lower) tiers, divided into blocks (*bloques*), rows (*filas*), and seats (*sillas*). Spatial queries must resolve seat positions and nearby Points of Interest (POIs) in under 50ms.

---

## 2. ARCHITECTURAL PRINCIPLES & LAWS

When writing code, designing APIs, or proposing solutions for StadiumAI, you MUST adhere strictly to the following principles:

1. **AI as Orchestrator, NOT Business Logic:**
   - The LLM (Gemini / Claude) **NEVER** computes prices, processes payments, manages inventory, or decides runner assignments directly.
   - The LLM's sole responsibility is **Intent Classification**, **Entity Extraction**, **Function Calling Execution**, and **Natural Language Formatting**.
   - Business rules, state machines, and calculations reside strictly inside NestJS services and PostgreSQL triggers.

2. **Offline-First & Graceful Degradation (Mobile):**
   - Essential stadium vector maps, seat indices, and emergency POIs must be pre-cached on the mobile client (using Hive / SQLite).
   - If network drops, natural language chat fails gracefully back to structured UI buttons without crashing.

3. **Deterministic & Strongly Typed APIs:**
   - All backend endpoints use strict DTOs validated via `class-validator` in NestJS.
   - LLM function calling outputs MUST strictly conform to JSON Schema definitions.

4. **Event-Driven Asynchronous Processing:**
   - Orders and status transitions use **Redis Pub/Sub** and **BullMQ** job queues to prevent HTTP worker thread blocking during half-time order bursts.

---

## 3. TECHNICAL STACK SPECIFICATION

| Component | Technology | Version / Tooling | Primary Responsibility |
| :--- | :--- | :--- | :--- |
| **Mobile App** | Flutter (Dart) | >= 3.22 | Cross-platform app, 2D/3D stadium map rendering (Flutter Map / Custom Painters), offline local storage (Hive), SSE/WebSocket client. |
| **Backend Framework** | NestJS | Node.js v20 LTS | Modular microservice-ready API Gateway, WebSocket Gateway, REST controllers, BullMQ producers. |
| **Database** | PostgreSQL | v16 + PostGIS extension | Spatial indexing (`ST_DWithin`, `ST_Distance`), transactional ACID support for orders and seat catalog. |
| **Cache & Queue** | Redis | v7.x | High-speed cache, session management, Pub/Sub events, BullMQ order dispatch queues. |
| **AI Orchestration** | Gemini API / Vertex AI | Gemini 1.5 Flash / Pro | Structured outputs, intent router, function calling schema execution. |
| **Cloud & Push** | GCP & Firebase | Cloud Run, FCM, Cloud Storage | Scalable serverless hosting, low-latency push notifications for order status and crowd traffic alerts. |

---

## 4. SYSTEM ARCHITECTURE & DATA FLOW

```
                       +-----------------------------------+
                       |    Flutter Mobile Application     |
                       | (Offline Cache / Interactive UI) |
                       +-----------------+-----------------+
                                         |
                                         | REST / WebSockets
                                         v
                       +-----------------------------------+
                       |        NestJS API Gateway         |
                       |  (Auth Guard, Rate Limiter, DTOs) |
                       +-----------------+-----------------+
                                         |
             +---------------------------+---------------------------+
             |                                                       |
             v                                                       v
+--------------------------+                               +--------------------+
|  AI Intent Router Module |                               |  Core Business     |
| (Gemini Function Calling)|                               |  Modules (NestJS)  |
+------------+-------------+                               +---------+----------+
             |                                                       |
             | Extract Intent & Params                               |
             +--------------------------+----------------------------+
                                        |
                                        v
                    +---------------------------------------+
                    |           Data Services               |
                    |  - PostGIS Geo Query Service          |
                    |  - In-Seat Order Dispatcher Service   |
                    |  - Mobility & Crowd Analytics Engine  |
                    +-------------------+-------------------+
                                        |
                +-----------------------+-----------------------+
                |                                               |
                v                                               v
  +---------------------------+                   +---------------------------+
  | PostgreSQL + PostGIS DB   |                   | Redis + BullMQ Queue      |
  | (Seats, POIs, Orders,     |                   | (Live Order Processing,   |
  |  Users, Inventory)        |                   |  WebSocket Events)        |
  +---------------------------+                   +---------------------------+
```

---

## 5. DATABASE SCHEMA & ENTITY MODELS (PostgreSQL + PostGIS)

Below is the database schema definition required for StadiumAI development.

```sql
-- Enable PostGIS Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enum Types
CREATE TYPE user_role AS ENUM ('SPECTATOR', 'RUNNER', 'ADMIN', 'LOGISTICS');
CREATE TYPE stand_zone AS ENUM ('OCCIDENTAL', 'ORIENTAL', 'NORTE', 'SUR');
CREATE TYPE tier_level AS ENUM ('ALTA', 'BAJA', 'PALCO');
CREATE TYPE order_status AS ENUM ('PENDING', 'ACCEPTED', 'PREPARING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED');
CREATE TYPE poi_type AS ENUM ('GATE', 'BATHROOM', 'CONCESSION', 'FIRST_AID', 'EXIT', 'POLICE');

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    role user_role DEFAULT 'SPECTATOR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stadium Structure / Seat Catalog
CREATE TABLE stadium_seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stand stand_zone NOT NULL,
    tier tier_level NOT NULL,
    block_number INT NOT NULL,  -- e.g., Bloque 4
    row_number INT NOT NULL,    -- e.g., Fila 12
    seat_number INT NOT NULL,   -- e.g., Silla 8
    location GEOMETRY(Point, 4326) NOT NULL, -- Spatial Coordinate (Lat, Lon)
    gate_access VARCHAR(50) NOT NULL, -- Primary gate (e.g., "Puerta 4")
    UNIQUE(stand, tier, block_number, row_number, seat_number)
);

-- Points of Interest (POIs)
CREATE TABLE stadium_pois (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category poi_type NOT NULL,
    stand stand_zone NOT NULL,
    tier tier_level NOT NULL,
    description TEXT,
    location GEOMETRY(Point, 4326) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Products & Inventory
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Beverage, Snack, Merchandise
    price NUMERIC(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255)
);

-- In-Seat Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spectator_id UUID REFERENCES users(id),
    runner_id UUID REFERENCES users(id),
    seat_id UUID REFERENCES stadium_seats(id),
    status order_status DEFAULT 'PENDING',
    total_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL
);

-- Spatial Indices for fast queries
CREATE INDEX idx_seats_spatial ON stadium_seats USING GIST(location);
CREATE INDEX idx_pois_spatial ON stadium_pois USING GIST(location);
```

---

## 6. MODULE-BY-MODULE SPECIFICATIONS

### MÓDULO 1: ORIENTACIÓN INTELIGENTE (Smart Navigation & Wayfinding)

#### Functionality
- Resolves natural language user queries such as:
  - *"¿Dónde queda mi silla en Occidental Baja, bloque 3, fila 10, silla 12?"*
  - *"¿Cuál es el baño más cercano y menos congestionado?"*
  - *"Necesito el punto de primeros auxilios más cercano."*
- Returns formatted steps, vector coordinates for rendering on Flutter Map, and distance in meters.

#### PostGIS Spatial Query Example (Nearest Bathroom)
```sql
SELECT 
    p.id, p.name, p.description,
    ST_Distance(p.location::geography, s.location::geography) AS distance_meters
FROM stadium_pois p, stadium_seats s
WHERE s.id = $1 -- User's Current Seat ID
  AND p.category = 'BATHROOM'
  AND p.is_active = TRUE
ORDER BY p.location <-> s.location
LIMIT 3;
```

---

### MÓDULO 2: SERVICIO INTELIGENTE DESDE EL ASIENTO (In-Seat Ordering & Dispatch)

#### Functionality
1. Spectator orders snacks/beverages via natural chat or visual catalog.
2. NestJS validates stock, creates `PENDING` order, pushes job to BullMQ queue.
3. Runner Assignment Algorithm:
   - Evaluates active runners assigned to the same **Stand + Tier** quadrant.
   - Assigns order to runner with lowest active batch payload (`< 4 active orders`).
   - Computes optimized delivery route order.
4. Real-time updates pushed via WebSockets to spectator and runner.

#### Order State Machine Diagram
```
  [PENDING] ---> (Runner Accepts) ---> [ACCEPTED]
     |                                    |
     v (Timeout / No Runner)              v (Preparing at Concession)
  [CANCELLED]                         [PREPARING]
                                          |
                                          v (Runner en route to seat)
                                      [IN_TRANSIT]
                                          |
                                          v (Handed to spectator)
                                      [DELIVERED]
```

---

### MÓDULO 3: MOVILIDAD INTELIGENTE (Ingress / Egress Crowd Management)

#### Functionality
- Monitors gate occupation rates (input from barcode scanners / manual congestion reports).
- Generates dynamic recommendations post-match to prevent stampedes and bottlenecking at key exit corridors (*Puerta 1, Puerta 4, Metrovia access*).
- System triggers push broadcasts: *"Atención Occidental Alta: Se recomienda salir por Puerta 6 hacia la Av. Murillo debido a alta congestión en Puerta 4."*

---

## 7. AI ORCHESTRATION & FUNCTION CALLING SPECIFICATION

The AI layer uses **Gemini 1.5 Function Calling** (Structured JSON Output). Claude/Engineers MUST structure tool definitions according to this schema contract:

### 7.1 Defined AI Tools (JSON Schema for NestJS Agent)

```json
[
  {
    "name": "find_seat_navigation",
    "description": "Obtiene la ruta y la puerta de acceso adecuada para la silla indicada del usuario.",
    "parameters": {
      "type": "OBJECT",
      "properties": {
        "stand": { "type": "STRING", "enum": ["OCCIDENTAL", "ORIENTAL", "NORTE", "SUR"] },
        "tier": { "type": "STRING", "enum": ["ALTA", "BAJA", "PALCO"] },
        "block": { "type": "INTEGER" },
        "row": { "type": "INTEGER" },
        "seat": { "type": "INTEGER" }
      },
      "required": ["stand", "tier", "block", "row", "seat"]
    }
  },
  {
    "name": "locate_nearest_poi",
    "description": "Encuentra los puntos de interés más cercanos (baños, tiendas, primeros auxilios, salidas) desde el asiento del usuario.",
    "parameters": {
      "type": "OBJECT",
      "properties": {
        "poi_category": { "type": "STRING", "enum": ["BATHROOM", "CONCESSION", "FIRST_AID", "EXIT"] },
        "current_seat_id": { "type": "STRING" }
      },
      "required": ["poi_category", "current_seat_id"]
    }
  },
  {
    "name": "create_in_seat_order",
    "description": "Estructura un pedido de comida/bebida desde la silla.",
    "parameters": {
      "type": "OBJECT",
      "properties": {
        "items": {
          "type": "ARRAY",
          "items": {
            "type": "OBJECT",
            "properties": {
              "product_id": { "type": "STRING" },
              "quantity": { "type": "INTEGER" }
            },
            "required": ["product_id", "quantity"]
          }
        },
        "seat_id": { "type": "STRING" }
      },
      "required": ["items", "seat_id"]
    }
  },
  {
    "name": "get_mobility_recommendation",
    "description": "Consulta el estado de congestión y sugiere la mejor ruta de salida o ingreso.",
    "parameters": {
      "type": "OBJECT",
      "properties": {
        "action_type": { "type": "STRING", "enum": ["INGRESS", "EGRESS"] },
        "current_stand": { "type": "STRING", "enum": ["OCCIDENTAL", "ORIENTAL", "NORTE", "SUR"] }
      },
      "required": ["action_type", "current_stand"]
    }
  }
]
```

---

## 8. MVP IMPLEMENTATION ROADMAP FOR DEVELOPERS

### Phase 1: Core Infra, Spatial Data & Wayfinding (Sprint 1 - 3)
- [x] Set up NestJS Monorepo / Modular Structure.
- [x] Database setup with PostGIS & seed vector points for **Tribuna Occidental**.
- [x] Flutter baseline app with offline spatial caching & 2D interactive stadium map.
- [x] Gemini Intent Router for Wayfinding queries.

### Phase 2: In-Seat Food & Beverage Logistics (Sprint 4 - 6)
- [ ] Product catalog & inventory management API.
- [ ] WebSocket gateway for live order updates.
- [ ] Runner mobile UI view (order batching and status updates).
- [ ] Gemini Function Calling integration for ordering from natural language chat.

### Phase 3: Dynamic Crowd Mobility & Full Rollout (Sprint 7 - 8)
- [ ] Gate congestion monitoring portal for stadium ops team.
- [ ] Automated FCM push dispatch system for egress recommendations.
- [ ] Scale spatial dataset to full stadium (Oriental, Norte, Sur).
- [ ] Stress-testing WebSocket and queue processing for 10,000 concurrent active users.

---

## 9. GUIDANCE FOR CLAUDE WHEN GENERATING CODE

When implementing features for StadiumAI:
1. **Always write strict TypeScript for Backend:** Use NestJS dependency injection, DTO decorators (`@IsString()`, `@IsEnum()`, `@IsNumber()`), and TypeORM or Prisma for PostGIS integrations.
2. **Always write clean Dart/Flutter code:** Use BLoC or Riverpod for state management, isolate HTTP/WebSocket layers, and store spatial geometry cleanly.
3. **Always optimize for low network overhead:** Keep JSON payloads compact, use WebSockets only for active order flows, and prefer REST/cached endpoints for static data.
