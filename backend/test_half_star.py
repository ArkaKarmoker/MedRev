import urllib.request
import json

# Get token
req = urllib.request.Request("http://localhost:8000/api/token/", data=json.dumps({"username": "admin", "password": "1234"}).encode(), headers={"Content-Type": "application/json"})
res = urllib.request.urlopen(req)
token = json.loads(res.read())["access"]

# Delete existing review (ignore errors)
try:
    req = urllib.request.Request("http://localhost:8000/api/reviews/medicine/2/", method="DELETE", headers={"Authorization": f"Bearer {token}"})
    urllib.request.urlopen(req)
except Exception as e:
    pass

# Post half star review
try:
    req = urllib.request.Request("http://localhost:8000/api/reviews/medicine/2/", data=json.dumps({"rating": 4.5, "comment": "Test half star"}).encode(), headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"}, method="POST")
    res = urllib.request.urlopen(req)
    print(res.getcode(), json.loads(res.read()))
except urllib.error.HTTPError as e:
    print(e.code, e.read())
