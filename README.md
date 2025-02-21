# Task Manager - Full-Stack Cloud Application

[![CI/CD Pipeline](https://github.com/adarsh1445/taskmanager/actions/workflows/testpipeline.yml/badge.svg)](https://github.com/adarsh1445/taskmanager/actions)

A cloud-native task management solution built with **React (TypeScript) + FastAPI**, deployed on **Azure** with a full **CI/CD pipeline**.

![Task Dashboard](/screenshots/dashboard.png)

## 🚀 Features
- 🔐 **JWT-based authentication** (Login/Signup)
- 📝 **CRUD operations** for tasks with metadata
- 📱 **Responsive UI** with modern React patterns
- 🐳 **Dockerized** development & testing environments
- ✅ **Unit & Integration Tests** (Jest + pytest)
- 🚀 **Azure deployment** with Terraform & GitHub Actions
- 🔒 **Security best practices** (HTTPS, RBAC, secrets management)

## 🛠 Tech Stack
### **Frontend**
- **React (Vite + TypeScript)**
- React Query, ShadCN

### **Backend**
- **FastAPI**, SQLAlchemy, PostgreSQL
- JWT-based Authentication

### **Infrastructure**
- **Docker**, Terraform, Azure
- App Service, ACR, AGW, PostgreSQL

### **CI/CD**
- GitHub Actions, Azure CLI

### **Testing**
- **Jest** (Frontend)
- **pytest** (Backend)

## ⚡ Getting Started

### **Prerequisites**
- Docker & Docker Compose
- Terraform (for deployment)

### **Local Development**
```bash
# Clone repository
git clone https://github.com/adarsh1445/taskmanager.git
cd taskmanager

# Start development environment
docker-compose up

# Application available at:
http://localhost:5173

# To run tests
bash run-test.sh
```

## 🌍 Deployment
The application is deployed at:  
🔗 [Task Manager App](https://processitytaskmanagerdemo.info/login)  
_(Note: SSL is self-signed, so ignore the warning.)_

---

