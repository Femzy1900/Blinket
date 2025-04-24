import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generatedOTP from "../utils/generateOTP.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";

export async function registerUserController(req, res){
    try{
        const {name, email, password } = req.body

        if(!name || !email || !password){
            return res.status(400).json({
                message: "provide email, name, password",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if(user){
            return res.json({
                message: "Already register email",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            password: hashPassword
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save()

        // const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`

        // const verifyEmail = await sendEmail({
        //     sendTo: email,
        //     subject: "Verify email from blinket",
        //     html: verifyEmailTemplate({
        //         name,
        //         url: VerifyEmailUrl
        //     })
        // })

        return res.json({
            message: "User register successfully",
            error: false,
            success: true,
            data: save
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function verifyEmailController(request,response){
    try {
        const { code } = request.body

        const user = await UserModel.findOne({ _id : code})

        if(!user){
            return response.status(400).json({
                message : "Invalid code",
                error : true,
                success : false
            })
        }

        const updateUser = await UserModel.updateOne({ _id : code },{
            verify_email : true
        })

        return response.json({
            message : "Verify email done",
            success : true,
            error : false
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : true
        })
    }
}

//login controller

export async function loginController(req, res) {
    try {
        const { email, password } = req.body

        if(!email || !password) {
            return res.status(400).json({
                message: "provide email and password",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })
        
        if (!user) {
            return res.status(400).jsin({
                message: "Invalid email or password",
                error: true,
                success: false
            })
        }

        // const checkAccountStatus = await UserModel.findOne({ email, verify_email: false})
        if(user.status === "inactive"){
            return res.status(400).json({
                message: "Contact with admin to active your account",
                error: true,
                success: false
            })
        }

        const checkPassword = await bcryptjs.compare(password, user.password)    
        
        if(!checkPassword) {
            return res.status(400).json({
                maessage: "Invalid email or password",
                error: true,
                success: false
            })
        }

        const accessToken = await generateAccessToken(user._id)
        const refreshToken = await generateRefreshToken(user._id)

        const cookiesOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }
        response.cookie("accessToken", accessToken, cookiesOptions)
        response.cookie("refreshToken", refreshToken, cookiesOptions)

        return res.json({
            message: "Login successfully",
            error: false,
            success: true,
            data: {
                _id: user._id,
                refreshToken: refreshToken,
                accessToken: accessToken
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
    
}

//logout
export async function logoutController(req, res) {
    try {
        const user = req.userId
        const cookiesOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }
        res.clearCookie("accessToken", cookiesOptions)
        res.clearCookie("refreshToken", cookiesOptions)

        const removeRefreshToken = await UserModel.updateOne({ _id: user }, {
            $set: {
                refresh_token: ""
            }
        })

        return res.json({
            message: "Logout successfully",
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
        
    }
}

//upload userAvatar
export async function uploadAvatar(req, res) {
    try {
        const userId = req.userId // auth middleware
        const image = req.file // multer middleware
        const upload = await uploadImageCloudinary(image)

        const updateUser = await UserModel.findByIdandUpdate(userId,{
            avatar: upload.url
        })

        return response.json({
            message: 'upload profile',
            data: {
                _id: userId,
                avatar: upload.url
            }
        })

        console.log(image)
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// update user details 
export async function updateUserDetails(req, res) {
    try {
        const userId = req.userId // auth middleware
        const {name, email, password, mobile} = req.body
        
        let hashPassword = ''

        if(password) {
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password, salt)
        }

        const updateUser = await UserModel.updateOne({_id: userId}, {
            ...(name && {name: name}),
            ...(email && {email: email}),
            ...(mobile && {mobile: mobile}),
            ...(password && {password: hashPassword}),
        })

        return res.json({
            message: "updated user successfully",
            error: false,
            success: true,
            data: updateUser
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//forgot password
export async function forgotPasswordController(req, res) {
    try {
    const {email} = req.body

    const user = await UserModel.findOne({ email })

    if(!user) {
        return res.status(400).json({
            message: "Email not available",
            error: true,
            success: false
        })
    }

    const otp = generatedOTP()
    const expireTime = new Date() + 60 * 60 * 1000 // 1hour

    const update = await UserModel.findByIdAndUpdate(user._id, {
        forgot_password_otp: otp,
        forgot_password_expiry: new Date(expireTime).toISOString()
    })

    await sendEmail({
        sendTo: email,
        subject: "Forgot password f(or Blinket",
        html: forgotPasswordTemplate({
            name: user.name,
            otp: otp
        })
    })

    return res.status(400).json({
        message: "check your email",
        error: false,
        success: true
    })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function verifyForgotPasswordOtp(request,response){
    try {
        const { email , otp }  = request.body

        if(!email || !otp){
            return response.status(400).json({
                message : "Provide required field email, otp.",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const currentTime = new Date().toISOString()

        if(user.forgot_password_expiry < currentTime  ){
            return response.status(400).json({
                message : "Otp is expired",
                error : true,
                success : false
            })
        }

        if(otp !== user.forgot_password_otp){
            return response.status(400).json({
                message : "Invalid otp",
                error : true,
                success : false
            })
        }

        //if otp is not expired
        //otp === user.forgot_password_otp

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp : "",
            forgot_password_expiry : ""
        })
        
        return response.json({
            message : "Verify otp successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//reset the password
export async function resetpassword(request,response){
    try {
        const { email , newPassword, confirmPassword } = request.body 

        if(!email || !newPassword || !confirmPassword){
            return response.status(400).json({
                message : "provide required fields email, newPassword, confirmPassword"
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email is not available",
                error : true,
                success : false
            })
        }

        if(newPassword !== confirmPassword){
            return response.status(400).json({
                message : "newPassword and confirmPassword must be same.",
                error : true,
                success : false,
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword,salt)

        const update = await UserModel.findOneAndUpdate(user._id,{
            password : hashPassword
        })

        return response.json({
            message : "Password updated successfully.",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


//refresh token controler
export async function refreshToken(request,response){
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]  /// [ Bearer token]

        if(!refreshToken){
            return response.status(401).json({
                message : "Invalid token",
                error  : true,
                success : false
            })
        }

        const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return response.status(401).json({
                message : "token is expired",
                error : true,
                success : false
            })
        }

        const userId = verifyToken?._id

        const newAccessToken = await generateAccessToken(userId)

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        response.cookie('accessToken',newAccessToken,cookiesOption)

        return response.json({
            message : "New Access token generated",
            error : false,
            success : true,
            data : {
                accessToken : newAccessToken
            }
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//get login user details
export async function userDetails(request,response){
    try {
        const userId  = request.userId

        console.log(userId)

        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return response.json({
            message : 'user details',
            data : user,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : "Something is wrong",
            error : true,
            success : false
        })
    }
}