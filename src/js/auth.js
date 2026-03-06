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
     * Updated to show Admin/User/Login for everyone
     */
    updateUI() {
        const isAuth = this.isAuthenticated();
        const user = this.getUser();

        // Always show the new menu structure with Admin, User, Login
        const guestMenu = document.getElementById('guestMenu');
        
        if (guestMenu) {
            // Create new menu structure if it doesn't have the updated items
            const existingAdminLink = guestMenu.querySelector('a[href="admin-dashboard.html"]');
            
            if (!existingAdminLink) {
                // Replace the menu content with Admin, User, Login
                guestMenu.innerHTML = `
                    <div class="dropdown-menu">
                        <a href="admin-dashboard.html" class="dropdown-item">Admin</a>
                        <a href="user-dashboard.html" class="dropdown-item">User</a>
                        <div class="dropdown-divider"></div>
                        <a href="login.html" class="dropdown-item primary">Login</a>
                    </div>
                `;
            }
        }

        // Update avatar initials based on auth state
        const avatarInitials = document.getElementById('avatarInitials');
        if (avatarInitials) {
            avatarInitials.textContent = isAuth ? this.getInitials() : 'G';
        }

        // Update user info if authenticated
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        
        if (isAuth && user) {
            if (userName) userName.textContent = user.firstName + (user.lastName ? ' ' + user.lastName : '');
            if (userEmail) userEmail.textContent = user.email;
        }

        // Update mobile menu auth links
        const mobGuestLinks = document.getElementById('mobGuestLinks');
        
        if (mobGuestLinks) {
            // Check if already updated
            const existingMobAdminLink = mobGuestLinks.querySelector('a[href="admin-dashboard.html"]');
            
            if (!existingMobAdminLink) {
                // Update mobile menu with Admin, User, Login links
                const mobGuestContent = mobGuestLinks.innerHTML;
                
                // Replace the mobile menu links to include Admin and User options
                mobGuestLinks.innerHTML = `
                    <a href="admin-dashboard.html" class="mob-action-btn secondary" style="margin-bottom: 0.5rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        Admin Panel
                    </a>
                    <a href="user-dashboard.html" class="mob-action-btn secondary" style="margin-bottom: 0.5rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="7" height="9" x="3" y="3" rx="1" />
                            <rect width="7" height="5" x="14" y="3" rx="1" />
                            <rect width="7" height="9" x="14" y="12" rx="1" />
                            <rect width="7" height="5" x="3" y="16" rx="1" />
                        </svg>
                        My Dashboard
                    </a>
                    <a href="donate.html" class="mob-action-btn primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                        Support Our Mission
                    </a>
                    <a href="login.html" class="mob-action-btn secondary">Login</a>
                `;
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
