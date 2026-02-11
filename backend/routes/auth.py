import bcrypt
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Request, Response, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from jose import jwt, JWTError

from config import settings
from database import get_db

router = APIRouter()
templates = Jinja2Templates(directory="templates")


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


async def get_current_admin(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        return None
    payload = verify_token(token)
    if not payload:
        return None
    db = get_db()
    user = await db.users.find_one({"email": payload.get("sub")})
    if not user or not user.get("is_admin"):
        return None
    return user


@router.get("/admin/login", response_class=HTMLResponse)
async def login_page(request: Request):
    user = await get_current_admin(request)
    if user:
        return RedirectResponse("/admin/", status_code=302)
    return templates.TemplateResponse("login.html", {"request": request, "error": None})


@router.post("/admin/login")
async def login(request: Request):
    form = await request.form()
    email = form.get("email", "").strip()
    password = form.get("password", "")

    db = get_db()
    user = await db.users.find_one({"email": email})

    if not user or not bcrypt.checkpw(password.encode("utf-8"), user["password_hash"].encode("utf-8")):
        return templates.TemplateResponse("login.html", {
            "request": request,
            "error": "Invalid email or password"
        })

    token = create_access_token({"sub": user["email"]})
    response = RedirectResponse("/admin/", status_code=302)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
    )
    return response


@router.get("/admin/logout")
async def logout():
    response = RedirectResponse("/admin/login", status_code=302)
    response.delete_cookie("access_token")
    return response
