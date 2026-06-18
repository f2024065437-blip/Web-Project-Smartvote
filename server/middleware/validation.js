const validateEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

const validateRegistration = (req, res, next) => {
    const { fullname, email, password } = req.body;
    
    if (!fullname || fullname.length < 2) {
        return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
    }
    
    if (!email || !validateEmail(email)) {
        return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }
    
    if (!validatePassword(password)) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    
    next();
};

module.exports = { validateEmail, validatePassword, validateRegistration, validateLogin };