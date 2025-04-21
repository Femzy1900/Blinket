const auth = (req, res,next) => {
    try {
        const token = req.cookies.accessToken || req?.headers?.authorization?.split(" ")[1]    
        console.log(token)
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}