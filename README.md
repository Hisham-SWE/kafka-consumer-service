# Order Processing Microservices
This project demonstrates an event-driven architecture using **NestJS**, **Kafka**, and **WebSockets**. It consists of two main services (Producer & Consumer) communicating asynchronously via a Kafka message queue.

## 🏗 System Architecture

1.  **ws-service (Producer)**:
    *   A WebSocket Gateway (NestJS).
    *   Receives `placeOrder` events from clients (e.g., Postman, Frontend).
    *   Produces an `ORDER_PLACED` event to the Kafka topic `order-placement`.
2.  **consumer-service (Consumer)**:
    *   A NestJS background service.
    *   Subscribes to the `order-placement` Kafka topic.
    *   Processes orders (Validation -> Payment -> Shipping) with simulated delays.

## 🚀 Prerequisites
-   **Node.js** (v16+)
-   **Docker Desktop** (Running)

## 🛠️ Project Setup

### 1. Start Infrastructure (Kafka )
Since there is no `docker-compose.yml`, run the following commands manually in PowerShell or Command Prompt to start the necessary containers.

**Create Network:**
```bash
docker network create mq-net
```


**Run Kafka:**
```bash
docker run -d --name kafka --network mq-net -p 9092:9092 -e KAFKA_BROKER_ID=1 -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 -e KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT --restart unless-stopped confluentinc/cp-kafka:latest
```

### 2. Start Services
Run each service in a separate terminal window.

**Terminal 1: WebSocket Service (Producer)**
```bash
cd ws-service
npm install
npm run start:dev
```
*Running on: http://localhost:3000*

**Terminal 2: Consumer Service**
```bash
cd consumer-service
npm install
# Port is set to 3001 in code to avoid conflicts
npm run start:dev
```
*Running on: http://localhost:3001*

## 🧪 How to Test

1.  Open a WebSocket Client (e.g., Postman or [PieSocket](https://www.piesocket.com/websocket-tester)).
2.  Connect to: `ws://localhost:3000`
3.  **Emit Event**: `placeOrder`
4.  **Payload (JSON)**:
    ```json
    {
      "orderId": "#101",
      "item": "Mechanical Keyboard",
      "price": 150
    }
    ```
5.  **Check Consumer Logs**:
    Switch to the `consumer-service` terminal to see the processing flow:
    ```
    📦 Processing Order #101...
    🔍 Validating items for Order #101...
    💳 Charging customer for Order #101...
    🚚 Shipping Order #101...
    ✅ Order #101 processed successfully!
    ```

## 📂 Project Structure

### ws-service
-   `src/oreder-placement/`: Contains the WebSocket gateway logic.
-   `src/kafka/`: Kafka producer configuration.

### consumer-service
-   `src/kafka/`: Kafka consumer handling logic (`processOrder` flow).
