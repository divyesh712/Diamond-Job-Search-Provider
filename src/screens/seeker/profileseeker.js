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
    ScrollView,
    StatusBar,
    Keyboard,
    Alert,
    TouchableOpacity,
    Switch,
    BackHandler
  } from 'react-native';

  import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';
  import Icon8 from 'react-native-vector-icons/MaterialIcons';
  import debounce from 'lodash/debounce';
  import DateTimePicker from '@react-native-community/datetimepicker';
  import {Picker} from '@react-native-picker/picker';
  import Modal from 'react-native-modal';
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
  import { launchImageLibrary,launchCamera} from 'react-native-image-picker';
  import ImagePicker from 'react-native-image-crop-picker';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import AppLoader from '../component/loader';
  import DropdownAlert from 'react-native-dropdownalert';
  import moment from 'moment';
  import SeekerServices from '../../api/seekerservices';
  import NetworkCheck from '../../utils/networkcheck';
  import {MyLanguage} from '../../utils/languagehelper';

export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        userdata:{},
        totalSaved:0,
        totalApplied:0,
        langid:null,
        onlinestatus:0,
        firstname:'',
        lastname:'',
        email:'',
        mobile:'',
        address:'',
        city:'',
        state:'',
        langid:'0',
        cname:'',
        cjobexperience:'',
        cjobtitle:'',
        clastjobexperience:'',
        ctotalexperience:'',
        sdate:new Date(),
        showstartDate:false,
        cstartdate:'',
        enddate:new Date(),
        showendDate:false,
        cenddate:'',
        companyArray:[],
        CompanyModalVisible: false,
        editting:false,
        imageOBJ:null,
        apiimageObJ:null,
        adharOBJ:[{uri:null},{uri:null}],
        apiadharOBJ:null,
        panOBJ:{uri:null},
        apipanObJ:null,
        aadhar_status:null,
        pan_status:null,
        appLoading:false,
        appFetchingLoader:false,
        myCustomAlert:0,

        ExpertModalVisible:false,
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

      this.onSettingClick = this.onSettingClick.bind(this);
      this.onSaveProfileClick = this.onSaveProfileClick.bind(this);
      this.onLogoutCLick = this.onLogoutCLick.bind(this);
      this.onCompanyEditClick = this.onCompanyEditClick.bind(this);
      this.onExpertClick = this.onExpertClick.bind(this);
      this.onExpertEditClick = this.onExpertEditClick.bind(this);
      this.onExpertModalSubmitClick = this.onExpertModalSubmitClick.bind(this);
      this.onSelect1 = this.onSelect1.bind(this);
      this.onSelect2 = this.onSelect2.bind(this);
      this.onSelect3 = this.onSelect3.bind(this);
      this.onSelect4 = this.onSelect4.bind(this);
      this.onSelect5 = this.onSelect5.bind(this);
    //   this.handleBackButton = this.handleBackButton.bind(this);
      this.onProfilePictureClick= debounce(this.onProfilePictureClick.bind(this), 200);
    }

    componentDidMount(){
        var that = this;
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            that.getUserData();
          });
        //   BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    // handleBackButton() {
    //     this.props.navigation.jumpTo('SavedJobSeeker')
    //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    //     return true;
    // }
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

    async onExpertModalUpdateClick(){
        Keyboard.dismiss();

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

            if(this.state.selected1 == 0){
                Alert.alert(this.state.renderLanguage.selectatleastonecategory);
                return
            }
         this.setState({
             ExpertModalVisible:false,
             appLoading:true,
             editting:false
         })   

        let myFormData = new FormData();
        myFormData.append("_id",this.state.editID)
        myFormData.append("lang_id",this.state.userdata.lang_id)
        myFormData.append("user_id",this.state.userdata._id)
        myFormData.append("cat_id",this.state.selected1)
        if(this.state.selected2 != 0){
            myFormData.append("lone_id",this.state.selected2)
        }
        if(this.state.selected3 != 0){
            myFormData.append("ltwo_id",this.state.selected3)
        }
        if(this.state.selected4 != 0){
            myFormData.append("lthree_id",this.state.selected4)
        }
        if(this.state.selected5 != 0){
            myFormData.append("lfour_id",this.state.selected5)
        }


        try {
            const { data } = await SeekerServices.ExpertSubmit(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({
                    appLoading:false,
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
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.apistatus0);
                this.SeekerProfileApiCall();
            }

            if( data.status == 1){
                this.setState({
                    appLoading:false,
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
                this.dropDownAlertRef.alertWithType('success', this.state.renderLanguage.expertiseupdated);
                this.SeekerProfileApiCall();
            }
            this.setState({appLoading: false})
          }
          catch(error){
            console.log(error)
            this.setState({appFetchingLoader:false,appLoading:false})
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    async onExpertModalSubmitClick(){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  
            if(this.state.selected1 == 0){
                Alert.alert(this.state.renderLanguage.selectatleastonecategory);
                return
            }
 
         this.setState({
             ExpertModalVisible:false,
             appLoading:true
         })   

        let myFormData = new FormData();
        myFormData.append("lang_id",this.state.userdata.lang_id)
        myFormData.append("user_id",this.state.userdata._id)
        myFormData.append("cat_id",this.state.selected1)
        if(this.state.selected2 != 0){
            myFormData.append("lone_id",this.state.selected2)
        }
        if(this.state.selected3 != 0){
            myFormData.append("ltwo_id",this.state.selected3)
        }
        if(this.state.selected4 != 0){
            myFormData.append("lthree_id",this.state.selected4)
        }
        if(this.state.selected5 != 0){
            myFormData.append("lfour_id",this.state.selected5)
        }

        try {
            const { data } = await SeekerServices.ExpertSubmit(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({
                    appLoading:false,
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
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.apistatus0);
                this.SeekerProfileApiCall();
            }

            if( data.status == 1){
                this.setState({
                    appLoading:false,
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
                this.dropDownAlertRef.alertWithType('success', this.state.renderLanguage.expertiseadded);
                this.SeekerProfileApiCall();
            }

          }
          catch(error){
            console.log(error)
            console.log(error.data)
            this.setState({
                appLoading:false,
            })
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
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

    async onLogoutCLick(){
        await AsyncStorage.removeItem('User').then(
            this.props.navigation.popToTop(),
            this.props.navigation.replace("LandingPage")
        )
    }

    async SeekerProfileApiCall(){

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        let myFormData = new FormData();
        myFormData.append("userid",this.state.userdata._id)

        try {
            const { data } = await SeekerServices.SeekerProfile(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.apistatus0);
            }

            if( data.status == 1){
                this.setState({
                    totalSaved:data.totalsavepost,
                    totalApplied:data.totalapplied,
                    onlinestatus:data.data.is_work,
                    firstname:data.data.firstname,
                    lastname:data.data.lastname,
                    email:data.data.email,
                    mobile:data.data.mobile_no,
                    address:data.data.address,
                    city:data.data.city,
                    state:data.data.state,
                    langid:data.data.lang_id,
                    cname:'',
                    cjobexperience:'',
                    cjobtitle:'',
                    clastjobexperience:'',
                    ctotalexperience:'',
                    cstartdate:'',
                    cenddate:'',
                    companyArray:data.userexperience,
                    expertiseArray:data.usercategory,
                    CompanyModalVisible: false,
                    imageOBJ:{uri:data.data.image},
                    apiimageObJ:{uri:data.data.image},
                    adharOBJ:[{uri:data.data.adhar_image_f},{uri:data.data.adhar_image_b}],
                    panOBJ:{uri:data.data.pan_image},
                    apipanObJ:{uri:data.data.pan_image},
                    apiadharOBJ:[{uri:data.data.adhar_image_f},{uri:data.data.adhar_image_b}],
                    aadhar_status:data.data.adhar_status,
                    pan_status:data.data.pan_status,
                })
                await AsyncStorage.setItem('User',JSON.stringify(data.data)).then(
                    this.trytorefresh()
                );
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

    trytorefresh(){
        if(this.state.myCustomAlert == 1){
            this.props.navigation.popToTop();
            this.props.navigation.replace("MainTabSeeker");
        }
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({
            userdata: value , 
        },()=>{
            this.SeekerProfileApiCall()
            this.Level1ApiCall()
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


    onSettingClick(){
        this.props.navigation.navigate('SettingSeeker');
    }

    onExpertClick(){
        this.setState({ExpertModalVisible:!this.state.ExpertModalVisible,                    
            selected1:0,
            selected2:0,
            selected3:0,
            selected4:0,
            selected5:0,
            level2:[],
            level3:[],
            level4:[],
            level5:[],
            editing:false
        });
    }


    async onSaveProfileClick(){
        Keyboard.dismiss();

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        let myFormData = new FormData();
        myFormData.append("_id",this.state.userdata._id)
        myFormData.append("firstname",this.state.firstname)
        myFormData.append("is_work",this.state.onlinestatus)
        myFormData.append("lastname",this.state.lastname)
        myFormData.append("email",this.state.email)
        myFormData.append("address",this.state.address)
        myFormData.append("city",this.state.city)
        myFormData.append("state",this.state.state)
        myFormData.append("langid",this.state.langid)
    
        if(this.state.apiimageObJ.uri != this.state.imageOBJ.uri){
            myFormData.append("image", {
                name: "filedocument.png",
                uri: this.state.imageOBJ.uri,
                type: "*/*"
            })
        }
        
        if(this.state.apipanObJ.uri != this.state.panOBJ.uri ){
            myFormData.append("pan_image", {
                name: "filedocument.png",
                uri: this.state.panOBJ.uri,
                type: "*/*"
            })
        }

        if(this.state.apiadharOBJ[0].uri != this.state.adharOBJ[0].uri){
            myFormData.append("adhar_image_f", {
                name: "filedocument.png",
                uri: this.state.adharOBJ[0].uri,
                type: "*/*"
            })

            myFormData.append("adhar_image_b", {
                name: "filedocument.png",
                uri: this.state.adharOBJ[1].uri,
                type: "*/*"
            })
        }

        try {
            this.setState({appLoading: true})
            const { data } = await SeekerServices.SeekerProfileUpdate(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({appFetchingLoader:false,appLoading:false})
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.somethingwentwrong);
            }

            if( data.status == 1){
                this.setState({appFetchingLoader:false,appLoading:false,myCustomAlert:1})
                this.dropDownAlertRef.alertWithType('success',this.state.renderLanguage.profilesaved);
                this.SeekerProfileApiCall();
            }
            this.setState({appLoading: false})
          }
          catch(error){
            console.log(error)
            this.setState({appFetchingLoader:false,appLoading:false})
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        } 
    }

    onProfilePictureClick = () => {

        let options = {
            mediaType:"photo"
        };

        launchCamera(options, (res) => {
            console.log('Response = ', res);
      
            if (res.didCancel) {
              this.setState({
                  imageOBJ:this.state.apiimageObJ
                });
              console.log('User cancelled image picker');
            } else if (res.error) {
              console.log('ImagePicker Error: ', res.error);
            } else {
              console.log('response', JSON.stringify(res));
              this.setState({
                  imageOBJ:res
              });
            }
          }); 
    }

    onAadharCardClick = () => {

        ImagePicker.openPicker({
            multiple: true,
            mediaType :'photo',
            minFiles:2,
            maxFiles:2,
          }).then(images => {
              if(images.length < 2 || images.length > 2){
                this.setState({
                    aadharOBJ:this.state.apiadharOBJ
                  });
                Alert.alert(
                    this.state.renderLanguage.select2photos,
                    this.state.renderLanguage.aadharmustcontain2,
                    [
                      {text: this.state.renderLanguage.cancel, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      {text: this.state.renderLanguage.tryagain, onPress: () =>  this.onAadharCardClick()},
                    ],
                    {cancelable: false},
                  );
              }
              if(images.length == 2 ){
                this.setState({
                    adharOBJ:[{uri:images[0].path},{uri:images[1].path}],
                });
                console.log(images);
              }
          });

    }

    onPanCardClick = () => {

        let options = {
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
    
        launchImageLibrary(options, (res) => {
          console.log('Response = ', res);
          if (res.didCancel) {
            this.setState({
                panOBJ:this.state.apipanObJ,
              });
            console.log('User cancelled image picker');
          } else if (res.error) {
            console.log('ImagePicker Error: ', res.error);
          } else {
            console.log('response', JSON.stringify(res));
            this.setState({
                panOBJ:res,
            });
          }
        });
    }


    onCompanyModalClick = () => {
        this.setState({
            CompanyModalVisible: !this.state.CompanyModalVisible,            
            cname:'',
            cjobexperience:'',
            cjobtitle:'',
            clastjobexperience:'',
            cstartdate:'',
            cenddate:'',
            ctotalexperience:'',
            editting:false
        });
      };

      async onCompanyUpdateClick(){
        Keyboard.dismiss();

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        if(this.state.cname.trim() == ''){
            this.setState({cname:''},()=>{this.companynameInputRef.focus(); })
            Alert.alert(this.state.renderLanguage.companynameblank);
            return
        }
        if(this.state.cjobexperience.trim() == ''){
            this.setState({cjobexperience:''},()=>{this.workexpInputRef.focus(); })
            Alert.alert('error',this.state.renderLanguage.workexperienceblank);
            return
        }
        if(this.state.cjobtitle.trim() == ''){
            this.setState({cjobtitle:''},()=>{this.lastjobtitleInputRef.focus(); })
            Alert.alert('error',this.state.renderLanguage.jobtitleblank);
            return
        }
        if(this.state.clastjobexperience.trim() == ''){
            this.setState({cname:''},()=>{this.lastjobexpInputRef.focus(); })
            Alert.alert('error',this.state.renderLanguage.jobexpblank);
            return
        }
        if(this.state.cstartdate.trim() == ''){
            this.setState({cstartdate:''},()=>{ })
            Alert.alert('error',this.state.renderLanguage.startdateblank);
            return
        }
        if(this.state.cstartdate.trim() == 'Invalid date'){
            this.setState({cstartdate:''},()=>{ })
            Alert.alert('error',this.state.renderLanguage.startdateinvalid);
            return
        }
        if(this.state.cenddate.trim() == ''){
            this.setState({cenddate:''},()=>{ })
            Alert.alert('error',this.state.renderLanguage.enddateblank);
            return
        }
        if(this.state.cenddate.trim() == 'Invalid date'){
            this.setState({cenddate:''},()=>{})
            Alert.alert('error',this.state.renderLanguage.enddateinvalid);
            return
        }
        if(this.state.ctotalexperience.trim() == ''){
            this.setState({ctotalexperience:''},()=>{this.totalexpInputRef.focus(); })
            Alert.alert('error',this.state.renderLanguage.totalexpblank);
            return
        }


        let myFormData = new FormData();
        myFormData.append("_id",this.state.editID)
        myFormData.append("user_id",this.state.userdata._id)
        myFormData.append("company_name",this.state.cname)
        myFormData.append("experience",this.state.cjobexperience)
        myFormData.append("job_title",this.state.cjobtitle)
        myFormData.append("last_job_experience",this.state.clastjobexperience)
        myFormData.append("start_date",this.state.cstartdate)
        myFormData.append("leave_date",this.state.cenddate)
        myFormData.append("total_experience",this.state.ctotalexperience)


        try {
            this.setState({CompanyModalVisible:false,editting:false,appLoading: true})
            const { data } = await SeekerServices.SeekerUserExperience(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({appFetchingLoader:false,appLoading:false})
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.companyexperienceupdatefailed);
            }

            if( data.status == 1){
                this.setState({appFetchingLoader:false,appLoading:false})
                this.dropDownAlertRef.alertWithType('success',this.state.renderLanguage.companyexperienceupdatesuccess);
                this.SeekerProfileApiCall();
            }

            this.setState({appLoading: false})
          }
          catch(error){
            console.log(error)
            this.setState({appFetchingLoader:false,appLoading:false})
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    async onCompanyAddClick(){
        Keyboard.dismiss();

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        if(this.state.cname.trim() == ''){
            this.setState({cname:''},()=>{this.companynameInputRef.focus(); })
            Alert.alert(this.state.renderLanguage.companynameblank);
            return
        }
        if(this.state.cjobexperience.trim() == ''){
            this.setState({cjobexperience:''},()=>{this.workexpInputRef.focus(); })
            Alert.alert('error',this.state.renderLanguage.workexperienceblank);
            return
        }
        if(this.state.cjobtitle.trim() == ''){
            this.setState({cjobtitle:''},()=>{this.lastjobtitleInputRef.focus(); })
            Alert.alert('error',this.state.renderLanguage.jobtitleblank);
            return
        }
        if(this.state.clastjobexperience.trim() == ''){
            this.setState({cname:''},()=>{this.lastjobexpInputRef.focus(); })
            Alert.alert('error',this.state.renderLanguage.jobexpblank);
            return
        }
        if(this.state.cstartdate.trim() == ''){
            this.setState({cstartdate:''},()=>{ })
            Alert.alert('error',this.state.renderLanguage.startdateblank);
            return
        }
        if(this.state.cstartdate.trim() == 'Invalid date'){
            this.setState({cstartdate:''},()=>{ })
            Alert.alert('error',this.state.renderLanguage.startdateinvalid);
            return
        }
        if(this.state.cenddate.trim() == ''){
            this.setState({cenddate:''},()=>{ })
            Alert.alert('error',this.state.renderLanguage.enddateblank);
            return
        }
        if(this.state.cenddate.trim() == 'Invalid date'){
            this.setState({cenddate:''},()=>{})
            Alert.alert('error',this.state.renderLanguage.enddateinvalid);
            return
        }
        if(this.state.ctotalexperience.trim() == ''){
            this.setState({ctotalexperience:''},()=>{this.totalexpInputRef.focus(); })
            Alert.alert('error',this.state.renderLanguage.totalexpblank);
            return
        }


        let myFormData = new FormData();
        myFormData.append("user_id",this.state.userdata._id)
        myFormData.append("company_name",this.state.cname)
        myFormData.append("experience",this.state.cjobexperience)
        myFormData.append("job_title",this.state.cjobtitle)
        myFormData.append("last_job_experience",this.state.clastjobexperience)
        myFormData.append("start_date",this.state.cstartdate)
        myFormData.append("leave_date",this.state.cenddate)
        myFormData.append("total_experience",this.state.ctotalexperience)

        try {
            this.setState({CompanyModalVisible:false,appLoading: true})
            const { data } = await SeekerServices.SeekerUserExperience(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({appFetchingLoader:false,appLoading:false})
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.companyexperienceaddingfailed);
            }

            if( data.status == 1){
                this.setState({appFetchingLoader:false,appLoading:false,CompanyModalVisible:false})
                this.dropDownAlertRef.alertWithType('success',this.state.renderLanguage.companyexperienceaddingsuccess);
                this.SeekerProfileApiCall();
            }
            this.setState({appLoading: false})
          }
          catch(error){
            console.log(error)
            this.setState({appFetchingLoader:false,appLoading:false})
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
        else{
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.nointernetconnection, this.state.renderLanguage.pleasecheckyourinternet);
        }
    }

    onCompanyEditClick(item,index){
        this.setState({
            editID:item._id,
            cname:item.company_name,
            cjobexperience:item.experience,
            cjobtitle:item.job_title,
            clastjobexperience:item.last_job_experience,
            cstartdate:item.start_date,
            cenddate:item.leave_date,
            ctotalexperience:item.total_experience,
            editting:true,
            editIndex:index,
            CompanyModalVisible:true
        })
    }

    onExpertEditClick(item,index){
        this.setState({
            editID:item.id,
            selected1:0,
            selected2:0,
            selected3:0,
            selected4:0,
            selected5:0,
            level2:[],
            level3:[],
            level4:[],
            level5:[],
            editting:true,
            editIndex:index,
            ExpertModalVisible:true,
        })
    }

    setDate = (event, date) => {
        let day = moment(date,'DD-MM-YYYY');
        this.setState({
            cstartdate: moment(day).format('DD-MM-YYYY'),
            showstartDate: false,
        });
    };

    showDatepicker() {
        Keyboard.dismiss();
        this.setState({showstartDate:true});
    }

    setDate2 = (event, date) => {
        let day = moment(date,'DD-MM-YYYY');
        this.setState({
            cenddate: moment(day).format('DD-MM-YYYY'),
            showendDate: false,
        });
    };

    showDatepicker2() {
        Keyboard.dismiss();
        this.setState({showendDate:true});
    }


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
                <Text style={{color:'white',fontSize:hp('2.5%')}}>{this.state.renderLanguage.profile}</Text>
            </View>

            <View style={{alignSelf:'flex-end',flexDirection:'row',marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <TouchableOpacity  onPress={this.onSettingClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/settings_1.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>
        </View>
        </View>
        
        <View style={{ height:hp('93%') , width:wp('100%') }}>
            <ScrollView style={{height:hp('93%') , width:wp('100%') }}
            contentContainerStyle={{paddingBottom:hp('10%')}}
            showsVerticalScrollIndicator={false}
            >

            <View style={{backgroundColor:"#4F45F0",}}>
            <View style={{alignSelf:"center",height: hp('10%'),}}>
            <TouchableOpacity  onPress={this.onProfilePictureClick} 
            style={{
                borderRadius: hp('20%')/2,
                width: hp('20%'),
                height: hp('20%'),
                backgroundColor:'#4F45F0',
                justifyContent: 'center',
                alignItems: 'center',
                }}
                activeOpacity={1}>  
                {
                    this.state.imageOBJ == null || this.state.imageOBJ.uri === ""  || this.state.imageOBJ.uri == null ?
                    <View>
                    <Image source={require('../../assets/image/dummy_avatar.png')} style={{borderWidth:hp('0.5%'),height:hp('20%'),width:hp('20%'),borderRadius:hp('20%')/2}} resizeMode='contain'></Image>
                    <View style={{position:"absolute",top:hp('2%'),right:wp('2%'),elevation:9,height:hp('3%'),width:hp('3%'),borderRadius:hp('3%')/2,backgroundColor:this.state.onlinestatus == '1' ? "#2eef2b" : "#e80d35"}}></View>
                    </View>
                    :
                    <View>
                    <Image source={{uri: `${this.state.imageOBJ.uri}`}} style={{height:hp('20%'),width:hp('20%'),borderRadius:hp('20%')/2}} />
                    <View style={{position:"absolute",top:hp('2%'),right:wp('2%'),elevation:9,height:hp('3%'),width:hp('3%'),borderRadius:hp('3%')/2,backgroundColor:this.state.onlinestatus == '1' ? "#2eef2b" : "#e80d35"}}></View>
                    </View>
                }   
            </TouchableOpacity>
            </View>
            </View>
            <TouchableOpacity  onPress={this.onProfilePictureClick} 
            style={{
                zIndex:1,
                borderBottomLeftRadius: hp('10%')*2,
                borderBottomRightRadius: hp('10%')*2,
                width: hp('10%')*2,
                height: hp('10%'),
                alignSelf:"center"
                }}>
            </TouchableOpacity>

            <View style={{alignItems:'center',alignSelf:"center",flexDirection:"row",marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2.3%')}}>{this.state.firstname}</Text>
                {
                    this.state.pan_status == 2 && this.state.aadhar_status == 2 ?
                    <Icon8 name="verified" color={"#4F45F0"} size={hp('4%')} style={{bottom:5,left:2}} />
                    :null
                }                
            </View>

            <View style={{alignItems:'center',alignSelf:"center",borderRadius:hp('1%'),justifyContent:"space-between",paddingHorizontal:wp('4%'),flexDirection:"row",height:hp('4%'),marginTop:hp('2%'),width:wp('90%'),backgroundColor:"#4F45F0"}}>
                <Text style={{fontSize:hp('1.7%'),color:"white"}}>{this.state.renderLanguage.everyweektogglesoff}</Text>
                <Switch
                    trackColor={{ false: "#e80d355a", true: "#2eef2b5a" }}
                    thumbColor={this.state.onlinestatus == '1'? "#2eef2b" : "#e80d35"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(s)=>{this.setState({onlinestatus:s == true ? '1':'0'})}}
                    value={this.state.onlinestatus == '1'? true:false}
                />
            </View>

            <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',borderTopWidth:0.8,borderBottomWidth:0.8,marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <View style={{justifyContent:"center",alignItems:"center",margin:hp('2%')}}>
                        <Text>{this.state.renderLanguage.savedjob}</Text>
                        <Text style={{backgroundColor:"#C3BCFC",marginTop:hp('1%'),height:hp('5%'),width:hp('5%'),borderRadius:hp('5%')/2,fontSize:hp('2%'),textAlign:"center",textAlignVertical:"center"}}>{this.state.totalSaved}</Text>
                </View>

                <View style={{justifyContent:"center",alignItems:"center",margin:hp('2%')}}>
                        <Text>{this.state.renderLanguage.appliedjob}</Text>
                        <Text style={{backgroundColor:"#C3BCFC",marginTop:hp('1%'),height:hp('5%'),width:hp('5%'),borderRadius:hp('5%')/2,fontSize:hp('2%'),textAlign:"center",textAlignVertical:"center"}}>{this.state.totalApplied}</Text>
                </View>
            </View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{color:"#fff",alignSelf:'flex-start',backgroundColor:"#4F45F0",padding:hp('1%'),borderRadius:hp('1%'),fontSize:hp('2%')}}>{this.state.renderLanguage.personaldetails}</Text>
            </View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.firstname}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.firstnameInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.lastnameInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.firstname}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.firstname}
                onChangeText={(c) => this.setState({firstname:c})}  />
            </View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.lastname}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.lastnameInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.emailInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.lastname}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.lastname}
                onChangeText={(lastname) => this.setState({lastname})}  />
            </View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.emailid}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.emailInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.addressInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.emailid}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                keyboardType="email-address"
                value={this.state.email}
                onChangeText={(email) => this.setState({email})}  />
            </View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.mobilenumber}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.mobilenumber}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                keyboardType='phone-pad'
                value={this.state.mobile}
                editable={false}
                onChangeText={(mobile) => this.setState({mobile})}  />
            </View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.address}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.addressInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.cityInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.address}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.address}
                onChangeText={(address) => this.setState({address})}  />
            </View>

            <View style={{marginTop:hp('2%'),marginHorizontal:hp('2%'),flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <View style={{}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.currentcity}</Text>
                <View style={{
                        flexDirection:'row',
                        alignItems:'center',
                        backgroundColor:'#EDECFC',
                        marginTop:hp('0.5%'),
                        height:hp('7%'),
                        width:wp('40%'),
                        borderRadius:hp('1.2%'),
                    }}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.cityInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.stateInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.currentcity}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.city}
                onChangeText={(city) => this.setState({city})}  />
            </View>
            </View>

            <View style={{}}>
                <Text style={{fontSize:hp('2%'),marginHorizontal:hp('2%')}}>{this.state.renderLanguage.state}</Text>
                <View style={{
                        flexDirection:'row',
                        alignItems:'center',
                        backgroundColor:'#EDECFC',
                        marginHorizontal:hp('1%'),
                        marginTop:hp('0.5%'),
                        height:hp('7%'),
                        width:wp('40%'),
                        borderRadius:hp('1.2%'),
                    }}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.stateInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { Keyboard.dismiss() }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.state}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.state}
                onChangeText={(state) => this.setState({state})}  />
            </View>
            </View>
            </View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.language}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <Picker
                mode="dropdown"
                style = {styles.iconInputField}
                selectedValue={this.state.langid}
                enabled={true}
                dropdownIconColor={'#4F45F0'}
                onValueChange={(category) => this.setState({langid: category})}
            >
                <Picker.Item label={'English'} value={'0'} key={0}/>
                <Picker.Item label={'हिंदी'} value={'1'} key={1}/>
                <Picker.Item label={'ગુજરાતી'} value={'2'} key={2}/>
            </Picker>
            </View>

            <View style={{height:hp('0.5%'),borderBottomWidth:1,marginTop:hp('2.5%'),borderColor:"#0000003a"}}></View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%'),justifyContent:'space-between',flexDirection:'row'}}>
                <Text style={{color:"#fff",alignSelf:'flex-start',backgroundColor:"#4F45F0",padding:hp('1%'),borderRadius:hp('1%'),fontSize:hp('2%')}}>{this.state.renderLanguage.expertise}</Text>
                <TouchableOpacity onPress={this.onExpertClick} ><Image source={require('../../assets/icon/add.png')} style={{height:hp('6.5%'),width:hp('6.5%')}} resizeMode='contain'></Image></TouchableOpacity>
            </View>

            <View style={{marginHorizontal:hp('2%')}}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.expertiseArray}
                    keyExtractor={item => item.id}
                    renderItem={({ item , index }) => 
                        
                    <View style={{marginTop:hp('2%'),padding:hp('1%'),justifyContent:'space-between',alignItems:'center',flexDirection:'row',backgroundColor:'#EDECFC',borderRadius:hp('1%')}}>
                    <View>
                        <Text style={{fontSize:hp('1.4%')}}>{item.data}</Text>
                    </View>
                    <TouchableOpacity onPress={()=>{this.onExpertEditClick(item,index)}}  style={{paddingVertical:hp('1%'),paddingHorizontal:hp('2%'),alignItems:'center',justifyContent:'center',backgroundColor:'#4F45F0',borderRadius:hp('1%')}}><Text style={{color:'#fff',fontSize:hp('1.4%')}}>Edit</Text></TouchableOpacity>
                </View>
                        }
                />
            </View>

            <View style={{height:hp('0.5%'),borderBottomWidth:1,marginTop:hp('2.5%'),borderColor:"#0000003a"}}></View>

            <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%'),justifyContent:'space-between',flexDirection:'row'}}>
                <Text style={{color:"#fff",alignSelf:'flex-start',backgroundColor:"#4F45F0",padding:hp('1%'),borderRadius:hp('1%'),fontSize:hp('2%')}}>{this.state.renderLanguage.companydetails}</Text>
                <TouchableOpacity onPress={this.onCompanyModalClick} ><Image source={require('../../assets/icon/add.png')} style={{height:hp('6.5%'),width:hp('6.5%')}} resizeMode='contain'></Image></TouchableOpacity>
            </View>

        <View style={{marginHorizontal:hp('2%')}}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.companyArray}
                    keyExtractor={item => item._id}
                    renderItem={({ item , index }) => 
                        
                    <View style={{marginTop:hp('2%'),padding:hp('1%'),justifyContent:'space-between',alignItems:'center',flexDirection:'row',backgroundColor:'#EDECFC',borderRadius:hp('1%')}}>
                    <View>
                        <Text style={{fontSize:hp('1.4%')}}>{item.company_name}</Text>
                        <Text style={{fontSize:hp('1.4%')}}>{item.total_experience}</Text>
                        <Text style={{fontSize:hp('1.4%')}}>{item.start_date} - {item.leave_date}</Text>
                    </View>
                    <TouchableOpacity onPress={()=>{this.onCompanyEditClick(item,index)}}  style={{paddingVertical:hp('1%'),paddingHorizontal:hp('2%'),alignItems:'center',justifyContent:'center',backgroundColor:'#4F45F0',borderRadius:hp('1%')}}><Text style={{color:'#fff',fontSize:hp('1.4%')}}>Edit</Text></TouchableOpacity>
                </View>
                        }
                />
        </View>

        {
                this.state.pan_status==2 && this.state.aadhar_status==2 ? null :
                <View>
                                    <View style={{height:hp('0.5%'),borderBottomWidth:hp('0.1%'),marginTop:hp('3.5%'),borderColor:"#0000003a"}}></View>

                                    <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%'),justifyContent:'space-between',flexDirection:'row'}}>
                                        <Text style={{color:"#fff",alignSelf:'flex-start',backgroundColor:"#4F45F0",padding:hp('1%'),borderRadius:hp('1%'),fontSize:hp('2%')}}>{this.state.renderLanguage.knowyourcustomer}</Text>
                                    </View>

                                    <Text style={{color:"#0000005a",marginTop:hp('0.2%'),marginHorizontal:hp('2%'),backgroundColor:"#EDECFC",borderWidth:hp('0.1%'),borderStyle:'dashed',padding:hp('1%'),borderRadius:hp('1%'),fontSize:hp('1.4%')}}>{this.state.renderLanguage.kycministatement}</Text>



                                    {
                                        this.state.aadhar_status == 0 && (this.state.adharOBJ[0].uri == null || this.state.adharOBJ[0].uri === '' )?
                                        <TouchableOpacity onPress={this.onAadharCardClick} style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Icon4 name="address-card" color={"#4F45F0"} size={hp('4%')} />
                                        </View>
                                        <View style={{alignSelf:"center",justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.aadharcard}</Text>
                                        </View>
                                        </TouchableOpacity>
                                        :null
                                    }

                                    {
                                        this.state.aadhar_status == 0 && this.state.adharOBJ[0].uri != null && this.state.adharOBJ[0].uri !== '' ?
                                        <TouchableOpacity onPress={this.onAadharCardClick} style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Image style={{
                                                    width: hp('7%'),
                                                    height: hp('5.5%'),
                                                }}
                                                source={{uri: `${this.state.adharOBJ[0].uri}`}}/>  
                                        </View>
                                        <View style={{marginHorizontal:hp('1%'),marginVertical:hp('2%'),backgroundColor:"#fff",width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Image style={{
                                                    width: hp('7%'),
                                                    height: hp('5.5%'),
                                                }}
                                                source={{uri: `${this.state.adharOBJ[1].uri}`}}/>  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('8%')}}>{this.state.renderLanguage.aadharcard}</Text>
                                        </View>

                                        </TouchableOpacity>
                                        :null
                                    }

                                    {
                                        this.state.aadhar_status == 1 ?
                                        <View style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Icon4 name="clock" color={"#4F45F0"} size={hp('4%')} />  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.aadharcard}</Text>
                                        <Text style={{fontSize:12,color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.approvalpending}</Text>
                                        </View>

                                        </View>
                                        :null
                                    }

                                    {
                                        this.state.aadhar_status == 2 ?
                                        <View style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Icon8 name="verified" color={"#4F45F0"} size={hp('4%')} />  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.aadharcard}</Text>
                                        <Text style={{fontSize:12,color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.approved}</Text>
                                        </View>

                                        </View>
                                        :null
                                    }

                                    {
                                        this.state.aadhar_status == 3 && (this.state.adharOBJ[0].uri == null || this.state.adharOBJ[0].uri === '' )?
                                        <TouchableOpacity onPress={this.onAadharCardClick} style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Icon8 name="do-not-disturb" color={"#4F45F0"} size={hp('4%')} />  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.aadharcard}</Text>
                                        <Text style={{fontSize:12,color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.rejected}</Text>
                                        </View>
                                        </TouchableOpacity>
                                        :null
                                    }

                                    {
                                        this.state.aadhar_status == 3 && this.state.adharOBJ[0].uri != null ?
                                        <TouchableOpacity onPress={this.onAadharCardClick} style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Image style={{
                                                    width: hp('7%'),
                                                    height: hp('5.5%'),
                                                }}
                                                source={{uri: `${this.state.adharOBJ[0].uri}`}}/>  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.aadharcard}</Text>
                                        <Text style={{fontSize:12,color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.rejected}</Text>
                                        </View>

                                        </TouchableOpacity>
                                        :null
                                    }

                                    {
                                        this.state.pan_status == 0 && (this.state.panOBJ.uri == null || this.state.panOBJ.uri === '' )?
                                        <TouchableOpacity onPress={this.onPanCardClick} style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Icon4 name="address-card" color={"#4F45F0"} size={hp('4%')} />
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.pancard}</Text>
                                        </View>
                                        </TouchableOpacity>
                                        :null
                                    }

                                    {
                                        this.state.pan_status == 0 && this.state.panOBJ.uri != null && this.state.panOBJ.uri !== '' ?
                                        <TouchableOpacity onPress={this.onPanCardClick} style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Image style={{
                                                    width: hp('7%'),
                                                    height: hp('5.5%'),
                                                }}
                                                source={{uri: `${this.state.panOBJ.uri}`}}/>  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.pancard}</Text>
                                        </View>

                                        </TouchableOpacity>
                                        :null
                                    }

                                    {
                                        this.state.pan_status == 1 ?
                                        <View style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Icon4 name="clock" color={"#4F45F0"} size={hp('4%')} />  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.pancard}</Text>
                                        <Text style={{fontSize:12,color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.approvalpending}</Text>
                                        </View>

                                        </View>
                                        :null
                                    }

                                    {
                                        this.state.pan_status == 2 ?
                                        <View style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Icon8 name="verified" color={"#4F45F0"} size={hp('4%')} />  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.pancard}</Text>
                                        <Text style={{fontSize:12,color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.approved}</Text>
                                        </View>

                                        </View>
                                        :null
                                    }

                                    {
                                        this.state.pan_status == 3 && (this.state.panOBJ.uri == null || this.state.panOBJ.uri == 'null' )?
                                        <TouchableOpacity onPress={this.onPanCardClick} style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Icon8 name="do-not-disturb" color={"#4F45F0"} size={hp('4%')} />  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.pancard}</Text>
                                        <Text style={{fontSize:12,color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.rejected}</Text>
                                        </View>
                                        </TouchableOpacity>
                                        :null
                                    }

                                    {
                                        this.state.pan_status == 3 && this.state.panOBJ.uri != null ?
                                        <TouchableOpacity onPress={this.onPanCardClick} style={{alignItems:"center",flexDirection:"row",borderRadius:hp('1%'),marginHorizontal:hp('2%'),marginTop:hp('2%'),borderStyle:'dashed',borderWidth:1,borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                                        <View style={{marginHorizontal:hp('2%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('5.5%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                                        <Image style={{
                                                    width: hp('7%'),
                                                    height: hp('5.5%'),
                                                }}
                                                source={{uri: `${this.state.panOBJ.uri}`}}/>  
                                        </View>
                                        <View style={{alignSelf:"center",flex:1,justifyContent:"center"}}>
                                        <Text style={{fontSize:hp('2%'),color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.pancard}</Text>
                                        <Text style={{fontSize:12,color:"#4F45F0",paddingHorizontal:wp('20%')}}>{this.state.renderLanguage.rejected}</Text>
                                        </View>

                                        </TouchableOpacity>
                                        :null
                                    }

                </View>
            }
 
            <TouchableOpacity onPress={()=>{this.onSaveProfileClick()}}  style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>{this.state.renderLanguage.saveprofile}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onLogoutCLick}  style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>{this.state.renderLanguage.logout}</Text>
            </TouchableOpacity>

            </ScrollView>
        </View>
        </ImageBackground> 

        <Modal isVisible={this.state.ExpertModalVisible} avoidKeyboard={false} animationIn="slideInRight" animationInTiming={300} animationOut="slideOutRight" animationOutTiming={300}>
        <View style={{height:hp('100%'),width:wp('100%'),alignSelf:"center",backgroundColor:"white"}} >
            <View style={{height:hp('7%'),borderBottomWidth:hp('0.1%'),flexDirection:"row",borderColor:"gray",width:wp('100%'),alignSelf:"center",justifyContent:"space-between",alignItems:"center"}}>
                <View style={{width:wp('15%')}}></View>
                <Text style={{fontSize:hp('3%'),color:"gray"}}>{this.state.editting == true ?this.state.renderLanguage.updateexpertise:this.state.renderLanguage.addexpertise}</Text>
                <View>
                <TouchableOpacity  onPress={()=>{this.setState({ExpertModalVisible:false,editing:false})}} style={{width:wp('15%'),alignItems:"center",justifyContent:"center"}}>
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
            <TouchableOpacity  onPress={()=>{this.state.editting == true ? this.onExpertModalUpdateClick() : this.onExpertModalSubmitClick() }}   style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>{this.state.editting == true ?this.state.renderLanguage.update:this.state.renderLanguage.submit}</Text>
            </TouchableOpacity>
            </View>
            </View>


        </View>
        </Modal>

        <Modal isVisible={this.state.CompanyModalVisible} avoidKeyboard={false}>
        <KeyboardAwareScrollView 
            style={{borderWidth:1,width:wp('85%'),height:hp('70%'),borderRadius:hp('1%'), backgroundColor:"#fff",alignSelf:"center"}} 
            extraHeight={hp('20%')} enableOnAndroid>

                    <View style={{marginTop:hp('2%'),alignSelf:"flex-end",marginRight:hp('2%')}}>
                                <TouchableOpacity onPress={this.onCompanyModalClick}>
                                <Icon5 name="closecircleo" color="#4F45F0" size={25}/>
                                </TouchableOpacity>
                    </View>
                        <View style={{height:hp('4%'),flexDirection:"row",marginTop:hp('1%')}}>
                            <View style={{marginTop:hp('1%'),alignSelf:"center",width:"100%"}}>
                            <Text style={{textAlign:"center",fontSize:hp('2.3%'),color:"#4F45F0"}}>{this.state.renderLanguage.companyprofile}</Text>
                            </View>
                        </View>

                        <View style={{marginHorizontal:hp('2%'),marginTop:35}}>
                            <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.companyname}</Text>
                        </View>
                        <View style={styles.iconInputContainerModal}>
                        <TextInput style = {styles.iconInputField}
                            ref={(input) => { this.companynameInputRef = input }}
                            returnKeyType="next"
                            onSubmitEditing={() => { this.workexpInputRef.focus(); }}
                            blurOnSubmit={false}
                            underlineColorAndroid = "transparent"
                            placeholder = {this.state.renderLanguage.companyname}
                            placeholderTextColor = "#0000005a"
                            autoCapitalize = "none"
                            value={this.state.cname}
                            onChangeText={(cname) => this.setState({cname})}  />
                        </View>

                        <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                            <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.workexperience}</Text>
                        </View>
                        <View style={styles.iconInputContainerModal}>
                        <TextInput style = {styles.iconInputField}
                            ref={(input) => { this.workexpInputRef = input }}
                            returnKeyType="next"
                            onSubmitEditing={() => { this.lastjobtitleInputRef.focus(); }}
                            blurOnSubmit={false}
                            underlineColorAndroid = "transparent"
                            placeholder = {this.state.renderLanguage.workexperience}
                            placeholderTextColor = "#0000005a"
                            autoCapitalize = "none"
                            keyboardType='numeric'
                            value={this.state.cjobexperience}
                            onChangeText={(cjobexperience) => this.setState({cjobexperience})}  />
                        </View>

                        <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                            <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.lastjobtitle}</Text>
                        </View>
                        <View style={styles.iconInputContainerModal}>
                        <TextInput style = {styles.iconInputField}
                            ref={(input) => { this.lastjobtitleInputRef = input }}
                            returnKeyType="next"
                            onSubmitEditing={() => { this.lastjobexpInputRef.focus(); }}
                            blurOnSubmit={false}
                            underlineColorAndroid = "transparent"
                            placeholder = {this.state.renderLanguage.lastjobtitle}
                            placeholderTextColor = "#0000005a"
                            autoCapitalize = "none"
                            value={this.state.cjobtitle}
                            onChangeText={(cjobtitle) => this.setState({cjobtitle})}  />
                        </View>

                        <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                            <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.lastjobexp}</Text>
                        </View>
                        <View style={styles.iconInputContainerModal}>
                        <TextInput style = {styles.iconInputField}
                            ref={(input) => { this.lastjobexpInputRef = input }}
                            returnKeyType="next"
                            onSubmitEditing={() => {  }}
                            blurOnSubmit={false}
                            underlineColorAndroid = "transparent"
                            placeholder = {this.state.renderLanguage.lastjobexp}
                            placeholderTextColor = "#0000005a"
                            autoCapitalize = "none"
                            keyboardType='numeric'
                            value={this.state.clastjobexperience}
                            onChangeText={(clastjobexperience) => this.setState({clastjobexperience})}  />
                        </View>

                        <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                            <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.lastjobtimestamps}</Text>
                        </View>
                        <View style={{marginTop:hp('1%'),marginHorizontal:hp('2%'),flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <View style={{}}>
                            <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.startdate}</Text>
                            <View style={{
                                flexDirection:'row',
                                alignItems:'center',
                                backgroundColor:'#EDECFC',
                                marginTop:hp('1%'),
                                height:hp('6%'),
                                width:wp('30%'),
                                borderRadius:hp('1%'),
                                }}>
                        <TextInput style = {styles.iconInputField}
                            ref={(input) => { this.startdateInputRef = input }}
                            onFocus={this.showDatepicker.bind(this)}
                            underlineColorAndroid = "transparent"
                            placeholder = {this.state.renderLanguage.startdate}
                            placeholderTextColor = "#0000005a"
                            value={this.state.cstartdate} />
                        </View>
                        </View>
                        {this.state.showstartDate &&
                        <DateTimePicker value={new Date()} mode={'date'}  display="default"
                                        onChange={this.setDate}/>}

                        <View style={{}}>
                            <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.enddate}</Text>
                            <View style={{
                                flexDirection:'row',
                                alignItems:'center',
                                backgroundColor:'#EDECFC',
                                marginTop:hp('1%'),
                                height:hp('6%'),
                                width:wp('30%'),
                                borderRadius:hp('1%'),
                                }}>
                        <TextInput style = {styles.iconInputField}
                             ref={(input) => { this.startdateInputRef = input }}
                             onFocus={this.showDatepicker2.bind(this)}
                             underlineColorAndroid = "transparent" 
                             placeholder = {this.state.renderLanguage.enddate}
                             placeholderTextColor = "#0000005a"
                             value={this.state.cenddate} />
                        </View>
                        </View>
                        {this.state.showendDate &&
                        <DateTimePicker value={new Date()} mode={'date'}  display="default"
                                        onChange={this.setDate2}/>}
                        </View>

                        <View style={{marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                            <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.totalexp}</Text>
                        </View>
                        <View style={styles.iconInputContainerModal}>
                        <TextInput style = {styles.iconInputField}
                            ref={(input) => { this.totalexpInputRef = input }}
                            returnKeyType="next"
                            onSubmitEditing={() => { Keyboard.dismiss(); }}
                            blurOnSubmit={false}
                            underlineColorAndroid = "transparent"
                            placeholder = {this.state.renderLanguage.totalexp}
                            placeholderTextColor = "#0000005a"
                            autoCapitalize = "none"
                            keyboardType='numeric'
                            value={this.state.ctotalexperience}
                            onChangeText={(ctotalexperience) => this.setState({ctotalexperience})}  />
                        </View>

                        <TouchableOpacity onPress={()=>{this.state.editting == true ? this.onCompanyUpdateClick() : this.onCompanyAddClick() }}  style={{width:wp("70%"),height:hp('7%'),borderRadius:20,alignSelf:"center",alignItems:"center",justifyContent:"center",marginTop:50,marginBottom:50,backgroundColor:"#4F45F0"}}>
                            <Text style={{color:"#fff"}}>{this.state.editting == true ? this.state.renderLanguage.updatedetails :  this.state.renderLanguage.adddetails }</Text>
                        </TouchableOpacity>

                    </KeyboardAwareScrollView>
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
        marginTop:hp('2%'),
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
        backgroundColor:'#EDECFC',
        marginHorizontal:hp('2%'),
        marginTop:hp('0.5%'),
        height:hp('7%'),
        width:wp('90%'),
        borderRadius:hp('1.2%'),
    },
    ExpertInputContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:"space-between",
        paddingHorizontal:wp('6%'),
        backgroundColor:'#EDECFC',
        marginHorizontal:hp('2%'),
        marginTop:hp('0.5%'),
        height:hp('7%'),
        width:wp('90%'),
        borderRadius:hp('1.2%'),
    },
    iconInputContainerModal:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#EDECFC',
        marginHorizontal:hp('2%'),
        marginTop:hp('1%'),
        height:hp('6%'),
        width:wp('76%'),
        borderRadius:hp('1.2%'),
    },
    iconInputField:{
        marginHorizontal:hp('1%'),
        flex:1,
        color:"#000000"
    },
    iconInputImage:{
        marginRight:20
    },
    loginButtonContainer:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#4F45F0',
        alignSelf:'center',
        marginTop:hp('6%'),
        height:hp('7%'),
        width:hp('45%'),
        borderRadius:hp('1.2%'),
        justifyContent:'center',
        alignItems:'center',
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
        marginHorizontal:10,
        height:hp('7%'),
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