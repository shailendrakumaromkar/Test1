pragma solidity 0.5.0;

/// @title Marketplace
/// @author Shailendra Kumar Omkar
/// @notice You can use this contract for creating & purchasing Products
/// @dev All function calls are currently implemented without side effects
contract Marketplace {

  /// @notice It keeps the counter track of Product which are added
  /// @dev Initializing with zero
    uint public productCount=0;

  /// Create a struct named Product.
  /// It contain Product details -  id, name, price, owner, purchased
    struct Product{
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }


  /// Create a Public mapping that maps ProductCount (a number) to an Product (struct)

    mapping(uint => Product) public products;

  /// @notice Create event ProductCreated for EVM logging
  /// @dev This event will be emitted when a new Product has been created
 
    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

  /// @notice Create event ProductPurchased for EVM logging
  /// @dev This event will be emitted when a Product has been purchased

event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

  ///@notice Defining a constrcutor
    constructor() public {}
    

  /// @notice Creating a Product
  /// @dev It will validate Product Name length & Product Price value
 /// @param _name Product Name  _price Product Price
  /// @return ProductCount
  ///         Emit ProductCreated event with associated parameter
    function createProduct(string memory _name, uint _price) public {
      
        require(bytes(_name).length>0 ,"Product Name should be a valid name of length greater than zero");
        require(_price >0,"Product Price must be greater than zero");

        productCount++;
        products[productCount] = Product(productCount,_name,_price, msg.sender,false);

        emit ProductCreated(productCount,_name,_price, msg.sender,false);
        
    }

   /// @notice Purchasing a Product
   /// @dev It will check for valid Product Id, 
   ///      Product Price to purchase
   ///      Product is not already purchased
   ///      Buyer is not same as seller
   /// @param _id product ID
   /// @return Transfer the owneership to Buyer & amount to seller
   ///         Emit ProductPurchased event with associated parameter
    function purchaseProduct(uint _id) public payable{
    Product memory _product = products[_id];

    address payable seller = _product.owner;

    require(_product.id > 0 && _product.id <= productCount);
    require((msg.value >= _product.price));
    require(!_product.purchased);
    require(seller != msg.sender);


    _product.owner = msg.sender;
    _product.purchased = true;
    products[_id] = _product;

    address(seller).transfer(msg.value);

    emit ProductPurchased(_id,_product.name,_product.price,msg.sender,true);
    }
}