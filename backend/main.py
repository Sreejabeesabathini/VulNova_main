from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import dashboard, vulnerabilities, threat_intel, support, assets
import models  # Import models to register them with FastAPI

app = FastAPI(title="VulNova API")

# ✅ Enable CORS so React (port 3000) can call FastAPI (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ✅ Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register routers
app.include_router(dashboard.router)
app.include_router(vulnerabilities.router)  # ✅ Add vulnerabilities router
app.include_router(threat_intel.router) # ✅ Add threat_intel router
app.include_router(support.router)  # ✅ Add support router
app.include_router(assets.router)  # ✅ Add assets router

@app.get("/")
def root():
    return {"message": "VulNova API is running"}
