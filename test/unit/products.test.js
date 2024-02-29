const productController = require('../../controller/products')
const productModel = require('../../models/Product')
const httpMocks = require('node-mocks-http')
const newProduct = require('../data/new-product.json')

productModel.create = jest.fn()

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