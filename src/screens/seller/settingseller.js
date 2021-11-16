import React from 'react';
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    ImageBackground,
    Image,
    FlatList,
    Dimensions, 
    TouchableOpacity,
    StatusBar
  } from 'react-native';

  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';
  import Icon8 from 'react-native-vector-icons/SimpleLineIcons';
  import Icon9 from 'react-native-vector-icons/Feather';
  import Icon10 from 'react-native-vector-icons/MaterialIcons';

import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MyLanguage} from '../../utils/languagehelper';


export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
          loading:false,
          userdata:{},
          renderLanguage:MyLanguage.en

      };

      this.onEditProfileClick = this.onEditProfileClick.bind(this);
      this.onShippingAddressClick = this.onShippingAddressClick.bind(this);
      this.onWishlistClick = this.onWishlistClick.bind(this);
      this.onOrderHistoryClick = this.onOrderHistoryClick.bind(this);
      this.onTrackOrderClick = this.onTrackOrderClick.bind(this);
      this.onPaymentOptionClick = this.onPaymentOptionClick.bind(this);
      this.onLogoutCLick = this.onLogoutCLick.bind(this);

    }

    componentDidMount(){
        this.getUserData();
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({userdata: value},()=>{
            this.setLanguage();
        })
    }

    setLanguage(){
        if(this.state.userdata.lang_id == '0' ){
            this.setState({renderLanguage:MyLanguage.en})
        }
        if(this.state.userdata.lang_id == '1' ){
            this.setState({renderLanguage:MyLanguage.hi})
        }
        if(this.state.userdata.lang_id == '2' ){
            this.setState({renderLanguage:MyLanguage.gj})
        }
    }

    onEditProfileClick(){
        this.props.navigation.navigate('Profile');
    }

    onShippingAddressClick(){
        this.props.navigation.navigate('ShippingSeller');
    }

    onWishlistClick(){
        this.props.navigation.navigate('FavouriteSeller');
    }

    onOrderHistoryClick(){
        this.props.navigation.navigate('My Orders');
    }

    onTrackOrderClick(){
        this.props.navigation.navigate('TrackOrder');
    }

    onPaymentOptionClick(){
        this.props.navigation.navigate('PaymentSeller');
    }

    async onLogoutCLick(){
        await AsyncStorage.removeItem('User').then(
            this.props.navigation.popToTop(), 
            this.props.navigation.replace("LandingPage")
        )
    }

    render () {
      return (
        <View style={styles.maincontainer}>
        <StatusBar
           backgroundColor = "#4F45F0"
           barStyle = "light-content"
         />
        <ImageBackground source={require('../../assets/image/splash_bg.png')} style={styles.backgroundImage} resizeMode='stretch' >
        <View style={styles.subcontainer1}>
            <Text style={{color:'black',fontSize:hp('3%'),textAlignVertical:'center'}}>{this.state.userdata.firstname}</Text>
            <Text style={{color:'black',fontSize:hp('2.5%'),textAlignVertical:'center',marginTop:hp('1%')}}>{this.state.userdata.mobile_no}</Text>
        </View>
        
        <ScrollView style={styles.subcontainer2} contentContainerStyle={{alignItems:"center"}}>

        <TouchableOpacity style={{justifyContent:"space-between",alignItems:"center",flexDirection:"row",width:wp('80%'),marginTop:hp('3%')}} onPress={this.onEditProfileClick}>
            <View style={{alignItems:'center',flexDirection:"row"}}>
            <View style={{backgroundColor:"#4F45F0",padding:hp('1%'),borderRadius:hp('1%')}}>
            <Image source={require('../../assets/icon/edit.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
            </View>
            <Text style={{color:'#000',fontSize:hp('1.7%'),paddingHorizontal:wp('5%')}}>{this.state.renderLanguage.editprofile}</Text>
            </View>
            <View>
            <Icon9 name="chevron-right" color={'#0000008a'} size={hp('4%')} />
            </View>
        </TouchableOpacity>

        <TouchableOpacity style={{justifyContent:"space-between",alignItems:"center",flexDirection:"row",width:wp('80%'),marginTop:hp('3%')}} onPress={this.onShippingAddressClick}>
            <View style={{alignItems:'center',flexDirection:"row"}}>
            <View style={{backgroundColor:"#4F45F0",padding:hp('1%'),borderRadius:hp('1%')}}>
            <Image source={require('../../assets/icon/location_white.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
            </View>            
            <Text style={{color:'#000',fontSize:hp('1.7%'),paddingHorizontal:wp('5%')}}>{this.state.renderLanguage.shippingaddress}</Text>
            </View>
            <View>
            <Icon9 name="chevron-right" color={'#0000008a'} size={hp('4%')} />
            </View>
        </TouchableOpacity>

        <TouchableOpacity style={{justifyContent:"space-between",alignItems:"center",flexDirection:"row",width:wp('80%'),marginTop:hp('3%')}} onPress={this.onWishlistClick}>
            <View style={{alignItems:'center',flexDirection:"row"}}>
            <View style={{backgroundColor:"#4F45F0",padding:hp('1%'),borderRadius:hp('1%')}}>
            <Image source={require('../../assets/icon/star.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
            </View>
            <Text style={{color:'#000',fontSize:hp('1.7%'),paddingHorizontal:wp('5%')}}>{this.state.renderLanguage.wishlist}</Text>
            </View>
            <View>
            <Icon9 name="chevron-right" color={'#0000008a'} size={hp('4%')} />
            </View>
        </TouchableOpacity>

        <TouchableOpacity style={{justifyContent:"space-between",alignItems:"center",flexDirection:"row",width:wp('80%'),marginTop:hp('3%')}} onPress={this.onOrderHistoryClick}>
            <View style={{alignItems:'center',flexDirection:"row"}}>
            <View style={{backgroundColor:"#4F45F0",padding:hp('1%'),borderRadius:hp('1%')}}>
            <Image source={require('../../assets/icon/reload.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
            </View>
            <Text style={{color:'#000',fontSize:hp('1.7%'),paddingHorizontal:wp('5%')}}>{this.state.renderLanguage.orderhistory}</Text>
            </View>
            <View>
            <Icon9 name="chevron-right" color={'#0000008a'} size={hp('4%')} />
            </View>
        </TouchableOpacity>

        <TouchableOpacity style={{justifyContent:"space-between",alignItems:"center",flexDirection:"row",width:wp('80%'),marginTop:hp('3%')}} onPress={this.onTrackOrderClick}>
            <View style={{alignItems:'center',flexDirection:"row"}}>
            <View style={{backgroundColor:"#4F45F0",padding:hp('1%'),borderRadius:hp('1%')}}>
            <Image source={require('../../assets/icon/box_outline.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
            </View>
            <Text style={{color:'#000',fontSize:hp('1.7%'),paddingHorizontal:wp('5%')}}>{this.state.renderLanguage.trackorder}</Text>
            </View>
            <View>
            <Icon9 name="chevron-right" color={'#0000008a'} size={hp('4%')} />
            </View>
        </TouchableOpacity>

        <TouchableOpacity style={{justifyContent:"space-between",alignItems:"center",flexDirection:"row",width:wp('80%'),marginTop:hp('3%')}} onPress={this.onPaymentOptionClick}>
            <View style={{alignItems:'center',flexDirection:"row"}}>
            <View style={{backgroundColor:"#4F45F0",padding:hp('1%'),borderRadius:hp('1%')}}>
            <Image source={require('../../assets/icon/card.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
            </View>            
            <Text style={{color:'#000',fontSize:hp('1.7%'),paddingHorizontal:wp('5%')}}>{this.state.renderLanguage.paymentoption}</Text>
            </View>
            <View>
            <Icon9 name="chevron-right" color={'#0000008a'} size={hp('4%')} />
            </View>
        </TouchableOpacity>


        <TouchableOpacity style={{justifyContent:"space-between",alignItems:"center",flexDirection:"row",width:wp('80%'),marginTop:hp('3%')}} onPress={this.onLogoutCLick}>
            <View style={{alignItems:'center',flexDirection:"row"}}>
            <View style={{backgroundColor:"#4F45F0",padding:hp('1%'),borderRadius:hp('1%')}}>
            <Image source={require('../../assets/icon/logout.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
            </View>            
            <Text style={{color:'#000',fontSize:hp('1.7%'),paddingHorizontal:wp('5%')}}>{this.state.renderLanguage.logout}</Text>
            </View>
            <View>
            </View>
        </TouchableOpacity>


        </ScrollView>
        </ImageBackground> 
        </View>
      );
    }
}

const styles = StyleSheet.create({
    maincontainer:{
        height: hp('100%'),
        width:wp('100%'),
        backgroundColor:"#fff" ,
    },
    item: {
        backgroundColor: '#EDECFC',
        borderRadius:hp('2%'),
        padding:hp('1.2%'),
        marginHorizontal:hp('2%')
      },
      title: {
        fontSize:hp('1.8%'),
      },
    subcontainer1:{
       height:hp('20%') , width:wp('100%'),
        justifyContent:'center',
        alignItems:"center",
        alignSelf:"center"
    },
    subcontainer2:{
        height:hp('80%') , width:wp('100%'),
    },

    backgroundImage: {
        height: hp('100%'),
        width:wp('100%'),
    },
    pageheader:{
        fontSize:28,
        color:'#4F45F0'
    },
    forgotPasswordText:{
        fontSize:hp('2.8%'),
        color:'#4F45F0',
    },
    forgotPasswordContainer:{
        marginTop:15,
        marginRight:'10%',
        alignSelf:'flex-end'
    },
    pagesubheader:{
        marginTop:hp('1%'),
        fontSize:hp('2.1%')
    },
    iconInputContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
        marginHorizontal:hp('2%'),
        marginTop:hp('2%'),
        height:hp('6%'),
        width:wp('93%'),
        borderRadius:hp('1.2%'),
    },
    iconInputField:{
        marginLeft:hp('1%'),
        flex:1,
        color:"#000"
    },
    iconInputImage:{
        marginRight:20
    },
    loginButtonContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#4F45F0',
        marginHorizontal:'10%',
        marginTop:15,
        height:55,
        width:Dimensions.get('window').width-70,
        borderRadius:hp('1%'),
        justifyContent:'center',
        alignItems:'center'
    },
    loginButtonText:{
        color:'white',
        fontSize:25
    },
    socialButtonContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#EDECFC',
        marginTop:20,
        marginHorizontal:hp('2%'),
        height:55,
        width:Dimensions.get('window').width/2-60,
        borderRadius:hp('1%'),
    },
    socialButtonText:{
        color:'#4F45F0'
    },
    socialButtonImage:{
        height:25,
        width:25,
        margin:10
    },
    



})