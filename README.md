# MedRev: Medicine Review Platform

MedRev is a comprehensive web application designed to help users browse, search, and review medicines. It provides detailed medical information and allows a community-driven approach to sharing experiences with different medications.

## 🚀 Features

- **User Authentication**: Secure JWT-based Login and Registration. Accessible anywhere via clean, responsive modals.
- **Medicine Directory**: Browse a vast list of medicines with details like strength, generic name, manufacturer, unit price, and more.
- **Advanced Filtering & Search**: Find medicines by searching or filtering by specific attributes (e.g., Dosage Form, Type).
- **Medicine Details**: View in-depth information about a medicine, including pharmacology, indications, dosage, side effects, and precautions.
- **Community Reviews**: Authenticated users can write, edit, and delete reviews, including a 5-star rating system for medicines.
- **User Profile**: A clean, minimalistic profile page for users to manage their personal information and keep track of their past reviews.

## 💻 Tech Stack

### Frontend
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **UI Components**: custom components built with Base UI / Shadcn, and Lucide React for icons.
- **HTTP Client**: Axios
- **State/Auth**: React Hooks, JWT Decode, LocalStorage

### Backend
- **Framework**: Django & Django REST Framework (DRF)
- **Database**: PostgreSQL
- **Authentication**: SimpleJWT (JSON Web Tokens)
- **Utilities**: Django CORS Headers, Django Filters

## 🛠️ Project Structure

```
MedRev/
├── backend/            # Django application
│   ├── backend/        # Core settings and routing
│   ├── medicines/      # Medicine models, views, and API
│   ├── reviews/        # Review system models and API
│   ├── users/          # Custom user models and authentication
│   └── manage.py
├── frontend/           # Next.js application
│   ├── src/
│   │   ├── app/        # Pages (medicines, profile, auth routing)
│   │   ├── components/ # Reusable UI components (Navbar, Modals, Shadcn UI)
│   │   ├── hooks/      # Custom React hooks (e.g., useDebounce)
│   │   └── lib/        # Axios configuration and utilities
│   ├── public/         # Static assets
│   ├── tailwind.config.ts
│   └── package.json
└── README.md
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- PostgreSQL

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up Environment Variables:
   Copy `.env.sample` to `.env` and update the database credentials and secret key.
   ```bash
   cp .env.sample .env
   ```
5. Set up your PostgreSQL database matching the settings in `.env` (Default DB Name: `MedRev`).
6. Run migrations to create the database tables:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
7. Start the development server:
   ```bash
   python manage.py runserver
   ```
   *The backend will run on `http://localhost:8000`*

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install NPM packages:
   ```bash
   npm install
   ```
3. Set up Environment Variables:
   Copy `.env.sample` to `.env.local` to point the frontend to your local backend.
   ```bash
   cp .env.sample .env.local
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:3000`*

## 💡 Usage

- Open `http://localhost:3000` in your browser.
- Browse the list of medicines.
- Click **Sign Up** to create an account and leave a review.
- Manage your account and see your past activities on the **Profile** page.
