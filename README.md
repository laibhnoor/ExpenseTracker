Expense Tracker
<img width="1920" height="914" alt="image" src="https://github.com/user-attachments/assets/73ba5e98-a2fe-402a-9277-fd45c53df6b9" />
<img width="1914" height="911" alt="image" src="https://github.com/user-attachments/assets/35e02876-a0bd-4e9b-91a3-a796c51c9e0e" />
<img width="1920" height="911" alt="image" src="https://github.com/user-attachments/assets/0768060e-4ab0-4c54-906f-786d53012eec" />
<img width="1918" height="868" alt="image" src="https://github.com/user-attachments/assets/1297d58d-33ba-40cf-8ab8-8987e6ad313c" />


A modern **full-stack Expense Tracker** that helps users manage their income and expenses, visualize spending patterns, and gain financial insights. The application features a responsive user interface built with **React** and **Tailwind CSS**, along with a robust backend powered by **Node.js**, **Express**, **Prisma**, and **PostgreSQL**.

---

## 🚀 Features

- 🔐 **Authentication** – Secure user signup and login using JWT and bcrypt.
- 💰 **Transaction Management** – Add, edit, delete, and view income and expenses.
- 🏷 **Categories** – Organize transactions (Food, Rent, Travel, Salary, etc.).
- 📊 **Dashboard** – View monthly income, expenses, balance, and top spending category.
- 📈 **Visual Insights** – Pie chart showing expense distribution by category.
- 📱 **Responsive Design** – Clean and mobile-friendly UI built with Tailwind CSS.

---

## 🛠️ Tech Stack

### Frontend
- **React** – User interface
- **Tailwind CSS** – Styling and responsive design
- **Axios / Fetch** – API communication

### Backend
- **Node.js & Express** – Server and RESTful endpoints
- **Prisma ORM** – Database interaction
- **PostgreSQL** – Relational database
- **JWT & bcrypt** – Authentication and password security

---




---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
2️⃣ Setup the Backend
cd server
npm install

Create a .env file:

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/expense_db"
JWT_SECRET="your_jwt_secret"
PORT=5000

Run database migrations:

npx prisma migrate dev --name init

Start the backend server:

npm start
3️⃣ Setup the Frontend
cd ../client
npm install
npm run dev
