from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import dashboard  # adjust if your router import path is different

app = FastAPI(title="VulNova API")

# ✅ Enable CORS so React (port 3000) can call FastAPI (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register routers
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "VulNova API is running"}
