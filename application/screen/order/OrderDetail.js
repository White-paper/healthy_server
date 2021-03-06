import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Linking,
    Alert,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator} from 'react-navigation';
import StackViewStyleInterpolator from 'react-navigation-stack/lib/commonjs/views/StackView/StackViewStyleInterpolator';

// import {MapView, MapTypes, Geolocation, Overlay} from 'react-native-baidu-map';
//import { MapView, Initializer } from 'react-native-baidumap-sdk'
//import { Initializer } from 'react-native-baidumap-sdk'
import { MapView } from 'react-native-amap3d'


import SwitchSelector from "react-native-switch-selector";

import ScreenUtil, {deviceWidth, deviceHeight, SZ_API_URI, DATA_API} from "../../common/ScreenUtil";
import NavigationUtil from "../../navigator/NavigationUtil";

let phone = "";

/*
* 主页
*/
export class OrderDetailView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            switchVal: 0,
            infoObj: null,
            // id: this.props.navigation.getParam("id"),
            // address: this.props.navigation.getParam("add"),
            // contactPhone: this.props.navigation.getParam("phone"),
            // contactUser: this.props.navigation.getParam("user"),
            // appointTime: this.props.navigation.getParam("time"),
            // remark: this.props.navigation.getParam("remark"),
            // lat: this.props.navigation.getParam("lat"),
            // lon: this.props.navigation.getParam("lon"),
            // cuslat: this.props.navigation.getParam("cuslat"),
            // cuslon: this.props.navigation.getParam("cuslon"),
        }
    }

    componentDidMount() {
        // console.log(MapView);
        const obj = this.props.navigation.state.params;
        try {
            if (!obj.orderId) {
                Alert.alert('后台数据错误');
                NavigationUtil.goPage();
            }
            this.setState({
                infoObj: this.props.navigation.state.params
            })
        } catch (e) {
            NavigationUtil.goPage();
        }
        // this._navListener = this.props.navigation.addListener('didFocus', () => {
        //    StatusBar.setBarStyle('dark-content');
        //    (Platform.OS === 'ios')?"":StatusBar.setBackgroundColor('#fff');
        // });


        // phone = this.props.navigation.getParam("phone");
        //this._getDetail(id);
        //Initializer.init('iOS 开发密钥').catch(e => console.error(e))
    }

    componentWillUnmount() {
        // this._navListener.remove();
    }

    //完结订单
    async _overOrder() {

        let user = JSON.parse(await AsyncStorage.getItem("userInfo"));

        let d = new FormData();
        d.append("userId", user.data_layer_uid);
        d.append("orderId", this.state.id);

        fetch(DATA_API + "api/v1/order/serves/finished", {
            method: "PUT",
            headers: {
                "Content-Type": "multipart/form-data"
            },
            body: d
        }).then(res => res.json())
            .then(resJson => {
                console.log(resJson);
            }).catch(err => {
            console.error(err);
        })
    }

    _cancelOrder() {
        Alert.alert('暂时无法取消该订单');
    }

    // render() {
    //     if (!this.state.infoObj) {
    //         return <View/>
    //     }
    //     return <MapView style={StyleSheet.absoluteFill}
    //         coordinate={{
    //             latitude: this.state.infoObj.lat,
    //             longitude: this.state.infoObj.lon,
    //         }}
    //     />
    //
    // }

    render() {
        if (!this.state.infoObj) {
            return <View/>
        }
        try {
            // const {navigate} = this.props.navigation;
            // const {Marker} = Overlay;
            return (
                <View style={{flex: 1}}>
                    <ScrollView style={[styles.container, {flex: 1}]}>
                        <MapView
                            style={{width: "100%", height: 300}}
                            mapType={'standard'}
                            showsCompass={true}
                            locationEnabled={true}
                            showsScale={true}
                            showsLocationButton={true}
                            showsBuildings={true}
                            zoomLevel={14}
                            coordinate={{longitude: this.state.infoObj.lon, latitude: this.state.infoObj.lat}}
                        >
                            <MapView.Marker
                                draggable={false}
                                title='用户地点'
                                onDragEnd={({ nativeEvent }) => {}
                                    // console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`)
                                }
                                coordinate={{
                                    latitude: this.state.infoObj.latitude,
                                    longitude: this.state.infoObj.longitude,
                                }}
                            />
                            {/*<Marker*/}
                            {/*    title='客户位置'*/}
                            {/*    location={{longitude: this.state.infoObj.longitude, latitude: this.state.infoObj.latitude}}*/}
                            {/*/>*/}
                        </MapView>
                        {/*<MapView*/}
                        {/*    width={deviceWidth}*/}
                        {/*    height={200}*/}
                        {/*    zoom={18}*/}
                        {/*    trafficEnabled={true}*/}
                        {/*    zoomControlsVisible={true}*/}
                        {/*    mapType={MapTypes.SATELLITE}*/}
                        {/*    center={{ longitude: 116.465175, latitude: 39.938522 }}*/}
                        {/*>*/}
                        {/*    <Marker*/}
                        {/*        title='中心'*/}
                        {/*        location={{longitude: 116.465175, latitude: 39.938522}}*/}
                        {/*    />*/}
                        {/*</MapView>*/}
                        <MapView/>

                        <View style={{paddingHorizontal: ScreenUtil.scaleSize(30)}}>
                            <Text style={{
                                fontSize: ScreenUtil.scaleSize(32),
                                color: "#000",
                                fontWeight: "bold",
                                height: ScreenUtil.scaleSize(120),
                                lineHeight: ScreenUtil.scaleSize(120),
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                borderBottomColor: "#ccc"
                            }}>我的订单</Text>
                            <View style={styles.fuwu}>
                                <Image
                                    resizeMode="contain"
                                    source={require("../../static/icons/06.png")}
                                    style={{width: ScreenUtil.scaleSize(40), height: ScreenUtil.scaleSize(40)}}/>
                                <Text style={styles.text}>服务地址:{this.state.infoObj.address}</Text>
                            </View>
                            <View style={styles.fuwu}>
                                <Image resizeMode="contain" source={require("../../static/icons/07.png")}
                                       style={{width: ScreenUtil.scaleSize(40), height: ScreenUtil.scaleSize(40)}}/>
                                <Text
                                    style={styles.text}>联系电话:{this.state.infoObj.contactPhone} | {this.state.infoObj.contactPerson}</Text>
                            </View>
                            <View style={styles.fuwu}>
                                <Image resizeMode="contain" source={require("../../static/icons/09.png")}
                                       style={{width: ScreenUtil.scaleSize(40), height: ScreenUtil.scaleSize(40)}}/>
                                <Text style={styles.text}>预约时间:{this.state.infoObj.appointTime}</Text>
                            </View>
                            <View style={styles.fuwu}>
                                <Image resizeMode="contain" source={require("../../static/icons/11.png")}
                                       style={{width: ScreenUtil.scaleSize(40), height: ScreenUtil.scaleSize(40)}}/>
                                <Text style={styles.text}>备注:{this.state.infoObj.remark}</Text>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={styles.footer}>
                        <View style={{flex: 1}}>
                            <TouchableOpacity onPress={() => {
                                //navigate("Model");
                                this._cancelOrder();
                            }}>
                                <Text style={{
                                    width: ScreenUtil.scaleSize(150),
                                    borderWidth: 1,
                                    borderColor: "#FFF",
                                    textAlign: "center",
                                    paddingVertical: 10,
                                    borderRadius: ScreenUtil.scaleSize(20),
                                    color: "#FFF"
                                }}>取消订单</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{flex: 2, height: 50, width: 200}}>

                            <SwitchSelector
                                initial={0}
                                height={50}
                                onPress={value => {
                                    let index = 1;
                                    if (value == 1) {
                                        index = 0;
                                    }
                                    if (index == 1) {
                                        this._overOrder();
                                    }
                                }}
                                disableValueChangeOnPress={true}
                                textColor={"#CCC"} //'#7a44cf'
                                selectedTextStyle={{color: "#fff", fontWeight: "bold"}}
                                selectedColor={"#0071ff"}
                                buttonColor={"#0071ff"}
                                borderColor={"#ccc"}
                                value={this.state.switchVal}
                                hasPadding
                                options={[
                                    {label: "滑动完成订单", value: "1",}, //images.feminino = require('./path_to/assets/img/feminino.png')
                                    {label: "订单完成", value: "0",} //images.masculino = require('./path_to/assets/img/masculino.png')
                                ]}
                            />
                        </View>
                    </View>
                </View>
            )
        } catch (e) {
            return <Text>error</Text>
        }
    }
}

