import { AssertionError } from "assert"

require('chai')
.use(require('chai-as-promised'))
.should()

const Marketplace = artifacts.require('./Marketplace.sol')

contract('Marketplace',([deployer,seller,buyer]) => {
    let marketplace

    before(async ()=>{
        marketplace=await Marketplace.deployed()
    })

    describe('Deployment', async () =>{

        it('deployed successfully', async() =>{
            
        const address = await marketplace.address

        assert.notEqual(address,0x0)
        assert.notEqual(address,null)
        assert.notEqual(address,'')
        assert.notEqual(address,undefined)
    })
        it('Has a name', async () =>{
            const name=await marketplace.name()
            assert.equal(name,'Omkar DApp')
        })

    })


    describe('products', async () =>{
        let result, productCount

        before(async ()=>{
           result=await marketplace.createProduct('Bullet', web3.utils.toWei('1','ether'), { from:seller })
           productCount = await marketplace.productCount()
        })

        it('creates product', async () =>{
           assert.equal(productCount,1)
           //console.log(result.logs)

           const event=result.logs[0].args
           assert.equal(event.id.toNumber(),productCount.toNumber(),'Id is correct')
           assert.equal(event.name,'Bullet','name is correct')
           assert.equal(event.price,'1000000000000000000','price is correct')
           assert.equal(event.owner,seller,'owner is correct')
           assert.equal(event.purchased,false,'purchased is correct')


            //failed
            await marketplace.createProduct('',web3.utils.toWei('1','Ether'), {from:seller}).should.be.rejected;
            await marketplace.createProduct('Bullet','', {from:seller}).should.be.rejected;

        })

        it('list product', async () =>{
            const product= await marketplace.products(productCount)

           assert.equal(product.id.toNumber(),productCount.toNumber(),'Id is correct')
           assert.equal(product.name,'Bullet','name is correct')
           assert.equal(product.price,'1000000000000000000','price is correct')
           assert.equal(product.owner,seller,'owner is correct')
           assert.equal(product.purchased,false,'purchased is correct')
        })

        it('sells product', async () => {

            //check seller balance

            let oldSellerBalance;
            oldSellerBalance= await web3.eth.getBalance(seller)
            oldSellerBalance= new web3.utils.BN(oldSellerBalance)

            //success
            result =await marketplace.purchaseProduct(productCount,{from:buyer, value:web3.utils.toWei('1','Ether')})
            
            //event logs
            const event= await result.logs[0].args
            assert.equal(event.id.toNumber(),productCount.toNumber(),'id is correct')
            assert.equal(event.name,'Bullet','name is correct')
            assert.equal(event.price,'1000000000000000000','price is correct')
            assert.equal(event.owner,buyer,'owner is correct')
            assert.equal(event.purchased,true,'purchased is correc')

            //amount transferred to seller
            let newSellerBalance
            newSellerBalance=await web3.eth.getBalance(seller)
            newSellerBalance=new web3.utils.BN(newSellerBalance)

            let price
            price= await web3.utils.toWei('1','Ether')
            price= new web3.utils.BN(price)

            //console.log(oldSellerBalance, newSellerBalance,price)
            const expectedBalance = oldSellerBalance.add(price)
            assert.equal(expectedBalance.toString(),newSellerBalance.toString())

            //Product exist

            await marketplace.purchaseProduct(99, {from:buyer, value:web3.utils.toWei('1','Ether')}).should.be.rejected;
            await marketplace.purchaseProduct(productCount, {from:buyer, value:web3.utils.toWei('0.1','Ether')}).should.be.rejected;
            await marketplace.purchaseProduct(productCount,{from:deployer, value:web3.utils.toWei('1','ether')}).should.be.rejected;
            await marketplace.products(productCount,{from:buyer, value:web3.utils.toWei('1','Ether')}).should.be.rejected;


        })
    })

})