import re
import ipaddress
from urllib.parse import urlparse
from typing import Dict, List, Any, Optional

class SecurityValidator:
    """
    Validates targets to ensure ONLY authorized website/web application URLs are accepted.
    Strictly blocks IP ranges, CIDR notations, raw IP targets, port scanning targets,
    and non-web protocols.
    """
    
    @staticmethod
    def validate_website_url(target: str) -> Dict[str, Any]:
        if not target or not isinstance(target, str):
            return {"valid": False, "error": "Target URL is required."}
            
        target = target.strip()
        
        # Reject CIDR notation immediately
        if "/" in target and re.search(r"/\d{1,2}$", target):
            return {
                "valid": False,
                "error": "IP range / CIDR notation is strictly forbidden. SecureRecon only assesses authorized web application URLs."
            }
            
        # Parse URL
        if not (target.startswith("http://") or target.startswith("https://")):
            target = "https://" + target
            
        try:
            parsed = urlparse(target)
        except Exception:
            return {"valid": False, "error": "Malformed URL format."}
            
        if parsed.scheme not in ["http", "https"]:
            return {"valid": False, "error": f"Unsupported protocol '{parsed.scheme}'. Only http and https are allowed."}
            
        hostname = parsed.hostname
        if not hostname:
            return {"valid": False, "error": "Invalid hostname in URL."}
            
        # Check if hostname is an IP address
        try:
            ipaddress.ip_address(hostname)
            return {
                "valid": False,
                "error": "Direct IP targets and network scanning are forbidden. Please specify a verified website domain (e.g., https://app.example.com)."
            }
        except ValueError:
            # Not an IP address, valid domain
            pass
            
        # Check port: disallow non-web ports
        if parsed.port and parsed.port not in [80, 443, 8000, 8080, 8443, 3000, 5000, 5173]:
            return {
                "valid": False,
                "error": f"Port {parsed.port} is not a supported web application port. Network port scanning is disabled."
            }
            
        return {
            "valid": True,
            "normalized_url": f"{parsed.scheme}://{parsed.netloc}{parsed.path or '/'}"
        }


