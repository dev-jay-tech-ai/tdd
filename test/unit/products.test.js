const productController = require('../../controller/products')
const productModel = require('../../models/Product')
const httpMocks = require('node-mocks-http')
const newProduct = require('../data/new-product.json')
const allProducts = require('../data/all-products.json')

productModel.create = jest.fn()
productModel.find = jest.fn()
productModel.findById = jest.fn()
productModel.findByIdAndUpdate = jest.fn()
productModel.findByIdAndDelete = jest.fn()

let req,res,next
beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = jest.fn();
})

describe('Product Controller Create',() => {
  beforeEach(() => req.body = newProduct)
  it('should have a createProduct function',() => {
    expect(typeof productController.createProduct).toBe('function')
  })
  // 프로덕트 모델을 만드는 테스트
  it('should call ProductModel create', async() => {
    await productController.createProduct(req,res,next)
    expect(productModel.create).toBeCalledWith(newProduct)
  })
  // 상태값 전달(status)
  it('should return 201 response code',async() => {
    await productController.createProduct(req,res,next)
    expect(res.statusCode).toBe(201)
    expect(res._isEndCalled()).toBeTruthy()
  })
  // 결과값 전달(send/ json 타입)
  it('should return json body in response',async() => {
    productModel.create.mockReturnValue(newProduct)
    await productController.createProduct(req,res,next)
    expect(res._getJSONData()).toStrictEqual(newProduct)
  })
  // 에러처리를 위한 단위테스트 작성
  it('should handle errors', async() => {
    // 몽고디비에서 처리하는 부분은 문제가 없다는 것을 
    // 가정하는 단위 테스트이기 떄문에
    // 원래 몽고DB에서 처리하는 에러 메시지 부분은
    // Mock 함수를 이용해서 처리
    const errorMessage = { message: "desription priority missing" }
    const rejectedPromise = Promise.reject(errorMessage)
    // 실패에 대한 결과값 임의로 실행
    productModel.create.mockReturnValue(rejectedPromise)
    await productController.createProduct(req,res,next)
    expect(next).toBeCalledWith(errorMessage)
  })

})

describe('Product Controller Get',() => {
  it('should have a get products function', async() => {
    expect(typeof productController.getProducts).toBe('function')
  })

  it('should call ProductModel.find({})', async() =>  {
    await productController.getProducts(req,res,next)
    expect(productModel.find).toHaveBeenCalledWith({})
  })

  it('shold return 200 response', async() => {
    await productController.getProducts(req,res,next)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled).toBeTruthy()
  })

  it('should return json body in response', async() => {
    productModel.find.mockReturnValue(allProducts)
    await productController.getProducts(req,res,next)
    expect(res._getJSONData()).toStrictEqual(allProducts)
  })

  it('should handle errors', async() => {
    const errorMessage = { message: "Error finding product data" }
    const rejectedPromise = Promise.reject(errorMessage)
    productModel.create.mockReturnValue(rejectedPromise)
    await productController.createProduct(req,res,next)
    expect(next).toBeCalledWith(errorMessage)
  })
})

const productId = 'adadnnk9u30h2lk'
describe('Product Controller GetById',() => {
  it('should have a getProductId', () => {
    expect(typeof productController.getProductById).toBe('function')
  })

  it('should call productMode.findById', async() => {
    req.params.productId = productId
    await productController.getProductById(req,res,next)
    expect(productModel.findById).toBeCalledWith(productId)
  })

  it('should return json body and response code 200', async() => {
    productModel.findById.mockReturnValue(newProduct)
    await productController.getProductById(req,res,next)
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toStrictEqual(newProduct)
    expect(res._isEndCalled()).toBeTruthy()
  }) 

  it('should return 404 when item doesnt exist', async() => {
    productModel.findById.mockReturnValue(null)
    await productController.getProductById(req,res,next)
    expect(res.statusCode).toBe(404)
    expect(res._isEndCalled()).toBeTruthy()
  })

  it('should handle errors', async() => {
    const errorMessage = { message: 'error' }
    const rejectedPromise = Promise.reject(errorMessage) // 비동기
    productModel.findById.mockReturnValue(rejectedPromise)
    await productController.getProductById(req,res,next)
    expect(next).toHaveBeenCalledWith(errorMessage)
  })
})

const updatedProduct = {
  name: 'updated name',
  description: 'updated description'
}
describe('Product Controller Update',() => {
  it('should have an updateProduct function',() =>  {
    expect(typeof productController.updateProduct).toBe('function')
  })

  it('should call productModel.findByIdAndUpdate',async() => {
    req.params.productId = productId
    req.body = updatedProduct
    await productController.updateProduct(req,res,next)
    expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
      productId, updatedProduct, { new: true }
    )
  })

  it('should return json body and response code 200', async() => {
    req.params.productId = productId
    req.body = updatedProduct
    productModel.findByIdAndUpdate.mockReturnValue(updatedProduct)
    await productController.updateProduct(req,res,next)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toStrictEqual(updatedProduct)
  })

  it('should return json body and reponse code 200', async() => {
    req.params.productId = productId
    req.body = updatedProduct
    productModel.findByIdAndUpdate.mockReturnValue(updatedProduct)
    await productController.updateProduct(req, res, next)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toStrictEqual(updatedProduct)
  })

  it('should handle 404 when item doesnt exist', async() => {
    productModel.findByIdAndUpdate.mockReturnValue(null)
    await productController.updateProduct(req,res,next)
    expect(res.statusCode).toBe(404)
    expect(res._isEndCalled()).toBeTruthy()
  })

  it('should handle errors', async() => {
    const errorMessage = { message: 'Error' }
    const rejectPromise = Promise.reject(errorMessage)
    productModel.findByIdAndUpdate.mockReturnValue(rejectPromise)
    await productController.updateProduct(req,res,next)
    expect(next).toHaveBeenCalledWith(errorMessage)
  })
  
})

describe('Product Controller Delete',() => {
  it('should have a deleteProduct function',() => {
    expect(typeof productController.deleteProduct).toBe('function')
  })

  it('should call ProductModel.findByIdAndDelete',async() => {
    req.params.productId = productId
    await productController.deleteProduct(req, res, next)
    expect(productModel.findByIdAndDelete).toBeCalledWith(productId)

  })

  it('should return 200 response', async() => {
    let deletedProduct = {
      name: 'deletedProduct',
      description: 'it is deleted'
    }
    productModel.findByIdAndDelete.mockReturnValue(deletedProduct)
    await productController.deleteProduct(req,res,next)
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toStrictEqual(deletedProduct)
    expect(res._isEndCalled()).toBeTruthy()
  })

  it('should handle 404 when item doesnt exist', async() => {
    productModel.findByIdAndDelete.mockReturnValue(null)
    await productController.deleteProduct(req,res,next)
    expect(res.statusCode).toBe(404)
    expect(res._isEndCalled()).toBeTruthy()
  })

  it('should handle errors', async() => {
    const errorMessage = { message: 'Error deleting' }
    const rejectedPromise = Promise.reject(errorMessage)
    productModel.findByIdAndDelete.mockReturnValue(rejectedPromise)
    await productController.deleteProduct(req,res,next)
    expect(next).toHaveBeenCalledWith(errorMessage)
  })
})