import jwt from "jsonwebtoken"

const auth = (req, res,next) => {
    try {
        const token = req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1]    
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
                error: true,
                success: false
            })
        }

        const decode = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN)
        if (!decode) {
            return res.status(401).json({
                message: "Unauthorized",
                error: true,
                success: false
            })
        }

        request.userId = decode.id  

        next()  
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}