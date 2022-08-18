
export const getLogin = (req, res) => {
    res.render('login', { flash: req.flash('error'), title: 'Login' });
}

export const getRegister = (req, res) => {
    res.render('signup')
}

export const getDashboard = (req, res) => {
    res.render('dashboard')
}

export const getAddbook = (req, res) => {
    res.render('addbook')
}

