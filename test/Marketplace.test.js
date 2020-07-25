import { AssertionError } from "assert"

const Marketplace = artifacts.require('./Marketplace.sol')

contract('Marketplace',(accounts) => {
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
})