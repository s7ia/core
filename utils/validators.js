import User from '../models/userModel';
import bcrypt from 'bcrypt';

export const validateUserLoginInput = async (req, res, next) =>
{
    const { login, password } = req.body;

    try {
        if (!login || !password)
            return res
                .status(400)
                .json({
                    errorMessage: "Must have all required fields."
                });

        let existingUser = await User.findOne ({email: login})
        if (!existingUser) {
            existingUser = await User.findOne ({username: login})
            if (!existingUser)
                return res
                    .status(400)
                    .json({
                        errorMessage: "Wrong login or password."
                    });
        }

        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect)
        return res
            .status(400)
            .json({
                errorMessage: "Wrong login or password."
            });
        
        req.body.existingUserId = existingUser._id;
        next();
            
    } catch (error) {
        console.log(error);
        return res.status(500).send();
    }
    
}

export const validateUserRegistrationInput = async (req, res, next) => 
{
    const { username, email, password, passwordVerify } = req.body;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    try {
        if (!username || !email || !password || !passwordVerify)
            return res
                .status(400)
                .json({
                    errorMessage: "Must have all required fields."
                });

        if (username.trim().length > process.env.MAX_USERNAME_LENGTH)
            return res
                .status(400)
                .json({
                    errorMessage: "Username cannot exceed "+process.env.MAX_USERNAME_LENGTH+" characters."
                });
        
        if (!re.test(String(email).toLowerCase()))
            return res
            .status(400)
                .json({
                    errorMessage: "Must be a valid e-mail."
                });

        if (password.length < process.env.MIN_PASSWORD_LENGTH)
            return res
                .status(400)
                .json({
                    errorMessage: "Password must be at least "+process.env.MIN_PASSWORD_LENGTH+" characters."
                });

        if (password.length > 512)
            return res
                .status(400)
                .json({
                    errorMessage: "Password may not exceed 512 characters."
                });

        if (password !== passwordVerify)
            return res
                .status(400)
                .json({
                    errorMessage: "Passwords did not match."
                });

        const existingUser = await User.findOne({ username: username })

        if (existingUser) 
            return res
                .status(400)
                .json({
                    errorMessage: "Username already exsists."
                });    	

        const existingEmail = await User.findOne({ email: email })

        if (existingEmail) 
            return res
                .status(400)
                .json({
                    errorMessage: "E-mail already in use."
                });
                
        next();
    } catch (error) {
        return res.status(500).send();
    }

}