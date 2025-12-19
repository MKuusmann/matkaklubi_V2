// Authentication middleware
export function requireAuth(req, res, next) {
    if (req.session && req.session.isAuthenticated) {
        return next() // User is authenticated, proceed
    }
    // User is not authenticated, redirect to login
    res.redirect('/admin/login')
}

// Login page controller
export function loginCntrl(req, res) {
    // If already authenticated, redirect to admin
    if (req.session && req.session.isAuthenticated) {
        return res.redirect('/admin')
    }
    res.render('login', { error: null })
}

// Login submission controller
export function loginPostCntrl(req, res) {
    const { username, password } = req.body
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD
    
    // Validate credentials
    if (username === adminUsername && password === adminPassword) {
        // Create session
        req.session.isAuthenticated = true
        req.session.username = username
        res.redirect('/admin')
    } else {
        // Invalid credentials
        res.render('login', { error: 'Vale kasutajanimi või parool' })
    }
}

// Logout controller
export function logoutCntrl(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err)
        }
        res.redirect('/admin/login')
    })
}

// Admin page controller (protected)
export function adminCntrl(req, res) {
    // Authentication is handled by requireAuth middleware
    res.render('admin')
}