import { asyncHandler } from "../../../Services/errorHandling.js";
import orderModel from "../../../../DB/model/Order.model.js";
import couponModel from "../../../../DB/model/coupon.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import cartModel from "../../../../DB/model/Cart.model.js";
import createInvoice from "../../../Services/createInvoice.js";
import {sendEmail} from "../../../Services/sendEmail.js"

export const createOrder = asyncHandler(async(req,res,next)=>{

    const {couponName,address,phoneNumber,products,paymentType} = req.body
    //-----------------------------------------
    if(couponName){
        const coupon = await couponModel.findOne({name:couponName});

        if(!coupon){return next(new Error('this coupon is not exisit',{cause:400}))}

        const dateNow = new Date().toLocaleDateString
        if(dateNow > coupon.expireDate){return next(new Error('this coupon is expired',{cause:400}))}

        if(coupon.usedBy.includes(req.user._id)){return next(new Error('this coupon is used by this user',{cause:400}))}
        req.body.coupon = coupon
    }
    const listOfProducts = []
    const productIds = []
    let totalSum = 0
    for(const product of products){
        const checkProduct = await productModel.findOne({
            _id:product.productId,
            stock:{$gte:product.qty},
            //deleted:false,
        })
        if(!checkProduct){return next(new Error('this product is not exisit',{cause:400}))}

        product.unitPrice = checkProduct.finalPrice
        product.finalPrice = checkProduct.finalPrice*product.qty
        product.name = checkProduct.name
        totalSum+=product.finalPrice
        productIds.push(product.productId)
        listOfProducts.push(product)
    }

    const order = await orderModel.create({userId:req.user._id,address,phoneNumber,
        products:listOfProducts,totalSum,paymentType,
        couponId:req.body.coupon._id,
        finalPrice:totalSum - (totalSum * ((req.body.coupon.amount||0)/100)),
        status:(paymentType=="card")?"onWay":"pending"
    })
    //-------------------------------------------------------------------------------
    const invoice = {
        shipping: {
          name: req.user.userName,
          address,
          city: "Jenin",
          state: "west bank",
          country: "Palestine",
        },
        items:order.products,
        subtotal:totalSum,
        paid:order.finalPrice,
        invoice_nr:order._id
      };
      
      createInvoice(invoice,"invoice.pdf"); 

      await sendEmail(req.user.email,"Wes Co. - invoice","wellcome",{path:"invoice.pdf",contentType:"application/pdf"})
      //------------------------------------------------

    for(const product of products){

        await productModel.updateOne({_id:product.productId},{$inc:{stock:-product.qty}})
    }

    await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}})

    await cartModel.updateOne({userId:req.user._id},
        {
            $pull:{products:{productId:{$in:productIds}}}
    })

    //----------------------------------------------------------

return res.status(200).json({message:"success",order})
})

export const addItemsFromCartToOrder = asyncHandler(async(req,res,next)=>{

    const {couponName,address,phoneNumber,paymentType} = req.body
    //-----------------------------------------
    const cart = await cartModel.findOne({userId:req.user._id})
    if(!cart?.products?.length){return next(new Error('this cart is empty',{cause:400}))}
    req.body.products = cart.products
    if(couponName){
        const coupon = await couponModel.findOne({name:couponName});

        if(!coupon){return next(new Error('this coupon is not exisit',{cause:400}))}

        const dateNow = new Date().toLocaleDateString
        if(dateNow > coupon.expireDate){return next(new Error('this coupon is expired',{cause:400}))}

        if(coupon.usedBy.includes(req.user._id)){return next(new Error('this coupon is used by this user',{cause:400}))}
        req.body.coupon = coupon
    }
    const listOfProducts = []
    const productIds = []
    let totalSum = 0
    for(let product of req.body.products){
        const checkProduct = await productModel.findOne({
            _id:product.productId,
            stock:{$gte:product.qty},
            //deleted:false,
        })
        if(!checkProduct){return next(new Error('this product is not exisit',{cause:400}))}
        product = product.toObject()
        product.unitPrice = checkProduct.finalPrice
        product.finalPrice = checkProduct.finalPrice*product.qty
        totalSum+=product.finalPrice
        productIds.push(product.productId)
        listOfProducts.push(product)
    }

    const order = await orderModel.create({userId:req.user._id,address,phoneNumber,
        products:listOfProducts,totalSum,paymentType,
        couponId:req.body.coupon._id,
        finalPrice:totalSum - (totalSum * ((req.body.coupon.amount||0)/100)),
        status:(paymentType=="card")?"onWay":"pending"
    })

    for(let product of req.body.products){

        await productModel.updateOne({_id:product.productId},{$inc:{stock:-product.qty}})
    }

    await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}})

    await cartModel.updateOne({userId:req.user._id},{products:[]})

return res.status(200).json({message:"success",order})
})

export const cancelOrder = asyncHandler(async(req,res,next)=>{
    const {orderId} = req.params ;
    const order = await orderModel.findOne({_id:orderId,userId:req.user._id})
    if(!order||order.status!='pending'||order.paymentType!='cash'){
       return next(new Error("cant cancel this order",{cause:400}))
    }
    await orderModel.updateOne({_id:orderId},{status:'canceled'})
    for(const product of order.products){
        await productModel.updateOne({_id:product.productId},{$inc:{stock:product.qty}})
    }
    if(order.couponId){
        await couponModel.updateOne({_id:order.couponId},{$pull:{usedBy:req.user._id}})
    }
    return res.status(200).json({message:"success"})
})
export const changeStatus = asyncHandler(async(req,res,next)=>{
    const {orderId} = req.params ;
    const {status} = req.body ; 
    const order = await orderModel.findOne({_id:orderId,userId:req.user._id})
    if(!order||order.status=='delivered'){
       return next(new Error("cant change this status order",{cause:400}))
    }
    const updateStatus = await orderModel.updateOne({_id:orderId},{status,updatedBy:req.user._id})
    if(!updateStatus.matchedCount){return next(new Error("fail change status",{cause:400}))}

    if(order.status=="canceled"&&status!="canceled"){
        for(let product of order.products){

            product= product.toObject()
            await productModel.updateOne({_id:product.productId},{$inc:{stock:-product.qty}})
        }
    
        await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}})
    }


    return res.status(200).json({message:"success"})
})
