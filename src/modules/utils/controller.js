const getRequestIp = (req,res,next)=>{
    try {
        const isReachable = true
        res.status(200).json({isReachable});
    } catch (err) {
        console.log("Error crating User:", err);
        next(err);
    }
}

module.exports={getRequestIp}