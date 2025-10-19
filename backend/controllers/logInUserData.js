
export const loginUserData = (req, res) => {
    try {
        res.status(200).json({
            message: "User data retrieved successfully",
            success: true,
            user: req.user
        });
    } catch (error) {
        console.log("Error in loginUserData controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}