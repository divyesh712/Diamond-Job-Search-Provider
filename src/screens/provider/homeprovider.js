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
    KeyboardAvoidingView,
    StatusBar,
    BackHandler,
    Animated,
    Alert
  } from 'react-native';

  import { Header } from '@react-navigation/stack';
  let {width, height} = Dimensions.get('window');
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';
  import Icon8 from 'react-native-vector-icons/SimpleLineIcons';
  import Icon9 from 'react-native-vector-icons/Fontisto';
  import Modal from 'react-native-modal';

  import AsyncStorage from '@react-native-async-storage/async-storage';
  import AppLoader from '../component/loader';
  import DropdownAlert from 'react-native-dropdownalert';
  import ProviderServices from '../../api/providerservices';
  import SeekerServices from '../../api/seekerservices';
  import NetworkCheck from '../../utils/networkcheck';
  import {MyLanguage} from '../../utils/languagehelper';


export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
          userdata:{},
          activeNumber:0,
          appliedNumber:0,
          totalNumber:0,
          togglePasswordVisibility:true,
          appLoading:false,

          FilterModalVisible:false,
          selected1:0,
          selected2:0,
          selected3:0,
          selected4:0,
          selected5:0,
          level1:[],
          level2:[],
          level3:[],
          level4:[],
          level5:[],
          expertiseArray:[],
          level2Loading:false,
          level3Loading:false,
          level4Loading:false,
          level5Loading:false,
          renderLanguage:MyLanguage.en

      };

      this.onFilterClick = this.onFilterClick.bind(this);
      this.onSettingClick = this.onSettingClick.bind(this);
      this.onActivePostClick = this.onActivePostClick.bind(this);
      this.onAppliedUserClick = this.onAppliedUserClick.bind(this);
      this.onTotalPostClick = this.onTotalPostClick.bind(this);
      this.onAddPostClick = this.onAddPostClick.bind(this);
      this.springValue = new Animated.Value(100) ;
      this.handleBackButton = this.handleBackButton.bind(this);

      this.onFilterModalSubmitClick = this.onFilterModalSubmitClick.bind(this);
      this.onSelect1 = this.onSelect1.bind(this);
      this.onSelect2 = this.onSelect2.bind(this);
      this.onSelect3 = this.onSelect3.bind(this);
      this.onSelect4 = this.onSelect4.bind(this);
      this.onSelect5 = this.onSelect5.bind(this);
    }

    onFilterClick(){
        this.setState({
            FilterModalVisible:!this.state.FilterModalVisible,                    
            selected1:0,
            selected2:0,
            selected3:0,
            selected4:0,
            selected5:0,
            level2:[],
            level3:[],
            level4:[],
            level5:[],
        });
    }

    async onFilterModalSubmitClick(){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  
            if(this.state.selected1 == 0){
                Alert.alert(this.state.renderLanguage.selectatleastonecategory);
                return
            }
         
         var myfilters={
             lang_id:this.state.userdata.lang_id,
             user_id:this.state.userdata._id,
             cat_id:this.state.selected1,
             lone_id:this.state.selected2,
             ltwo_id:this.state.selected3,
             lthree_id:this.state.selected4,
             lfour_id:this.state.selected5
         }

         this.setState({
            FilterModalVisible:false,
            selected1:0,
            selected2:0,
            selected3:0,
            selected4:0,
            selected5:0,
            level2:[],
            level3:[],
            level4:[],
            level5:[],
        }) 
        this.props.navigation.navigate('FilteredUser',{filterData:myfilters});

        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    async Level1ApiCall(){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        let myFormData = new FormData();
        myFormData.append("lang_id",this.state.userdata.lang_id)

        try {
            const { data } = await SeekerServices.Level1(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.apistatus0);
            }

            if( data.status == 1){
                this.setState({
                    level1:data.categorylist,
                })
            }

          }
          catch(error){
            console.log(error)
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    async Level2ApiCall(){
        const isConnected = await NetworkCheck.isNetworkAvailable()
        if (isConnected) {  
        this.setState({level2Loading:true});
        let myFormData = new FormData();
        myFormData.append("cat_id",this.state.selected1)
        myFormData.append("lang_id",this.state.userdata.lang_id)

        try {
            const { data } = await SeekerServices.Level2(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({level2Loading:false});
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.apistatus0);
            }

            if( data.status == 1){
                this.setState({
                    level2:data.lavelone,
                    level2Loading:false,
                })
            }

          }
          catch(error){
            this.setState({level2Loading:false});
            console.log(error)
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    async Level3ApiCall(){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  
        this.setState({level3Loading:true});
        let myFormData = new FormData();
        myFormData.append("lone_id",this.state.selected2)
        myFormData.append("lang_id",this.state.userdata.lang_id)

        try {
            const { data } = await SeekerServices.Level3(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({level3Loading:false});
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.apistatus0);
            }

            if( data.status == 1){
                this.setState({
                    level3:data.laveltwo,
                    level3Loading:false,
                })
            }

          }
          catch(error){
            this.setState({level3Loading:false});
            console.log(error)
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    async Level4ApiCall(){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  
        this.setState({level4Loading:true});
        let myFormData = new FormData();
        myFormData.append("ltwo_id",this.state.selected3)
        myFormData.append("lang_id",this.state.userdata.lang_id)

        try {
            const { data } = await SeekerServices.Level4(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({level4Loading:false});
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.apistatus0);
            }

            if( data.status == 1){
                this.setState({
                    level4:data.lavelthree,
                    level4Loading:false
                })
            }

          }
          catch(error){
            this.setState({level4Loading:false});
            console.log(error)
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    async Level5ApiCall(){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  
        this.setState({level5Loading:true});
        let myFormData = new FormData();
        myFormData.append("lthree_id",this.state.selected4)
        myFormData.append("lang_id",this.state.userdata.lang_id)

        try {
            const { data } = await SeekerServices.Level5(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({level5Loading:false});
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.apistatus0);
            }

            if( data.status == 1){
                this.setState({
                    level5:data.lavelfour,
                    level5Loading:false
                })
            }

          }
          catch(error){
            this.setState({level5Loading:false});
            console.log(error)
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    onSelect1(level1id){
        if(level1id==this.state.selected1){
            this.setState({
                selected1:0,
                selected2:0,
                selected3:0,
                selected4:0,
                selected5:0,
                level2:[],
                level3:[],
                level4:[],
                level5:[],
            })
        }else{
            this.setState({
                selected1:level1id,
                selected2:0,
                selected3:0,
                selected4:0,
                selected5:0,
                level2:[],
                level3:[],
                level4:[],
                level5:[],
            },()=>{
                this.Level2ApiCall();
            })
        }
    }

    onSelect2(level2id){
        if(level2id==this.state.selected2){
            this.setState({
                selected2:0,
                selected3:0,
                selected4:0,
                selected5:0,
                level3:[],
                level4:[],
                level5:[],
            })
        }else{
            this.setState({
                selected2:level2id,
                selected3:0,
                selected4:0,
                selected5:0,
                level3:[],
                level4:[],
                level5:[],
            },()=>{
                this.Level3ApiCall();
            })
        }   
    }

    onSelect3(level3id){
        if(level3id==this.state.selected3){
            this.setState({
                selected3:0,
                selected4:0,
                selected5:0,
                level4:[],
                level5:[],
            })
        }else{
            this.setState({
                selected3:level3id,
                selected4:0,
                selected5:0,
                level4:[],
                level5:[],
            },()=>{
                this.Level4ApiCall();
            })
        }
    }

    onSelect4(level4id){
        if(level4id==this.state.selected4){
            this.setState({
                selected4:0,
                selected5:0,
                level5:[],
            })
        }else{
            this.setState({
                selected4:level4id,
                selected5:0,
                level5:[],
            },()=>{
                this.Level5ApiCall();
            }) 
        }   
    }

    onSelect5(level5id){
        if(level5id==this.state.selected5){
            this.setState({
                selected5:0
            })
        }else{
            this.setState({
                selected5:level5id
            })  
        }       
    }

    componentDidMount(){
        
        var that = this;
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            that.getUserData();
            that._backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
          });
          this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
            that._backHandler.remove();
          });
    }

    componentWillUnmount() {
        this._unsubscribe();
        this._unsubscribe2();
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({userdata: value},()=>{
            console.log(this.state.userdata)
            this.ProviderHomeApiCall();
            this.Level1ApiCall();
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

    async ProviderHomeApiCall(){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        let myFormData = new FormData();
        myFormData.append("user_id",this.state.userdata._id)

        try {
            const { data } = await ProviderServices.ProviderHome(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.somethingwentwrong);
            }

            if( data.status == 1){
                this.setState({
                    activeNumber: data.total_active,
                    appliedNumber: data.totalpost_apply,
                    totalNumber: data.totalpost
                })
            }

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

    handleBackButton = () => {         
        this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();
        return true;
    };
    _spring() {

        this.setState({backClickCount: 1}, () => {
            Animated.sequence([
                Animated.spring(
                    this.springValue,
                    {
                        toValue: -.1 * height,
                        friction: 5,
                        duration: 300,
                        useNativeDriver: true,
                    }
                ),
                Animated.timing(
                    this.springValue,
                    {
                        toValue: 100,
                        duration: 300,
                        useNativeDriver: true,
                    }
                ),

            ]).start(() => {
                this.setState({backClickCount: 0});
            });
        });
    }

    onSettingClick(){
        this.props.navigation.navigate('SettingProvider');
    }

    onActivePostClick(){
        this.props.navigation.navigate('HomeProvider');
    }

    onAppliedUserClick(){
        this.props.navigation.navigate('HomeProvider');
    }

    onTotalPostClick(){
        this.props.navigation.navigate('HomeProvider');
    }

    onAddPostClick(){
        this.props.navigation.navigate('CreateJobProvider');
    }
 
  renderItem = ({ item }) => (
    <TouchableOpacity  style={styles.item}>
    <Text style={styles.title}>{item.value}</Text>
    </TouchableOpacity>
  );

    render () {
      return (

        <View style={styles.maincontainer}>
        <StatusBar
           backgroundColor = "#4F45F0"
           barStyle = "light-content"
         />
        <ImageBackground source={require('../../assets/image/splash_bg.png')} style={styles.backgroundImage} resizeMode='stretch' >
        <View style={{backgroundColor : '#4F45F0' ,height: hp('7%'),width:wp('100%'),}} >
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <View style={{marginTop:hp('2%'),marginLeft:hp('2.2%')}}>
            </View>

            <View style={{alignSelf:'flex-end',flexDirection:'row',marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <TouchableOpacity  onPress={this.onFilterClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/filter_1.png')} style={{height:hp('3.1%'),width:hp('3.1%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
                <TouchableOpacity  onPress={this.onSettingClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/settings_1.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>
        </View>
        </View>
        
        <View style={{ height:hp('93%') , width:wp('100%') }}>

        <View style={{marginTop:hp('2%'),marginLeft:hp('4%')}}>
                <Text style={{color:'#4F45F0',fontSize:hp('3.3%')}}>{this.state.renderLanguage.welcome}, {this.state.userdata.firstname}</Text>
        </View>

        <View style={{flexDirection:'row',marginTop:hp('2%'),alignSelf:"center",justifyContent:'space-between',width:wp('100%')}}>
            <TouchableOpacity  onPress={this.onActivePostClick} style={{borderRadius:hp('2%'),backgroundColor:'#EDECFC',width:wp('40%'),marginHorizontal:wp('5%')}}>
                <View style={{}}>
                <Icon6 name="md-documents-outline" color={'#4F45F08a'} size={hp('6%')}  style={{paddingVertical:hp('1%'),paddingLeft:hp('2%')}}/>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:hp('1%')}}>
                <View style={{marginHorizontal:hp('1.5%')}}><Text style={{color:'#4F45F0',fontSize:hp('2%')}}>{this.state.renderLanguage.activepost}</Text></View>
                <View style={{marginHorizontal:hp('1.5%')}}><Text style={{color:'#4F45F0',fontSize:hp('2.3%')}}>({this.state.activeNumber})</Text></View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity  onPress={this.onAppliedUserClick} style={{borderRadius:hp('2%'),backgroundColor:'#EDECFC',width:wp('40%'),marginHorizontal:wp('5%')}}>
                <View style={{}}>
                <Icon4 name="user" color={'#4F45F08a'} size={hp('6%')} style={{paddingVertical:hp('1%'),paddingLeft:hp('2%')}}/>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:hp('1%')}}>
                <View style={{marginLeft:hp('1.5%')}}><Text style={{color:'#4F45F0',fontSize:hp('2%'),width:wp('25%')}} numberOfLines={2}>{this.state.renderLanguage.todayapplieduser}</Text></View>
                <View style={{marginHorizontal:hp('1.5%')}}><Text style={{color:'#4F45F0',fontSize:hp('2.3%')}}>({this.state.appliedNumber})</Text></View>
                </View>
            </TouchableOpacity>
        </View>
        
        <TouchableOpacity  onPress={this.onTotalPostClick} style={{borderRadius:hp('2%'),backgroundColor:'#EDECFC',marginTop:hp('3%'),width:wp('90%'),alignSelf:"center"}}>
                <View style={{}}>
                <Icon2 name="text-box-check-outline" color={'#4F45F08a'} size={hp('7%')}  style={{paddingVertical:hp('2%'),paddingLeft:hp('2%')}}/>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:hp('1%')}}><View style={{marginHorizontal:hp('2%')}}><Text style={{color:'#4F45F0',fontSize:hp('2%')}}>{this.state.renderLanguage.totalpost}</Text></View>
                <View style={{marginHorizontal:hp('1.5%')}}><Text style={{color:'#4F45F0',fontSize:hp('2.3%')}}>({this.state.totalNumber})</Text></View>
                </View>
        </TouchableOpacity>


        <TouchableOpacity onPress={this.onAddPostClick} 
        activeOpacity={0.5}
        style= {{
                //Here is the trick
                position: 'absolute',
                width: hp('7%'),
                height: hp('7%'),
                borderRadius:hp('7%')/2,
                backgroundColor:"#4F45F0",
                alignItems: 'center',
                justifyContent: 'center',
                right: wp('5%'),
                bottom: hp('12%'),
            }}>
                <Image source={require('../../assets/icon/post_add.png')} style={{height:hp('6%'),width:hp('6%')}} resizeMode='contain'></Image>
        </TouchableOpacity>
        </View>
        <Animated.View style={[styles.animatedView, {transform: [{translateY: this.springValue}]}]}>
                    <Text style={styles.exitTitleText}>{this.state.renderLanguage.backhandlerstatement}</Text>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => BackHandler.exitApp()}
                    >
                        <Text style={styles.exitText}>{this.state.renderLanguage.backhandlertitle}</Text>
                    </TouchableOpacity>

        </Animated.View>
        </ImageBackground> 

        <Modal isVisible={this.state.FilterModalVisible} avoidKeyboard={false} animationIn="slideInRight" animationInTiming={300} animationOut="slideOutRight" animationOutTiming={300}>
        <View style={{height:hp('100%'),width:wp('100%'),alignSelf:"center",backgroundColor:"white"}} >
            <View style={{height:hp('7%'),borderBottomWidth:hp('0.1%'),flexDirection:"row",borderColor:"gray",width:wp('100%'),alignSelf:"center",justifyContent:"space-between",alignItems:"center"}}>
                <View style={{width:wp('15%')}}></View>
                <Text style={{fontSize:hp('3%'),color:"gray"}}>{this.state.renderLanguage.filter}</Text>
                <View>
                <TouchableOpacity  onPress={()=>{this.setState({FilterModalVisible:false,})}} style={{width:wp('15%'),alignItems:"center",justifyContent:"center"}}>
                <Image source={require('../../assets/icon/close.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
                </View>
            </View>

            <View style={{height:hp('93%'),width:wp('100%'),alignSelf:"center",backgroundColor:"white"}}>

            <View style={{height:hp('7%'),width:wp('100%'),marginTop:hp('1%')}}>
            <FlatList
                horizontal={true}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{alignItems:"center"}}
                data={this.state.level1}
                keyExtractor={item => item.id}
                renderItem={({ item }) => 
                                
                              <TouchableOpacity 
                                onPress={()=>{this.onSelect1(item.id)}}
                                style={{height:hp('5%'),borderRadius:hp('3%'),paddingHorizontal:wp('3%'),elevation:9,paddingVertical:hp('1%'),justifyContent:"center",alignItems:"center",marginHorizontal:wp('4%'),backgroundColor:"white"}}
                              >
                                  <Text style={{fontSize:hp('1.7%'),color:item.id==this.state.selected1?"#4F45F0":"black"}}>{item.name}</Text>
                                    
                              </TouchableOpacity>
                                }
                        />
            </View>

            <View style={{height:hp('7%'),width:wp('100%'),marginTop:hp('1%')}}>
                {
                    this.state.level2Loading ? 
                    <View style={{justifyContent:"center",width:wp('90%'),alignSelf:"center"}}>
                        <Text style={{fontSize:hp('1.7%'),}}>{this.state.renderLanguage.loading}</Text>
                    </View>
                    :
                    <FlatList
                    horizontal={true}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{alignItems:"center"}}
                    data={this.state.level2}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => 
                                    
                                  <TouchableOpacity 
                                    onPress={()=>{this.onSelect2(item.id)}}
                                    style={{height:hp('5%'),borderRadius:hp('3%'),paddingHorizontal:wp('3%'),elevation:9,paddingVertical:hp('1%'),justifyContent:"center",alignItems:"center",marginHorizontal:wp('4%'),backgroundColor:"white"}}
                                  >
                                      <Text style={{fontSize:hp('1.7%'),color:item.id==this.state.selected2?"#4F45F0":"black"}}>{item.name}</Text>
                                        
                                  </TouchableOpacity>
                                    }
                            />
                }

            </View>

            <View style={{height:hp('7%'),width:wp('100%'),marginTop:hp('1%')}}>
            {
                    this.state.level3Loading ? 
                    <View style={{justifyContent:"center",width:wp('90%'),alignSelf:"center"}}>
                        <Text style={{fontSize:hp('1.7%'),}}>{this.state.renderLanguage.loading}</Text>
                    </View>
                    :
                    <FlatList
                    horizontal={true}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{alignItems:"center"}}
                    data={this.state.level3}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => 
                                    
                                  <TouchableOpacity 
                                    onPress={()=>{this.onSelect3(item.id)}}
                                    style={{height:hp('5%'),borderRadius:hp('3%'),paddingHorizontal:wp('3%'),flexDirection:"row",elevation:9,paddingVertical:hp('1%'),justifyContent:"center",alignItems:"center",marginHorizontal:wp('4%'),backgroundColor:"white"}}
                                  >
                                      <Text style={{fontSize:hp('1.7%'),color:item.id==this.state.selected3?"#4F45F0":"black"}}>{item.name}</Text>
                                      <Image style={{
                                                        width: hp('4%'),
                                                        height: hp('4%'),
                                                        marginHorizontal:wp('3%')
                                                    }}
                                                    source={{uri: `${item.image}`}}/>  
                                  </TouchableOpacity>
                                    }
                    />
                }
            </View>

            <View style={{height:hp('7%'),width:wp('100%'),marginTop:hp('1%')}}>
            {
                    this.state.level4Loading ? 
                    <View style={{justifyContent:"center",width:wp('90%'),alignSelf:"center"}}>
                        <Text style={{fontSize:hp('1.7%'),}}>{this.state.renderLanguage.loading}</Text>
                    </View>
                    :
                    <FlatList
                    horizontal={true}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{alignItems:"center"}}
                    data={this.state.level4}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => 
                                    
                                  <TouchableOpacity 
                                    onPress={()=>{this.onSelect4(item.id)}}
                                    style={{height:hp('5%'),borderRadius:hp('3%'),paddingHorizontal:wp('3%'),elevation:9,paddingVertical:hp('1%'),justifyContent:"center",alignItems:"center",marginHorizontal:wp('4%'),backgroundColor:"white"}}
                                  >
                                      <Text style={{fontSize:hp('1.7%'),color:item.id==this.state.selected4?"#4F45F0":"black"}}>{item.name}</Text>
                                        
                                  </TouchableOpacity>
                                    }
                    />
            }
            </View>

            <View style={{height:hp('40%'),width:wp('100%'),marginTop:hp('1%')}}>
            {
                    this.state.level5Loading ? 
                    <View style={{justifyContent:"center",width:wp('90%'),alignSelf:"center"}}>
                        <Text style={{fontSize:hp('1.7%'),}}>{this.state.renderLanguage.loading}</Text>
                    </View>
                    :
                    <FlatList
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{height:hp('40%'),width:wp('90%'),alignSelf:"center",backgroundColor:"white"}}
                    contentContainerStyle={{}}
                    data={this.state.level5}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => 
                                    
                                  <TouchableOpacity 
                                    onPress={()=>{this.onSelect5(item.id)}}
                                    style={{height:hp('5%'),borderRadius:hp('3%'),flexDirection:"row",paddingHorizontal:wp('3%'),marginVertical:hp('1.5%'),paddingVertical:hp('1%'),justifyContent:"center",alignItems:"center",marginHorizontal:wp('4%'),backgroundColor:"white",elevation:9}}
                                  >
                                      <Text style={{fontSize:hp('1.7%'),color:item.id==this.state.selected5?"#4F45F0":"black"}}>{item.name}</Text>
                                      <Image style={{
                                                        width: hp('4%'),
                                                        height: hp('4%'),
                                                        marginLeft:wp('10%')
                                                    }}
                                                    source={{uri: `${item.image}`}}/>  
                                  </TouchableOpacity>
                                    }
                    />
            }
            </View>

            <View style={{height:hp('20%'),width:wp('100%'),justifyContent:"center",alignItems:"center"}}>
            <TouchableOpacity  onPress={()=>{this.onFilterModalSubmitClick()}}   style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>{this.state.renderLanguage.submit}</Text>
            </TouchableOpacity>
            </View>
            </View>


        </View>
        </Modal>
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
    animatedView: {
        width:wp('100%'),
        backgroundColor: "#4F45F0",
        elevation: 2,
        position: "absolute",
        bottom:0,
        padding: hp('2%'),
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    exitTitleText: {
        textAlign: "center",
        color: "#ffffff",
        fontSize:hp('1.8%'),
        marginRight: wp('3%'),
    },
    exitText: {
        color: "#e5933a",
        fontSize:hp('2%'),
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('0.5%')
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