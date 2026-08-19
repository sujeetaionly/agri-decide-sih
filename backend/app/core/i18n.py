"""
Scalable Internationalization (i18n) Engine for Fasal Disha.
Designed to support 20-100+ regional languages dynamically via standard ISO 639-1 / Bhashini / IndicTrans codes
without modifying database schemas or API contracts.
"""
from typing import Dict, Any, Optional

# Universal Multi-Language Crop Registry
# Structure: ISO Code -> Native Translated Name
# New languages (kn, te, ta, bn, pa, or, ml, etc.) can be loaded dynamically from JSON / DB / Bhashini API
CROP_I18N_REGISTRY: Dict[str, Dict[str, str]] = {
    "SOYBEAN": {
        "en": "Soybean",
        "hi": "सोयाबीन",
        "mr": "सोयाबीन",
        "gu": "સોયાબીન",
        "raj": "सोयाबीन",
        "pa": "ਸੋਇਆਬੀਨ",
        "kn": "ಸೋಯಾಬೀನ್",
        "te": "సోయాబీన్",
        "ta": "சோயாபீன்",
        "bn": "সয়াবিন"
    },
    "MAIZE": {
        "en": "Maize (Corn)",
        "hi": "मक्का",
        "mr": "मका",
        "gu": "મકાઈ",
        "raj": "मक्का",
        "pa": "ਮੱਕੀ",
        "kn": "ಮೆಕ್ಕೆಜೋಳ",
        "te": "మొక్కజొన్న",
        "ta": "மக்காச்சோளம்",
        "bn": "ভুট্টা"
    },
    "TUR": {
        "en": "Tur / Arhar (Pigeon Pea)",
        "hi": "अरहर (तूर)",
        "mr": "तूर",
        "gu": "તુવેર",
        "raj": "अरहर",
        "pa": "ਅਰਹਰ",
        "kn": "ತೊಗರಿ",
        "te": "కంది",
        "ta": "துவரை",
        "bn": "অড়হর"
    },
    "COTTON": {
        "en": "Cotton",
        "hi": "कपास",
        "mr": "कापूस",
        "gu": "કપાસ",
        "raj": "कपास",
        "pa": "ਕਪਾਹ",
        "kn": "ಹತ್ತಿ",
        "te": "పత్తి",
        "ta": "பருத்தி",
        "bn": "তুলা"
    },
    "BAJRA": {
        "en": "Bajra (Pearl Millet)",
        "hi": "बाजरा",
        "mr": "बाजरी",
        "gu": "બાજરી",
        "raj": "बाजरो",
        "pa": "ਬਾਜਰਾ",
        "kn": "ಸಜ್ಜೆ",
        "te": "సజ్జలు",
        "ta": "கம்பு",
        "bn": "বাজরা"
    },
    "MOONG": {
        "en": "Moong (Green Gram)",
        "hi": "मूंग",
        "mr": "मूग",
        "gu": "મગ",
        "raj": "मूंग",
        "pa": "ਮੂੰਗ",
        "kn": "ಹೆಸರುಕಾಳು",
        "te": "పెసలు",
        "ta": "பாசிப்பயறு",
        "bn": "মুগ ডাল"
    },
    "GROUNDNUT": {
        "en": "Groundnut (Peanut)",
        "hi": "मूंगफली",
        "mr": "भुईमूग",
        "gu": "મગફળી",
        "raj": "मूंगफली",
        "pa": "ਮੂੰਗਫਲੀ",
        "kn": "ಕಡಲೆಕಾಯಿ",
        "te": "వేరుಶనగ",
        "ta": "வேர்க்கடலை",
        "bn": "চীনাবাদাম"
    },
    "WHEAT": {
        "en": "Wheat",
        "hi": "गेहूं",
        "mr": "गहू",
        "gu": "ઘઉં",
        "raj": "गेहूं",
        "pa": "ਕਣਕ",
        "kn": "ಗೋಧಿ",
        "te": "గోధుమ",
        "ta": "கோதுமை",
        "bn": "গম"
    },
    "GRAM": {
        "en": "Gram / Chana (Chickpea)",
        "hi": "चना",
        "mr": "हरभरा",
        "gu": "ચણા",
        "raj": "चणो",
        "pa": "ਛੋਲੇ",
        "kn": "ಕಡಲೆ",
        "te": "శనగలు",
        "ta": "கொண்டைக்கடலை",
        "bn": "ছোলা"
    },
    "JOWAR": {
        "en": "Jowar (Sorghum)",
        "hi": "ज्वार",
        "mr": "ज्वारी",
        "gu": "જુવાર",
        "raj": "ज्वार",
        "pa": "ਜਵਾਰ",
        "kn": "ಜೋಳ",
        "te": "జొన్నలు",
        "ta": "சோளம்",
        "bn": "জোয়ার"
    },
    "MUSTARD": {
        "en": "Mustard (Sarson / Raida)",
        "hi": "सरसों (राई)",
        "mr": "मोहरी",
        "gu": "રાઈ",
        "raj": "रायड़ो",
        "pa": "ਸਰ੍ਹੋਂ",
        "kn": "ಸಾಸಿವೆ",
        "te": "ఆవాలు",
        "ta": "கடுகு",
        "bn": "সরিষা"
    },
    "URAD": {
        "en": "Urad (Black Gram)",
        "hi": "उड़द",
        "mr": "उडीद",
        "gu": "અડદ",
        "raj": "उड़द",
        "pa": "ਮਾਂਹ",
        "kn": "ಉದ್ದಿನಕಾಳು",
        "te": "మినుములు",
        "ta": "உளுந்து",
        "bn": "মাষকলাই"
    },
    "SUNFLOWER": {
        "en": "Sunflower",
        "hi": "सूरजमुखी",
        "mr": "सूर्यफूल",
        "gu": "સૂર્યમુખી",
        "raj": "सूरजमुखी",
        "pa": "ਸੂਰਜਮੁਖੀ",
        "kn": "ಸೂರ್ಯಕಾಂತಿ",
        "te": "పొద్దుతిరుగుడు",
        "ta": "சூரியகாந்தி",
        "bn": "সূর্যমুখী"
    },
    "SUGARCANE": {
        "en": "Sugarcane",
        "hi": "गन्ना",
        "mr": "ऊस",
        "gu": "શેરડી",
        "raj": "गन्नो",
        "pa": "ਗੰਨਾ",
        "kn": "ಕಬ್ಬು",
        "te": "చెరకు",
        "ta": "கரும்பு",
        "bn": "আখ"
    },
    "ONION": {
        "en": "Onion",
        "hi": "प्याज",
        "mr": "कांदा",
        "gu": "ડુંગળી",
        "raj": "कांदो",
        "pa": "ਪਿਆਜ਼",
        "kn": "ಈರುಳ್ಳಿ",
        "te": "ఉల్లిపాయ",
        "ta": "வெங்காயம்",
        "bn": "পেঁয়াজ"
    },
    "TOMATO": {
        "en": "Tomato",
        "hi": "टमाटर",
        "mr": "टोमॅटो",
        "gu": "ટામેટા",
        "raj": "टमाटर",
        "pa": "ਟਮਾਟਰ",
        "kn": "ಟೊಮೆಟೊ",
        "te": "టమోటా",
        "ta": "தக்காளி",
        "bn": "টমেটো"
    },
    "GUAR": {
        "en": "Cluster Bean (Guar)",
        "hi": "ग्वार",
        "mr": "गवार",
        "gu": "ગુવાર",
        "raj": "ग्वांर",
        "pa": "ਗੁਆਰਾ",
        "kn": "ಗೋರಿಕಾಯಿ",
        "te": "గోరుచిక్కుడు",
        "ta": "கொத்தவரங்காய்",
        "bn": "গুয়ার"
    },
    "CUMIN": {
        "en": "Cumin (Jeera)",
        "hi": "जीरा",
        "mr": "जिरे",
        "gu": "જીરું",
        "raj": "जीरो",
        "pa": "ਜੀਰਾ",
        "kn": "ಜೀರಿಗೆ",
        "te": "జీలకర్ర",
        "ta": "சீரகம்",
        "bn": "জিরে"
    }
}

def resolve_localized_crop_name(crop_id: str, lang: str = "hi") -> str:
    """
    Dynamically resolves the localized crop name for ANY language code.
    Fallback cascade: requested lang -> Hindi ('hi') -> English ('en') -> raw crop_id.
    """
    cid = crop_id.upper().strip()
    translations = CROP_I18N_REGISTRY.get(cid, {})
    if not translations:
        return crop_id.capitalize()
    
    target_lang = (lang or "hi").lower().strip()
    return translations.get(target_lang) or translations.get("hi") or translations.get("en") or crop_id.capitalize()

def get_all_crop_translations(crop_id: str) -> Dict[str, str]:
    """
    Returns full dictionary of all available translations for a crop.
    """
    cid = crop_id.upper().strip()
    return CROP_I18N_REGISTRY.get(cid, {"en": crop_id.capitalize(), "hi": crop_id.capitalize()})
