import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Image,
    Alert
} from 'react-native';
import comStyles from "../../assets/styles/comStyles";
import {bindData} from "../../api/global";
import {cashOut} from "../../api";
import NavigationUtil from "../../navigator/NavigationUtil";
// {
//     id: 1,
//         label: '支付宝提现',
//     disable: true
// },
const withdrawList = [{
    id: 2,
    label: '银行卡提现'
}];

export default class CashOut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wallet: bindData('wallet', this),
            activeWithItem: withdrawList[0],
            amount: '',
            cardName: '',
            cardId: '',
            cardBank: '',
        };
    }

    componentDidMount() {
        // this.getMoneyBag();
        // this._navListener = this.props.navigation.addListener('didFocus', () => {
        //    StatusBar.setBarStyle('dark-content');
        // if (Platform.OS === 'android') {
        //     StatusBar.setBarStyle('light-content');
        //     StatusBar.setBackgroundColor('#3E93FF');
        // }

    }

    _onChangeText(text, who) {
        if (who === 'amount' && (isNaN(text) || text < 0)) {
            text = 0;
            this.refs.rewardAmount.clear()
        }
        this.setState({
            [who]: text
        }, () => {
        })
    }


    componentWillUnmount() {
        this.setState = () => {
            return null;
        }
    }

    async _submit() {
        if (!this.state.amount || !this.state.cardName || !this.state.cardId || !this.state.cardBank) {
            Alert.alert("请先完善提现信息");
            return false
        }
        if (this.state.cardId.length < 16 || isNaN(this.state.cardId)) {
            this.setState({
                cardId: ''
            });
            Alert.alert("请输入正确的银行卡账号");
            return false
        }
        const ret = await cashOut(this.state.amount, this.state.cardName, this.state.cardId, this.state.cardBank);
        if (ret.code === 200) {
            NavigationUtil.goPage({
                successInfo: {
                    amount: this.state.amount
                }
            }, 'CashSuc');
            this.setState({
                cardName: '',
                cardId: '',
                cardBank: '',
            });
        } else {
            Alert.alert(ret.msg || "提现申请失败");
        }
    }

    render() {
        return (
            <ScrollView style={[styles.container]}>
                <View style={[comStyles.blank]}/>
                <View style={[styles.cashOutHeader]}>
                    <View style={[styles.inputWrap, {
                        paddingLeft: 20
                    }]}>
                        <Text style={styles.inputIcon}>¥</Text>
                        <TextInput value={this.state.amount}
                                   ref={'rewardAmount'} keyboardType={'numeric'} style={styles.cashOutInput}
                                   maxLength={15}
                                   placeholder={"请输入提现金额"}
                                   placeholderTextColor={'#BDBDBD'}
                                   onChangeText={(text) => this._onChangeText(text, 'amount')}/>
                        <Text style={styles.inputBtn} onPress={() => {
                            if (this.state.wallet && this.state.wallet.balance) {
                                console.log('ddd')
                                this.setState({
                                    amount: this.state.wallet.balance,
                                    defaultInput: this.state.wallet.balance,
                                });
                                // console.log(this.refs.rewardAmount)
                                // this.refs.rewardAmount.props.value = this.state.wallet.balance
                            }
                        }}>全部提现</Text>
                    </View>
                    <Text style={styles.inputText}>可提现金额：{this.state.wallet.balance}</Text>
                </View>
                <View style={[comStyles.blank]}/>
                <View style={styles.cashChannelWrap}>
                    {(() => {
                        let view = [];
                        withdrawList.forEach((item, index) => {
                            if (item.disable) {
                                return false
                            }
                            view.push(
                                <TouchableOpacity style={[styles.cashCategoryWrap, {
                                    borderBottomWidth: index < withdrawList.length - 1 ? 1 : 0,
                                }]} onPress={() => {
                                    console.log(item)
                                    this.setState({
                                        activeWithItem: item
                                    }, () => {
                                        console.log(this.state.activeWithItem)
                                    })
                                }} key={`label${index}`}>
                                    <Text style={styles.cashCategory}>
                                        {item.label}
                                    </Text>
                                    <View style={[comStyles.flex, styles.choseBtn, {
                                        backgroundColor: this.state.activeWithItem.id === item.id ? '#0071ff' : '#fff',
                                        borderWidth: this.state.activeWithItem.id === item.id ? 0 : 1
                                    }]} key={`btn${index}`}>
                                        <View style={styles.choseBtnInner}/>
                                    </View>
                                </TouchableOpacity>
                            )
                        });
                        return view;
                    })()}
                </View>
                <View style={[comStyles.blank]}/>
                <View style={[comStyles.flex, styles.inputWrap]}>
                    <Text style={styles.cardLabel}>银行名</Text>
                    <TextInput keyboardType={'default'} style={styles.cardInput}
                               placeholder={"请输入银行名称"}
                               placeholderTextColor={'#BDBDBD'}
                               onChangeText={(text) => this._onChangeText(text, 'cardName')}/>
                </View>
                <View style={[comStyles.flex, styles.inputWrap]}>
                    <Text style={styles.cardLabel}>银行卡</Text>
                    <TextInput keyboardType={'numeric'} style={styles.cardInput}
                               placeholder={"请输入银行卡号"}
                               placeholderTextColor={'#BDBDBD'}
                               onChangeText={(text) => this._onChangeText(text, 'cardId')}/>
                </View>
                <View style={[comStyles.flex, styles.inputWrap]}>
                    <Text style={styles.cardLabel}>开户行</Text>
                    <TextInput keyboardType={'default'} style={styles.cardInput}
                               placeholder={"请输入开户行"}
                               placeholderTextColor={'#BDBDBD'}
                               onChangeText={(text) => this._onChangeText(text, 'cardBank')}/>
                </View>
                <TouchableOpacity onPress={() => {
                    this._submit();
                }}>
                    <Text style={[comStyles.commonBtn, {marginTop: 60}]}>确认提现</Text>
                </TouchableOpacity>
                {/*<View style={styles.input}>*/}
                {/*    <Text style={styles.label}>姓名</Text>*/}
                {/*    <TextInput placeholder="请输入姓名" style={{width:"80%",}} onChangeText={(uName)=>this.setState({uName})} />*/}
                {/*</View>*/}
                {/*<View style={[styles.input,{marginTop:0}]}>*/}
                {/*    <Text style={styles.label}>卡号</Text>*/}
                {/*    <TextInput placeholder="请输入卡号" style={{width:"80%",}} onChangeText={(uCard)=>this.setState({uCard})} />*/}
                {/*</View>*/}
                {/*<View style={[styles.input,{marginTop:0,borderBottomWidth:0}]}>*/}
                {/*    <Text style={styles.label}>银行</Text>*/}
                {/*    <TextInput placeholder="请输入银行" style={{width:"80%",}} onChangeText={(uBank)=>this.setState({uBank})} />*/}
                {/*</View>*/}
                {/*<View style={styles.input}>*/}
                {/*    <Text style={styles.label}>￥</Text>*/}
                {/*    <TextInput placeholder="请输入金额" style={{width:"70%",}} onChangeText={(uMoney)=>this.setState({uMoney})} />*/}
                {/*    <TouchableOpacity activeOpacity={.8} onPress={this.onBtnTiXian}>*/}
                {/*        <Text style={{color:"#FF9900",fontSize:ScreenUtil.scaleSize(30)}}>全部提现</Text>*/}
                {/*    </TouchableOpacity>*/}
                {/*</View>*/}
                {/*<View style={[styles.input,{marginTop:0,borderBottomWidth:0}]}>*/}
                {/*    <Text style={[styles.label,{color:"#ccc",}]}>可提现金额510.00</Text>*/}
                {/*</View>*/}
            </ScrollView>
        )
    }
}
// export default CashOut = createStackNavigator ({
//     CashOutHome:{
//         screen:CashOutView,
//         navigationOptions:({navigation})=>({
//             headerTitle : navigation.getParam("name","提现"),
//             headerStyle:headerStyle.style,
//             headerTitleStyle:headerStyle.titleStyle,
//             headerTintColor:'#FFF',
//             headerLeft:
//                 <TouchableOpacity onPress={()=>{
//                     navigation.pop();
//                 }}>
//                     <View style={{marginLeft:ScreenUtil.scaleSize(10),padding:ScreenUtil.scaleSize(10)}}>
//                         <Image resizeMode="contain" source={require('../../static/icons/16.png')} style={{width:ScreenUtil.scaleSize(30),height:ScreenUtil.scaleSize(30)}}/>
//                     </View>
//                 </TouchableOpacity>
//             ,
//             headerRight:
//                 <TouchableOpacity onPress={()=>{
//                     navigation.navigate("CashOutLog");
//                 }}>
//                     <View style={{marginRight:ScreenUtil.scaleSize(24)}}>
//                         <Text>提现记录</Text>
//                     </View>
//                 </TouchableOpacity>
//         })
//     },
//
// },{
//     initialRouteName:'CashOutHome',
//     transitionConfig:()=>({
//         screenInterpolator: StackViewStyleInterpolator.forHorizontal,
//     })
// })
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cardInput: {
        flex: 1
    },
    cashCategory: {
        height: 45,
        lineHeight: 45,
        position: 'relative',
        color: '#353535',
    },
    cardLabel: {
        width: 'auto',
        color: '#333',
        fontWeight: '600',
        marginRight: 10
    },
    cashOutHeader: {
        height: 100,
        backgroundColor: '#fff'
    },
    cashCategoryWrap: {
        width: 'auto',
        height: 'auto',
        position: 'relative',
        borderBottomColor: '#eee',
    },
    choseBtnInner: {
        width: 4,
        height: 4,
        backgroundColor: '#fff',
        borderRadius: 2
    },
    choseBtn: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderColor: '#b6b6b6',
        position: 'absolute',
        right: 0,
        top: 20,
    },
    cashTitle: {
        height: 40,
        lineHeight: 40,
        color: '#353535',
        fontSize: 14,
        fontWeight: '600'
    },
    cashChannelWrap: {
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        height: 'auto',
        backgroundColor: '#fff'
    },
    inputWrap: {
        width: '94%',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
        justifyContent: 'flex-start'
    },
    inputText: {
        paddingLeft: 20,
        fontSize: 14,
        lineHeight: 50,
        color: '#999'
    },
    inputBtn: {
        position: 'absolute',
        right: 0,
        top: 0,
        height: 50,
        lineHeight: 50,
        fontSize: 12,
        color: '#FF9917'
    },
    inputIcon: {
        height: 50,
        lineHeight: 50,
        fontSize: 20,
        fontWeight: '600',
        color: '#353535',
        position: 'absolute',
        left: 0,
        top: 0,
    },
    cashOutInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#353535',
    }
});
