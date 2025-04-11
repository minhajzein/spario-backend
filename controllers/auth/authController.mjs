import bcrypt from 'bcrypt'
import User from '../../models/userModel.mjs'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'

//⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡

export const login = async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username: username })

        if (user) {
            const exactPassword = user.role === 'admin' ?
                await bcrypt.compare(password, user.password)
                : user.password === password

            if (exactPassword) {
                const userToken = jwt.sign(
                    {
                        'UserInfo':
                        {
                            'username': user.username,
                            'role': user.role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: '15m'
                    }
                )
                const refreshToken = jwt.sign(
                    { 'id': user._id },
                    process.env.REFRESH_TOKEN_SECRET,
                    {
                        expiresIn: '1d'
                    }
                )
                res.status(200)
                    .cookie('user', refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'None',
                        maxAge: 24 * 60 * 60 * 1000
                    })
                    .send({ success: true, token: userToken, user: user })

            } else {
                res.status(403).send({ success: false, message: 'Entered password is incorrect' })
            }

        } else {
            res.status(401).send({ success: false, message: 'Entered username is not a valid username' })
        }
    }
    catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal server error' })
    }
}

export const refresh = async (req, res) => {

    const cookies = req.cookies

    if (!cookies?.user) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.user

    try {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,

            asyncHandler(async (err, decode) => {
                if (err) return res.status(401).json({ success: false, message: 'Forbidden' })
                const user = await User.findById(decode.id).select('-password')

                if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' })

                const accessToken = jwt.sign(
                    {
                        'UserInfo':
                        {
                            'username': user.username,
                            'role': user.role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: '15m'
                    }
                )
                res.json({ success: true, token: accessToken, user })

            }))
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal server error' })
    }
}

export const logout = async (req, res) => {
    try {
        const cookies = req.cookies
        if (!cookies?.user) return res.sendStatus(204) //No content
        res.clearCookie('user', {
            httpOnly: true,
            sameSite: 'None',
            secure: true
        }).json({ success: true })
    } catch (error) {
        console.log(error);
        res.send({ success: false, message: 'Internal server error' })
    }
}
