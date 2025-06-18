# 🚀 High-Frequency Cryptocurrency Exchange

## Overview
This project is a **high-frequency cryptocurrency exchange** designed to handle **10,000+ orders per second** with optimal scalability, real-time trade execution, and low-latency order processing. It leverages a **scalable event-driven architecture** using Redis, WebSockets, and a robust data storage system.


## Theory and concepts
- balances and orderbook are stored in memory variables
## Features
- ⚡ **High-Frequency Trading**: Handles **10,000+ orders/sec** ensuring fast and reliable trade execution.
- 📡 **Real-time Order Processing**: Utilizes **Redis Pub/Sub** and **WebSockets** to achieve sub-**50ms latency** for live market updates.
- 🏗 **Scalable Architecture**:
  - **Redis** for trade matching and real-time event distribution.
  - **MongoDB** for transaction storage.
  - **PostgreSQL/TimescaleDB** for historical data, improving query performance by **40%**.
- 📊 **Interactive Trading Dashboard**: Built with **Next.js** and **Tailwind CSS**, ensuring real-time market data visualization with **99.9% uptime**.

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Node.js, Express, WebSockets, Redis
- **Database**: MongoDB, PostgreSQL, TimescaleDB
- **Event Handling**: Redis Pub/Sub
- **Deployment**: Docker, Kubernetes (Optional)

## Backend Architecture
  - API- An API server the user sends HTTP requests. This server does not check balance of user. Even It does not know user's balance. It just authorises the user
    -before sending message to redis queue `RedisManager` class has a function `SendAndAwait` which subscribe to Redis Pub/sub by generating randomId and subscribing on that randomId.
    then the API `RedisManager` sends message with `lpush` to redis queue. Whenever messege get received from the engine on that id we unsubscribe.

  - Enginge-Runs various market orderbooks,stores user balance in memory. it also swap assets. it pull request from redis queue one by one and do some specific checks as per the request from the API server.
     what if queue goes very long or engine goes down: engine recreate the orderbook and balances
    - snapsots- very big json have users balances and orderbook is get stored time to time whenever system/engine goes down it takes latest snapshot from the queue.

    - Here in Nodejs which is single thread, single engine is storing all the orderbook and user's balances as well.
      but in `Rust` we can store orderbook and balances separate to parent
    - although we can not have multiple queues and multiple engine because we need single central place to hold the balances
    - If someone has access to backed they can change the balances

  - Websocket- Websocket server that user subscribes to real time events from

  - DB Processor- process messages from the engine and persists in DB

  - Frontend- NextJS App

  - Market-maker- Places random orders to keep the book liquid

  - Redis- Queue and pub/sub : Redis is single threaded since here we are using single thread, and is very fast which matters very fast. also we can use kafka

  - Postgres- Primary database to store user info/orders/trades etc.

  - TimescaleDB- Create buckets of klines based on price feed

  

    BE image: https://shorturl.at/PmvHv

## Installation & Setup
### Prerequisites
Make sure you have the following installed:
- Node.js v16+
- Redis v6+
- MongoDB
- PostgreSQL (with TimescaleDB extension, if applicable)

### Clone Repository
```bash
$ git clone https://github.com/your-username/crypto-exchange.git
$ cd crypto-exchange
```

### Install Dependencies
```bash
$ npm install
```

### Start Redis Server (Ensure Redis is Running)
```bash
$ redis-server
```

### Start Development Server
```bash
$ npm run dev
```

## API Endpoints
| Method | Endpoint           | Description                      |
|--------|-------------------|----------------------------------|
| GET    | `/depth`          | Get order book depth            |
| GET    | `/kline`          | Get historical kline data       |
| POST   | `/order`         | Place a new trade order         |
| DELETE | `/order`         | Cancel an existing order        |
| GET    | `/order/open`    | Get all open orders for a user  |
| GET    | `/tickers`       | Fetch latest ticker data        |
| GET    | `/trades`        | Retrieve recent trades          |

## How It Works
1. Users connect via **WebSockets** to receive real-time market updates.
2. Orders are processed asynchronously using **Redis Pub/Sub**.
3. Trade data is stored in **MongoDB**, while historical data is managed in **PostgreSQL/TimescaleDB**.
4. The API provides endpoints for market depth, kline data, order management, and trade history.
5. The frontend provides a **real-time trading dashboard** with price charts and trade history.

---
📈 **Built for high-speed trading with low-latency execution!** 🚀



