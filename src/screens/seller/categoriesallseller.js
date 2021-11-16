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
    StatusBar
  } from 'react-native';

  import AsyncStorage from '@react-native-async-storage/async-storage';
  import AppLoader from '../component/loader';
  import DropdownAlert from 'react-native-dropdownalert';
  import moment from 'moment';
  import SellerServices from '../../api/sellerservices';
  import NetworkCheck from '../../utils/networkcheck';
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';
  import Icon8 from 'react-native-vector-icons/Fontisto';
  import { ScrollView } from 'react-native-gesture-handler';
  import {MyLanguage} from '../../utils/languagehelper';


export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
          searchstring:'',
          toggleSeachBarVisible:false,
          renderCategory:null,
          userdata:{},
          appLoading:false,
          appFetchingLoader:false,
          isFetching: false,
          renderLanguage:MyLanguage.en
      };

      this.onBackClick = this.onBackClick.bind(this);
      this.onSearchClick = this.onSearchClick.bind(this);
      this.onNotificationClick = this.onNotificationClick.bind(this);
      this.onCategoryClick = this.onCategoryClick.bind(this);
      this.onSaveProductClick = this.onSaveProductClick.bind(this);
    }

    componentDidMount(){
        this.getUserData();
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({userdata: value},()=>{
            console.log(this.state.userdata)
            this.AllCategoryShowApiCall();
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


    async AllCategoryShowApiCall(){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appFetchingLoader:true})

        let myFormData = new FormData();
        myFormData.append("langid",this.state.userdata.lang_id)
        try {
            const { data } = await SellerServices.SellerHomeCategory(myFormData)
            console.log(data);

                if( data.status == 0 ){
                    this.setState({
                        renderCategory:null,
                        appFetchingLoader:false,
                        appLoading:false,
                    })
                    this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.apistatus0);
                }
                if( data.status == 1 ){
                    this.setState({
                        renderCategory:data.data,
                        appFetchingLoader:false,
                        appLoading:false,
                    })
                }     

          }
          catch(error){
            this.setState({appFetchingLoader:false,appLoading:false})
            console.log(error)
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    onBackClick(){
        this.props.navigation.goBack();
    }

    onSearchClick(){
        this.setState({toggleSeachBarVisible:!this.state.toggleSeachBarVisible})
    }

    onNotificationClick(){
        this.props.navigation.navigate('NotificationSeller');
    }

    onCategoryClick(){
        this.dropDownAlertRef.alertWithType('success', 'Saved !', "Product Clicked!",null,1500)
    }

    onSaveProductClick(){
        this.dropDownAlertRef.alertWithType('success', 'Saved !', "Product Saved Succcessfully !",null,1500)
    }

    searchViewHandler = function(options) {
        if(this.state.toggleSeachBarVisible)
        {
            return {
                height:hp('15%'),
              }
        }else{
            return {
                height:hp('7%'),
              }
        }
      }

      productViewHandler = function(options) {
        if(this.state.toggleSeachBarVisible)
        {
            return {
                height:hp('85%'),
              }
        }else{
            return {
                height:hp('93%'),
              }
        }
      }
 
    render () {
      return (
        <View style={styles.maincontainer}>
        <StatusBar
           backgroundColor = "#4F45F0"
           barStyle = "light-content"
         />
        <ImageBackground source={require('../../assets/image/splash_bg.png')} style={styles.backgroundImage} resizeMode='stretch' >
        
        <View style={this.searchViewHandler()} >
        <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginHorizontal:wp('3%'),marginTop:hp('2%')}}>
            <View>        
                <TouchableOpacity  onPress={this.onBackClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/shape.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity  onPress={this.onSearchClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/loupe_2.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
                <TouchableOpacity  onPress={this.onNotificationClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/bell.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>
        </View>

        {
            this.state.toggleSeachBarVisible ? 
            <View style={styles.iconInputContainer}>
            {
                    this.state.searchstring.length > 0 ? 
                    <TouchableOpacity  onPress={()=>{Keyboard.dismiss()}} >
                    <Image source={require('../../assets/icon/loupe_2.png')} style={styles.iconInputImage} resizeMode='contain'></Image>
                    </TouchableOpacity>
                    :
                    <View>
                    <Image source={require('../../assets/icon/loupe_2.png')} style={styles.iconInputImage} resizeMode='contain'></Image>
                    </View>
            }
            <TextInput style = {styles.iconInputField}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.searchproduct}
                placeholderTextColor = "#0000008a"
                autoCapitalize = "none"
                value={this.state.searchstring}
                onChangeText={(value) => this.setState({searchstring:value},()=>{this.updateSearch()})} />
            </View>
            :
            null
        }
        </View>
        
        <View style={this.productViewHandler()}>

        {this.state.renderCategory == null ? 
            
            this.state.appFetchingLoader == true ? 
            null 
            :
            <View style={{alignItems:"center",justifyContent:"center",flex:1}}>
                <Text style={{color:'#4F45F0',fontSize:hp('3%')}}>{this.state.renderLanguage.nocategoriesfound}</Text>
            </View>

        :
        <View>
        <View style={{marginHorizontal:wp('5%'),flexDirection:'row',}}>
            <Text style={{color:'#000',fontSize:hp('2.5%'),fontWeight:"bold"}}>{this.state.renderLanguage.allcategories}</Text>
        </View>

        <View style={{marginTop:hp('1%')}}>
            <FlatList
            numColumns={2}
            contentContainerStyle={{paddingBottom:hp('15%'),alignItems:"center"}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={this.state.renderCategory}
            keyExtractor={item => item.value}
            renderItem={({ item }) => 

            <TouchableOpacity  
            onPress={this.onCategoryClick} 
            style={{
                height:hp('30%'),
                width:wp('45%'),      
                borderRadius:hp('1%'),
                marginHorizontal:hp('1%'),
                marginVertical:hp('1%'),
                alignItems:"center",
                justifyContent:"center"}}>
                <ImageBackground 
                    source={{uri: `${item.image}`}} 
                    style={{
                    height:hp('30%'),
                    width:wp('45%'), 
                    alignItems:"center",
                    justifyContent:"center" 
                }} 
                imageStyle={{borderRadius:hp('1%'),overflow:"hidden"}} 
                resizeMode='cover' >
            <Text style={{color:"#fff",fontSize:hp('1.8%'),fontWeight:"bold"}}>{item.name}</Text>
           
            </ImageBackground>
            </TouchableOpacity>

                        }
                />
        </View>
        </View>
        }
        </View>

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
        backgroundColor: '#EDECFC',
        borderRadius:hp('2%'),
        padding:hp('1.2%'),
        marginHorizontal:hp('2%')
      },
      title: {
        fontSize:hp('1.8%'),
      },
    subcontainer1:{
        height:Dimensions.get('window').height/100*20,
        justifyContent:'center',
        marginLeft:'15%'
    },
    subcontainer2:{
        height:Dimensions.get('window').height/100*70,
        alignItems:'center',
        marginTop:hp('1%')
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
        backgroundColor:'#fafafa',
        alignSelf:"center",
        marginTop:hp('2%'),
        height:hp('6%'),
        width:wp('90%'),
        elevation:9,
        borderRadius:hp('1.2%'),
    },
    iconInputField:{
        marginLeft:hp('1%'),
        flex:1,
        color:"#000"
    },
    iconInputImage:{
        marginHorizontal:wp('4%'),
        height:hp('4%'),
        width:hp('4%')
    },
    loginButtonContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#4F45F0',
        marginHorizontal:'10%',
        marginTop:15,
        height:55,
        width:Dimensions.get('window').width-70,
        borderRadius:7,
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