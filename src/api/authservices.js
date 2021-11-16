import 
{
  LOGIN,
  REGISTER,
  ABOUTUS,
  FB_LOGIN,
  GOOGLE_LOGIN
} from "../utils/apiconstants";

import axios from 'axios'

const AuthServices = {
  LoginUser: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${LOGIN}`);
    const data = await axios.post(`${LOGIN}`, body, config);
    return data;
  },
  RegisterUser: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${REGISTER}`);
    const data = await axios.post(`${REGISTER}`, body, config);
    return data;
  },
  FbRegister: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${FB_LOGIN}`);
    const data = await axios.post(`${FB_LOGIN}`, body, config);
    return data;
  },
  GoogleRegister: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${GOOGLE_LOGIN}`);
    const data = await axios.post(`${GOOGLE_LOGIN}`, body, config);
    return data;
  },
  AboutUs: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${ABOUTUS}`);
    const data = await axios.post(`${ABOUTUS}`, body, config);
    return data;
  },
}
export default AuthServices
