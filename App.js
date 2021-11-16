/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Easing} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator,TransitionPresets,CardStyleInterpolators } from '@react-navigation/stack';

/**
 * Common Screen Imports For Root Stack
 */
import SplashScreen from './src/screens/common/splash';
import PaytmTest from './src/screens/common/paytmtest';
import LandingPage from './src/screens/common/landingPage';
import ForgotPassword from './src/screens/common/forgotpassword';
import OtpCommon from './src/screens/common/otpverify';
import ResetPassword from './src/screens/common/resetpassword';
import AboutUs from './src/screens/common/aboutus';
import ContactUs from './src/screens/common/contactus';
import TermsAndCondition from './src/screens/common/termsandcondition';
import PrivacyPolicy from './src/screens/common/privacypolicy';
import RateApp from './src/screens/common/rateapp';

/**
 * Seeker Imports For Root Stack
 */
 import LoginSeeker from './src/screens/seeker/loginseeker';
 import RegisterSeeker from './src/screens/seeker/registerseeker';
 import OtpSeeker from './src/screens/seeker/otpverify';
 import RegisterSkip from './src/screens/seeker/registerskip';
 import JobCard from './src/screens/seeker/jobcard';
 import MainTabSeeker from './src/screens/seeker/maintabseeker';
 import ApplyForJobSeeker from './src/screens/seeker/applyforjobseeker';
 import SettingSeeker from './src/screens/seeker/settingseeker';
 import ApplySuccess from './src/screens/seeker/applysuccess';
 import FreelancerList from './src/screens/seeker/freelancerlist';


 /**
 * Provider Imports For Root Stack
 */
  import LoginProvider from './src/screens/provider/loginprovider';
  import RegisterProvider from './src/screens/provider/registerprovider';
  import OtpProvider from './src/screens/provider/otpverify';
  import MainTabProvider from './src/screens/provider/maintabprovider';
  import SettingProvider from './src/screens/provider/settingprovider';
  import CreateJobProvider from './src/screens/provider/createjobprovider';
  import EmployeeApplied from './src/screens/provider/employeeapllied';
  import FilteredUser from './src/screens/provider/filteredUsers';

/**
 * Seller Imports For Root Stack
*/
import LoginSeller from './src/screens/seller/loginseller';
import RegisterSeller from './src/screens/seller/registerseller';
import OtpSeller from './src/screens/seller/otpverify';
import MainTabSeller from './src/screens/seller/maintabseller';
import FeaturedSeller from './src/screens/seller/featuredseller';
import BestSellSeller from './src/screens/seller/bestsellseller';
import AllCategorySeller from './src/screens/seller/categoriesallseller';
import FavouriteSeller from './src/screens/seller/favouriteseller';
import NotificationSeller from './src/screens/seller/notificationseller';
import ProductPageSeller from './src/screens/seller/productpageseller';
import ReviewSeller from './src/screens/seller/reviewseller';
import TrackOrder from './src/screens/seller/trackorder';
import ShippingSeller from './src/screens/seller/shippingseller';
import CreateAddressSeller from './src/screens/seller/createaddressseller';
import PaymentSeller from './src/screens/seller/paymentseller';
import CreateCardSeller from './src/screens/seller/createcardseller';
import CheckoutSeller from './src/screens/seller/checkoutseller';
import OrderCompletionSeller from './src/screens/seller/ordercompletionseller';


const RootStack = createStackNavigator();

const App = () =>{
  return(
    <NavigationContainer>
      <RootStack.Navigator
      screenOptions={{
        headerShown:false,
        ...TransitionPresets.SlideFromRightIOS   
      }}
      mode={"modal"}
      >


        <RootStack.Screen name="SplashScreen" component={SplashScreen} />
        <RootStack.Screen name="PaytmTest" component={PaytmTest} />
        <RootStack.Screen name="LandingPage" component={LandingPage} />
        <RootStack.Screen name="ForgotPassword" component={ForgotPassword} />
        <RootStack.Screen name="OtpCommon" component={OtpCommon} />
        <RootStack.Screen name="ResetPassword" component={ResetPassword} />
        <RootStack.Screen name="AboutUs" component={AboutUs} />
        <RootStack.Screen name="ContactUs" component={ContactUs} />
        <RootStack.Screen name="TermsAndCondition" component={TermsAndCondition} />
        <RootStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <RootStack.Screen name="RateApp" component={RateApp} />


        <RootStack.Screen name="LoginSeeker" component={LoginSeeker} />
        <RootStack.Screen name="RegisterSeeker" component={RegisterSeeker} />
        <RootStack.Screen name="JobCard" component={JobCard} />
        <RootStack.Screen name="OtpSeeker" component={OtpSeeker} />
        <RootStack.Screen name="RegisterSkip" component={RegisterSkip} />
        <RootStack.Screen name="MainTabSeeker" component={MainTabSeeker} />
        <RootStack.Screen name="ApplyForJobSeeker" component={ApplyForJobSeeker} />
        <RootStack.Screen name="ApplySuccess" component={ApplySuccess} />
        <RootStack.Screen name="SettingSeeker" component={SettingSeeker} />
        <RootStack.Screen name="FreelancerList" component={FreelancerList} />


        <RootStack.Screen name="LoginProvider" component={LoginProvider} />
        <RootStack.Screen name="RegisterProvider" component={RegisterProvider} />
        <RootStack.Screen name="OtpProvider" component={OtpProvider} />
        <RootStack.Screen name="MainTabProvider" component={MainTabProvider} />
        <RootStack.Screen name="SettingProvider" component={SettingProvider} />
        <RootStack.Screen name="CreateJobProvider" component={CreateJobProvider} />
        <RootStack.Screen name="EmployeeApplied" component={EmployeeApplied} />
        <RootStack.Screen name="FilteredUser" component={FilteredUser} />


        <RootStack.Screen name="LoginSeller" component={LoginSeller} />
        <RootStack.Screen name="RegisterSeller" component={RegisterSeller} />
        <RootStack.Screen name="OtpSeller" component={OtpSeller} />
        <RootStack.Screen name="MainTabSeller" component={MainTabSeller} />
        <RootStack.Screen name="FeaturedSeller" component={FeaturedSeller} />
        <RootStack.Screen name="BestSellSeller" component={BestSellSeller} />
        <RootStack.Screen name="FavouriteSeller" component={FavouriteSeller} />
        <RootStack.Screen name="AllCategorySeller" component={AllCategorySeller} />
        <RootStack.Screen name="NotificationSeller" component={NotificationSeller} />
        <RootStack.Screen name="ProductPageSeller" component={ProductPageSeller} />
        <RootStack.Screen name="ReviewSeller" component={ReviewSeller} />
        <RootStack.Screen name="TrackOrder" component={TrackOrder} />
        <RootStack.Screen name="ShippingSeller" component={ShippingSeller} />
        <RootStack.Screen name="CreateAddressSeller" component={CreateAddressSeller} />
        <RootStack.Screen name="PaymentSeller" component={PaymentSeller} />
        <RootStack.Screen name="CreateCardSeller" component={CreateCardSeller} />
        <RootStack.Screen name="CheckoutSeller" component={CheckoutSeller} />
        <RootStack.Screen name="OrderCompletionSeller" component={OrderCompletionSeller} />


      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default App;
