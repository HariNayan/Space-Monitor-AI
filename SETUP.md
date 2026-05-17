# Agentic AI Interactive Space Simulator - Phase 1

## Project Setup Commands

### Frontend (Next.js 14+ with Three.js/R3F)

```bash
# Navigate to Space directory
cd D:/Coding/Space

# Create Next.js app with TypeScript, Tailwind, and App Router
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --no-import-alias

# Install Three.js and React Three Fiber dependencies
cd frontend
npm install three @react-three/fiber @react-three/drei

# Install additional type definitions
npm install -D @types/three
```

### Backend (Python FastAPI)

```bash
# Navigate to Space directory
cd D:/Coding/Space

# Create backend directory
mkdir backend
cd backend

# Initialize Python virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt python-multipart

# Run the backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## Running the Application

1. **Start Backend**: In `backend/` directory, run `uvicorn main:app --reload --host 0.0.0.0 --port 8000`
2. **Start Frontend**: In `frontend/` directory, run `npm run dev`
3. Open `http://localhost:3000` in your browser