//头样式
const headerStyle = {
    style: {
        textAlign: 'center',
        height: ScreenUtil.scaleSize(120),
        borderBottomWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
        backgroundColor: "#fff"
    },
    titleStyle: {
        flex: 1,
        textAlign: 'center',
        color: '#000',
        alignItems: "center",
        fontSize: ScreenUtil.scaleSize(32)
    }
}
export default OrderDetail = createStackNavigator({
    OrderDetailH: {
        screen: OrderDetailView,
        navigationOptions: ({navigation}) => ({
            headerTitle: navigation.getParam("name", "订单详情"),
            headerStyle: headerStyle.style,
            headerTitleStyle: headerStyle.titleStyle,
            headerTintColor: '#FFF',
            headerLeft:
                <TouchableOpacity onPress={() => {
                    navigation.pop();
                }}>
                    <View style={{marginLeft: ScreenUtil.scaleSize(10), padding: ScreenUtil.scaleSize(10)}}>
                        <Image resizeMode="contain" source={require('../../static/icons/16.png')}
                               style={{width: ScreenUtil.scaleSize(30), height: ScreenUtil.scaleSize(30),}}/>
                    </View>
                </TouchableOpacity>
            ,
            headerRight:
                <View style={{marginRight: ScreenUtil.scaleSize(20)}}>
                    <TouchableOpacity onPress={() => {
                        let tel = 'tel:' + phone;// 目标电话
                        Alert.alert('', '是否拨打',
                            [
                                {
                                    text: '取消', onPress: () => {
                                        return
                                    }
                                },
                                {
                                    text: '确定', onPress: () => {
                                        Linking.canOpenURL(tel).then((supported) => {
                                            if (!supported) {
                                                return;
                                            } else {
                                                return Linking.openURL(tel)
                                            }
                                        }).catch(error => console.log('tel error', error))
                                    }
                                }
                            ]
                        )
                    }}>
                        <Text style={{
                            fontSize: ScreenUtil.scaleSize(24),
                            width: ScreenUtil.scaleSize(150),
                            height: ScreenUtil.scaleSize(70),
                            lineHeight: ScreenUtil.scaleSize(70),
                            textAlign: "center",
                            color: "#fff",
                            borderRadius: ScreenUtil.scaleSize(35),
                            fontWeight: "bold",
                            backgroundColor: "#FFCC66"
                        }}>拨打电话</Text>
                    </TouchableOpacity>
                </View>
        })
    },

}, {
    initialRouteName: 'OrderDetailH',
    transitionConfig: () => ({
        screenInterpolator: StackViewStyleInterpolator.forHorizontal,
    })
})
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0071ff",
        paddingVertical: ScreenUtil.scaleSize(30)
    },
    footer: {
        flexDirection: "row",
        backgroundColor: "#0071ff",
        height: ScreenUtil.scaleSize(150),
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: ScreenUtil.scaleSize(30)
    },
    text: {
        marginVertical: ScreenUtil.scaleSize(20),
        paddingHorizontal: ScreenUtil.scaleSize(20),
        lineHeight: ScreenUtil.scaleSize(40),
        fontSize: ScreenUtil.scaleSize(30)
    },
    fuwu: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: ScreenUtil.scaleSize(30)
    },
})
