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
    ScrollView,
    StatusBar,
    Keyboard
  } from 'react-native';

    import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
  import Icon1 from 'react-native-vector-icons/Entypo';
  import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
  import Icon3 from 'react-native-vector-icons/FontAwesome';
  import Icon4 from 'react-native-vector-icons/FontAwesome5';
  import Icon5 from 'react-native-vector-icons/AntDesign';
  import Icon6 from 'react-native-vector-icons/Ionicons';
  import Icon7 from 'react-native-vector-icons/EvilIcons';

  import DropDownPicker from 'react-native-dropdown-picker';
  import {Picker} from '@react-native-picker/picker';
  import { launchImageLibrary} from 'react-native-image-picker';
  import { CheckBox } from 'react-native-elements';
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

  import AsyncStorage from '@react-native-async-storage/async-storage';
  import AppLoader from '../component/loader';
  import DropdownAlert from 'react-native-dropdownalert';
  import SeekerServices from '../../api/seekerservices';
  import ProviderServices from '../../api/providerservices';
  import NetworkCheck from '../../utils/networkcheck';
  import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
  import {MyLanguage} from '../../utils/languagehelper';



export default class Splash extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
          userdata:{},
          apicategories:null,
          category:'',
          jobtitle:'',
          experience:'',
          salary:'',
          shortjobdesc:'',
          jobdesc:'',
          emptype:'',
          emprole:'',
          empskill:'',
          qualification:'',
          vacancy:'',
          location:'',
          locationlat:0,
          locationlong:0,
          imageOBJ:null,
          urgentchecked:false,
          freelancerchecked:false,
          freelancer_title:'',
          appLoading:false,
          renderLanguage:MyLanguage.en

      };

      this.onBackButtonClick = this.onBackButtonClick.bind(this);
      this.onInfoClick = this.onInfoClick.bind(this);
      this.onPostJobClick = this.onPostJobClick.bind(this);
      this.onChooseImageClick = this.onChooseImageClick.bind(this);
      this.onUrgentCheckBoxToggle = this.onUrgentCheckBoxToggle.bind(this);
      this.onFreelancerCheckBoxToggle = this.onFreelancerCheckBoxToggle.bind(this);
    }

    componentDidMount(){
        this.getUserData();   
    }

    async getUserData(){
        var value = await AsyncStorage.getItem('User');
        value = JSON.parse(value);
        this.setState({userdata: value},()=>{            
            this.getCategory();
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

    async getCategory(){
        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  
        let myFormData = new FormData();
        myFormData.append("langid",this.state.userdata.lang_id)

          try {
            const { data } = await SeekerServices.SeekerHomeCategory(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({
                    apicategories:null,
                })
            }

            if( data.status == 1 ){

                let myUsers = data.data.map((myValue,myIndex)=>{
                    return(
                    <Picker.Item label={myValue.name} value={myValue.id} key={myIndex}/>
                    )
                    });

                this.setState({
                    apicategories:myUsers,
                })
            }

          }
          catch(error){
            console.log(error)
            console.log(error.data)
            this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.servererror500);
          }
        }
    }

    onBackButtonClick(){
        this.props.navigation.goBack();
    }

    onInfoClick(){
        
    }

    async onPostJobClick(){

        Keyboard.dismiss();

        const isConnected = await NetworkCheck.isNetworkAvailable()

        if (isConnected) {  

        if(this.state.jobtitle.trim() == ''){
            this.setState({jobtitle:''},()=>{this.jobtitleInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.jobtitleblank);
          return
        }
        if(this.state.experience.trim() == ''){
            this.setState({experience:''},()=>{this.experienceInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.experienceblank);
          return
        }
        if(this.state.salary.trim() == ''){
            this.setState({salary:''},()=>{this.salaryInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.salaryblank);
          return
        }
        if(this.state.shortjobdesc.trim() == ''){
            this.setState({shortjobdesc:''},()=>{this.shortjobdescriptionInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.jobshortdescblank);
          return
        }
        if(this.state.jobdesc.trim() == ''){
            this.setState({jobdesc:''},()=>{this.jobdescriptionInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.jobdescblank);
          return
        }
        if(this.state.emprole.trim() == ''){
            this.setState({emprole:''},()=>{this.emproleInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.employementrolaeblank);
          return
        }
        if(this.state.empskill.trim() == ''){
            this.setState({empskill:''},()=>{this.empskillsInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.employmentskillblank);
          return
        }
        if(this.state.qualification.trim() == ''){
            this.setState({qualification:''},()=>{this.qualificationInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.qualificationblank);
          return
        }
        if(this.state.vacancy.trim() == ''){
            this.setState({vacancy:''},()=>{this.vacancyInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.vacancyblank);
          return
        }
        if(this.state.location.trim() == ''){
            this.setState({location:''},()=>{this.locationInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.locationblank);
          return
        }
        if(this.state.locationlat == 0){
            this.setState({locationlat:0},()=>{this.locationInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.latitudeerror);
          return
        }
        if(this.state.locationlong == 0){
            this.setState({locationlong:0},()=>{this.locationInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.longitudeerror);
          return
        }
        if(this.state.imageOBJ == null){
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.imageblank);
          return
        }

        if(this.state.freelancerchecked==true && this.state.freelancer_title.trim() == ''){
            this.setState({freelancer_title:''},()=>{this.freelancer_titleInputRef.focus(); })
            this.dropDownAlertRef.alertWithType('error',this.state.renderLanguage.freelancetitleblank);
          return
        }


        let myFormData = new FormData();
        myFormData.append("user_id",this.state.userdata._id)
        myFormData.append("category",this.state.category)
        myFormData.append("job_title", this.state.jobtitle)
        myFormData.append("experience", this.state.experience)
        myFormData.append("salary", this.state.salary)
        myFormData.append("short_description", this.state.shortjobdesc)
        myFormData.append("description", this.state.jobdesc)
        myFormData.append("emp_type", this.state.emptype)
        myFormData.append("emp_role", this.state.emprole)
        myFormData.append("skills", this.state.empskill)
        myFormData.append("qualification", this.state.qualification)
        myFormData.append("vacancy", this.state.vacancy)
        myFormData.append("location", this.state.location)
        myFormData.append("latitude", this.state.locationlat)
        myFormData.append("longitude", this.state.locationlong)

        myFormData.append("images", {
            name: "filedocument.png",
            uri: this.state.imageOBJ.uri,
            type: "*/*"
        })
        if(this.state.urgentchecked == false){myFormData.append("urgent_req",0)}
        if(this.state.urgentchecked == true){myFormData.append("urgent_req",1)}
        if(this.state.freelancerchecked == false){myFormData.append("is_freelancer",0)}
        if(this.state.freelancerchecked == true){
            myFormData.append("is_freelancer",1)
            myFormData.append("freelancer_title",this.state.freelancer_title)
        }

        try {
            this.setState({appLoading: true})
            const { data } = await ProviderServices.ProviderPostJob(myFormData)
            console.log(data);

            if( data.status == 0 ){
                this.setState({appLoading: false})
                this.dropDownAlertRef.alertWithType('error', this.state.renderLanguage.somethingwentwrong);
            }

            if( data.status == 1){
                this.setState({appLoading: false})
                this.dropDownAlertRef.alertWithType('success',this.state.renderLanguage.jobcreatedsuccess);
                this.props.navigation.goBack();
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

    onChooseImageClick = () => {

            let options = {
              storageOptions: {
                skipBackup: true,
                path: 'images',
              },
            };
        
            launchImageLibrary(options, (res) => {
              console.log('Response = ', res);
        
              if (res.didCancel) {
                console.log('User cancelled image picker');
                this.setState({
                    imageOBJ: null
                  });
              } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
              } else {
                console.log('response', JSON.stringify(res));
                this.setState({
                  imageOBJ: res
                });
              }
            });
    }

    onUrgentCheckBoxToggle(){
        if(this.state.urgentchecked == false){this.setState({urgentchecked:true})}
        if(this.state.urgentchecked == true){this.setState({urgentchecked:false})}
    }

    onFreelancerCheckBoxToggle(){
        if(this.state.freelancerchecked == false){this.setState({freelancerchecked:true})}
        if(this.state.freelancerchecked == true){this.setState({freelancerchecked:false})}
    }

    render () {

        const onChangeLocation = (text) => {
            this.setState({location:text})
        }

      return (
        <View style={styles.maincontainer}>
        <StatusBar
           backgroundColor = "#4F45F0"
           barStyle = "light-content"
         />
        <ImageBackground source={require('../../assets/image/splash_bg.png')} style={styles.backgroundImage} resizeMode='stretch' >

        <View style={{backgroundColor : '#4F45F0' ,height: hp('7%'),width:wp('100%'),}} >
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            
            <TouchableOpacity onPress={this.onBackButtonClick} style={{marginTop:hp('2%'),marginLeft:hp('2.2%'),flexDirection:"row",alignItems:"center"}}>
            <Image source={require('../../assets/icon/right_arrow.png')} style={{height:hp('2.5%'),width:hp('2.5%')}} resizeMode='contain'></Image>
                <Text style={{color:'white',fontSize:hp('2.5%'),marginLeft:hp('0.5%')}}>{this.state.renderLanguage.postjob}</Text>
            </TouchableOpacity>

            <View style={{alignSelf:'flex-end',flexDirection:'row',marginHorizontal:hp('2%'),marginTop:hp('2%')}}>
                <TouchableOpacity  onPress={this.onInfoClick} style={{marginHorizontal:hp('1.7%')}}>
                <Image source={require('../../assets/icon/info.png')} style={{height:hp('3.3%'),width:hp('3.3%')}} resizeMode='contain'></Image>
                </TouchableOpacity>
            </View>
        </View>
        </View>
        
        <KeyboardAwareScrollView 
          style={{height:hp('93%') , width:wp('100%') }}
          contentContainerStyle={{paddingBottom:hp('20%')}}
          extraHeight={hp('30%')}
          enableOnAndroid={true}
          keyboardShouldPersistTaps={true}
          >     

            <View style={{marginHorizontal:hp('3%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.category}</Text> 
            </View>
            <View style={styles.iconInputContainer}>
            <Picker
                mode="dropdown"
                style = {styles.iconInputField}
                selectedValue={this.state.category}
                enabled={true}
                dropdownIconColor={'#4F45F0'}
                onValueChange={(c) => this.setState({category: c})}
            >
               {this.state.apicategories}
            </Picker>
            </View>

            <View style={{marginHorizontal:hp('3%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.jobtitledesignation}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.jobtitleInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.experienceInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.jobtitle}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.jobtitle}
                onChangeText={(jobtitle) => this.setState({jobtitle})}  />
            </View>

            <View style={{marginHorizontal:hp('3%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.experience}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.experienceInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { 
                    this.salaryInputRef.focus();
                    
                    // if(this.state.experience){
                    //     this.setState({experience:`${this.state.experience+' Years'}`})
                    // }
                }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.experience}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                keyboardType='number-pad'
                value={this.state.experience}
                onChangeText={(experience) => this.setState({experience})}  />
            </View>

            <View style={{marginHorizontal:hp('3%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.salary}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.salaryInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { 
                    this.shortjobdescriptionInputRef.focus();
                    // if(this.state.salary){
                    //     this.setState({salary:`${this.state.salary+' INR'}`})
                    // }
                }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.salary}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                keyboardType='number-pad'
                value={this.state.salary}
                onChangeText={(salary) => this.setState({salary})}  />
            </View>

            <View style={{marginHorizontal:hp('3%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.shortjobdescription}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.shortjobdescriptionInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.jobdescriptionInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.shortjobdescription}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.shortjobdesc}
                onChangeText={(shortjobdesc) => this.setState({shortjobdesc})}  />
            </View>

            <View style={{marginHorizontal:hp('3%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.jobdescription}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.jobdescriptionInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.emproleInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.jobdescription}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.jobdesc}
                onChangeText={(jobdesc) => this.setState({jobdesc})}  />
            </View>

            <View style={{marginHorizontal:hp('3%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.employmenttype}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <Picker
                mode="dropdown"
                style = {styles.iconInputField}
                selectedValue={this.state.emptype}
                enabled={true}
                dropdownIconColor={'#4F45F0'}
                onValueChange={(emptype) => {
                    this.setState({emptype: emptype})
                }}
            >
               <Picker.Item label={'Full Time'} value={this.state.renderLanguage.fulltime} key={1}/>
               <Picker.Item label={'Part Time'} value={this.state.renderLanguage.parttime} key={2}/>
            </Picker>
            </View>


            <View style={{marginHorizontal:hp('3%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.employmentrole}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.emproleInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.empskillsInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.employmentrole}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.emprole}
                onChangeText={(emprole) => this.setState({emprole})}  />
            </View>

            <View style={{marginHorizontal:hp('3%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.employmentskills}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.empskillsInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.qualificationInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.employmentskills}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.empskill}
                onChangeText={(empskill) => this.setState({empskill})}  />
            </View>

            <View style={{marginHorizontal:hp('3%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.qualification}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.qualificationInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { this.vacancyInputRef.focus(); }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.qualification}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.qualification}
                onChangeText={(qualification) => this.setState({qualification})}  />
            </View>

            <View style={{marginHorizontal:hp('3%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.vacancy}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.vacancyInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { 
                    this.locationInputRef.focus(); 
                }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.vacancy}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                keyboardType="number-pad"
                value={this.state.vacancy}
                onChangeText={(vacancy) => this.setState({vacancy})}  />
            </View>

            {/* <View style={{marginHorizontal:hp('3%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>Location</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.locationInputRef = input }}
                onSubmitEditing={() => { Keyboard.dismiss() }}
                underlineColorAndroid = "transparent"
                placeholder = "Location"
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                value={this.state.location}
                onChangeText={(location) => this.setState({location})}  />
            </View> */}

            <View style={{marginHorizontal:hp('3%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}> {this.state.renderLanguage.googlelocation}</Text>
            </View>
            <GooglePlacesAutocomplete
                styles={{
                    textInputContainer: {
                        flexDirection:'row',
                        alignItems:'center',
                        backgroundColor:'#EDECFC',
                        alignSelf:"center",
                        marginTop:hp('0.5%'),
                        height:hp('7%'),
                        width:wp('90%'),
                        borderRadius:hp('1.2%'),
                    },
                    textInput: {
                        flex:1,
                        color:"#000",
                        backgroundColor:'#EDECFC',
                    },
                  }}
                ref={(input) => { this.locationInputRef = input }}
                textInputProps={{ 
                placeholderTextColor: '#0000005a',
                onChangeText: onChangeLocation
                 }}
                placeholder={this.state.renderLanguage.joblocation}
                fetchDetails={true}
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  console.log(details);
                  this.setState({
                    location:data.description,
                    locationlat:details.geometry.location.lat, 
                    locationlong:details.geometry.location.lng
                  })

                }}
                onFail={(error) => console.error(error)}
                query={{
                    key: 'AIzaSyCmB2FdQCnwAPqxooE2UyfMnlfI_EHuj6M',
                    language: 'en',
                    components: 'country:in',
                }}
                />

         

            <TouchableOpacity onPress={this.onChooseImageClick}  style={{alignItems:"center",flexDirection:"row",borderRadius:hp('2%'),marginHorizontal:hp('3%'),marginTop:hp('4%'),borderStyle:'dashed',borderWidth:hp('0.15%'),borderColor:'#4F45F0',backgroundColor:"#EDECFC"}}>
                <View style={{marginHorizontal:hp('3%'),marginVertical:hp('2%'),backgroundColor:"#fff",height:hp('7%'),width:hp('7%'),borderRadius:hp('1%'),alignItems:"center",justifyContent:"center"}}>
                {
                    this.state.imageOBJ == null || this.state.imageOBJ.uri === "" ?

                    <Image source={require('../../assets/icon/user.png')} style={{height:hp('5%'),width:hp('5%'),marginLeft:hp('1%')}} resizeMode='center'></Image>

                    :
                        <Image style={{
                            width: hp('7%'),
                            height: hp('7%'),
                        }}
                        source={{uri: `${this.state.imageOBJ.uri}`}}/>
                }    

                </View>
                <View style={{justifyContent:"center",alignItems:"center",paddingHorizontal:hp('3%')}}></View>
                <Text style={{fontSize:hp('2%'),color:"#4F45F0"}}>{this.state.renderLanguage.chooseimage}</Text>
            </TouchableOpacity>

            <View style={{marginTop:hp('2%')}}>
            <CheckBox
            title={this.state.renderLanguage.urgentjob}
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            uncheckedColor={'#EDECFC'}
            checkedColor={'#4F45F0'}
            textStyle={{color:"black",fontWeight:"300",fontStyle:'normal',fontSize:hp('2%')}}
            checked={this.state.urgentchecked}
            containerStyle={{backgroundColor:"transparent",borderWidth:0,marginHorizontal:hp('3%')}}
            onPress={this.onUrgentCheckBoxToggle} 
            />
            </View>

            <View style={{marginTop:hp('2%')}}>
            <CheckBox
            title={this.state.renderLanguage.freelancerjob}
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            uncheckedColor={'#EDECFC'}
            checkedColor={'#4F45F0'}
            textStyle={{color:"black",fontWeight:"300",fontStyle:'normal',fontSize:hp('2%')}}
            checked={this.state.freelancerchecked}
            containerStyle={{backgroundColor:"transparent",borderWidth:0,marginHorizontal:hp('3%')}}
            onPress={this.onFreelancerCheckBoxToggle} 
            />
            </View>

            {
                this.state.freelancerchecked ? 
            <View>
                <View style={{marginHorizontal:hp('3%'),marginTop:hp('2%')}}>
                <Text style={{fontSize:hp('2%')}}>{this.state.renderLanguage.freelancetime}</Text>
            </View>
            <View style={styles.iconInputContainer}>
            <TextInput style = {styles.iconInputField}
                ref={(input) => { this.freelancer_titleInputRef = input }}
                returnKeyType="next"
                onSubmitEditing={() => { 
                  Keyboard.dismiss();
                }}
                blurOnSubmit={false}
                underlineColorAndroid = "transparent"
                placeholder = {this.state.renderLanguage.enterdaysofjobhere}
                placeholderTextColor = "#0000005a"
                autoCapitalize = "none"
                keyboardType="number-pad"
                value={this.state.freelancer_title}
                onChangeText={(freelancer_title) => this.setState({freelancer_title})}  />
            </View>
            </View>
            :
            null
            }

            <TouchableOpacity onPress={this.onPostJobClick}  style={styles.loginButtonContainer}>
                <Text style={styles.loginButtonText}>{this.state.renderLanguage.postjob}</Text>
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
        alignSelf:"center",
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
        width:wp('78%'),
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