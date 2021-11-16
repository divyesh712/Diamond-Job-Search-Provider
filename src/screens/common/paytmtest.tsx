import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  Switch,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import PaytmCustomuisdk, {
  PaytmConsentCheckBox,
} from 'paytm-customuisdk-react-native';
import CustomAlertView from './CustomAlertView';

export default function HomePage({ navigation }: { navigation: any }) {

  const [mid, setMid] = useState("GFOmgH08799233198562");
  const [clientId, setClientId] = useState('6355148079');
  const [orderId, setOrderId] = useState('OREDRID_98765');
  const [amount, setAmount] = useState('100');
  const [isStaging, setIsStaging] = useState(false);
  const [result, setResult] = useState('');
  const [txnToken, setTxnToken] = useState("f0bed899539742309eebd8XXXX7edcf61588842333227");
  const [authCheck, setAuthCheck] = useState(true);
  const [authCode, setAuthCode] = useState('');
  const [isTransactionStarted, setTransactionStarted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  
  const [paymentFlow, setPaymentFlow] = useState('NONE');
  const [checkboxBackgroud, setCheckboxBackgroud] = useState('white');
  const [checkboxTrueTint, setCheckboxTrueTint] = useState('blue');
  const [checkboxFalseTint, setCheckboxFalseTint] = useState('grey');
  const [checkboxTextColor, setCheckboxTextColor] = useState('black');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Foundation');
  
  const paymentFLowList = ['NONE', 'ADDANDPAY', 'HYBRID'];

  const fetchPayOption = (txnToken: string) =>
    new Promise<any>((resolve, reject) => {
      var urls = '';
      if (isStaging) {
        urls = 'https://securegw-stage.paytm.in';
      } else {
        urls = 'https://securegw.paytm.in';
      }
      const url = `${urls}/theia/api/v2/fetchPaymentOptions?mid=${mid}&orderId=${orderId}&ORDER_ID=${orderId}`;
     
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          head: {
            requestTimestamp: 'Time',
            version: 'v1',
            channelId: 'WAP',
            txnToken: txnToken,
          },
          body: {
            sdkVersion: 'Android_1.0',
          },
        }),
      };
      // console.log(requestOptions);
      console.log('FETCH PAY OPTIONS Started !');

      fetch(url, requestOptions)
        .then((response) => {
          response
            .json()
            .then((res) => {
              // console.log(JSON.stringify(res));
              var body = res.body;
              var resultInfo = body.resultInfo;
              if (resultInfo.resultStatus === 'S') {
                return resolve(body);
              } else {
                return reject(resultInfo.resultMsg);
              }
            })
            .catch((err) => {
              return reject(err.message);
            });
        })
        .catch((err) => {
          return reject(err.message);
        });
    });
    
  const startTransaction = async () => {
    setResult('');
        console.log('Transaction Started !');
        fetchPayOption(txnToken)
          .then((body) => {
            console.log('FETCH PAY RESPONDED !');
            // var paymentFlow: string = body.paymentFlow;
            var merchantPayOption: any = body.merchantPayOption;
            var savedInstruments = merchantPayOption.savedInstruments;
            var upiProfile: any = merchantPayOption.upiProfile;
            var vpaDetails: any[] = [];
            var bankAccounts: any[] = [];
            var paytmWalletBalance: string = '';
            if (
              upiProfile != undefined &&
              upiProfile.respDetails != undefined &&
              // upiProfile.upiOnboarding === true &&
              upiProfile.respDetails.profileDetail != undefined
            ) {
              vpaDetails = upiProfile.respDetails.profileDetail.vpaDetails;
              bankAccounts = upiProfile.respDetails.profileDetail.bankAccounts;
            }
            if (
              merchantPayOption.paymentModes[0].payChannelOptions[0]
                .balanceInfo != undefined
            ) {
              paytmWalletBalance =
                merchantPayOption.paymentModes[0].payChannelOptions[0]
                  .balanceInfo.accountBalance.value;
            }
            var merchantDetails: any = body.merchantDetails;
            initPaytmSdk(txnToken);
            navigation.navigate('PayMode', {
              paymentFlow: paymentFlow,
              savedInstruments: savedInstruments,
              vpaDetails: vpaDetails,
              bankAccounts: bankAccounts,
              paytmWalletBalance: paytmWalletBalance,
              merchantDetails: merchantDetails,
              mid: mid,
              orderId: orderId,
              txnToken: txnToken,
              amount: amount,
            });
            setTransactionStarted(false);
          })
          .catch((err) => {
            console.log('Transaction Start ERRORRRRR !');
            setTransactionStarted(false);
            setResult(err);
          });
  };

  const initPaytmSdk = (txnToken: string) => {
    PaytmCustomuisdk.initPaytmSDK(
      mid,
      orderId,
      txnToken,
      amount,
      isStaging,
      ''
    );
  };

  const fetchAuthCode = () => {
    if (authCheck === true) {
      PaytmCustomuisdk.fetchAuthCode(clientId, mid)
        .then((res) => {
          setResult(JSON.stringify(res));
          setAuthCode(res.response);
        })
        .catch((err) => {
          setResult(err.message);
        });
    } else {
      setResult('Please check auth code checkbox');
    }
  };

  const checkAuthCodeValid = () => {
    if (clientId === '' || authCode === '') {
      setResult('client id or auth code is empty');
      return;
    }
    PaytmCustomuisdk.isAuthCodeValid(clientId, authCode)
      .then((res) => {
        setResult(JSON.stringify(res));
      })
      .catch((err) => {
        setResult(err.message);
      });
  };

  const checkHasInstrument = () => {
    if (mid === '') {
      setResult('mid id is empty');
      return;
    }
    PaytmCustomuisdk.checkHasInstrument(mid,true,true,true)
      .then((res) => {
        setResult(JSON.stringify(res));
      })
      .catch((err) => {
        setResult(err.message);
      });
  };

  const isPaytmInstalled = () => {
    PaytmCustomuisdk.isPaytmAppInstalled()
      .then((res) => {
        setResult(JSON.stringify(res));
      })
      .catch((err) => {
        setResult(err.message);
      });
  };
  const { width } = Dimensions.get('window');
  const itemWidth = (width - 34) / 3;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <View style={{ margin: 8 }}>
            <View>
              <TextInput
                style={styles.textInput}
                defaultValue={mid}
                placeholder={'Merchant Id'}
                onChangeText={(e) => setMid(e)}
              />
              <TextInput
                style={styles.textInput}
                defaultValue={orderId}
                placeholder={'Order Id'}
                onChangeText={(e) => setOrderId(e)}
              />
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                defaultValue={amount}
                placeholder={'Amount'}
                onChangeText={(e) => setAmount(e)}
              />
              <TextInput
                style={styles.textInput}
                defaultValue={txnToken}
                placeholder={'Transaction Token'}
                onChangeText={(e) => setTxnToken(e)}
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 0.15 }}>
                  <Switch
                    value={isStaging}
                    onValueChange={() =>
                      isStaging ? setIsStaging(false) : setIsStaging(true)
                    }
                  />
                </View>
                <View style={{ flex: 0.85 }}>
                  <Text style={{ fontSize: 18 }}>
                    Staging : {isStaging ? 'true' : 'false'}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  borderColor: 'lightskyblue',
                  borderWidth: 1,
                  marginStart: 8,
                  marginTop: 16,
                  marginEnd: 8,
                }}
              >
                <FlatList
                  horizontal={true}
                  data={paymentFLowList}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(index) => index}
                  renderItem={({ item }) => (
                    <TouchableWithoutFeedback
                      onPress={() => setPaymentFlow(item)}
                    >
                      <View
                        style={{
                          flex: 1,
                          minWidth: itemWidth,
                          maxWidth: itemWidth,
                        }}
                      >
                        {item === paymentFlow && (
                          <View style={styles.selectedView}>
                            <Text style={styles.selectedHeaderText}>
                              {item}
                            </Text>
                          </View>
                        )}
                        {item != paymentFlow && (
                          <View style={styles.unselectedView}>
                            <Text style={styles.unSelectedHeaderText}>
                              {item}
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableWithoutFeedback>
                  )}
                />
              </View>
              <View style={styles.buttonStyle}>
                <Button
                  disabled={isTransactionStarted}
                  title="Start Transaction"
                  onPress={() => startTransaction()}
                />
              </View>
            </View>
            <View style={{ padding: 8 }}>
              <View>
                <PaytmConsentCheckBox
                  tintColor = {{true: checkboxTrueTint, false: checkboxFalseTint}}
                  style = {{ fontFamily : fontFamily, fontSize : fontSize, backgroundColor: checkboxBackgroud, padding : fontSize*1.35, color: checkboxTextColor }}
                  onChange={(e: boolean) => setAuthCheck(e)}
                />
              </View>
              
              <View>
                <CustomAlertView 
                title = "Customise Checkbox" 
                showAlert = {showAlert}
                onChange = {(response)=> {
                  setCheckboxBackgroud(response["checkboxBackgroud"])
                  setCheckboxTrueTint(response["checkboxTrueTint"])
                  setCheckboxFalseTint(response["checkboxFalseTint"])
                  setCheckboxTextColor(response["textColor"])
                  setFontFamily(response["fontFamily"])
                  setFontSize(response["fontSize"])
                  setShowAlert(false)
                }}
                onCancel = {()=> {
                  setShowAlert(false)
                }}
                ></CustomAlertView>
                <View style={styles.buttonStyle}>
                <Button
                  title="Customise checkbox"
                  onPress={() => {setShowAlert(true)
                    console.log("alert")
                  }}>
                </Button>
                </View>
              </View>
              <TextInput
                style={styles.textInput}
                defaultValue={clientId}
                placeholder={'Client Id'}
                onChangeText={(e) => setClientId(e)}
              />
              <View style={{ margin: 16 }}>
                <Button title="Fetch" onPress={() => fetchAuthCode()} />
              </View>
            </View>
            <View>
              <Text style={styles.textStyle}>Message :</Text>
              <Text style={styles.messageText}>{result}</Text>
            </View>
            <View
              style={{
                marginTop: 16,
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <View style={{ flex: 0.5, margin: 8 }}>
                <Button
                  title="Is Paytm Installed"
                  onPress={() => isPaytmInstalled()}
                />
              </View>
              <View style={{ flex: 0.5, margin: 8 }}>
                <Button
                  title="Is authcode Valid"
                  onPress={() => checkAuthCodeValid()}
                />
              </View>
            </View>
            <View style={{ margin: 8 }}>
              <Button
                title="check has instrument"
                onPress={() => checkHasInstrument()}
              />
            </View>
            <View>
                <PaytmConsentCheckBox
                  tintColor = {{true: checkboxTrueTint, false: checkboxFalseTint}}
                  style = {{ fontFamily : fontFamily, fontSize : fontSize, backgroundColor: checkboxBackgroud, padding : fontSize*1.35, color: checkboxTextColor }}
                  onChange={(e: boolean) => setAuthCheck(e)}
                />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    backgroundColor: '#2c86d4',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    padding: 8,
  },
  textStyle: {
    marginTop: 16,
    marginStart: 4,
    fontSize: 19,
    fontWeight: 'bold',
  },
  textInput: {
    fontSize: 18,
    padding: 8,
    borderColor: 'gray',
    marginStart: 8,
    marginEnd: 8,
    borderBottomWidth: 1,
  },
  buttonStyle: {
    padding: 8,
    margin: 8,
  },
  messageText: {
    fontSize: 18,
    padding: 8,
  },
  listView: {
    margin: 8,
  },
  listHeaderText: {
    padding: 8,
    fontWeight: 'bold',
    flex: 0.3,
    alignSelf: 'center',
  },
  selectedView: {
    backgroundColor: 'lightskyblue',
    borderColor: 'white',
  },
  selectedHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    padding: 8,
    alignSelf: 'center',
  },
  unSelectedHeaderText: {
    fontWeight: 'bold',
    color: 'black',
    padding: 8,
    alignSelf: 'center',
  },
  unselectedView: {
    backgroundColor: 'white',
  },
});
