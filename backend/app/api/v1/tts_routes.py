import os
import urllib.request
import urllib.parse
from fastapi import APIRouter, Query, Response, HTTPException
import httpx

router = APIRouter(prefix="/tts", tags=["Text to Speech (Bhashini & Indic TTS)"])

# In-memory audio byte cache for instantaneous (<5ms) repeat audio playback
AUDIO_CACHE: dict[str, bytes] = {}

# Map application language codes to TTS codes
LANG_CODE_MAP = {
    "hi": "hi",
    "mr": "mr",
    "gu": "gu",
    "raj": "hi",
    "en": "en",
    "pa": "pa",
    "bn": "bn",
    "ta": "ta",
    "te": "te",
    "kn": "kn",
}

async def fetch_bhashini_tts(text: str, target_lang: str) -> bytes | None:
    """Optional Bhashini API integration if government credentials are configured."""
    bhashini_user_id = os.getenv("BHASHINI_USER_ID")
    bhashini_api_key = os.getenv("BHASHINI_API_KEY")
    
    if not (bhashini_user_id and bhashini_api_key):
        return None
        
    try:
        url = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"
        headers = {
            "Content-Type": "application/json",
            "userID": bhashini_user_id,
            "ulcaApiKey": bhashini_api_key,
        }
        payload = {
            "pipelineTasks": [
                {
                    "taskType": "tts",
                    "config": {
                        "language": {"sourceLanguage": target_lang},
                        "gender": "female"
                    }
                }
            ],
            "inputData": {
                "input": [{"source": text}]
            }
        }
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                import base64
                audio_content = data["pipelineResponse"][0]["audio"][0]["audioContent"]
                return base64.b64decode(audio_content)
    except Exception as e:
        print(f"[TTS] Bhashini error fallback: {e}")
    return None

def fetch_indic_tts_stream(text: str, lang: str) -> bytes:
    """Ultra-reliable high-speed Indic TTS stream proxy."""
    target_lang = LANG_CODE_MAP.get(lang.lower(), "hi")
    encoded_text = urllib.parse.quote(text[:300])
    
    url = f"https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl={target_lang}&q={encoded_text}"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "*/*",
            "Referer": "https://translate.google.com/"
        }
    )
    with urllib.request.urlopen(req, timeout=5) as response:
        return response.read()

@router.get("", response_class=Response)
async def synthesize_speech(
    text: str = Query(..., min_length=1, max_length=500, description="Text to synthesize"),
    lang: str = Query("hi", description="Language code (hi, mr, gu, raj, en)")
):
    """
    Synthesize Indic speech in Hindi, Marathi, Gujarati, Rajasthani, or English.
    Returns direct audio/mpeg bytes with browser cache headers.
    """
    clean_text = text.strip()
    cache_key = f"{lang}:{clean_text}"
    
    if cache_key in AUDIO_CACHE:
        return Response(
            content=AUDIO_CACHE[cache_key],
            media_type="audio/mpeg",
            headers={"Cache-Control": "public, max-age=86400"}
        )
    
    # 1. Try Bhashini if configured
    target_lang = LANG_CODE_MAP.get(lang.lower(), "hi")
    audio_bytes = await fetch_bhashini_tts(clean_text, target_lang)
    
    # 2. High-speed Indic TTS stream proxy
    if not audio_bytes:
        try:
            audio_bytes = fetch_indic_tts_stream(clean_text, target_lang)
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"TTS synthesis failed: {str(e)}")
            
    # Cache up to 1000 items
    if len(AUDIO_CACHE) < 1000:
        AUDIO_CACHE[cache_key] = audio_bytes
        
    return Response(
        content=audio_bytes,
        media_type="audio/mpeg",
        headers={
            "Cache-Control": "public, max-age=86400",
            "Content-Disposition": "inline"
        }
    )
