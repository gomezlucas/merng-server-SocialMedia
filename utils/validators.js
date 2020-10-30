module.exports.registerValidators = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {}
    if (username.trim() === '') {
        errors.username = "Username must not be empty"
    }
    if (email.trim() === "") {
        errors.email = "Email must not be empty"
    }
    if (password === "") {
        errors.password = "Password must not be empty"
    } else if (password !== confirmPassword){
        errors.password = "Password and Confirm Email must be equal"
    }
    return {
        errors, 
        valid: Object.keys(errors).length < 1
    }
}


module.exports.validateLogin = (username, password) =>{
    const errors = {}

    if (username.trim() === ''){
        errors.username = "Username must not be empty"
    }

    if (password === ''){
        errors.password = "Password must not be empty"
    }

    return {
        errors, 
        valid: Object.keys(errors).length < 1
    }
}