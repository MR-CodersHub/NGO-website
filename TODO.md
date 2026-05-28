# Task: Update Profile Dropdown & Remove Dashboard Auth

## Plan
1. [x] Modify auth.js - Update dropdown logic to always show Admin/User/Login options
2. [x] Update admin-dashboard.html - Remove authentication check
3. [x] Update user-dashboard.html - Remove authentication check
4. [x] Update all HTML files with new profile dropdown menu (handled by auth.js dynamically)

## Files to Update (14 HTML files):
- index.html ✓ (handled by auth.js)
- home2.html ✓ (handled by auth.js)
- about.html ✓ (handled by auth.js)
- causes.html ✓ (handled by auth.js)
- events.html ✓ (handled by auth.js)
- event-registration.html ✓ (handled by auth.js)
- blog.html ✓ (handled by auth.js)
- donate.html ✓ (handled by auth.js)
- contact.html ✓ (handled by auth.js)
- components.html ✓ (handled by auth.js)
- faq.html ✓ (handled by auth.js)
- terms.html ✓ (handled by auth.js)
- policy.html ✓ (handled by auth.js)
- error404.html ✓ (handled by auth.js)

## Summary
- Modified src/js/auth.js to always show Admin → admin-dashboard.html, User → user-dashboard.html, Login → login.html in the profile dropdown
- Removed authentication check from admin-dashboard.html
- Removed authentication check from user-dashboard.html
- The auth.js dynamically updates the dropdown menus in all HTML files when they load

