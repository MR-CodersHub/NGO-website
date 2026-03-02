/**
 * Authentication Module for Jeevan Foundation
 * Handles simulated authentication using localStorage
 * No backend required - pure frontend demo logic
 */

const Auth = {
    // Storage key for auth state
    STORAGE_KEY: 'jeevan_auth_user',

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        const user = this.getUser();
        return user !== null && user.isAuthenticated === true;
    },

    /**
     * Check if current user is admin
     * @returns {boolean}
     */
    isAdmin() {
        const user = this.getUser();
        return this.isAuthenticated() && user.role === 'admin' && user.email === 'admin@gmail.com';
    },

    /**
     * Get current user data from localStorage
     * @returns {Object|null}
     */
    getUser() {
        try {
            const userData = localStorage.getItem(this.STORAGE_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (e) {
            console.error('Error reading auth state:', e);
            return null;
        }
    },

    /**
     * Simulate user signup
     * @param {Object} userData - User registration data
     * @returns {Object} - Result with success status
     */
    signup(userData) {
        try {
            // Prevent duplicate admin or unauthorized admin creation
            if (userData.email === 'admin@gmail.com') {
                return { success: false, error: 'Cannot register as admin. Please login directly.' };
            }

            const user = {
                id: Date.now(),
                firstName: userData.firstName || 'User',
                lastName: userData.lastName || '',
                email: userData.email,
                phone: userData.phone || '',
                role: 'donor', // Force role to donor for all signups
                createdAt: new Date().toISOString(),
                isAuthenticated: true
            };

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
            this.updateUI();

            return { success: true, user: user };
        } catch (e) {
            console.error('Signup error:', e);
            return { success: false, error: 'Failed to create account' };
        }
    },

    /**
     * Simulate user login
     * @param {string} email - User email
     * @param {string} password - User password (not validated in demo except for admin)
     * @returns {Object} - Result with success status
     */
    login(email, password) {
        try {
            // Admin Credentials Check
            if (email === 'admin@gmail.com' && password === 'admin123') {
                const user = {
                    id: 'admin_001',
                    firstName: 'Admin',
                    lastName: 'User',
                    email: email,
                    role: 'admin',
                    createdAt: new Date().toISOString(),
                    isAuthenticated: true
                };
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
                this.updateUI();
                return { success: true, user: user, redirect: 'admin-dashboard.html' };
            }

            // Regular User Logic
            let user = this.getUser();

            if (user && user.email === email) {
                // Existing user - mark as authenticated
                user.isAuthenticated = true;
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
            } else {
                // Create new user for demo
                user = {
                    id: Date.now(),
                    firstName: email.split('@')[0],
                    lastName: '',
                    email: email,
                    role: 'donor', // Default role
                    createdAt: new Date().toISOString(),
                    isAuthenticated: true
                };
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
            }

            this.updateUI();
            return { success: true, user: user, redirect: 'user-dashboard.html' };
        } catch (e) {
            console.error('Login error:', e);
            return { success: false, error: 'Failed to login' };
        }
    },

    /**
     * Logout current user
     */
    logout() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            this.updateUI();
            return { success: true };
        } catch (e) {
            console.error('Logout error:', e);
            return { success: false, error: 'Failed to logout' };
        }
    },

    /**
     * Get user initials for avatar
     * @returns {string}
     */
    getInitials() {
        const user = this.getUser();
        if (!user) return 'G';

        const first = user.firstName ? user.firstName[0] : '';
        const last = user.lastName ? user.lastName[0] : '';
        return (first + last).toUpperCase() || 'U';
    },

    /**
     * Get user display name
     * @returns {string}
     */
    getDisplayName() {
        const user = this.getUser();
        if (!user) return 'Guest';
        return user.firstName || user.email.split('@')[0];
    },

    /**
     * Update UI based on auth state
     * Called automatically after login/logout/signup
     */
    updateUI() {
        const isAuth = this.isAuthenticated();
        const user = this.getUser();

        // Update profile dropdown content
        const guestMenu = document.getElementById('guestMenu');
        const userMenu = document.getElementById('userMenu');
        const avatarInitials = document.getElementById('avatarInitials');
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');

        if (guestMenu && userMenu) {
            if (isAuth) {
                guestMenu.style.display = 'none';
                userMenu.style.display = 'block';

                if (avatarInitials) {
                    avatarInitials.textContent = this.getInitials();
                }
                if (userName && user) {
                    userName.textContent = user.firstName + (user.lastName ? ' ' + user.lastName : '');
                }
                if (userEmail && user) {
                    userEmail.textContent = user.email;
                }

                // Dynamically update dashboard links based on role
                const dashboardLinks = document.querySelectorAll('a[href="user-dashboard.html"], a[href="admin-dashboard.html"]');
                const targetDashboard = this.isAdmin() ? 'admin-dashboard.html' : 'user-dashboard.html';

                dashboardLinks.forEach(link => {
                    link.href = targetDashboard;
                });

            } else {
                guestMenu.style.display = 'block';
                userMenu.style.display = 'none';

                if (avatarInitials) {
                    avatarInitials.textContent = 'G';
                }
            }
        }

        // Update mobile menu auth links
        const mobGuestLinks = document.getElementById('mobGuestLinks');
        const mobUserLinks = document.getElementById('mobUserLinks');

        if (mobGuestLinks && mobUserLinks) {
            if (isAuth) {
                mobGuestLinks.style.display = 'none';
                mobUserLinks.style.display = 'block';

                // Also update dashboard links in mobile menu
                const mobDashboardLinks = mobUserLinks.querySelectorAll('a[href="user-dashboard.html"], a[href="admin-dashboard.html"]');
                const targetDashboard = this.isAdmin() ? 'admin-dashboard.html' : 'user-dashboard.html';
                mobDashboardLinks.forEach(link => {
                    link.href = targetDashboard;
                });
            } else {
                mobGuestLinks.style.display = 'block';
                mobUserLinks.style.display = 'none';
            }
        }
    }
};

/**
 * Profile Dropdown Controller
 */
const ProfileDropdown = {
    isOpen: false,

    /**
     * Toggle dropdown visibility
     */
    toggle() {
        const dropdown = document.getElementById('profileDropdown');
        if (!dropdown) return;

        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            dropdown.classList.add('open');
        } else {
            dropdown.classList.remove('open');
        }
    },

    /**
     * Close dropdown
     */
    close() {
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown) {
            dropdown.classList.remove('open');
            this.isOpen = false;
        }
    },

    /**
     * Initialize dropdown - add click outside listener
     */
    init() {
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const profileBtn = document.getElementById('profileBtn');
            const dropdown = document.getElementById('profileDropdown');

            if (profileBtn && dropdown) {
                if (!profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
                    this.close();
                }
            }
        });

        // Update UI on page load
        Auth.updateUI();
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    ProfileDropdown.init();
});

// Handle logout click
function handleLogout() {
    Auth.logout();
    ProfileDropdown.close();
    // Redirect to home after logout
    window.location.href = 'index.html';
}

// Mobile menu toggle is handled in main.js to avoid duplication
// Profile dropdown toggle is handled in main.js to avoid duplication
