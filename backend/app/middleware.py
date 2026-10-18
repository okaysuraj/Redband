"""Request size limits and response headers shared by all API routes."""

from fastapi import HTTPException
from starlette.responses import JSONResponse


class RequestGuardMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        limit = 256 * 1024
        received = 0

        async def bounded_receive():
            nonlocal received
            message = await receive()
            received += len(message.get("body", b""))
            if received > limit:
                raise HTTPException(413, "Request body exceeds the permitted size")
            return message

        async def secure_send(message):
            if message["type"] == "http.response.start":
                headers = [
                    (b"x-content-type-options", b"nosniff"),
                    (b"x-frame-options", b"DENY"),
                    (b"referrer-policy", b"no-referrer"),
                    (
                        b"permissions-policy",
                        b"camera=(), microphone=(), geolocation=()",
                    ),
                ]
                if scope["path"].startswith(
                    ("/api/bookings", "/api/admin", "/api/dispatch")
                ):
                    headers.append((b"cache-control", b"no-store"))
                message["headers"] = list(message.get("headers", [])) + headers
            await send(message)

        length = dict(scope["headers"]).get(b"content-length")
        if length:
            try:
                too_large = int(length) > limit
            except ValueError:
                too_large = True
            if too_large:
                return await JSONResponse(
                    {"detail": "Request body exceeds the permitted size"},
                    status_code=413,
                )(scope, receive, secure_send)
        await self.app(scope, bounded_receive, secure_send)
