# Task Manager - Full-Stack Cloud Application

[![CI/CD Pipeline](https://github.com/adarsh1445/taskmanager/actions/workflows/testpipeline.yml/badge.svg)](https://github.com/adarsh1445/taskmanager/actions)

A cloud-native task management solution built with **React (TypeScript) + FastAPI**, deployed on **Azure** with a full **CI/CD pipeline**.



## Desktop View

<img src="https://github.com/user-attachments/assets/f61522f2-f1c2-4e52-ad78-a647ca1946fb" width="600">

<img src="https://github.com/user-attachments/assets/4a399b0b-010a-46f5-a184-4dd967c699ca" width="600">

## Mobile View

<p align="center">
  <img src="https://github.com/user-attachments/assets/d7502f5f-38b0-4d54-b49f-61165cfe95f3" width="300"> &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/3d93f01a-7b93-4b55-99c2-3948c76f832e" width="300">
</p>



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

