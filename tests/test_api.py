import unittest
from fastapi.testclient import TestClient
from backend.main import app

class TestAPIEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["product"], "SecureRecon")
        self.assertEqual(data["tagline"], "Web Application Security, Simplified.")

    def test_health_endpoint(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "healthy")

    def test_dashboard_stats(self):
        response = self.client.get("/api/dashboard/stats")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("security_score", data)
        self.assertIn("cards", data)
        self.assertIn("severity", data)

    def test_list_websites(self):
        response = self.client.get("/api/websites")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_reject_unauthorized_website_add(self):
        # Adding without is_authorized flag confirmation must fail
        response = self.client.post("/api/websites", json={
            "project_id": "none",
            "name": "Unauthorized Target",
            "url": "https://unauthorized.test",
            "is_authorized": False
        })
        self.assertEqual(response.status_code, 400)

if __name__ == "__main__":
    unittest.main()
