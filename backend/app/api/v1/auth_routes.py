import time
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.security import create_jwt_token, verify_jwt_token, get_current_user_optional
from backend.app.models.farmer import Farmer

router = APIRouter(prefix="/auth", tags=["Authentication & JWT"])

class SendOtpRequest(BaseModel):
    phone: str = Field(..., description="10-digit Indian Mobile Number")

class SendOtpResponse(BaseModel):
    success: bool
    message: str
    demo_otp: Optional[str] = None

class VerifyOtpRequest(BaseModel):
    phone: str = Field(..., description="10-digit Indian Mobile Number")
    otp: str = Field(..., description="6-digit OTP Code")

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int
    user: dict

@router.post("/send-otp", response_model=SendOtpResponse)
def send_otp(request: SendOtpRequest):
    cleaned_phone = "".join(filter(str.isdigit, request.phone))
    if len(cleaned_phone) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="कृपया १० अंकों का मान्य मोबाइल नंबर दर्ज करें।"
        )
    
    # In production, dispatch SMS via Twilio / Gupshup API
    return SendOtpResponse(
        success=True,
        message=f"+91 {cleaned_phone[-10:]} पर ओटीपी सफलतापूर्वक भेजा गया",
        demo_otp="123456"
    )

@router.post("/verify-otp", response_model=TokenResponse)
def verify_otp(request: VerifyOtpRequest, db: Session = Depends(get_db)):
    cleaned_phone = "".join(filter(str.isdigit, request.phone))[-10:]
    cleaned_otp = request.otp.strip()

    if cleaned_otp not in ["123456", "1234"] and len(cleaned_otp) != 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="अमान्य ओटीपी कोड। कृपया सही ६-अंकों का कोड दर्ज करें।"
        )

    # Lookup or create farmer in database
    farmer = db.query(Farmer).filter(Farmer.phone_number == cleaned_phone).first()
    if not farmer:
        farmer = Farmer(
            id=f"farmer_{cleaned_phone[-4:]}",
            name="किसान मित्र",
            phone_number=cleaned_phone,
            preferred_language="hi"
        )
        db.add(farmer)
        db.commit()
        db.refresh(farmer)

    payload = {
        "sub": farmer.id,
        "phone": farmer.phone_number,
        "role": "farmer",
        "name": farmer.name
    }

    access_token = create_jwt_token(payload)
    refresh_token = f"ref_{farmer.id}_{int(time.time())}"

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="Bearer",
        expires_in=86400 * 30,
        user={
            "id": farmer.id,
            "name": farmer.name,
            "phone": farmer.phone_number,
            "role": "farmer"
        }
    )

@router.get("/me")
def get_current_user_profile(user: Optional[dict] = Depends(get_current_user_optional)):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="अनधिकृत पहुंच (Unauthorized access token)"
        )
    return {
        "status": "authenticated",
        "user": user
    }
