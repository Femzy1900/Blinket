const uploadImageCloudinary = async (image) => {
    const buffer = Buffer.from(await image.arrayBuffer())

    const uploadImage = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "binkeyit" }, (error, uploadResult) => {
           return resolve(uploadResult)
        }).end(buffer)

    })
    return uploadImage
}

export default uploadImageCloudinary