import unittest
from backend.scanner.passive_scanner import SecurityValidator, PassiveSecurityAnalyzer

class TestSecurityValidator(unittest.TestCase):
    def test_blocks_cidr_range(self):
        result = SecurityValidator.validate_website_url("192.168.1.0/24")
        self.assertFalse(result["valid"])
        self.assertIn("CIDR", result["error"])

    def test_blocks_raw_ip(self):
        result = SecurityValidator.validate_website_url("http://192.168.1.100")
        self.assertFalse(result["valid"])
        self.assertIn("IP targets", result["error"])

    def test_blocks_non_web_port(self):
        result = SecurityValidator.validate_website_url("https://example.com:22")
        self.assertFalse(result["valid"])
        self.assertIn("not a supported web application port", result["error"])

    def test_allows_authorized_website_url(self):
        result = SecurityValidator.validate_website_url("https://demo.example.test")
        self.assertTrue(result["valid"])
        self.assertEqual(result["normalized_url"], "https://demo.example.test/")

    def test_passive_header_evaluation(self):
        sample_headers = {
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "X-Frame-Options": "DENY"
        }
        res = PassiveSecurityAnalyzer.evaluate_headers(sample_headers, "https://demo.example.test")
        self.assertIn("headers", res)
        self.assertIn("findings", res)
        self.assertTrue(any(h["header_name"] == "Strict-Transport-Security" and h["is_present"] for h in res["headers"]))
        self.assertTrue(any(f["title"] == "Missing Content Security Policy (CSP)" for f in res["findings"]))

if __name__ == "__main__":
    unittest.main()
