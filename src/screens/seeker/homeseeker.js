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
    Alert,
    Keyboard,    
    BackHandler,
    Animated
  } from 'react-native';
  import {useNavigationState} from '@react-navigation/native';
  let {width, height} = Dimensions.get('window');
  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';
  import Icon8 from 'react-native-vector-icons/Fontisto';
  import Modal from 'react-native-modal';
  import {Picker} from '@react-native-picker/picker';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import AppLoader from '../component/loader';
  import DropdownAlert from 'react-native-dropdownalert';
  import moment from 'moment';
  import SeekerServices from '../../api/seekerservices';
  import NetworkCheck from '../../utils/networkcheck';
  import {MyLanguage} from '../../utils/languagehelper';

export default class SplashHome extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        categories:null,
        renderjobs:null,
        apijobs:null,
        userdata:{},
        searchstring:'',
        appLoading:false,
        appFetchingLoader:false,
        paginationNumber:0,
        myCustomAlert:0,
        isFetching: false,
        loadMoreResults:true,

        getfilteredData:false,
        FilterModalVisible:false,
        selected1:0,
        selected2:5,
        selected3:5,
        selected4:0,
        selected5:0,
        selected5name:'None',
        level1:[],
        level2:[
            {
                "id": "5",
                "name": "None",
            },
            {
                "id": "0",
                "name": "0 to 1000",
            },
            {
                "id": "1",
                "name": "1000 to 5000",
            },
            {
                "id": "2",
                "name": "5000 to 10000",
            },
            {
                "id": "3",
                "name": "10000 to 20000",
            },
            {
                "id": "4",
                "name": "20000 ++",
            },
        ],
        salaryfilterpickeritems:null,
        level3:[
            {
                "id": "0",
                "name": "Micro Enterprise :- 1 to 9 Employees",
            },
            {
                "id": "1",
                "name": "Small Enterprise :- 10 to 49 Employees",
            },
            {
                "id": "2",
                "name": "Medium Enterprise :- 50 to 249 Employees",
            },
            {
                "id": "3",
                "name": "Large Enterprise :- 250+ Employees",
            },

        ],
        level4:[
            {
                "id": "1",
                "name": "1 Km",
            },
            {
                "id": "2",
                "name": "2 Kms",
            },
            {
                "id": "3",
                "name": "3 Kms",
            },
            {
                "id": "4",
                "name": "4 Kms",
            },
            {
                "id": "5",
                "name": "5 Kms",
            },
            {
                "id": "10",
                "name": "10 Kms",
            },
        ],

        renderLanguage:MyLanguage.en
      };

      this.onFilterClick = this.onFilterClick.bind(this);
      this.onBriefcaseClick = this.onBriefcaseClick.bind(this);
      this.onSettingClick = this.onSettingClick.bind(this);
      this.onCategoryClick = this.onCategoryClick.bind(this);
      this.onApplyNowClick = this.onApplyNowClick.bind(this);
      this.onSaveJobClick = this.onSaveJobClick.bind(this);
      this.onUnsaveJobClick = this.onUnsaveJobClick.bind(this);
      this.springValue = new Animated.Value(100) ;
      this.handleBackButton = this.handleBackButton.bind(this);

      this.onSelect1 = this.onSelect1.bind(this);
      this.onSelect3 = this.onSelect3.bind(this);
      this.onSelect4 = this.onSelect4.bind(this);
      this.onFilterModalSubmitClick = this.onFilterModalSubmitClick.bind(this);
      this.onClearFilterClick = this.onClearFilterClick.bind(this);
      
    }

    componentDidMount(){
        var myrouteparam = this.props.route.params.status;
        // if(myrouteparam == 4){this.dropDownAlertRef.alertWithType('success', "Job Applied !");}
        // if(myrouteparam == 5){this.dropDownAlertRef.alertWithType('error', "Job Apply Failed !");}
        let myUsers = this.state.level2.map((myValue,myIndex)=>{
            return(
            <Picker.Item label={myValue.name} value={myValue.id} key={myIndex}/>
            )
            });

        this.setState({
            salaryfilterpickeritems:myUsers,
        })

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
            if(this.state.getfilteredData == true){
                this.SeekerHomeFilteredApiCall(this.state.paginationNumber);
            }else{
                this.SeekerHomeApiCall(this.state.paginationNumber);
            }
            this.SeekerHomeCategories();
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

    async SeekerHomeCategories(){
        
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        let myFormData = new FormData();
        myFormData.append("langid",this.state.userdata.lang_id)
          try {
            const { data } = await SeekerServices.SeekerHomeCategory(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({
                    categories:null,
                    level1:[],
                    appFetchingLoader:false,
                    appLoading:false,
                    isFetching:false,
                })
            }

            if( data.status == 1 ){
                this.setState({
                    categories:data.data,
                    level1:data.data,
                    appFetchingLoader:false,
                    appLoading:false,
                    isFetching:false,
                })
            }

          }
          catch(error){
            console.log(error)
            this.setState({appLoading: false,isFetching:false,})
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    async SeekerHomeApiCall(pageno){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        let myFormData = new FormData();
        myFormData.append("userid",this.state.userdata._id)
        myFormData.append("langid",this.state.userdata.lang_id)
        myFormData.append("page",pageno)

        try {
            this.setState({
                appFetchingLoader:true,
            })
            const { data } = await SeekerServices.SeekerHome(myFormData)
            console.log(data);

            if(pageno>0){
                if( data.status == 0 ){
                    var oldLady=this.state.renderjobs;
                    this.setState({
                        renderjobs:oldLady,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                        loadMoreResults:false,
                    })
                }
                if( data.status == 1 ){
                    var oldLady=this.state.renderjobs;
                    var newLady = oldLady.concat(data.data);
                    this.setState({
                        renderjobs:newLady,
                        apijobs:newLady,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                        loadMoreResults:true
                    })
                }
            }
            if(pageno==0){
                if( data.status == 0 ){
                    this.setState({
                        renderjobs:null,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                    })
                }
                if( data.status == 1 ){
                    this.setState({
                        renderjobs:data.data,
                        apijobs:data.data,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                    })
                }     
            }
            
            if(this.state.myCustomAlert == 0){}
            if(this.state.myCustomAlert == 1){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.somethingwentwrong);
            }
            if(this.state.myCustomAlert == 2){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('success', this.state.renderLanguage.jobsaved);
            }
            if(this.state.myCustomAlert == 3){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('success', this.state.renderLanguage.jobunsaved);
            }
          }
          catch(error){
            console.log(error)
            this.setState({appLoading: false,isFetching:false,})
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection , this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    async SeekerHomeFilteredApiCall(pageno){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        let myFormData = new FormData();
        if(this.state.selected1 != 0){
            myFormData.append("category",this.state.selected1)
        }
        if(this.state.selected2 != 5){
            myFormData.append("salary_range",this.state.selected2)
        }
        if(this.state.selected3 != 5){
            myFormData.append("company_size",this.state.selected3)
        }
        if(this.state.selected4 != 0){
            myFormData.append("km",this.state.selected4)
            myFormData.append("lat","21.2166428")
            myFormData.append("long","72.8651865")
        }
        myFormData.append("userid",this.state.userdata._id)
        myFormData.append("langid",this.state.userdata.lang_id)
        myFormData.append("page",pageno)

        try {
            this.setState({
                appFetchingLoader:true,
            })
            const { data } = await SeekerServices.SeekerFilteredHome(myFormData)
            console.log(data);

            if(pageno>0){
                if( data.status == 0 ){
                    var oldLady=this.state.renderjobs;
                    this.setState({
                        renderjobs:oldLady,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                        loadMoreResults:false,
                    })
                }
                if( data.status == 1 ){
                    var oldLady=this.state.renderjobs;
                    var newLady = oldLady.concat(data.data);
                    this.setState({
                        renderjobs:newLady,
                        apijobs:newLady,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                        loadMoreResults:true
                    })
                }


            }
            if(pageno==0){
                if( data.status == 0 ){
                    this.setState({
                        renderjobs:null,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                    })
                }
                if( data.status == 1 ){
                    this.setState({
                        renderjobs:data.data,
                        apijobs:data.data,
                        appFetchingLoader:false,
                        appLoading:false,
                        isFetching:false,
                    })
                }     
            }
            
            if(this.state.myCustomAlert == 0){}
            if(this.state.myCustomAlert == 1){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.somethingwentwrong);
            }
            if(this.state.myCustomAlert == 2){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('success', this.state.renderLanguage.jobsaved);
            }
            if(this.state.myCustomAlert == 3){
                this.setState({myCustomAlert:0})
                this.dropDownAlertRef.alertWithType('success', this.state.renderLanguage.jobunsaved);
            }
          }
          catch(error){
            console.log(error)
            this.setState({appLoading: false,isFetching:false,})
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

    onFilterClick(){
        this.setState({
            FilterModalVisible:true,                    
        });
    }

    onSelect1(level1id){
        if(level1id==this.state.selected1){
            this.setState({
                selected1:0,
            })
        }else{
            this.setState({
                selected1:level1id,
            })
        }
    }

    onSelect3(level3id){
        if(level3id==this.state.selected3){
            this.setState({
                selected3:5,
            })
        }else{
            this.setState({
                selected3:level3id,
            })
        }
    }

    onSelect4(level4id){
        if(level4id==this.state.selected4){
            this.setState({
                selected4:0,
            })
        }else{
            this.setState({
                selected4:level4id,
            }) 
        }   
    }

    onClearFilterClick(){
        this.setState({
            searchstring:"",
            selected1:0,
            selected2:5,
            selected3:5,
            selected4:0,
            getfilteredData:false,
            isFetching: true,
            paginationNumber:0,
            renderjobs:null,
            categories:null,
        },()=>{
            this.getUserData();
        })
    }

    onBriefcaseClick(){
        this.props.navigation.navigate('FreelancerList');
    }

    onSettingClick(){
        this.props.navigation.navigate('SettingSeeker');
    }

    onCategoryClick(){
        this.props.navigation.navigate('ProfileSeeker');
    }

    onApplyNowClick(pid){
        this.props.navigation.navigate('ApplyForJobSeeker',{postID:pid});
    }

    onFilterModalSubmitClick(){
        console.log('select1 =',this.state.selected1)
        console.log('select2 =',this.state.selected2)
        console.log('select3 =',this.state.selected3)
        console.log('select4 =',this.state.selected4)
        if(this.state.selected1 == 0 && this.state.selected2 == 5 && this.state.selected3 == 5 && this.state.selected4 == 0 ){
            this.setState({
                getfilteredData:false,
                FilterModalVisible:false,
                isFetching: true,
                paginationNumber:0,
                renderjobs:null,
                categories:null,
            },()=>{
                this.getUserData();
            })
        }
        else{
            this.setState({
                getfilteredData:true,
                FilterModalVisible:false,
                isFetching: true,
                paginationNumber:0,
                renderjobs:null,
                categories:null,
            },()=>{
                console.log("i am filtered data");
                this.getUserData();
            })
        }
    }


    async onSaveJobClick(postid){
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appLoading:true})

        let myFormData = new FormData();
        myFormData.append("post_id",postid)
        myFormData.append("status",1)
        myFormData.append("user_id",this.state.userdata._id)

        try {
            const { data } = await SeekerServices.SeekerSaveJob(myFormData)
            console.log(data);

            if( data.status == 1 ){
                this.setState({myCustomAlert:2})
            }
            if( data.status == 0 ){
                this.setState({myCustomAlert:1})
            }
            this.SeekerHomeApiCall(this.state.paginationNumber);
          }
          catch(error){
            this.setState({appLoading:false})
            console.log(error)
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    async onUnsaveJobClick(postid){
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        this.setState({appLoading:true})

        let myFormData = new FormData();
        myFormData.append("post_id",postid)
        myFormData.append("status",0)
        myFormData.append("user_id",this.state.userdata._id)

        try {
            const { data } = await SeekerServices.SeekerSaveJob(myFormData)
            console.log(data);

            if( data.status == 1 ){
                this.setState({myCustomAlert:3})
            }
            if( data.status == 0 ){
                this.setState({myCustomAlert:1})
            }
            this.SeekerHomeApiCall(this.state.paginationNumber);
          }
          catch(error){
            this.setState({appLoading:false})
            console.log(error)
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }
 
    renderItem = ({ item }) => (
        <TouchableOpacity  onPress={()=>{ this.setState({searchstring:item.name},()=>{this.updateSearch()})}} 
            style={styles.item}>
        <Text style={styles.title}>{item.name}</Text>
        </TouchableOpacity>
    );

    updateSearch(){
        if(this.state.searchstring == ""){
            this.setState({
                renderjobs:this.state.apijobs
            })
            return
        }

        var searchedjobs =[]
        if(this.state.renderjobs.length > 0) {
            this.state.renderjobs.map((item) => {
            if(item.category != null && item.job_title != null && item.company_name != null && item.experience != null && item.salary != null && item.location != null ) {
                if (item.category.toLowerCase().indexOf(this.state.searchstring.toLowerCase()) != -1 || item.job_title.toLowerCase().indexOf(this.state.searchstring.toLowerCase()) != -1 || item.company_name.toLowerCase().indexOf(this.state.searchstring.toLowerCase()) != -1 || item.experience.toLowerCase().indexOf(this.state.searchstring.toLowerCase()) != -1 || item.salary.toLowerCase().indexOf(this.state.searchstring.toLowerCase()) != -1 || item.location.toLowerCase().indexOf(this.state.searchstring.toLowerCase()) != -1) {
                    searchedjobs.push(item)
                }
            }
            })
        }
        this.setState({
            renderjobs:searchedjobs
        },()=>{console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!! =',this.state.renderjobs)})
    };

    loadMoreResults(info){
        if(this.state.searchstring.length<1){
            if(this.state.loadMoreResults){
                var pageno = this.state.paginationNumber + 1;
                this.setState({paginationNumber:pageno},()=>{
                    if(this.state.getfilteredData == true){
                        this.SeekerHomeFilteredApiCall(pageno);
                    }else{
                        this.SeekerHomeApiCall(pageno);
                    }
                })
            }
        }
    }
    onRefresh() {
        if(this.state.searchstring.length<1){
        this.setState({isFetching: true,paginationNumber:0,renderjobs:null,categories:null},() => {            
            this.getUserData();});
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
        <View style={{backgroundColor : '#4F45F0' ,height: hp('20%'),width:wp('100%'),}} >

            <View style={{alignSelf:'flex-end',flexDirection:'row',marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <TouchableOpacity  onPress={this.onFilterClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/filter_1.png')} style={{height:hp('3.1%'),width:hp('3.1%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
                <TouchableOpacity  onPress={this.onBriefcaseClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/portfolio_2.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
                <TouchableOpacity  onPress={this.onSettingClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/settings_1.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>

            <View style={{marginTop:hp('1%'),marginLeft:hp('2%')}}>
                <Text style={{color:'white',fontSize:hp('2.8%')}}>{this.state.renderLanguage.welcome}, {this.state.userdata.firstname}</Text>
            </View>

            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.homelabel1}
                placeholderTextColor = "#0000003a"
                autoCapitalize = "none"
                value={this.state.searchstring}
                onChangeText={(value) => this.setState({searchstring:value},()=>{this.updateSearch()})}  />
                {
                    this.state.searchstring.length > 0 ? 
                    <TouchableOpacity  onPress={()=>{Keyboard.dismiss()}} >
                    <Image source={require('../../assets/icon/loupe_1.png')} style={{height:hp('4%'),width:hp('4%'),marginRight:hp('2.5%')}} resizeMode='contain'></Image>
                    </TouchableOpacity>
                    :
                    <View>
                    <Image source={require('../../assets/icon/loupe_1.png')} style={{height:hp('4%'),width:hp('4%'),marginRight:hp('2.5%')}} resizeMode='contain'></Image>
                    </View>
                }
  
            </View>

        </View>
        
        <View style={{ height:hp('80%') , width:wp('100%') }}>

        {this.state.renderjobs == null ? 
            
            this.state.appFetchingLoader == true ? 
            <View style={{alignItems:"center",justifyContent:"center",height:hp('80%'),width:wp('100%')}}>
            </View>
            :
            <View style={{alignItems:"center",justifyContent:"center",height:hp('80%'),width:wp('100%')}}>
                <Text style={{color:'#4F45F0',fontSize:hp('2.8%')}}>{this.state.getfilteredData == true ? this.state.renderLanguage.nofilteredjobsfound:this.state.renderLanguage.nojobsfound}</Text>
                {
                    this.state.getfilteredData == true ?
                    <TouchableOpacity onPress={()=>{this.onClearFilterClick()}}  
                    style={{        
                        flexDirection:'row',
                        alignItems:'center',
                        backgroundColor:'#4F45F0',
                        marginTop:hp('5%'),
                        height:hp('6%'),
                        width:wp('40%'),
                        borderRadius:hp('1%'),
                        justifyContent:'center',
                        alignItems:'center'}}>
                    <Text style={styles.loginButtonText}>{this.state.renderLanguage.clearfilters}</Text>
                    </TouchableOpacity>
                    :null
                }
            </View>

        :
            <View>

                {
                    this.state.searchstring.length > 0 ? 
                    null
                    :
                    this.state.getfilteredData == true ?
                    null
                    :
                    <View>
                    <View style={{marginTop:hp('1%'),marginHorizontal:hp('2.3%')}}>
                    <Text style={{color:'#000',fontSize:hp('2.1%')}}>{this.state.renderLanguage.homelabel2}</Text>
                    </View>

                    <View style={{marginTop:hp('1%'),marginBottom:hp('1%')}}>
                        <FlatList
                        horizontal={true}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={this.state.categories}
                        renderItem={this.renderItem}
                        keyExtractor={item => item._id}
                        />
                    </View>

                    <View style={{marginHorizontal:hp('2.3%')}}>
                            <Text style={{color:'#000',fontSize:hp('2.1%')}}>{this.state.renderLanguage.homelabel3}</Text>
                    </View>
                    </View>
                }
               
               {
                    this.state.searchstring.length > 0  && this.state.renderjobs.length < 1 ? 
                    <View style={{alignItems:"center",justifyContent:"center" , marginTop:hp('15%')}}>
                    <Text style={{color:'#4F45F0',fontSize:hp('2%')}}>{this.state.renderLanguage.nothingfoundforresult} "{this.state.searchstring}"</Text>
                    <Text style={{color:'#4F45F0',fontSize:hp('1.8%')}}>{this.state.renderLanguage.trysomethingelse}</Text>
                    </View>
                    :
                    null
                }

                <View style={{marginHorizontal:hp('2.3%'),marginTop:hp('1%')}}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: hp('40%') }}
                            data={this.state.renderjobs}
                            onRefresh={() => this.onRefresh()}
                            refreshing={this.state.isFetching}
                            onEndReachedThreshold={0.1}
                            onEndReached={info => {
                              this.loadMoreResults(info);
                            }}
                            keyExtractor={item => item._id}
                            renderItem={({ item }) => 
                                
                                <TouchableOpacity key={item._id} onPress={()=>{this.props.navigation.navigate('JobCard',{job:item,applynow:true});}} style={{borderRadius:hp('2%'),borderWidth:0.5,marginTop:hp('1%'),backgroundColor:'#F7F5F7'}}>
                                    <View style={{flexDirection:'row'}}>
                                        <View style={{marginVertical:hp('2%'),marginLeft:hp('2%')}}>
                                            <Image 
                                            source={{uri: `${item.image}`}} 
                                            style={{  width: hp('9%'),
                                            height: hp('9%'),
                                            borderRadius: hp('9%')/2,
                                            backgroundColor: '#4F45F0',
                                            alignItems:'center',
                                            justifyContent:'center'}}>
                                                </Image>
                                        </View>
                                        <View style={{marginVertical:hp('2%'),marginLeft:hp('3%'),width:hp('25%'),justifyContent:"center"}}> 
                                            <Text style={{fontSize:hp('2.1%'),fontWeight:'bold'}}>{item.job_title}</Text>
                                            <Text style={{marginTop:hp('1%')}}>{item.company_name}</Text>
                                        </View >
                                        {
                                            item.is_save == 0 ? 
                                            <TouchableOpacity onPress={()=>{this.onSaveJobClick(item._id)}} style={{position:'absolute',right:wp('6%')}}><Image source={require('../../assets/icon/bookmark.png')} style={{height:hp('4%'),width:hp('4%'),top:-3}} resizeMode='contain'></Image></TouchableOpacity>
                                            :
                                            <TouchableOpacity onPress={()=>{this.onUnsaveJobClick(item._id)}} style={{position:'absolute',right:wp('6%')}}><Image source={require('../../assets/icon/bookmark_1.png')} style={{height:hp('4%'),width:hp('4%'),top:-2}} resizeMode='contain'></Image></TouchableOpacity>
                                        }                                    
                                        </View>

                                    <View style={{flexDirection:'row',marginTop:hp('1%'),alignItems:'center'}}>
                                        <View style={{alignSelf:"center",alignItems:"center",justifyContent:"center",paddingHorizontal:hp('0.6%'),marginLeft:hp('2.4%')}}>
                                        <Image source={require('../../assets/icon/location.png')} style={{height:hp('3%'),width:hp('3%')}} resizeMode='contain'></Image>
                                        </View>
                                        <Text style={{marginLeft:hp('1.9%'),fontSize:hp('1.8%')}} >{item.location}</Text>
                                    </View>

                                    <View style={{flexDirection:'row',marginTop:hp('1%'),alignItems:'center'}}>
                                        <View style={{alignSelf:"center",alignItems:"center",justifyContent:"center",paddingHorizontal:hp('0.6%'),marginLeft:hp('2.4%')}}>
                                        <Image source={require('../../assets/icon/portfolio_1.png')} style={{height:hp('3%'),width:hp('3%')}} resizeMode='contain'></Image>
                                        </View>
                                        <Text style={{marginLeft:hp('1.9%'),fontSize:hp('1.8%')}} >{item.experience}</Text>
                                    </View>

                                    <View style={{flexDirection:'row',marginTop:hp('1%'),alignItems:'center'}}>
                                        <View style={{alignSelf:"center",alignItems:"center",justifyContent:"center",paddingHorizontal:hp('0.6%'),marginLeft:hp('2.4%')}}>
                                        <Image source={require('../../assets/icon/portfolio_1.png')} style={{height:hp('3%'),width:hp('3%')}} resizeMode='contain'></Image>
                                        </View>
                                        <Text style={{marginLeft:hp('1.9%'),fontSize:hp('1.8%')}} numberOfLines={1}>{item.short_description.length < 35? `${item.short_description}`: `${item.short_description.substring(0, 34)} ...`}</Text>
                                    </View>

                                    <View style={{flexDirection:'row',marginTop:hp('1%'),alignItems:'center'}}>
                                        <View style={{alignSelf:"center",alignItems:"center",justifyContent:"center",paddingHorizontal:hp('0.6%'),marginLeft:hp('2.4%')}}>
                                        <Image source={require('../../assets/icon/calendar.png')} style={{height:hp('3%'),width:hp('3%')}} resizeMode='contain'></Image>
                                        </View>
                                        <Text style={{marginLeft:hp('1.9%'),fontSize:hp('1.8%')}}>{this.state.renderLanguage.postedon} {moment(item.created_at).format('Do MMMM,YYYY')}</Text> 
                                    </View>

                                    <View style={{flexDirection:'row',marginLeft:hp('3%'),marginTop:hp('1.5%'),marginBottom:hp('1.2%'),alignItems:'center',justifyContent:'space-between'}}>
                                        <View style={{padding:hp('1%'),backgroundColor:(item.status == '1') ? '#9af5a56a' : '#0000003a',alignItems:'center',borderRadius:hp('1%')}}><Text style={{color:'#15d12c',fontWeight:"900",fontSize:hp('1.8%')}}>{item.status == '1' ? this.state.renderLanguage.active : this.state.renderLanguage.closed }</Text></View>
                                        {
                                            item.urgent_req == '1' ? 
                                            <View style={{padding:hp('1%'),backgroundColor:(item.urgent_req == '1') ? '#c7697a' : null,alignItems:'center',borderRadius:hp('1%')}}><Text style={{color:'#b80021',fontWeight:"900",fontSize:hp('1.5%')}}>{item.urgent_req == '1' ? this.state.renderLanguage.urgenthiring : this.state.renderLanguage.closed }</Text></View>
                                            :null
                                        }
                                        <TouchableOpacity onPress={()=>{this.onApplyNowClick(item._id)}} style={{flexDirection:'row',alignItems:'center',marginRight:hp('2%')}}>
                                            <Text style={{color:'#4F45F0',fontSize:hp('2%')}}>{this.state.renderLanguage.applynow}</Text>
                                            <Image source={require('../../assets/icon/right.png')} style={{height:hp('3%'),width:hp('3%'),marginLeft:hp('0.4%'),top:hp('0.25%')}} resizeMode='contain'></Image>
                                        </TouchableOpacity> 
                                    </View>
                                </TouchableOpacity>
                                }
                        />
                </View>
            </View>
        }
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
                <TouchableOpacity  onPress={()=>{this.setState({FilterModalVisible:false})}} style={{width:wp('15%'),alignItems:"center",justifyContent:"center"}}>
                <Image source={require('../../assets/icon/close.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
                </View>
            </View>

            <View style={{height:hp('93%'),width:wp('100%'),alignSelf:"center",backgroundColor:"white"}}>
            <View style={{marginVertical:hp('1%'),width:wp('90%'),justifyContent:"center",alignSelf:"center"}}>
                <Text style={{fontSize:hp('2.5%'),color:"#4F45F0"}}>{this.state.renderLanguage.category}</Text>
            </View>
            <View style={{height:hp('7%'),width:wp('100%')}}>
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
                                style={{height:hp('5%'),borderRadius:hp('3%'),paddingHorizontal:wp('3%'),elevation:3,paddingVertical:hp('1%'),justifyContent:"center",alignItems:"center",marginHorizontal:wp('4%'),backgroundColor:"white"}}
                              >
                                  <Text style={{fontSize:hp('1.7%'),color:item.id==this.state.selected1?"#4F45F0":"black"}}>{item.name}</Text>
                                    
                              </TouchableOpacity>
                                }
                        />
            </View>

            <View style={{marginVertical:hp('1%'),width:wp('90%'),justifyContent:"center",alignSelf:"center"}}>
                <Text style={{fontSize:hp('2.5%'),color:"#4F45F0"}}>{this.state.renderLanguage.salary}</Text>
            </View>

            <View style={{height:hp('7%'),width:wp('86%'),alignSelf:"center",borderRadius:hp('3%'),backgroundColor:"white",elevation:3}}>
            <Picker
                mode="dropdown"
                style = {styles.iconInputField}
                selectedValue={this.state.selected2}
                enabled={true}
                dropdownIconColor={'#4F45F0'}
                onValueChange={(c) => this.setState({selected2: c})}
            >
               {this.state.salaryfilterpickeritems}
            </Picker>
            </View>

            <View style={{marginVertical:hp('1%'),width:wp('90%'),justifyContent:"center",alignSelf:"center"}}>
                <Text style={{fontSize:hp('2.5%'),color:"#4F45F0"}}>{this.state.renderLanguage.companysize}</Text>
            </View>

            <View style={{height:hp('30%'),width:wp('100%'),}}>
            <FlatList
                horizontal={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{}}
                data={this.state.level3}
                keyExtractor={item => item.id}
                renderItem={({ item }) => 
                                
                              <TouchableOpacity 
                                onPress={()=>{this.onSelect3(item.id)}}
                                style={{height:hp('5%'),borderRadius:hp('3%'),paddingHorizontal:wp('3%'),flexDirection:"row",elevation:3,paddingVertical:hp('1%'),marginHorizontal:wp('5%'),marginVertical:hp('1%'),backgroundColor:"white"}}
                              >
                                  <Text style={{fontSize:hp('1.7%'),color:item.id==this.state.selected3?"#4F45F0":"black",textAlign:"left",textAlignVertical:"center",marginLeft:wp('5%')}}>{item.name}</Text>
                              </TouchableOpacity>
                                }
                        />
            </View>

            <View style={{marginVertical:hp('1%'),width:wp('90%'),justifyContent:"center",alignSelf:"center"}}>
                <Text style={{fontSize:hp('2.5%'),color:"#4F45F0"}}>{this.state.renderLanguage.location}</Text>
            </View>

            <View style={{height:hp('14%'),width:wp('100%'),}}>
            <FlatList
                horizontal={false}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{alignItems:"center"}}
                data={this.state.level4}
                keyExtractor={item => item.id}
                renderItem={({ item }) => 
                                
                              <TouchableOpacity 
                                onPress={()=>{this.onSelect4(item.id)}}
                                style={{height:hp('5%'),width:wp('25%'),borderRadius:hp('3%'),paddingHorizontal:wp('3%'),elevation:3,paddingVertical:hp('1%'),justifyContent:"center",alignItems:"center",marginHorizontal:wp('4%'),marginVertical:hp('1%'),backgroundColor:"white"}}
                              >
                                  <Text style={{fontSize:hp('1.7%'),color:item.id==this.state.selected4?"#4F45F0":"black"}}>{item.name}</Text>     
                              </TouchableOpacity>
                                }
                        />
            </View>


            <View style={{height:hp('13%'),width:wp('100%'),justifyContent:"center",alignItems:"center"}}>
            <TouchableOpacity onPress={()=>{this.onFilterModalSubmitClick()}}  style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>{this.state.renderLanguage.apply}</Text>
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
        marginLeft:hp('2%'),
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
        fontSize:hp('2%')
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