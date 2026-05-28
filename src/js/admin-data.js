/**
 * Admin Data Management Module for Jeevan Foundation
 * Handles global operations and simulates aggregated data for the admin dashboard
 */

const AdminData = {
    // Storage keys for global stats
    KEYS: {
        ALL_DONATIONS: 'jeevan_all_donations',
        // We'll trust UserData for the current user's contribution
    },

    /**
     * Initialize default admin data
     * Starts empty now - no mock data
     */
    /**
     * Initialize default admin data
     * Cleans up any legacy mock data
     */
    init() {
        const storedDonations = localStorage.getItem(this.KEYS.ALL_DONATIONS);

        // Check if it exists and contains legacy mock data (simple check for hardcoded names)
        if (storedDonations && (storedDonations.includes('Rahul Sharma') || storedDonations.includes('Priya Menon'))) {
            localStorage.setItem(this.KEYS.ALL_DONATIONS, JSON.stringify([]));
        } else if (!storedDonations) {
            localStorage.setItem(this.KEYS.ALL_DONATIONS, JSON.stringify([]));
        }
    },

    /**
     * Get recent donations across all users (Real only)
     */
    getAllDonations(limit = 0) {
        try {
            // 1. Get stored data (will be empty initially now)
            let allDonations = JSON.parse(localStorage.getItem(this.KEYS.ALL_DONATIONS)) || [];

            // 2. Get current user's real data
            // In a real app, this would come from the backend.
            // Here, we merge the current session's UserData into the view.
            const user = Auth.getUser();
            const userDonations = UserData.getDonations().map(d => ({
                id: d.id,
                donorName: user ? (user.firstName + ' ' + (user.lastName || '')) : 'Guest User',
                email: user ? user.email : 'guest@example.com',
                amount: parseFloat(d.amount),
                cause: d.cause,
                status: d.status,
                date: d.date,
                donorAvatar: user ? Auth.getInitials() : 'G'
            }));

            // Combine and sort by date (newest first)
            const combined = [...userDonations, ...allDonations].sort((a, b) => new Date(b.date) - new Date(a.date));

            return limit > 0 ? combined.slice(0, limit) : combined;
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    /**
     * Get global summary stats dynamically
     */
    getGlobalStats() {
        try {
            const allDonations = this.getAllDonations();

            // Calculate Total Donations (Strictly sum of existing data)
            const totalDonations = allDonations.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);

            // Calculate Unique Donors
            const uniqueDonors = new Set(allDonations.map(d => d.email)).size;

            // Active Volunteers
            let activeVolunteers = 0;
            if (UserData.getTotalVolunteerHours() > 0) {
                // If current user is volunteering, they count
                activeVolunteers = 1;
                // In a real multi-user app, we'd sum this from a 'ALL_VOLUNTEERS' key similar to donations
            }

            return {
                totalDonations: totalDonations,
                totalDonors: uniqueDonors,
                activeVolunteers: activeVolunteers,
                activeCampaigns: UserData.getCausesCount(),
                trends: {
                    donations: '0%',
                    donors: '0',
                    volunteers: '0'
                }
            };
        } catch (e) {
            return {};
        }
    },

    /**
     * Format currency
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    }
};

// Initialize
AdminData.init();
