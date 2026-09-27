import urllib.request
import json

endpoints = [
    ("Root", "http://localhost:8000/"),
    ("Health", "http://localhost:8000/health"),
    ("Treatments", "http://localhost:8000/api/treatments"),
    ("Locations", "http://localhost:8000/api/locations"),
    ("Practitioners", "http://localhost:8000/api/practitioners"),
    ("Availability", "http://localhost:8000/api/availability"),
    ("Favorites", "http://localhost:8000/api/availability/favorites"),
    ("Treatment Detail", "http://localhost:8000/api/treatments/architectural-cut"),
]

for name, url in endpoints:
    try:
        r = urllib.request.urlopen(url)
        data = json.loads(r.read())
        if isinstance(data, list):
            print(f"[OK] {name}: {len(data)} items")
        elif isinstance(data, dict):
            keys = list(data.keys())[:5]
            print(f"[OK] {name}: keys={keys}")
    except Exception as e:
        print(f"[FAIL] {name}: {e}")

# Test POST booking
import urllib.request
booking_payload = json.dumps({
    "treatment_id": "architectural-cut",
    "location_id": "noho-nyc",
    "practitioner_id": "elena-vane",
    "date": "2026-09-17",
    "time": "11:00 AM",
    "silent_chair": False,
    "addon": None,
    "guest_name": "Julian Hayes",
    "guest_email": "julian@test.com",
    "guest_phone": "+1 555 019 2834",
    "guest_notes": "Dry scalp"
}).encode("utf-8")

req = urllib.request.Request(
    "http://localhost:8000/api/bookings",
    data=booking_payload,
    headers={"Content-Type": "application/json"},
    method="POST"
)
try:
    r = urllib.request.urlopen(req)
    booking = json.loads(r.read())
    print(f"[OK] Booking Created: ref={booking['reference']}, service={booking['service']}, practitioner={booking['practitioner']}")

    # Now look it up
    r2 = urllib.request.urlopen(f"http://localhost:8000/api/bookings/{booking['reference']}")
    found = json.loads(r2.read())
    print(f"[OK] Booking Lookup: ref={found['reference']}, status={found['status']}")
except Exception as e:
    print(f"[FAIL] Booking: {e}")

# Test POST dispatch subscribe
sub_payload = json.dumps({"email": "guest@redband-test.com"}).encode("utf-8")
req2 = urllib.request.Request(
    "http://localhost:8000/api/dispatch/subscribe",
    data=sub_payload,
    headers={"Content-Type": "application/json"},
    method="POST"
)
try:
    r = urllib.request.urlopen(req2)
    sub = json.loads(r.read())
    print(f"[OK] Dispatch Subscribe: {sub['message']}")
except Exception as e:
    print(f"[FAIL] Dispatch: {e}")

print("\nAll endpoint tests complete.")
