import 
{
  SELLER_HOME,
  SELLER_HOME_CATEGORY,
  SELLER_WISHLIST,
  SELLER_WISHLIST_SHOW,
  SELLER_PRODUCT_DETAILS,
  SELLER_PRODUCT_ADD_TO_CART,
  SELLER_SHOW_CART,
  SELLER_CART_QUANTITY,
  SELLER_ADD_ADDRESS,
  SELLER_SHOW_ADDRESS,
  SELLER_SHOW_NOTIFICATION,
  SELLER_SHOW_PROFILE,
  SELLER_UPDATE_PROFILE,
  SELLER_SHOW_CARD,
  SELLER_UPDATE_CARD,
  SELLER_CHECKOUT
} from "../utils/apiconstants";

import axios from 'axios'

const SellerServices = {

  SellerHome: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SELLER_HOME}`);
    const data = await axios.post(`${SELLER_HOME}`, body, config);
    return data;
  },
  SellerHomeCategory: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SELLER_HOME_CATEGORY}`);
    const data = await axios.post(`${SELLER_HOME_CATEGORY}`, body, config);
    return data;
  },
  SellerWishlist: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SELLER_WISHLIST}`);
    const data = await axios.post(`${SELLER_WISHLIST}`, body, config);
    return data;
  },
  SellerWishlistShow: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SELLER_WISHLIST_SHOW}`);
    const data = await axios.post(`${SELLER_WISHLIST_SHOW}`, body, config);
    return data;
  },
  SellerProductDetails: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SELLER_PRODUCT_DETAILS}`);
    const data = await axios.post(`${SELLER_PRODUCT_DETAILS}`, body, config);
    return data;
  },
  SellerProductAddToCart: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SELLER_PRODUCT_ADD_TO_CART}`);
    const data = await axios.post(`${SELLER_PRODUCT_ADD_TO_CART}`, body, config);
    return data;
  },
  SellerShowCart: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SELLER_SHOW_CART}`);
    const data = await axios.post(`${SELLER_SHOW_CART}`, body, config);
    return data;
  },
  SellerCartQuantity: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SELLER_CART_QUANTITY}`);
    const data = await axios.post(`${SELLER_CART_QUANTITY}`, body, config);
    return data;
  },
  SellerAddAddress: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SELLER_ADD_ADDRESS}`);
    const data = await axios.post(`${SELLER_ADD_ADDRESS}`, body, config);
    return data;
  },
  SellerShowAddress: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SELLER_SHOW_ADDRESS}`);
    const data = await axios.post(`${SELLER_SHOW_ADDRESS}`, body, config);
    return data;
  },
  SellerShowNotification: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SELLER_SHOW_NOTIFICATION}`);
    const data = await axios.post(`${SELLER_SHOW_NOTIFICATION}`, body, config);
    return data;
  },
  SellerShowProfile: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SELLER_SHOW_PROFILE}`);
    const data = await axios.post(`${SELLER_SHOW_PROFILE}`, body, config);
    return data;
  },
  SellerUpdateProfile: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SELLER_UPDATE_PROFILE}`);
    const data = await axios.post(`${SELLER_UPDATE_PROFILE}`, body, config);
    return data;
  },
  SellerShowCard: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SELLER_SHOW_CARD}`);
    const data = await axios.post(`${SELLER_SHOW_CARD}`, body, config);
    return data;
  },
  SellerUpdateCard: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SELLER_UPDATE_CARD}`);
    const data = await axios.post(`${SELLER_UPDATE_CARD}`, body, config);
    return data;
  },
  SellerCheckout: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SELLER_CHECKOUT}`);
    const data = await axios.post(`${SELLER_CHECKOUT}`, body, config);
    return data;
  },
}
export default SellerServices
