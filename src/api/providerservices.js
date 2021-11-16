import 
{
  PROVIDER_HOME,
  POST_JOB,
  TOTAL_POST,
  TOGGLE_POST_STATUS,
  PROVIDER_PROFILE,
  PROVIDER_APPLIED_EMP,
  PROVIDER_PROFILE_UPDATE,
  PROVIDER_FILTERED_EMP
} from "../utils/apiconstants";

import axios from 'axios'

const ProviderServices = {

  ProviderHome: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${PROVIDER_HOME}`);
    const data = await axios.post(`${PROVIDER_HOME}`, body, config);
    return data;
  },
  ProviderProfile: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${PROVIDER_PROFILE}`);
    const data = await axios.post(`${PROVIDER_PROFILE}`, body, config);
    return data;
  },
  ProviderProfileUpdate: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${PROVIDER_PROFILE_UPDATE}`);
    const data = await axios.post(`${PROVIDER_PROFILE_UPDATE}`, body, config);
    return data;
  },
  ProviderPostJob: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${POST_JOB}`);
    const data = await axios.post(`${POST_JOB}`, body, config);
    return data;
  },
  ProvideActivePosts: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${TOTAL_POST}`);
    const data = await axios.post(`${TOTAL_POST}`, body, config);
    return data;
  },
  ProvideTogglePosts: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${TOGGLE_POST_STATUS}`);
    const data = await axios.post(`${TOGGLE_POST_STATUS}`, body, config);
    return data;
  },
  ProvideAppliedEmployees: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${PROVIDER_APPLIED_EMP}`);
    const data = await axios.post(`${PROVIDER_APPLIED_EMP}`, body, config);
    return data;
  },
  ProvideFilteredEmployees: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${PROVIDER_FILTERED_EMP}`);
    const data = await axios.post(`${PROVIDER_FILTERED_EMP}`, body, config);
    return data;
  },
}
export default ProviderServices
