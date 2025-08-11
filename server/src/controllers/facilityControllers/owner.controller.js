module.exports={
    //dashboard api 

    totalBooking: catchAsync(async (req, res) => {
        const total = await bookingService.countDocuments({ facility: req.params.id });
        res.status(httpStatus.OK).json({
            success: true,
            data: { total },
        });
    }),
}