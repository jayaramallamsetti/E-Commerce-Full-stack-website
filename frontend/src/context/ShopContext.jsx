import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

// console.log("Environment Variables:", import.meta.env);


const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({}); // for ADD TO cart functionality  , {} -> empty object
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItems); // To create the copy of object i.e. cartItems

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        // If there is product entry but there is no product entry with same size, then we will create new entry
        cartData[itemId][size] = 1;
      }
    } else {
      // In the cartData If there is no entry available with this particularId then we will create a new entry
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData); // to save this cartData in cartItems state variable

    if (token) {
        try {
          await axios.post(backendUrl + '/api/cart/add' , {itemId,size} , {headers:{token}})
        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }
      
    }
  };

  // useEffect(() => {
  //   console.log(cartItems);
  // },[cartItems])

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount; // to get the total count of the cart items
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    // if we update the quantity from cart page then it should be updated in the database as well
    if(token) {
       try {
          await axios.post(backendUrl + '/api/cart/update' , {itemId,size,quantity}, {headers:{token}})
       } catch (error) {
        console.log(error);
        toast.error(error.message);
       }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  
  // console.log("Backend URL:", backendUrl);


  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      // console.log(response.data); // Debugging
      if (response.data.success) {
        setProducts(response.data.products); // Ensure products array is updated
      } else toast.error(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  //  when ever we refresh the page then the cart data has to be updated into the cart from the database

  const getUserCart = async (token) => {
      try {
          const response = await axios.post(backendUrl + '/api/cart/get' , {} , {headers:{token}})
          if (response.data.success) {
              setCartItems(response.data.cartData)
          }
      } catch (error) {
        console.log(error);
        toast.error(error.message); 
      }
  }

  

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {  // to resolve the issue that , when we refresh the webpage the token is getting erased and we are getting logged out...
    if (!token && localStorage.getItem('token')) {
        setToken(localStorage.getItem('token'))
        getUserCart(localStorage.getItem('token'))
    }
  },[])

  const value = {
    // to access the below features in any other component
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,token
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