class PassiveSecurityAnalyzer:
    """
    Performs purely passive, non-destructive web application security analysis.
    Focuses entirely on HTTP headers, cookie protection flags, form inputs,
    and client-side script inspection.
    """
    
    RECOMMENDED_HEADERS = {
        "Content-Security-Policy": {
            "title": "Missing Content Security Policy (CSP)",
            "severity": "Medium",
            "category": "Client-Side Security",
            "cvss": 5.4,
            "description": "Content Security Policy (CSP) restricts the resources the browser is allowed to load for a given page, offering robust defense against Cross-Site Scripting (XSS) and data injection.",
            "impact": "Increased susceptibility to XSS attacks, malicious script injection, and clickjacking.",
            "remediation": "Deploy a strict Content-Security-Policy header, configuring 'default-src \\'self\\'', restricting script-src, and enforcing nonce or hash-based script execution."
        },
        "Strict-Transport-Security": {
            "title": "Missing HTTP Strict Transport Security (HSTS)",
            "severity": "High",
            "category": "Cryptographic Protection",
            "cvss": 7.1,
            "description": "HSTS ensures modern browsers communicate with the web application exclusively via encrypted HTTPS connections.",
            "impact": "Users may be vulnerable to SSL stripping attacks, downgrade maneuvers, and adversary-in-the-middle eavesdropping.",
            "remediation": "Enable HSTS: 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'."
        },
        "X-Frame-Options": {
            "title": "Missing Anti-Clickjacking Header (X-Frame-Options)",
            "severity": "Medium",
            "category": "UI Redressing",
            "cvss": 5.0,
            "description": "X-Frame-Options instructs the browser whether the page may be rendered within a <frame>, <iframe>, <embed>, or <object>.",
            "impact": "Adversaries can embed the application in an invisible frame to hijack authenticated user clicks.",
            "remediation": "Set 'X-Frame-Options: DENY' or 'X-Frame-Options: SAMEORIGIN'."
        },
        "X-Content-Type-Options": {
            "title": "Missing X-Content-Type-Options (MIME Sniffing Risk)",
            "severity": "Low",
            "category": "MIME Security",
            "cvss": 3.7,
            "description": "Prevents web browsers from MIME-sniffing a response away from the declared content-type.",
            "impact": "Untrusted user uploads could be interpreted by browsers as executable HTML or JavaScript.",
            "remediation": "Set 'X-Content-Type-Options: nosniff'."
        },
        "Referrer-Policy": {
            "title": "Missing or Permissive Referrer-Policy",
            "severity": "Low",
            "category": "Information Disclosure",
            "cvss": 3.2,
            "description": "Controls how much referrer information is sent along with requests.",
            "impact": "Sensitive path tokens or identifiers in URLs could leak to external third-party services.",
            "remediation": "Set 'Referrer-Policy: strict-origin-when-cross-origin' or 'no-referrer'."
        },
        "Permissions-Policy": {
            "title": "Missing Permissions-Policy",
            "severity": "Informational",
            "category": "Browser Feature Restriction",
            "cvss": 2.0,
            "description": "Allows web developers to selectively enable or disable browser features and APIs (camera, microphone, geolocation).",
            "impact": "Third-party embedded frames may request unnecessary browser capabilities.",
            "remediation": "Configure Permissions-Policy to explicitly disallow unused hardware APIs."
        }
    }

    @classmethod
    def evaluate_headers(cls, headers: Dict[str, str], url: str) -> Dict[str, Any]:
        """
        Analyzes response headers for presence and configuration.
        """
        lower_headers = {k.lower(): v for k, v in headers.items()}
        results = []
        findings = []
        score_deductions = 0

        for header_name, meta in cls.RECOMMENDED_HEADERS.items():
            h_key = header_name.lower()
            if h_key in lower_headers:
                val = lower_headers[h_key]
                grade = "A"
                if h_key == "strict-transport-security" and "max-age" in val:
                    grade = "A+"
                results.append({
                    "header_name": header_name,
                    "header_value": val,
                    "is_present": True,
                    "grade": grade,
                    "recommendation": "Header correctly configured."
                })
            else:
                results.append({
                    "header_name": header_name,
                    "header_value": None,
                    "is_present": False,
                    "grade": "F",
                    "recommendation": meta["remediation"]
                })
                # Create finding
                findings.append({
                    "title": meta["title"],
                    "severity": meta["severity"],
                    "category": meta["category"],
                    "affected_url": url,
                    "evidence": f"Header '{header_name}' was not detected in server response.",
                    "description": meta["description"],
                    "impact": meta["impact"],
                    "remediation": meta["remediation"],
                    "cvss_score": meta["cvss"]
                })
                if meta["severity"] == "High":
                    score_deductions += 10
                elif meta["severity"] == "Medium":
                    score_deductions += 5
                elif meta["severity"] == "Low":
                    score_deductions += 2

        calculated_score = max(35, 100 - score_deductions)
        return {
            "headers": results,
            "findings": findings,
            "score": calculated_score
        }

    @classmethod
    def evaluate_cookie(cls, name: str, domain: str, path: str, is_secure: bool, is_httponly: bool, same_site: str, url: str) -> Dict[str, Any]:
        """
        Evaluates security flags of an HTTP cookie.
        """
        findings = []
        risk = "Secure"
        
        if not is_secure:
            risk = "Medium"
            findings.append({
                "title": f"Cookie '{name}' Missing Secure Flag",
                "severity": "Medium",
                "category": "Session Security",
                "affected_url": url,
                "evidence": f"Cookie '{name}' is missing the 'Secure' directive.",
                "description": "Cookies without the Secure attribute may be transmitted over unencrypted HTTP channels.",
                "impact": "Susceptible to interception by adversary-in-the-middle observers.",
                "remediation": "Add the 'Secure' attribute to ensure cookie transmission occurs solely over HTTPS.",
                "cvss_score": 4.8
            })

        if not is_httponly:
            if risk == "Secure":
                risk = "Low"
            else:
                risk = "High"
            findings.append({
                "title": f"Cookie '{name}' Missing HttpOnly Flag",
                "severity": "Medium",
                "category": "Session Security",
                "affected_url": url,
                "evidence": f"Cookie '{name}' lacks 'HttpOnly' flag.",
                "description": "HttpOnly cookies cannot be accessed via client-side Document.cookie scripts.",
                "impact": "If an XSS flaw exists on the domain, session tokens can be stolen by attacker scripts.",
                "remediation": "Enforce the 'HttpOnly' attribute on all session identifiers.",
                "cvss_score": 5.3
            })

        if not same_site or same_site.lower() == "none":
            findings.append({
                "title": f"Cookie '{name}' SameSite Insecurely Set",
                "severity": "Low",
                "category": "CSRF Defense",
                "affected_url": url,
                "evidence": f"SameSite attribute is '{same_site}'.",
                "description": "Cookies with SameSite=None or omitted can be sent on cross-site requests.",
                "impact": "Higher exposure to Cross-Site Request Forgery (CSRF).",
                "remediation": "Set SameSite=Lax or SameSite=Strict for authenticated session cookies.",
                "cvss_score": 3.5
            })

        return {
            "name": name,
            "domain": domain,
            "path": path,
            "is_secure": is_secure,
            "is_httponly": is_httponly,
            "same_site": same_site or "None",
            "risk_level": risk,
            "findings": findings
        }
