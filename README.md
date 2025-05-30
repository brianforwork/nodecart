# 🛒 NodeCart — Node.js Backend Architecture for eCommerce

NodeCart is a scalable, modular, and feature-rich backend system for an eCommerce platform.

It follows modern backend best practices and uses powerful technologies like MongoDB, Redis, MySQL, Elasticsearch, AWS, RabbitMQ, and NGINX to design a robust system capable of handling millions of users and products.

---

## 📦 Tech Stack

- **Node.js** & **Express.js** – Backend framework
- **MongoDB** – Document-based product storage
- **MySQL** – Relational DB for user & order management
- **Redis** – Caching, pub/sub, rate limiting
- **RabbitMQ** – Messaging queue for Microservices
- **Elasticsearch** – Advanced search & filtering
- **AWS (S3, EC2, CloudFront)** – Cloud storage & deployment
- **NGINX** – Reverse proxy & SSL termination
- **Jest** – Unit & integration testing

---

## 🧱 Key Architecture Patterns

- **Modular MVC structure** with service, controller, and repository layers
- **Factory + Strategy Pattern** for dynamic service creation
- **Environment-based Config Management** (`.env`, `config.js`)
- **Middleware-based Authentication & Authorization**
- **Microservices Communication** with Redis Pub/Sub & RabbitMQ
- **Advanced Product Schema Design**: Draft/Publish toggling, soft delete, indexing
- **Custom API Response Classes** & Global Error Handling

---

## 🚀 Features in Progress (per course)

- ✅ Shop Registration & JWT Auth (RSA keys)
- ✅ Product Service APIs (multi-level creation, pagination, filtering)
- ✅ Discount & Cart Services
- ✅ Order Service with Redis-backed inventory control
- 🔄 Notifications & Messaging Queues
- 🔄 Upload service to AWS S3 with secure access
- 🔄 CI/CD with GitHub Actions & EC2 deployment
- 🔄 Elasticsearch search integration

---

## 🛠 Local Setup

```bash
git clone https://github.com/brianforwork/nodecart.git
cd nodecart
npm install
cp .env.example .env
# Fill in your env variables
npm run dev

👨‍💻 Author
Brian Ho (@brianforwork)

📄 License
Please respect course authors and do not commercialize or redistribute without permission.
