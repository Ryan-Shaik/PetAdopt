# Pet Adoption Management System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

A full-stack web platform connecting animal shelters with potential adopters.

## 🚀 Features

### Core Functionality
- **Role-Based Access Control**
  - Admin: Full system management
  - Shelter: Pet management/adoption processing
  - Adopter: Search/pet interaction

- **Pet Management**
  - Multi-image gallery per profile
  - Medical history tracking
  - Adoption status workflow (Available → Pending → Adopted)

- **Search System**
  - Geo-location filtering
  - Multi-criteria filters (species, age, breed)
  - Saved search preferences

### Design System
**Color Palette**
```hex
Primary: #0D9488 (Teal)
Secondary: #F59E0B (Orange)
Background: #F3F4F6 (Light Gray)
Text: #1F2937 (Dark Gray)
```

**Typography**
- Primary Font: Inter (Sans-serif)
- Secondary Font: Merriweather (Serif)
- Base Size: 16px
- Hierarchy: 12px | 14px | 18px | 24px | 30px

## 🛠️ Technologies

| Layer        | Technologies |
|--------------|-|-------------|
| **Frontend** | | React.js, Tailwind CSS, Axios, React Router |
| **Backend**  | | Node.js, Express.js, JWT, Multer |
| **Database** | | MySQL, Sequelize ORM |


## ⚙️ Installation

1. **Clone Repository**
```bash
git clone https://github.com/yourrepo/pet-adoption-system.git
cd pet-adoption-system
```

2. **Frontend Setup**
```bash
cd frontend
npm install
```

3. **Backend Setup**
```bash
cd ../backend
npm install
```

4. **Database Configuration**
```bash
mysql -u root -p
CREATE DATABASE petadopt;
```

## 🔧 Environment Setup

Create `.env` in `/server`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=pet_adoption
JWT_SECRET=your_jwt_secret
PORT=5000
```

## 📚 API Reference

RESTful API built with Express.js. [View full API Documentation](/docs/API.md)

| Endpoint Group | Description |
|----------------|-------------|
| `/api/auth`    | Authentication & Authorization |
| `/api/pets`    | Pet management |
| `/api/users`   | User profiles |
| `/api/shelters`| Shelter operations |

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License
MIT License