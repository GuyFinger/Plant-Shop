# API DOCUMENTATION

# ADMIN USER NAME
    admin@gmail.com
# ADMIN PASSWORD
    1234

## Signup and Login :
focuses on login and signup phase of the client

### login

 Login to get a token and authorization to use the website.

        - path: /login
        - POST: body: {email, password} 
        - response: { type: isAdmin ? 'admin' : 'user', token: accessToken, id: users[0].ID, isLogged: true }
 
 ### signup

 First step of signup 

        - path: /signup
        - POST: body: {ID,email,password}
        - response: {all users from DB | users[{ID, F_NAME, L_NAME, EMAIL, PASSWORD, CITY, STREET, ADMIN_ROLE}]}


Second step of signup, updating the missing values of the user
    
        -path: /signup
        -PUT: body: {firstName,lastName,city,street}
        - response: {all users from DB | users[{ID, F_NAME, L_NAME, EMAIL, PASSWORD, CITY, STREET, ADMIN_ROLE}]}


### verification

    user Verification 

        -path: /verify
        -POST: body: {token}
        -response: { 'token': 'token verified' }


### users

    get users on load to check if user is already exist on signup

        -path: /users
        -GET
        -response: {all users from DB | users[{ID, F_NAME, L_NAME, EMAIL, PASSWORD, CITY, STREET, ADMIN_ROLE}]}


## User Info
fetching the data required on the landing page

### Site data

    get statistics about the website

        -path: /sitedata
        -GET
        -respons:{orders,products}

### Cart status

    get specific user cart status

        -path: /cartstatus
        -POST: body:{userID}
        -response:{  ('cartDate': userCart[0].CREATION_DATE,'price': totalPrice[0].TOTAL_PRICE,'btn': 'proceed','cart':'open') ||'role': 'admin'}


## User shop
this part refering to `user_edit_remove_items`

 ### New cart

    open a new cart for user if there isn't one open 

        -path: /newcart
        -POST: body:{userID}
        -response: {ID, USER_IDENTIFIER, CREATION_DATE, ORDER_STATUS, DELIVERY_DATE}

### User Cart

    gets all of the users items that in his cart

        -path: /cart
        -POST: body:{cartID}
        -response: {PRODUCT_IDENTIFIER, ID, QTY, PRICE, PRODUCT_NAME, IMAGE}

### Item quantity

    gets item quantity 

     -path: /qty
     -POST: body:{userID}
     -response: {ID,QTY,SHOPPING_CART_IDENTIFIER,PRODUCT_IDENTIFIER,USER_IDENTIFIER}


### Add product to cart

    adds new product to user cart

     -path: /addtocart   
     -POST: body:{product_ID, cart_ID, qty }
     -response: {ID, PRODUCT_IDENTIFIER, SHOPPING_CART_IDENTIFIER, QTY, PRICE}

### Change product quantity

    change the quantity of product in user cart

     -path:/changeqty
     -PUT: body:{qty,product_ID}
     -response:{ID, PRODUCT_IDENTIFIER, SHOPPING_CART_IDENTIFIER, QTY, PRICE}


### Get Cart ID by the Product ID

        -path:/getCartIdByProductID
        -POST: body:{id}
        -response:{cartID}

### Delete item from cart

    delete a single item from user cart

        -path: /deleteitem/:productID
        -DELETE: params:{productID}
        -response:{ID, PRODUCT_IDENTIFIER, SHOPPING_CART_IDENTIFIER, QTY, PRICE}

### Delete all items 

    delete all items from user cart

        -path: /deleteall/:cartID
        -DELETE: params:{cartID}
        -response:{ID, PRODUCT_IDENTIFIER, SHOPPING_CART_IDENTIFIER, QTY, PRICE}


## Product search and filtering

### Products

    gets all products

        -path: /products
        -GET
        -response:{ id, name, price, category, img}

### Product by name
    gets only the products that match the searched value

        -path: /productbyname
        -POST: body:{productName}
        -response:{ id, name, price, category, img}

### Product by category
        gets only the products that match the selected category value

        -path: /productbycategory
        -POST:body:{productCategory}
        -response:{ id, name, price, category, img}



## Order

### Add new cart
        opens a new shopping cart for user after ordering

        -path: /addcart
        -POST: body: {user_ID}
        -response: {ID, USER_IDENTIFIER, CREATION_DATE, ORDER_STATUS, DELIVERY_DATE}

### Make order
        making an order with user cart and deletes the old one

        -path: /order
        -PUT: body: {deliveryDate,userID,cartID,city,street,credit}
        -response: {ID, USER_IDENTIFIER, CREATION_DATE, ORDER_STATUS, DELIVERY_DATE}

### Cart final price
        gets user cart total price

        -path: /cartsum/:id
        -GET params:{id}
        -response: {price}

### Logged user
        gets user data

        -path: /loggedUser/:id
        -GET params:{id}
        -response: {F_NAME,L_NAME,EMAIL,CITY,STREET}


## Auto-complete 

### User address

        gets user home address for shipment

        -path:/useradress/:userID
        -GET params:{userID}
        -response:{ID, F_NAME, L_NAME, EMAIL, PASSWORD, CITY, STREET, ADMIN_ROLE}


### Delivery slots

        gets unavailable shipping dates

        -path:/deliveryslot
        -GET
        -response:{DELIVERY_DATE}


## Admin 

### Get product

        gets a single product for editing purpose

        -path: /product/:id
        -GET params:{id}
        -response:{products.ID,PRODUCT_NAME,PRICE,IMAGE,PRODUCT_CATEGORY,categories.CATEGORY}

### Add new product
        
        adds a new product to products list

        -path: /addproduct
        -POST: body: {productName, productCategoty, productPrice, productImage}
        -response: {ID, PRODUCT_NAME, PRODUCT_CATEGORY, PRICE, IMAGE}

### Edit product

        edit product values

        -path: /editproduct
        -PUT: body: {productName, productCategoty, productPrice, productImage, productID}
        -response: {ID, PRODUCT_NAME, PRODUCT_CATEGORY, PRICE, IMAGE}
