const productModel = require('../models/Product')

exports.createProduct = async (req,res,next) => {
  try {
    const createdProduct = await productModel.create(req.body)
    console.log('createdProduct',createdProduct)
    res.status(201).json(createdProduct)
  } catch(error){ 
    console.log(error) 
    next(error)  // 비동기 에러를 next를 이용해 애러를 처리할 수 있는 곳으로 보내준다
  } 
}

exports.getProducts = async (req,res,next) => {
  try {
    const allProducts = await productModel.find({})
    res.status(200).json(allProducts)
  } catch(error) {
    next(error)
  }
}

exports.getProductById = async(req,res,next) => {
  try  {
    const product = await productModel.findById(req.params.productId)
    if(product) res.status(200).json(product)
    else res.status(404).send()
  } catch(error) {
    console.log(error)
    next(error)
  }
}