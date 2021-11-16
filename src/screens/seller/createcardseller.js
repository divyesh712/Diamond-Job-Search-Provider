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
    KeyboardAvoidingView ,
    StatusBar,
    ScrollView,
    Keyboard
  } from 'react-native';

  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';
  import Icon8 from 'react-native-vector-icons/Fontisto';

  import { CheckBox } from 'react-native-elements';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import AppLoader from '../component/loader';
  import DropdownAlert from 'react-native-dropdownalert';
  import moment from 'moment';
  import SellerServices from '../../api/sellerservices';
  import NetworkCheck from '../../utils/networkcheck';
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
  import { CreditCardInput } from "react-native-credit-card-input";

export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        editComponent:this.props.route.params.edit,
        cardOBJ:this.props.route.params.item,
        EditID:null,
        name:'',
        number:'',
        cvv:'',
        expiry:'',
        userdata:{},
        defaultchecked:false,
        appLoading:false,
      };

      this.onBackClick = this.onBackClick.bind(this);
      this.onNotificationClick = this.onNotificationClick.bind(this);
      this.onAddCardClick = this.onAddCardClick.bind(this);
      this.onUpdateCardClick = this.onUpdateCardClick.bind(this);
      this.onDefualtCheckBoxToggle = this.onDefualtCheckBoxToggle.bind(this);

    }

    componentDidMount(){
        this.getUserData();   
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        if(this.state.editComponent){  
            this.CCInput.setValues({ 
                name:this.state.cardOBJ.card_name,
                number:this.state.cardOBJ.card_number,
                cvv:this.state.cardOBJ.cvv,
                expiry:this.state.cardOBJ.expiry_data,
            });
            this.setState({
                userdata: value,
                name:this.state.cardOBJ.card_name,
                number:this.state.cardOBJ.card_number,
                cvv:this.state.cardOBJ.cvv,
                expiry:this.state.cardOBJ.expiry_data,
                EditID:this.state.cardOBJ._id,
                defaultchecked:this.state.cardOBJ.is_default == '0' ? false : true
            })
        }
        else{
            this.setState({userdata: value})
        }
    }

    onBackClick(){
        this.props.navigation.goBack();
    }

    onNotificationClick(){
        this.props.navigation.navigate('NotificationSeller');
    }

   async onAddCardClick(){
        Keyboard.dismiss();

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  
        if(this.state.name.trim() == ''){
            this.setState({name:''})
            this.dropDownAlertRef.alertWithType('error',"Card Holder Name cannot be blank");
          return
        }
        if(this.state.number.trim() == ''){
            this.setState({number:''})
            this.dropDownAlertRef.alertWithType('error',"Card Number cannot be blank");
          return
        }
        if(this.state.expiry.trim() == ''){
            this.setState({expiry:''})
            this.dropDownAlertRef.alertWithType('error',"Expiry Date cannot be blank");
          return
        }
        if(this.state.cvv.trim() == ''){
            this.setState({cvv:''})
            this.dropDownAlertRef.alertWithType('error',"CVV Code cannot be blank");
          return
        }

        let myFormData = new FormData();
        myFormData.append("user_id",this.state.userdata._id)
        myFormData.append("card_name",this.state.name)
        myFormData.append("card_number", this.state.number)
        myFormData.append("expiry_data", this.state.expiry)
        myFormData.append("cvv", this.state.cvv)

        if(this.state.defaultchecked == false){myFormData.append("is_default",0)}
        if(this.state.defaultchecked == true){myFormData.append("is_default",1)}

        try {
            this.setState({appLoading: true})
            const { data } = await SellerServices.SellerUpdateCard(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({appLoading: false})
                this.dropDownAlertRef.alertWithType('error', 'Api Status = 0.', "Try Again");
            }

            if( data.status == 1){
                this.setState({        
                    name:'',
                    number:'',
                    expiry:'',
                    cvv:'',
                    defaultchecked:false,
                    appLoading:false,
                })
                this.props.navigation.replace('PaymentSeller');
            }
            this.setState({appLoading: false})
          }
          catch(error){
            console.log(error)
            this.setState({appLoading: false})
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', " Server Error : 500 ");
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', 'No Internet Connection', "please check your device connection");
        }
    }

    async onUpdateCardClick(){
        Keyboard.dismiss();

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  
        if(this.state.name.trim() == ''){
            this.setState({name:''})
            this.dropDownAlertRef.alertWithType('error',"Card Holder Name cannot be blank");
          return
        }
        if(this.state.number.trim() == ''){
            this.setState({number:''})
            this.dropDownAlertRef.alertWithType('error',"Card Number cannot be blank");
          return
        }
        if(this.state.expiry.trim() == ''){
            this.setState({expiry:''})
            this.dropDownAlertRef.alertWithType('error',"Expiry Date cannot be blank");
          return
        }
        if(this.state.cvv.trim() == ''){
            this.setState({cvv:''})
            this.dropDownAlertRef.alertWithType('error',"CVV Code cannot be blank");
          return
        }

        let myFormData = new FormData();
        myFormData.append("_id",this.state.EditID)
        myFormData.append("user_id",this.state.userdata._id)
        myFormData.append("card_name",this.state.name)
        myFormData.append("card_number", this.state.number)
        myFormData.append("expiry_data", this.state.expiry)
        myFormData.append("cvv", this.state.cvv)

        if(this.state.defaultchecked == false){myFormData.append("is_default",0)}
        if(this.state.defaultchecked == true){myFormData.append("is_default",1)}

        try {
            this.setState({appLoading: true})
            const { data } = await SellerServices.SellerUpdateCard(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({appLoading: false})
                this.dropDownAlertRef.alertWithType('error', 'Api Status = 0.', "Try Again");
            }

            if( data.status == 1){
                this.setState({        
                    name:'',
                    number:'',
                    expiry:'',
                    cvv:'',
                    defaultchecked:false,
                    appLoading:false,
                })
                this.props.navigation.replace('PaymentSeller');
            }
            this.setState({appLoading: false})
          }
          catch(error){
            console.log(error)
            this.setState({appLoading: false})
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', " Server Error : 500 ");
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', 'No Internet Connection', "please check your device connection");
        }
    }

      onDefualtCheckBoxToggle(){
        if(this.state.defaultchecked == false){this.setState({defaultchecked:true})}
        if(this.state.defaultchecked == true){this.setState({defaultchecked:false})}
      }

      _onChange = (form) => {
        console.log(form);
        this.setState({
            name:form.values.name,
            number:form.values.number,
            cvv:form.values.cvc,
            expiry:form.values.expiry,
        })
      }

 
    render () {
      return (
        <View style={styles.maincontainer}>
        <StatusBar
           backgroundColor = "#4F45F0"
           barStyle = "light-content"
         />
        <ImageBackground source={require('../../assets/image/splash_bg.png')} style={styles.backgroundImage} resizeMode='stretch' >
        
        <View style={{height: hp('7%'),width:wp('100%'),}} >
        <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginHorizontal:wp('3%'),marginTop:hp('2%')}}>
            <View>        
                <TouchableOpacity  onPress={this.onBackClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/shape.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity  onPress={this.onNotificationClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/bell.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>
        </View>
        </View>
        
        <KeyboardAwareScrollView 
            style={{height: hp('93%'),width:wp('100%'),}} 
            extraHeight={hp('20%')} enableOnAndroid>

        <View style={{marginHorizontal:wp('5%'),flexDirection:'row',}}>
                <Text style={{color:'#000',fontSize:hp('2.5%'),fontWeight:"bold"}}>Add Card</Text>
        </View>


        <ScrollView 
        style={{marginTop:hp("5%")}}
        contentContainerStyle={{alignItems:"center",justifyContent:"center"}}
        horizontal
        >   
        <View style={{width:wp('100%'),alignSelf:"center",justifyContent:"center",alignItems:"center"}}>
        <CreditCardInput 
            ref={(c) => this.CCInput = c}
            requiresName  
            placeholderColor="gray" 
            validColor="#4F45F0"
            labelStyle={{marginTop:hp('3%')}} 
            inputContainerStyle={{alignSelf:"center",marginTop:hp('1%'),borderBottomWidth:hp('0.1%'), borderBottomColor: "black" }}
            inputStyle={{color:"#4F45F0"}}
            cardScale={1}
            onChange={this._onChange} />
        </View>
        </ScrollView>
        {
                this.state.editComponent ?
                null :
                <View style={{marginTop:hp('5%')}}>
                <CheckBox
                title='Make Default'
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                uncheckedColor={'#EDECFC'}
                checkedColor={'#4F45F0'}
                textStyle={{color:"#0000005a",fontWeight:"300",fontStyle:'normal',fontSize:hp('2%')}}
                checked={this.state.defaultchecked}
                containerStyle={{backgroundColor:"transparent",borderWidth:0}}
                style={{}}
                onPress={this.onDefualtCheckBoxToggle} 
                />
                </View>
            }
        <TouchableOpacity onPress={()=>{this.state.editComponent?this.onUpdateCardClick():this.onAddCardClick()}}  style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>{this.state.editComponent?"Update Card":"Add Card"}</Text>
        </TouchableOpacity>

        </KeyboardAwareScrollView>

        </ImageBackground> 
        <DropdownAlert inactiveStatusBarStyle="light-content" inactiveStatusBarBackgroundColor="#4F45F0" ref={ref => this.dropDownAlertRef = ref} />
        <AppLoader isAppLoading={this.state.appLoading}/> 
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
        borderRadius:15,
        paddingHorizontal:20,
        paddingVertical:10,
        marginHorizontal:10,
      },
      title: {
        fontSize: 15,
      },
    subcontainer1:{
        height:Dimensions.get('window').height/100*20,
        justifyContent:'center',
        marginLeft:'15%'
    },
    subcontainer2:{
        height:Dimensions.get('window').height/100*70,
        alignItems:'center',
        marginTop:10
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
        fontSize:22,
        color:'#4F45F0',
    },
    forgotPasswordContainer:{
        marginTop:15,
        marginRight:'10%',
        alignSelf:'flex-end'
    },
    pagesubheader:{
        marginTop:8,
        fontSize:14
    },
    iconInputContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'transparent',
        height:45,
        borderBottomWidth:0.8,
        width:Dimensions.get('window').width-40,
    },
    iconInputField:{
        flex:1,
        color:"#000",
    },
    iconInputAddressContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'transparent',
        height:90,
        borderBottomWidth:0.8,
        width:Dimensions.get('window').width-40,
    },
    iconInputAddressField:{
        flex:1,
        color:"#000",
        minHeight:50,
    },
    iconInputImage:{
        marginLeft:10
    },
    loginButtonContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#4F45F0',
        marginVertical:hp('3%'),
        height:hp('6%'),
        width:wp('90%'),
        borderRadius:hp('1%'),
        justifyContent:'center',
        alignSelf:'center'
    },
    loginButtonText:{
        color:'white',
        fontSize:hp('2.3%')
    },
    socialButtonContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#4F45F01a',
        marginTop:20,
        marginHorizontal:10,
        height:55,
        width:Dimensions.get('window').width/2-60,
        borderRadius:7,
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