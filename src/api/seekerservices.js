import 
{
  SEEKER_HOME,
  SAVE_JOB,
  APPLY_JOB,
  APPLY_JOB_SHOW,
  SAVE_JOB_SHOW,
  CATEGORY,
  COLOR_CUT,
  SHAPE_COLOR,
  USER_EXPERIENCE,
  SEEKER_PROFILE,
  SEEKER_SPECIAL,
  SEEKER_PROFILE_UPDATE,
  LEVEL1,
  LEVEL2,
  LEVEL3,
  LEVEL4,
  LEVEL5,
  SEEKER_LEVEL_SUBMIT,
  SEEKER_FILTERED_HOME,
  SEEKER_FILTERED_SAVE,
  SEEKER_FREELANCER_LIST
} from "../utils/apiconstants";

import axios from 'axios'

const SeekerServices = {

  SeekerHome: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SEEKER_HOME}`);
    const data = await axios.post(`${SEEKER_HOME}`, body, config);
    return data;
  },
  SeekerFilteredHome: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SEEKER_FILTERED_HOME}`);
    const data = await axios.post(`${SEEKER_FILTERED_HOME}`, body, config);
    return data;
  },
  SeekerFilteredSave: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SEEKER_FILTERED_SAVE}`);
    const data = await axios.post(`${SEEKER_FILTERED_SAVE}`, body, config);
    return data;
  },
  SeekerHomeCategory: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${CATEGORY}`);
    const data = await axios.post(`${CATEGORY}`, body, config);
    return data;
  },
  SeekerCUT: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${COLOR_CUT}`);
    const data = await axios.post(`${COLOR_CUT}`, body, config);
    return data;
  },
  SeekerCOLOR: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SHAPE_COLOR}`);
    const data = await axios.post(`${SHAPE_COLOR}`, body, config);
    return data;
  },
  SeekerSPECIAL: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SEEKER_SPECIAL}`);
    const data = await axios.post(`${SEEKER_SPECIAL}`, body, config);
    return data;
  },
  SeekerSaveJob: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SAVE_JOB}`);
    const data = await axios.post(`${SAVE_JOB}`, body, config);
    return data;
  },
  SeekerApplyJob: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${APPLY_JOB}`);
    const data = await axios.post(`${APPLY_JOB}`, body, config);
    return data;
  },
  SeekerAppliedJob: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${APPLY_JOB_SHOW}`);
    const data = await axios.post(`${APPLY_JOB_SHOW}`, body, config);
    return data;
  },
  SeekerSavedJob: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SAVE_JOB_SHOW}`);
    const data = await axios.post(`${SAVE_JOB_SHOW}`, body, config);
    return data;
  },
  SeekerFreelancerList: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SEEKER_FREELANCER_LIST}`);
    const data = await axios.post(`${SEEKER_FREELANCER_LIST}`, body, config);
    return data;
  },
  SeekerUserExperience: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${USER_EXPERIENCE}`);
    const data = await axios.post(`${USER_EXPERIENCE}`, body, config);
    return data;
  },
  SeekerProfile: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SEEKER_PROFILE}`);
    const data = await axios.post(`${SEEKER_PROFILE}`, body, config);
    return data;
  },
  SeekerProfileUpdate: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SEEKER_PROFILE_UPDATE}`);
    const data = await axios.post(`${SEEKER_PROFILE_UPDATE}`, body, config);
    return data;
  },
  ExpertSubmit: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${SEEKER_LEVEL_SUBMIT}`);
    const data = await axios.post(`${SEEKER_LEVEL_SUBMIT}`, body, config);
    return data;
  },
  Level1: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${LEVEL1}`);
    const data = await axios.post(`${LEVEL1}`, body, config);
    return data;
  },
  Level2: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${LEVEL2}`);
    const data = await axios.post(`${LEVEL2}`, body, config);
    return data;
  },
  Level3: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${LEVEL3}`);
    const data = await axios.post(`${LEVEL3}`, body, config);
    return data;
  },
  Level4: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${LEVEL4}`);
    const data = await axios.post(`${LEVEL4}`, body, config);
    return data;
  },
  Level5: async (bodyFormData) => {
    const config = {
      headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Basic YWRtaW46MTIz` 
      },
    };
    const body = bodyFormData;
    console.log(body);
    console.log(`${LEVEL5}`);
    const data = await axios.post(`${LEVEL5}`, body, config);
    return data;
  },
 
}
export default SeekerServices
