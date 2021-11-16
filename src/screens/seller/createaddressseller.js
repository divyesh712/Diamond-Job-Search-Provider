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

  import AsyncStorage from '@react-native-async-storage/async-storage';
  import AppLoader from '../component/loader';
  import DropdownAlert from 'react-native-dropdownalert';
  import moment from 'moment';
  import SellerServices from '../../api/sellerservices';
  import NetworkCheck from '../../utils/networkcheck';
  import { CheckBox } from 'react-native-elements';
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
  import {MyLanguage} from '../../utils/languagehelper';


export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        editComponent:this.props.route.params.edit,
        addressOBJ:this.props.route.params.item,
        EditID:null,
        name:'',
        address:'',
        city:'',
        state:'',
        postal:'',
        phone:'',
        userdata:{},
        defaultchecked:false,
        appLoading:false,
        renderLanguage:MyLanguage.en

      };

      this.onBackClick = this.onBackClick.bind(this);
      this.onNotificationClick = this.onNotificationClick.bind(this);
      this.onAddAddressClick = this.onAddAddressClick.bind(this);
      this.onUpdateAddressClick = this.onUpdateAddressClick.bind(this);
      this.onDefualtCheckBoxToggle = this.onDefualtCheckBoxToggle.bind(this);
    }

    componentDidMount(){
        this.getUserData();   
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        if(this.state.editComponent){        
            this.setState({
                userdata: value,
                EditID:this.state.addressOBJ._id,
                name:this.state.addressOBJ.name,
                address:this.state.addressOBJ.address,
                city:this.state.addressOBJ.city,
                state:this.state.addressOBJ.state,
                postal:this.state.addressOBJ.postal_code,
                phone:this.state.addressOBJ.mobile_no,
                defaultchecked:this.state.addressOBJ.is_default == '0' ? false : true
            })
        }
        else{
            this.setState({userdata: value})
        }

        this.setLanguage();
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

    onBackClick(){
        this.props.navigation.goBack();
    }

    onNotificationClick(){
        this.props.navigation.navigate('NotificationSeller');
    }


    async onAddAddressClick(){

        Keyboard.dismiss();

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  
        if(this.state.name.trim() == ''){
            this.setState({name:''},()=>{this.nameInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.nameblank);
          return
        }
        if(this.state.address.trim() == ''){
            this.setState({address:''},()=>{this.addressInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.addressblank);
          return
        }
        if(this.state.city.trim() == ''){
            this.setState({city:''},()=>{this.cityInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.cityblank);
          return
        }
        if(this.state.state.trim() == ''){
            this.setState({state:''},()=>{this.stateInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.stateblank);
          return
        }
        if(this.state.postal.trim() == ''){
            this.setState({postal:''},()=>{this.pcodeInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.postalblank);
          return
        }
        if(this.state.phone.trim() == ''){
            this.setState({phone:''},()=>{this.phoneInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.phonenumberblank);
          return
        }

        let myFormData = new FormData();
        myFormData.append("_id","")
        myFormData.append("user_id",this.state.userdata._id)
        myFormData.append("name",this.state.name)
        myFormData.append("address", this.state.address)
        myFormData.append("city", this.state.city)
        myFormData.append("state", this.state.state)
        myFormData.append("postal_code", this.state.postal)
        myFormData.append("mobile_no", this.state.phone)

        if(this.state.defaultchecked == false){myFormData.append("is_default",0)}
        if(this.state.defaultchecked == true){myFormData.append("is_default",1)}

        try {
            this.setState({appLoading: true})
            const { data } = await SellerServices.SellerAddAddress(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({appLoading: false})
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.apistatus0);
            }

            if( data.status == 1){
                this.setState({        
                    name:'',
                    address:'',
                    city:'',
                    state:'',
                    postal:'',
                    phone:'',
                    defaultchecked:false,
                    appLoading:false,
                })
                this.props.navigation.replace('ShippingSeller');
            }
            this.setState({appLoading: false})
          }
          catch(error){
            console.log(error)
            this.setState({appLoading: false})
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    async onUpdateAddressClick(){

        Keyboard.dismiss();

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  
        if(this.state.name.trim() == ''){
            this.setState({name:''},()=>{this.nameInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.nameblank);
          return
        }
        if(this.state.address.trim() == ''){
            this.setState({address:''},()=>{this.addressInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.addressblank);
          return
        }
        if(this.state.city.trim() == ''){
            this.setState({city:''},()=>{this.cityInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.cityblank);
          return
        }
        if(this.state.state.trim() == ''){
            this.setState({state:''},()=>{this.stateInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.stateblank);
          return
        }
        if(this.state.postal.trim() == ''){
            this.setState({postal:''},()=>{this.pcodeInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.postalblank);
          return
        }
        if(this.state.phone.trim() == ''){
            this.setState({phone:''},()=>{this.phoneInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.phonenumberblank);
          return
        }
        let myFormData = new FormData();
        myFormData.append("_id",this.state.EditID)
        myFormData.append("user_id",this.state.userdata._id)
        myFormData.append("name",this.state.name)
        myFormData.append("address", this.state.address)
        myFormData.append("city", this.state.city)
        myFormData.append("state", this.state.state)
        myFormData.append("postal_code", this.state.postal)
        myFormData.append("mobile_no", this.state.phone)

        if(this.state.defaultchecked == false){myFormData.append("is_default",0)}
        if(this.state.defaultchecked == true){myFormData.append("is_default",1)}

        try {
            this.setState({appLoading: true})
            const { data } = await SellerServices.SellerAddAddress(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({appLoading: false})
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.apistatus0);
            }

            if( data.status == 1){
                this.setState({        
                    name:'',
                    address:'',
                    city:'',
                    state:'',
                    postal:'',
                    phone:'',
                    defaultchecked:false,
                    appLoading:false,
                })
                this.props.navigation.replace('ShippingSeller');
            }
            this.setState({appLoading: false})
          }
          catch(error){
            console.log(error)
            this.setState({appLoading: false})
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    onDefualtCheckBoxToggle(){
        if(this.state.defaultchecked == false){this.setState({defaultchecked:true})}
        if(this.state.defaultchecked == true){this.setState({defaultchecked:false})}
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
                {/* <TouchableOpacity  onPress={this.onNotificationClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/bell.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity> */}
            </View>
        </View>
        </View>
        
        <KeyboardAwareScrollView 
            style={{height: hp('93%'),width:wp('100%'),}} 
            extraHeight={hp('20%')} enableOnAndroid>

        <View style={{marginHorizontal:wp('5%'),flexDirection:'row',}}>
                <Text style={{color:'#000',fontSize:hp('2.5%'),fontWeight:"bold"}}>{this.state.editComponent?'Update Address':'Create Address'}</Text>
        </View>

        <View style={{marginTop:hp('2%'),marginHorizontal:wp('5%')}}>
            <View style={{marginTop:hp('7%')}}>
                <Text style={{fontSize:hp('2%'),color:"#0000005a"}}>{this.state.renderLanguage.name}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.nameInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.addressInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                autoCapitalize = "none"
                value={this.state.name}
                onChangeText={(name) => this.setState({name})}  />
            </View>

            <View style={{marginTop:hp('7%')}}>
                <Text style={{fontSize:hp('2%'),color:"#0000005a"}}>{this.state.renderLanguage.address}</Text>
            </View>
            <View style={styles.iconInputAddressContainer}>
            <TextInput style = {styles.iconInputAddressField}
                ref={(input) => { this.addressInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.cityInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                autoCapitalize = "none"
                multiline={true}
                value={this.state.address}
                onChangeText={(address) => this.setState({address})}  />
            </View>

            <View style={{marginTop:hp('7%')}}>
                <Text style={{fontSize:hp('2%'),color:"#0000005a"}}>{this.state.renderLanguage.city}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.cityInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.stateInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                autoCapitalize = "none"
                value={this.state.city}
                onChangeText={(city) => this.setState({city})}  />
            </View>

            <View style={{marginTop:hp('7%')}}>
                <Text style={{fontSize:hp('2%'),color:"#0000005a"}}>{this.state.renderLanguage.state}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.stateInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.pcodeInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                autoCapitalize = "none"
                value={this.state.state}
                onChangeText={(state) => this.setState({state})}  />
            </View>

            <View style={{marginTop:hp('7%')}}>
                <Text style={{fontSize:hp('2%'),color:"#0000005a"}}>{this.state.renderLanguage.postal}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.pcodeInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.mobileInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                autoCapitalize = "none"
                keyboardType= "number-pad"
                value={this.state.postal}
                onChangeText={(postal) => this.setState({postal})}  />
            </View>

            <View style={{marginTop:hp('7%')}}>
                <Text style={{fontSize:hp('2%'),color:"#0000005a"}}>{this.state.renderLanguage.phonenumberblank}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.mobileInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { Keyboard.dismiss() }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                keyboardType="phone-pad"
                autoCapitalize = "none"
                value={this.state.phone}
                onChangeText={(phone) => this.setState({phone})}  />
            </View>
            {
                this.state.editComponent ?
                null :
                <View style={{marginTop:hp('5%')}}>
                <CheckBox
                title={this.state.renderLanguage.makedefault}
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

            <TouchableOpacity onPress={()=>{this.state.editComponent ? this.onUpdateAddressClick() : this.onAddAddressClick() }}  style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>{this.state.editComponent ? this.state.renderLanguage.updateaddress :this.state.renderLanguage.addaddress}</Text>
            </TouchableOpacity>

        </View>

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
        fontSize:hp('2%')
    },
    iconInputContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'transparent',
        height:hp('7%'),
        borderBottomWidth:hp('0.1%'),
        width:wp('90%'),
    },
    iconInputField:{
        flex:1,
        color:"#000",
    },
    iconInputAddressContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'transparent',
        height:hp('14%'),
        borderBottomWidth:hp('0.1%'),
        width:wp('90%'),
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
        marginVertical:hp('10%'),
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