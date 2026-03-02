/**
 * Data Management Module for Jeevan Foundation
 * Handles storing and retrieving user data using localStorage
 * Tracks donations, volunteer hours, causes, and activities
 */

const UserData = {
    // Storage keys
    KEYS: {
        DONATIONS: 'jeevan_donations',
        VOLUNTEER_HOURS: 'jeevan_volunteer_hours',
        CAUSES: 'jeevan_causes',
        ACTIVITIES: 'jeevan_activities',
        EVENTS: 'jeevan_events'
    },

    /**
     * Initialize default data if not exists
     */
    init() {
        if (!localStorage.getItem(this.KEYS.DONATIONS)) {
            localStorage.setItem(this.KEYS.DONATIONS, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.VOLUNTEER_HOURS)) {
            localStorage.setItem(this.KEYS.VOLUNTEER_HOURS, JSON.stringify({ total: 0, sessions: [] }));
        }
        if (!localStorage.getItem(this.KEYS.CAUSES)) {
            localStorage.setItem(this.KEYS.CAUSES, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.ACTIVITIES)) {
            localStorage.setItem(this.KEYS.ACTIVITIES, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.EVENTS)) {
            localStorage.setItem(this.KEYS.EVENTS, JSON.stringify([]));
        }
    },

    // ==================== DONATIONS ====================

    /**
     * Add a new donation
     * @param {Object} donation - { amount, cause, date, paymentMethod }
     */
    addDonation(donation) {
        const donations = this.getDonations();
        const newDonation = {
            id: Date.now(),
            amount: donation.amount,
            cause: donation.cause || 'General Fund',
            date: donation.date || new Date().toISOString(),
            paymentMethod: donation.paymentMethod || 'Card',
            status: 'Completed'
        };
        donations.push(newDonation);
        localStorage.setItem(this.KEYS.DONATIONS, JSON.stringify(donations));

        // Add to activities
        this.addActivity({
            type: 'donation',
            title: `Donated ₹${donation.amount.toLocaleString()}`,
            description: `to ${newDonation.cause}`,
            date: newDonation.date
        });

        // Track cause if not already tracked
        this.addCause(newDonation.cause, donation.amount);

        return newDonation;
    },

    /**
     * Get all donations
     * @returns {Array}
     */
    getDonations() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.DONATIONS)) || [];
        } catch (e) {
            return [];
        }
    },

    /**
     * Get total donation amount
     * @returns {number}
     */
    getTotalDonations() {
        const donations = this.getDonations();
        return donations.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
    },

    /**
     * Get donation count
     * @returns {number}
     */
    getDonationCount() {
        return this.getDonations().length;
    },

    // ==================== VOLUNTEER HOURS ====================

    /**
     * Add volunteer hours
     * @param {Object} session - { hours, event, date }
     */
    addVolunteerHours(session) {
        const data = this.getVolunteerData();
        const newSession = {
            id: Date.now(),
            hours: parseFloat(session.hours) || 0,
            event: session.event || 'General Volunteering',
            date: session.date || new Date().toISOString()
        };
        data.sessions.push(newSession);
        data.total += newSession.hours;
        localStorage.setItem(this.KEYS.VOLUNTEER_HOURS, JSON.stringify(data));

        // Add to activities
        this.addActivity({
            type: 'volunteer',
            title: `Volunteered ${newSession.hours} hours`,
            description: `at ${newSession.event}`,
            date: newSession.date
        });

        return newSession;
    },

    /**
     * Get volunteer data
     * @returns {Object}
     */
    getVolunteerData() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.VOLUNTEER_HOURS)) || { total: 0, sessions: [] };
        } catch (e) {
            return { total: 0, sessions: [] };
        }
    },

    /**
     * Get total volunteer hours
     * @returns {number}
     */
    getTotalVolunteerHours() {
        return this.getVolunteerData().total;
    },

    // ==================== CAUSES ====================

    /**
     * Add or update a cause
     * @param {string} causeName 
     * @param {number} amount 
     */
    addCause(causeName, amount) {
        const causes = this.getCauses();
        const existingIndex = causes.findIndex(c => c.name === causeName);

        if (existingIndex >= 0) {
            causes[existingIndex].totalDonated += parseFloat(amount) || 0;
            causes[existingIndex].donationCount += 1;
        } else {
            causes.push({
                id: Date.now(),
                name: causeName,
                totalDonated: parseFloat(amount) || 0,
                donationCount: 1,
                dateJoined: new Date().toISOString()
            });
        }
        localStorage.setItem(this.KEYS.CAUSES, JSON.stringify(causes));
    },

    /**
     * Get all causes
     * @returns {Array}
     */
    getCauses() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.CAUSES)) || [];
        } catch (e) {
            return [];
        }
    },

    /**
     * Get causes count
     * @returns {number}
     */
    getCausesCount() {
        return this.getCauses().length;
    },

    // ==================== ACTIVITIES ====================

    /**
     * Add an activity
     * @param {Object} activity - { type, title, description, date }
     */
    addActivity(activity) {
        const activities = this.getActivities();
        const newActivity = {
            id: Date.now(),
            type: activity.type || 'general',
            title: activity.title,
            description: activity.description || '',
            date: activity.date || new Date().toISOString()
        };
        // Add to beginning for recent first
        activities.unshift(newActivity);
        // Keep only last 50 activities
        if (activities.length > 50) {
            activities.pop();
        }
        localStorage.setItem(this.KEYS.ACTIVITIES, JSON.stringify(activities));
        return newActivity;
    },

    /**
     * Get all activities
     * @param {number} limit - Number of activities to return
     * @returns {Array}
     */
    getActivities(limit = 10) {
        try {
            const activities = JSON.parse(localStorage.getItem(this.KEYS.ACTIVITIES)) || [];
            return activities.slice(0, limit);
        } catch (e) {
            return [];
        }
    },

    // ==================== EVENTS ====================

    /**
     * Register for an event
     * @param {Object} event - { name, date, location }
     */
    registerEvent(event) {
        const events = this.getEvents();
        const newEvent = {
            id: Date.now(),
            name: event.name,
            date: event.date,
            location: event.location,
            registeredAt: new Date().toISOString(),
            status: 'Registered'
        };
        events.push(newEvent);
        localStorage.setItem(this.KEYS.EVENTS, JSON.stringify(events));

        // Add to activities
        this.addActivity({
            type: 'event',
            title: `Registered for ${event.name}`,
            description: event.location,
            date: newEvent.registeredAt
        });

        return newEvent;
    },

    /**
     * Get registered events
     * @returns {Array}
     */
    getEvents() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.EVENTS)) || [];
        } catch (e) {
            return [];
        }
    },

    // ==================== UTILITIES ====================

    /**
     * Format date for display
     * @param {string} dateString 
     * @returns {string}
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    },

    /**
     * Format currency
     * @param {number} amount 
     * @returns {string}
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    },

    /**
     * Get dashboard stats summary
     * @returns {Object}
     */
    getDashboardStats() {
        return {
            totalDonated: this.getTotalDonations(),
            donationCount: this.getDonationCount(),
            volunteerHours: this.getTotalVolunteerHours(),
            causesSupported: this.getCausesCount(),
            eventsRegistered: this.getEvents().length
        };
    },

    /**
     * Add sample data for testing
     */
    addSampleData() {
        // Only add if no data exists
        if (this.getDonationCount() === 0) {
            this.addDonation({ amount: 5000, cause: 'Education for All' });
            this.addDonation({ amount: 2500, cause: 'Clean Water Initiative' });
            this.addDonation({ amount: 1000, cause: 'Healthcare Access' });
        }
        if (this.getTotalVolunteerHours() === 0) {
            this.addVolunteerHours({ hours: 4, event: 'Teaching at Community Center' });
            this.addVolunteerHours({ hours: 3, event: 'Food Distribution Drive' });
        }
    },

    /**
     * Clear all user data
     */
    clearAllData() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        this.init();
    }
};

