const productModel = require('../models/Product')

exports.createProduct = async (req,res,next) => {
  try {
    const createdProduct = await productModel.create(req.body)
    console.log('createdProduct',createdProduct)
    res.status(201).json(createdProduct)
  } catch(error){ 
    console.log(error) 
    next(error)  // 비동기 에러를 처리할 수 있는 곳으로 보내준다
  } 

}