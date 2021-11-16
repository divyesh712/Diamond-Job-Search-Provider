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
  import Icon9 from 'react-native-vector-icons/Fontisto';

  import { ScrollView } from 'react-native-gesture-handler';
  import Accordion from 'react-native-collapsible/Accordion';
  import {MyLanguage} from '../../utils/languagehelper';


export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        renderProducts:[            
            {
                "productid": "32",
                "image": "https://spsofttech.com/projects/diamond/images/product/737001619514274.jpg",
                "product_name": "हिंदी ",
                "company_name": "हिंदी ",
                "price": "5536",
                "payable_amount": "2541",
                "category": " काटने वाली मशीन",
                "rating": 0,
                "is_wish": 1,
                "is_feature": "0",
                "is_delivered":0,
                "delivery_json":[
                    {
                        "trackerid": "30",
                        "tracker_date": "2021-04-27 12:08:28",
                        "tracker_type": "pickup",
                        "tracker_name": "John Stones",
                        "tracker_address": "Gurgaoan,India",
                        "tracker_status":"0",
                    },
                    {
                        "trackerid": "31",
                        "tracker_date":"2021-04-27 12:08:28",
                        "tracker_type": "Warehouse",
                        "tracker_name": "name",
                        "tracker_address": "Delhi,India",
                        "tracker_status":"1",
                    },                    
                    {
                        "trackerid": "32",
                        "tracker_date": "2021-04-27 12:08:28",
                        "tracker_type": "Out for delivery",
                        "tracker_name": "Jaspreet Singh",
                        "tracker_address": "Delhi,India",
                        "tracker_status":"1",
                    },                    
                    {
                        "trackerid": "33",
                        "tracker_date": "2021-04-27 12:08:28",
                        "tracker_type": "Delivered",
                        "tracker_name": "Jaspreet Singh",
                        "tracker_address": "Delhi,India",
                        "tracker_status":"2",
                    },
                ]

            },
            {
                "productid": "30",
                "image": "https://spsofttech.com/projects/diamond/images/product/433101618403488.jpg",
                "product_name": " यू-विन",
                "company_name": "हिंदी ",
                "price": "500",
                "payable_amount": "210",
                "category": "",
                "rating": 0.23076923076923078,
                "is_wish": 0,
                "is_feature": "0",
                "is_delivered":0,
                "delivery_json":[
                    {
                        "trackerid": "30",
                        "tracker_date": "2021-04-27 12:08:28",
                        "tracker_type": "pickup",
                        "tracker_name": "John Stones",
                        "tracker_address": "Gurgaoan,India",
                        "tracker_status":"0",
                    },
                    {
                        "trackerid": "31",
                        "tracker_date":"2021-04-27 12:08:28",
                        "tracker_type": "Warehouse",
                        "tracker_name": "name",
                        "tracker_address": "Delhi,India",
                        "tracker_status":"1",
                    },                    
                    {
                        "trackerid": "32",
                        "tracker_date": "2021-04-27 12:08:28",
                        "tracker_type": "Out for delivery",
                        "tracker_name": "Jaspreet Singh",
                        "tracker_address": "Delhi,India",
                        "tracker_status":"1",
                    },                    
                    {
                        "trackerid": "33",
                        "tracker_date": "2021-04-27 12:08:28",
                        "tracker_type": "Delivered",
                        "tracker_name": "Jaspreet Singh",
                        "tracker_address": "Delhi,India",
                        "tracker_status":"2",
                    },
                ]
            },
            {
                "productid": "27",
                "image": "https://spsofttech.com/projects/diamond/images/product/169601618403174.jpg",
                "product_name": "ऑटो पालिशिंग मशीन",
                "price": "500000",
                "payable_amount": "4750000",
                "company_name": "हिंदी ",
                "category": " फेसिंग मशीन",
                "rating": 0,
                "is_wish": 1,
                "is_feature": "0",
                "is_delivered":0,
                "delivery_json":[
                    {
                        "trackerid": "30",
                        "tracker_date": "2021-04-27 12:08:28",
                        "tracker_type": "pickup",
                        "tracker_name": "John Stones",
                        "tracker_address": "Gurgaoan,India",
                        "tracker_status":"0",
                    },
                    {
                        "trackerid": "31",
                        "tracker_date":"2021-04-27 12:08:28",
                        "tracker_type": "Warehouse",
                        "tracker_name": "name",
                        "tracker_address": "Delhi,India",
                        "tracker_status":"1",
                    },                    
                    {
                        "trackerid": "32",
                        "tracker_date": "2021-04-27 12:08:28",
                        "tracker_type": "Out for delivery",
                        "tracker_name": "Jaspreet Singh",
                        "tracker_address": "Delhi,India",
                        "tracker_status":"1",
                    },                    
                    {
                        "trackerid": "33",
                        "tracker_date": "2021-04-27 12:08:28",
                        "tracker_type": "Delivered",
                        "tracker_name": "Jaspreet Singh",
                        "tracker_address": "Delhi,India",
                        "tracker_status":"3",
                    },
                ]
            },
            {
                "productid": "25",
                "image": "https://spsofttech.com/projects/diamond/images/product/719201618400157.png",
                "product_name": "PLASSTEZE सिंगल फेज माइक्रोमीटर पॉलिशिंग मशीनें",
                "price": "500000",
                "company_name": "हिंदी ",
                "payable_amount": "450000",
                "category": " पोलिशिंग मशीन",
                "rating": 0,
                "is_wish": 1,
                "is_feature": "0",
                "is_delivered":0,
                "delivery_json":[
                    {
                        "trackerid": "30",
                        "tracker_date": "2021-04-27 12:08:28",
                        "tracker_type": "pickup",
                        "tracker_name": "John Stones",
                        "tracker_address": "Gurgaoan,India",
                        "tracker_status":"0",
                    },
                    {
                        "trackerid": "31",
                        "tracker_date":"2021-04-27 12:08:28",
                        "tracker_type": "Warehouse",
                        "tracker_name": "name",
                        "tracker_address": "Delhi,India",
                        "tracker_status":"1",
                    },                    
                    {
                        "trackerid": "32",
                        "tracker_date": "2021-04-27 12:08:28",
                        "tracker_type": "Out for delivery",
                        "tracker_name": "Jaspreet Singh",
                        "tracker_address": "Delhi,India",
                        "tracker_status":"1",
                    },                    
                    {
                        "trackerid": "33",
                        "tracker_date": "2021-04-27 12:08:28",
                        "tracker_type": "Delivered",
                        "tracker_name": "Jaspreet Singh",
                        "tracker_address": "Delhi,India",
                        "tracker_status":"2",
                    },
                ]
            }
        ],
        userdata:{},
        sectionlist:[            
            {
                "productid": "32",
                "image": "https://spsofttech.com/projects/diamond/images/product/737001619514274.jpg",
                "product_name": "हिंदी ",
                "company_name": "हिंदी ",
                "price": "5536",
                "payable_amount": "2541",
                "category": " काटने वाली मशीन",
                "rating": 0,
                "is_wish": 1,
                "is_feature": "0"
            },
            {
                "productid": "30",
                "image": "https://spsofttech.com/projects/diamond/images/product/433101618403488.jpg",
                "product_name": " यू-विन",
                "company_name": "हिंदी ",
                "price": "500",
                "payable_amount": "210",
                "category": "",
                "rating": 0.23076923076923078,
                "is_wish": 0,
                "is_feature": "0"
            },
            {
                "productid": "27",
                "image": "https://spsofttech.com/projects/diamond/images/product/169601618403174.jpg",
                "product_name": "ऑटो पालिशिंग मशीन",
                "price": "500000",
                "payable_amount": "4750000",
                "company_name": "हिंदी ",
                "category": " फेसिंग मशीन",
                "rating": 0,
                "is_wish": 1,
                "is_feature": "0"
            },
            {
                "productid": "25",
                "image": "https://spsofttech.com/projects/diamond/images/product/719201618400157.png",
                "product_name": "PLASSTEZE सिंगल फेज माइक्रोमीटर पॉलिशिंग मशीनें",
                "price": "500000",
                "company_name": "हिंदी ",
                "payable_amount": "450000",
                "category": " पोलिशिंग मशीन",
                "rating": 0,
                "is_wish": 1,
                "is_feature": "0"
            }
        ],
        activeSections: [],
        appLoading:false,
        appFetchingLoader:false,
        myCustomAlert:0,
        paginationNumber:0,
        isFetching: false,
        loadMoreResults:true,
        renderLanguage:MyLanguage.en

      };

      this.onBackClick = this.onBackClick.bind(this);
      this.onNotificationClick = this.onNotificationClick.bind(this);
      this.onTrackOrderClick = this.onTrackOrderClick.bind(this);
    }

    componentDidMount(){
        var that = this;
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            that.getUserData();
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({userdata: value},()=>{
            this.setLanguage();
            // console.log(this.state.userdata)
            // this.MyOrderShowApiCall(this.state.paginationNumber);
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


    async MyOrderShowApiCall(pageno){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appFetchingLoader:true})

        let myFormData = new FormData();
        myFormData.append("user_id",this.state.userdata._id)
        // myFormData.append("langid",this.state.userdata.lang_id)
        myFormData.append("page",pageno)
        try {
            const { data } = await SellerServices.SellerShowNotification(myFormData)
            console.log(data);

            if(pageno>0){
                if( data.status == 0 ){
                    var oldLady=this.state.renderProducts;
                    this.setState({
                        renderProducts:oldLady,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                        loadMoreResults:false,
                    })
                }
                if( data.status == 1 ){
                    var oldLady=this.state.renderProducts;
                    var newLady = oldLady.concat(data.data);
                    this.setState({
                        renderProducts:newLady,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                    })
                }
            }
            if(pageno==0){
                if( data.status == 0 ){
                    this.setState({
                        renderProducts:null,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                    })
                }
                if( data.status == 1 ){
                    this.setState({
                        renderProducts:data.data,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                        loadMoreResults:true
                    })
                }     
            }

            if(this.state.myCustomAlert == 0){}
            if(this.state.myCustomAlert == 1){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('success', this.state.renderLanguage.somethingwentwrong);
            }
            if(this.state.myCustomAlert == 2){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('success', this.state.renderLanguage.productremovedfromwishlist);
            }
            if(this.state.myCustomAlert == 3){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.productwishlistremovefailed);
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

    loadMoreResults(info){
        if(this.state.loadMoreResults){
            var pageno = this.state.paginationNumber + 1;
            this.setState({paginationNumber:pageno},()=>{
                this.MyOrderShowApiCall(pageno);
            })
        }
    }
    onRefresh() {
        this.setState({isFetching: true,paginationNumber:0,renderProducts:null,categories:null},() => {            
        this.getUserData();});
    }

    onBackClick(){
        this.props.navigation.goBack();
    }

    onNotificationClick(){
        this.props.navigation.navigate('NotificationSeller');
    }

    onTrackOrderClick(productid){
        this.dropDownAlertRef.alertWithType('success', 'Product Added To Cart','',null,1500)
    }

    _renderHeader = section => {
        return (
            <View style={{backgroundColor:"#fff",height:hp('25%'),width:wp('90%'),elevation:9,marginHorizontal:wp('2%'),flexDirection:"row",marginTop:hp('2%'),alignSelf:"center"}}>

            <View >
            <Image
            source={{uri: `${section.image}`}} 
            style={{
                    height:hp('25%'),
                    width:wp('35%'),
                    backgroundColor:"#ffffff",
                }} 
                resizeMode='cover' />
            </View>

            <View style={{width:wp("55%")}}>

                <View style={{marginTop:hp('2%'),paddingHorizontal:wp('3%')}}>
                    <Text style={{fontSize:hp('2%')}} numberOfLines={2}>{section.product_name}</Text>
                </View>

                <View style={{marginTop:hp('2%'),paddingHorizontal:wp('3%')}}>
                    <Text style={{fontSize:hp('1.7%'),color:"#0000005a"}} numberOfLines={1}>{section.company_name}</Text>
                </View>

                <View style={{marginTop:hp('2%'),paddingHorizontal:wp('3%'),flexDirection:"row",justifyContent:"space-between"}}>
                    <Text style={{fontSize:hp('1.7%'),color:"#4F45F0"}}>₹{section.payable_amount}</Text>
                    <Text style={{fontSize:hp('1.7%'),color:"#4F45F0"}}>{moment(section.created_at).format('Do MMMM,YYYY')}</Text>

                </View>

                <View style={{marginTop:hp('3%'),paddingHorizontal:wp('3%'),backgroundColor:"#4F45F0",borderRadius:hp('1%'),paddingVertical:hp('1%'),marginBottom:hp('1.5%'),alignSelf:"center",alignItems:"center",flexDirection:"row"}}>

                <TouchableOpacity 
                onPress={()=>{this.onTrackOrderClick(section.productid)}}
                activeOpacity={0.5}>
                <Text style={{fontSize:hp('1.7%'),color:"#fff"}}>{this.state.renderLanguage.trackorder}</Text>
                </TouchableOpacity>
                </View>
            </View>

        </View>
        );
      };

      _renderContent = section => {
        return (
            <ScrollView 
                style={{height:hp('30%'),width:wp('90%'),backgroundColor:"white",elevation:9,borderWidth:hp('0.1%'),alignSelf:"center"}}
                contentContainerStyle={{alignItems:"center",justifyContent:"center",paddingBottom:hp('4%'),paddingTop:hp('2%')}}
            >
                {section.delivery_json.map((item, index) => (
                    item.tracker_status == 0 ?

                        <View style={{height:hp('7%'),width:wp('96%'),backgroundColor:"white",alignSelf:"center",alignItems:"center",justifyContent:"center",flexDirection:"row",}}> 
                            <View style={{marginHorizontal:wp('3%'),width:wp('20%'),height:hp('7%'),justifyContent:"center",alignItems:"center",alignSelf:"center"}}>
                                <Text style={{fontSize:hp('1.3%'),marginBottom:hp('0.5%')}}>{moment(item.tracker_date).format('Do MMMM,YYYY')}</Text>
                                <Text style={{fontSize:hp('1.3%')}}>{moment(item.tracker_date).format('Do MMMM,YYYY')}</Text>
                            </View>

                            <View style={{alignItems:"center",width:wp('2%'),justifyContent:"center"}}>
                                <View style={{height:hp('2%'),width:hp('2%'),borderRadius:hp('2%')/2,backgroundColor:"#4F45F0",top:hp('2%')}}></View>
                                <View style={{height:hp('3%'),width:wp('1%'),backgroundColor:"gray",top:hp('2%')}}></View>
                            </View>

                            <View style={{marginHorizontal:wp('3%'),width:wp('20%'),height:hp('7%'),justifyContent:"center",alignItems:"center",alignSelf:"center",bottom:hp('0.5%')}}>
                                <Text style={{fontSize:hp('1.3%'),marginTop:hp('1.3%'),color:"gray"}}>{item.tracker_type}</Text>
                                <Text style={{fontSize:hp('1.3%')}}>{item.tracker_name}</Text>
                                <Text style={{fontSize:hp('1.3%')}}>{item.tracker_address}</Text>
                            </View>
                        </View>
                            : 
                        item.tracker_status == 1 ? 

                        <View style={{height:hp('7%'),width:wp('96%'),backgroundColor:"white",alignSelf:"center",alignItems:"center",justifyContent:"center",flexDirection:"row",}}> 
                            <View style={{marginHorizontal:wp('3%'),width:wp('20%'),height:hp('7%'),justifyContent:"center",alignItems:"center",alignSelf:"center"}}>
                                <Text style={{fontSize:hp('1.3%'),marginBottom:hp('0.5%')}}>{moment(item.tracker_date).format('Do MMMM,YYYY')}</Text>
                                <Text style={{fontSize:hp('1.3%')}}>{moment(item.tracker_date).format('Do MMMM,YYYY')}</Text>
                            </View>

                            <View style={{alignItems:"center",width:wp('2%'),justifyContent:"center"}}>
                                <View style={{height:hp('7%'),width:wp('1%'),backgroundColor:"gray"}}></View>
                                <View style={{height:hp('2%'),width:hp('2%'),borderRadius:hp('2%')/2,backgroundColor:"#4F45F09a",position:"absolute",alignSelf:"center"}}></View>
                            </View>

                            <View style={{marginHorizontal:wp('3%'),width:wp('20%'),height:hp('7%'),justifyContent:"center",alignItems:"center",alignSelf:"center",bottom:hp('0.5%')}}>
                                <Text style={{fontSize:hp('1.3%'),marginTop:hp('1.3%'),color:"gray"}}>{item.tracker_type}</Text>
                                <Text style={{fontSize:hp('1.3%')}}>{item.tracker_name}</Text>
                                <Text style={{fontSize:hp('1.3%')}}>{item.tracker_address}</Text>
                            </View>
                        </View>


                            :
                            <View style={{height:hp('7%'),width:wp('96%'),backgroundColor:"white",alignSelf:"center",alignItems:"center",justifyContent:"center",flexDirection:"row",}}> 
                            <View style={{marginHorizontal:wp('3%'),width:wp('20%'),height:hp('7%'),justifyContent:"center",alignItems:"center",alignSelf:"center"}}>
                                <Text style={{fontSize:hp('1.3%'),marginBottom:hp('0.5%')}}>{moment(item.tracker_date).format('Do MMMM,YYYY')}</Text>
                                <Text style={{fontSize:hp('1.3%')}}>{moment(item.tracker_date).format('Do MMMM,YYYY')}</Text>
                            </View>

                            <View style={{alignItems:"center",width:wp('5%'),justifyContent:"center"}}>
                                <View style={{height:hp('4%'),width:wp('1%'),backgroundColor:"gray"}}></View>
                                {
                                    item.tracker_status == 2 ?
                                    <Image source={require('../../assets/icon/transport.png')} style={{height:hp('3.3%'),width:hp('3.3%'),bottom:hp('2%')}} resizeMode='cover'></Image>
                                    :
                                    <View style={{height:hp('3%'),width:hp('3%'),borderRadius:hp('3%')/2,backgroundColor:"#4F45F0"}}></View>
                                }
                            </View>

                            <View style={{marginHorizontal:wp('3%'),width:wp('20%'),height:hp('7%'),justifyContent:"center",alignItems:"center",bottom:hp('0.5%')}}>
                                <Text style={{fontSize:hp('1.3%'),marginTop:hp('1.3%'),color:"gray"}}>{item.tracker_type}</Text>
                                <Text style={{fontSize:hp('1.3%')}}>{item.tracker_name}</Text>
                                <Text style={{fontSize:hp('1.3%')}}>{item.tracker_address}</Text>
                            </View>
                        </View>                    
                ))}
                    
            </ScrollView>
        );
      };

      _updateSections = activeSections => {
        this.setState({ activeSections });
      };
 
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
        <View style={{ height:hp('93%') , width:wp('100%') }}>

        <View style={{marginHorizontal:wp('5%'),flexDirection:'row',}}>
                <Text style={{color:'#000',fontSize:hp('2.5%'),fontWeight:"bold"}}>{this.state.renderLanguage.trackorders}</Text>
        </View>

            { this.state.renderProducts == null? 
                
                <View style={{alignItems:"center",justifyContent:"center",flex:1}}>
                <Text style={{color:'#4F45F0',fontSize:22}}>{this.state.renderLanguage.noordersplacedyet}</Text>
                </View>
            :
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: hp('40%')}}
                >
                <Accordion
                            sections={this.state.renderProducts}
                            activeSections={this.state.activeSections}
                            renderHeader={this._renderHeader}
                            renderContent={this._renderContent}
                            onChange={this._updateSections}
                            underlayColor={"#fff"}                  
                            containerStyle={{ backgroundColor: "transparent" }}
                        />  
                </ScrollView>
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
        fontSize:15
    },
    iconInputContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
        marginHorizontal:20,
        marginTop:20,
        height:45,
        width:Dimensions.get('window').width-40,
        borderRadius:7,
        elevation:9
    },
    iconInputField:{
        marginLeft:5,
        flex:1,
        color:"#000"
    },
    iconInputImage:{
        marginLeft:10
    },
    loginButtonContainer:{
        position:"absolute",
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#4F45F0',
        marginHorizontal:20,
        bottom:15,
        height:55,
        width:Dimensions.get('window').width-60,
        borderRadius:7,
        justifyContent:'center',
        alignSelf:'center'
    },
    loginButtonText:{
        color:'white',
        fontSize:25
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