// Initialize on load
UserData.init();

const EventData = {
    events: [
        {
            id: 'gala-2026',
            title: 'Global Impact Gala 2026',
            date: '2026-02-15',
            time: '7:00 PM - 11:00 PM',
            location: 'The Grand Ballroom, New York City',
            description: 'Our flagship evening of inspiration, entertainment, and radical transparency. Join world leaders and field heroes for an unforgettable night of storytelling and collective action.',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
            month: 'FEB',
            day: '15'
        },
        {
            id: 'fashion-2026',
            title: 'Sustainable Fashion Runway',
            date: '2026-03-05',
            time: '6:00 PM - 9:00 PM',
            location: 'Milan, Italy',
            description: 'Showcasing apparel created by our vocational training graduates. 100% of proceeds go back into the Artisan Fund.',
            image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop',
            month: 'MAR',
            day: '05'
        },
        {
            id: 'health-fair',
            title: 'Community Health Fair',
            date: '2026-03-22',
            time: '9:00 AM - 5:00 PM',
            location: 'Mumbai, India',
            description: 'Free health screenings and wellness education for the local community, administered by regional experts.',
            image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop',
            month: 'MAR',
            day: '22'
        },
        {
            id: 'hackathon-2026',
            title: 'AI for Good Hackathon',
            date: '2026-04-02',
            time: '48 Hours (Continuous)',
            location: 'Silicon Valley, CA (Hybrid)',
            description: 'Developers competing to build open-source tools for disaster response and resource mapping.',
            image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop',
            month: 'APR',
            day: '02'
        },
        {
            id: 'edu-summit',
            title: 'Global Education Summit',
            date: '2026-04-10',
            time: '10:00 AM - 4:00 PM',
            location: 'London, UK',
            description: 'Innovative education leaders discussing the future of distributed learning in remote regions.',
            image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop',
            month: 'APR',
            day: '10'
        },
        {
            id: 'reef-walk',
            title: 'Reef Awareness Walk',
            date: '2026-04-18',
            time: '7:00 AM - 12:00 PM',
            location: 'Cairns, Australia',
            description: 'A 10km awareness walk along the coast to fund marine conservation and coral grafting.',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
            month: 'APR',
            day: '18'
        },
        {
            id: 'run-hope',
            title: 'Run for Hope 5K',
            date: '2026-04-28',
            time: '8:00 AM - 11:00 AM',
            location: 'Central Park, NYC',
            description: 'Join 5,000 runners in our annual charity run raising funds for planetary water health.',
            image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop',
            month: 'APR',
            day: '28'
        },
        {
            id: 'vol-training',
            title: 'Volunteer Training Day',
            date: '2026-05-15',
            time: '1:00 PM - 4:00 PM',
            location: 'Virtual Event',
            description: 'Comprehensive volunteer orientation program and skill-building workshop for field deployment.',
            image: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=600&h=400&fit=crop',
            month: 'MAY',
            day: '15'
        },
        {
            id: 'art-auction',
            title: 'Art for Change Auction',
            date: '2026-06-08',
            time: '6:00 PM - 9:00 PM',
            location: 'San Francisco, CA',
            description: 'Bid on museum-quality artwork donated by global masters to support primary healthcare.',
            image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop',
            month: 'JUN',
            day: '08'
        },
        {
            id: 'youth-conf',
            title: 'Youth Leadership Forum',
            date: '2026-06-20',
            time: '9:00 AM - 6:00 PM',
            location: 'Chicago, IL',
            description: 'Empowering the next generation of impact leaders with intensive workshops on social entrepreneurship.',
            image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=400&fit=crop',
            month: 'JUN',
            day: '20'
        }
    ],

    getEventById(id) {
        return this.events.find(e => e.id === id);
    },

    getAllEvents() {
        return this.events;
    }
};
