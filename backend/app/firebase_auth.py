"""Firebase is the identity authority; booking ownership is always the verified UID."""

import json
import os
import threading
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

import firebase_admin
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth, credentials, exceptions
from google.auth.exceptions import GoogleAuthError
from starlette.concurrency import run_in_threadpool


@dataclass(frozen=True, slots=True)
class AuthUser:
    uid: str
    email: str | None = None


_bearer = HTTPBearer(auto_error=False)
_initialization_lock = threading.Lock()


def firebase_ready() -> bool:
    """Configuration readiness only; live provider connectivity needs a real ID token."""
    project_id = os.getenv("FIREBASE_PROJECT_ID", "").strip()
    if not project_id:
        return False
    if os.getenv("APP_ENV") == "production" and os.getenv(
        "FIREBASE_AUTH_EMULATOR_HOST"
    ):
        return False
    raw_account = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
    credential_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    try:
        if raw_account:
            account = json.loads(raw_account)
        elif credential_path:
            account = json.loads(Path(credential_path).read_text(encoding="utf-8"))
        else:
            return False
        return (
            isinstance(account, dict)
            and account.get("type") == "service_account"
            and account.get("project_id") == project_id
            and isinstance(account.get("private_key"), str)
            and account["private_key"].startswith("-----BEGIN PRIVATE KEY-----")
            and isinstance(account.get("client_email"), str)
            and "@" in account["client_email"]
        )
    except (ValueError, OSError):
        return False


@lru_cache(maxsize=1)
def _firebase_app():
    if not firebase_ready():
        raise ValueError("Firebase identity configuration is incomplete")
    project_id = os.environ["FIREBASE_PROJECT_ID"].strip()
    raw_account = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
    if raw_account:
        account = json.loads(raw_account)
        if account.get("project_id") != project_id:
            raise ValueError("Firebase credential project does not match")
        credential = credentials.Certificate(account)
    else:
        credential = credentials.ApplicationDefault()
    with _initialization_lock:
        try:
            return firebase_admin.get_app("redband-auth")
        except ValueError:
            return firebase_admin.initialize_app(
                credential,
                {"projectId": project_id, "httpTimeout": 10},
                name="redband-auth",
            )


async def require_user(
    bearer: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> AuthUser:
    if (
        bearer is None
        or bearer.scheme.lower() != "bearer"
        or len(bearer.credentials) > 8192
    ):
        raise HTTPException(
            401,
            "Sign in to manage reservations",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        application = await run_in_threadpool(_firebase_app)
    except (ValueError, OSError, GoogleAuthError):
        raise HTTPException(503, "Sign-in service is not configured") from None
    try:
        claims = await run_in_threadpool(
            auth.verify_id_token,
            bearer.credentials,
            app=application,
            check_revoked=True,
        )
    except auth.CertificateFetchError:
        raise HTTPException(503, "Sign-in service is temporarily unavailable") from None
    except (
        auth.InvalidIdTokenError,
        auth.ExpiredIdTokenError,
        auth.RevokedIdTokenError,
        auth.UserDisabledError,
        auth.UserNotFoundError,
        ValueError,
    ):
        raise HTTPException(
            401,
            "Your session has expired. Sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from None
    except (GoogleAuthError, exceptions.FirebaseError):
        raise HTTPException(503, "Sign-in service is temporarily unavailable") from None
    uid = claims.get("uid")
    if not isinstance(uid, str) or not uid or len(uid) > 128:
        raise HTTPException(401, "Invalid sign-in session")
    email = claims.get("email")
    return AuthUser(uid=uid, email=email if isinstance(email, str) else None)
