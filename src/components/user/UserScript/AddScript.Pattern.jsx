import { useLocation, useNavigate } from "react-router-dom"
import AddForm from "../../../ExtraComponent/FormData";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { GET_EXPIRY_DATE, Get_StrikePrice, Get_Symbol, Get_Pattern_Time_Frame, Get_Pattern_Charting, Get_Pattern_Name, GetExchange } from '../../CommonAPI/Admin'
import { AddScript } from '../../CommonAPI/User'

const AddClient = () => {

    const location = useLocation()
    const userName = localStorage.getItem('name')
    const navigate = useNavigate()
    const [getSymbolData, setSymbolData] = useState({ loading: true, data: [] })
    const [getAllExchange, setAllExchange] = useState([])
    const [getStricke, setStricke] = useState({ loading: true, data: [] })
    const [getTimeFrame, setTimeFrame] = useState({ loading: true, data: [] })
    const [getExpiryDate, setExpiryDate] = useState({ loading: true, data: [] })
    const [getChartPattern, setChartPattern] = useState({ loading: true, data: [] })
    const [getPattern, setPattern] = useState({ loading: true, data: [] })


    const SweentAlertFun = (text) => {
        Swal.fire({
            title: "Error",
            text: text,
            icon: "error",
            timer: 1500,
            timerProgressBar: true
        });
    }

    const getEndData = (stg) => {
        const dataWithoutLastItem = location?.state?.scriptType?.data.slice(0, -1);
        const foundItem = dataWithoutLastItem.find((item) => {
            return item.Pattern.includes(stg);
        });
        return foundItem.EndDate;
    };




    const formik = useFormik({

        initialValues: {
            MainStrategy: location.state.data.selectStrategyType,
            Username: location.state.data.selectGroup,
            Strategy: "",
            ETPattern: "",
            Timeframe: "",
            Exchange: "",
            Symbol: "",
            Instrument: "",
            Strike: "",
            Optiontype: "",
            Targetvalue: 1.0,
            Slvalue: 1.00,
            TStype: "",
            Quantity: 1,
            LowerRange: 0.0,
            HigherRange: 0.0,
            HoldExit: "",
            EntryPrice: 0.0,
            EntryRange: 0.0,
            EntryTime: "09:15:00",
            ExitTime: "15:25:00",
            ExitDay: "",
            FixedSM: "",
            TType: "",
            serendate: "",
            expirydata1: "",
            Expirytype: "",
            Striketype: "",
            DepthofStrike: 0,
            DeepStrike: 0,
            Group: "",
            CEDepthLower: 0.0,
            CEDepthHigher: 0.0,
            PEDepthLower: 0.0,
            PEDepthHigher: 0.0,
            CEDeepLower: 0.0,
            CEDeepHigher: 0.0,
            PEDeepLower: 0.0,
            PEDeepHigher: 0.0,
            Trade_Count: 1,
            Trade_Execution: "Paper Trade",
        },


        validate: (values) => {
            let errors = {};
            const maxTime = "15:29:59";
            const minTime = "09:15:00";

            if (!values.Exchange) {
                errors.Exchange = "Please Select Exchange Type.";
            }
            if (!values.Instrument && values.Exchange == "NFO") {
                errors.Instrument = "Please Enter Instrument Type.";
            }
            if (!values.Trade_Execution || values.Trade_Execution == 0) {
                errors.Trade_Execution = "Please Select Trade Execution.";
            }
            if (!values.Trade_Count || values.Trade_Count == 0) {
                errors.Trade_Count = "Please Enter Trade Count.";
            }
            if (!values.Symbol) {
                errors.Symbol = "Please Enter Symbol Type.";
            }
            if (!values.Optiontype && (values.Instrument == "OPTIDX" || values.Instrument == "OPTSTK") && values.Exchange == "NFO") {
                errors.Optiontype = "Enter Option Type.";
            }
            if (!values.Strike && (values.Instrument == "OPTIDX" || values.Instrument == "OPTSTK") && values.Exchange == "NFO") {
                errors.Strike = "Enter Strike Price.";
            }
            if (!values.expirydata1 && values.Exchange == "NFO") {
                errors.expirydata1 = "Enter Expiry Date.";
            }
            if (!values.Strategy) {
                errors.Strategy = "Please Select Pattern Type.";
            }
            if (!values.Timeframe) {
                errors.Timeframe = "Please Enter Timeframe Type.";
            }
            if (!values.ETPattern) {
                errors.ETPattern = "Please Select Pattern Name.";
            }

            if (!values.TStype) {
                errors.TStype = "Please Enter Measurement Type.";
            }
            if (!values.Slvalue || values.Slvalue == 0 || Number(values.Slvalue) < 0) {
                errors.Slvalue = values.Slvalue == 0 ? "Stoploss can not be Zero" : Number(values.Slvalue) < 0 ? "Stoploss can not be Negative" : "Please Enter Stoploss Value.";
            }
            if (!values.Targetvalue || values.Targetvalue == 0 || Number(values.Targetvalue) < 0) {
                errors.Targetvalue = values.Targetvalue == 0 ? "Target can not be Zero" : Number(values.Targetvalue) < 0 ? "Target can not be Negative" : "Please Enter Target Value.";
            }
            if (!values.TType) {
                errors.TType = "Please Enter Transaction Type.";
            }
            if (!values.Quantity) {
                errors.Quantity = formik.values.Exchange == "NFO" ? "Please Enter Lot Value" : "Please Enter Quantity Value";
            }
            if (!values.ExitDay) {
                errors.ExitDay = "Please Select Exit Day.";
            }
            if (!values.ExitTime) {
                errors.ExitTime = "Please Select Exit Time.";
            } else if (values.ExitTime > maxTime) {
                errors.ExitTime = "Exit Time Must be Before 15:29:59.";
            }
            else if (values.ExitTime < minTime) {
                errors.ExitTime = "Exit Time Must be After 09:15:00.";
            }
            if (!values.EntryTime) {
                errors.EntryTime = "Please Select Entry Time.";
            } else if (values.EntryTime < minTime) {
                errors.EntryTime = "Entry Time Must be After 09:15:00.";
            }
            else if (values.EntryTime > maxTime) {
                errors.EntryTime = "Entry Time Must be Before 15:29:59.";
            }

            return errors;
        },


        onSubmit: async (values) => {
            const req = {
                MainStrategy: location.state.data.selectStrategyType,
                Username: userName,
                Strategy: values.Strategy,
                ETPattern: values.ETPattern,
                Timeframe: values.Timeframe,
                Exchange: values.Exchange,
                Symbol: values.Symbol,
                Instrument: values.Instrument,
                Strike: values.Strike,
                Optiontype: values.Instrument == "OPTIDX" || values.Instrument == "OPTSTK" ? values.Optiontype : "",
                Targetvalue: values.Targetvalue,
                Slvalue: values.Slvalue,
                TStype: values.TStype,
                Quantity: values.Quantity,
                LowerRange: 0.0,
                HigherRange: 0.0,
                HoldExit: "",
                EntryPrice: 0.0,
                EntryRange: 0.0,
                EntryTime: values.EntryTime,
                ExitTime: values.ExitTime,
                ExitDay: values.ExitDay,
                TradeCount: Number(values.Trade_Count),
                TradeExecution: values.Trade_Execution,
                FixedSM: "",
                TType: values.TType,
                serendate: getEndData(values.Strategy),
                expirydata1: values.Exchange == "NSE" ? getExpiryDate.data[0] : values.expirydata1,
                Expirytype: "",
                Striketype: "",
                DepthofStrike: 0,
                DeepStrike: 0,
                Group: "",
                CEDepthLower: 0.0,
                CEDepthHigher: 0.0,
                PEDepthLower: 0.0,
                PEDepthHigher: 0.0,
                CEDeepLower: 0.0,
                CEDeepHigher: 0.0,
                PEDeepLower: 0.0,
                PEDeepHigher: 0.0,
                stretegytag: values.Strategy
            }
            if (values.EntryTime >= values.ExitTime) {
                return SweentAlertFun("Exit Time should be greater than Entry Time")
            }

            await AddScript(req)
                .then((response) => {
                    if (response.Status) {
                        Swal.fire({
                            title: "Script Added !",
                            text: response.message,
                            icon: "success",
                            timer: 1500,
                            timerProgressBar: true
                        });
                        setTimeout(() => {
                            navigate('/user/dashboard')
                        }, 1500)
                    }
                    else {
                        Swal.fire({
                            title: "Error !",
                            text: response.message,
                            icon: "error",
                            timer: 1500,
                            timerProgressBar: true
                        });
                    }
                })
                .catch((err) => {
                    console.log("Error in added new Script", err)
                })


        },
    });


    // Symbol Break
    const extractDetails = (inputString) => {
        const regex = /([PC])(?!.*[PC])(\d+)/;
        const match = inputString.match(regex);
        if (match) {
            const number = match[2];
            const optionType = match[1];
            const type = optionType == "C" ? "CE" : "PE"
            return { number, type };
        } else {
            return null;
        }
    };



    const result = extractDetails(location.state.data.Symbol);


    useEffect(() => {
        formik.setFieldValue('Exchange', location.state.data.Exchange)
        formik.setFieldValue('Instrument', location.state.data['Instrument Type'])
        formik.setFieldValue('Symbol', location.state.data.MainSymbol)
        formik.setFieldValue('Strategy', location.state.data.TradePattern)
        formik.setFieldValue('Timeframe', location.state.data.TimeFrame)
        formik.setFieldValue('ETPattern', location.state.data.Pattern)
        formik.setFieldValue('TStype', location.state.data.TStype)
        formik.setFieldValue('Slvalue', location.state.data['SL value'])
        formik.setFieldValue('Targetvalue', location.state.data['Target value'])
        formik.setFieldValue('TType', location.state.data.TType)
        formik.setFieldValue('Quantity', location.state.data.Quantity)
        formik.setFieldValue('ExitDay', location.state.data.ExitDay)
        formik.setFieldValue('EntryTime', location.state.data.EntryTime)
        formik.setFieldValue('ExitTime', location.state.data.ExitTime)
        formik.setFieldValue('Trade_Execution', location.state.data.TradeExecution)
        formik.setFieldValue('Trade_Count', location.state.data.TradeCount || 1)
        formik.setFieldValue('expirydata1', location.state.data['Expiry Date'])
        formik.setFieldValue('Optiontype', result ? result.type : "")
        formik.setFieldValue('Strike', result ? result.number : "")

    }, [])




    const get_Exchange = async () => {

        await GetExchange()
            .then((response) => {
                if (response.Status) {
                    setAllExchange(response.Exchange)
                }
                else {
                    setAllExchange([])
                }
            })
            .catch((err) => {
                console.log("Error to finding the Exchange value", err)

            })
    }
    useEffect(() => {
        get_Exchange()
    }, [])


    const SymbolSelectionArr = [
        {
            name: "Exchange",
            label: "Exchange",
            type: "select",
            options: getAllExchange && getAllExchange.map((item) => ({
                label: item,
                value: item,
            })),
            hiding: false,
            label_size: 12,
            headingtype: 1,
            disable: true,
            col_size: formik.values.Exchange == "NFO" && (formik.values.Instrument == 'FUTIDX' || formik.values.Instrument == 'FUTSTK') ? 3 : formik.values.Exchange == "NFO" && (formik.values.Instrument == 'OPTIDX' || formik.values.Instrument == 'OPTSTK') ? 4 : 6,

        },
        {
            name: "Instrument",
            label: "Instrument",
            type: "select",
            options: formik.values.Exchange == "NFO" ?
                [
                    { label: "FUTIDX", value: "FUTIDX" },
                    { label: "FUTSTK", value: "FUTSTK" },
                    { label: "OPTIDX", value: "OPTIDX" },
                    { label: "OPTSTK", value: "OPTSTK" },
                ]
                : formik.values.Exchange == "MCX" ?
                    [
                        { label: "OPTFUT", value: "OPTFUT" },
                        { label: "FUTCOM", value: "FUTCOM" },
                        { label: "FUTIDX", value: "FUTIDX" },
                    ]
                    : formik.values.Exchange == "CDS" ?
                        [
                            { label: "OPTCUR", value: "OPTCUR" },
                            { label: "FUTCUR", value: "FUTCUR" },
                        ]
                        :
                        [],
            showWhen: (values) => values.Exchange == "NFO" || values.Exchange == "CDS" || values.Exchange == "MCX",
            hiding: false,
            label_size: 12,
            headingtype: 1,
            disable: true,
            col_size: formik.values.Exchange == "NFO" && (formik.values.Instrument == 'FUTIDX' || formik.values.Instrument == 'FUTSTK') ? 3 : formik.values.Exchange == "NFO" && (formik.values.Instrument == 'OPTIDX' || formik.values.Instrument == 'OPTSTK') ? 4 : 6,

        },
        {
            name: "Symbol",
            label: "Symbol",
            type: "select",
            options: getSymbolData.data && getSymbolData.data.map((item) => ({
                label: item,
                value: item,
            })),
            showWhen: (values) => values.Exchange === "NFO" || values.Exchange === "NSE" || values.Exchange === "CDS" || values.Exchange === "MCX",
            label_size: 12,
            headingtype: 1,

            hiding: false,
            col_size: formik.values.Exchange == "NFO" && (formik.values.Instrument == 'FUTIDX' || formik.values.Instrument == 'FUTSTK') ? 3 : formik.values.Exchange == "NFO" && (formik.values.Instrument == 'OPTIDX' || formik.values.Instrument == 'OPTSTK') ? 4 : 6,
            disable: false,
        },
        {
            name: "Optiontype",
            label: "Option Type",
            type: "select",
            options: [
                { label: "CE", value: "CE" },
                { label: "PE", value: "PE" },
            ],
            showWhen: (values) => values.Instrument == "OPTIDX" || values.Instrument == "OPTSTK",
            label_size: 12,
            headingtype: 1,
            hiding: false,
            col_size: 4,
            disable: false,
        },
        {
            name: "Strike",
            label: "Strike Price",
            type: "select",
            options: getStricke.data && getStricke.data.map((item) => ({
                label: item,
                value: item
            })),
            showWhen: (values) => values.Instrument == "OPTIDX" || values.Instrument == "OPTSTK",
            label_size: 12,
            headingtype: 1,
            col_size: 4,
            hiding: false,
            disable: false,
        },
        {
            name: "expirydata1",
            label: "Expiry Date",
            type: "select",
            options: getExpiryDate && getExpiryDate.data.map((item) => ({
                label: item,
                value: item
            })),
            showWhen: (values) => values.Exchange === "NFO" || values.Exchange === "CDS" || values.Exchange === "MCX",
            label_size: 12,
            headingtype: 1,
            hiding: false,
            col_size: formik.values.Exchange == "NFO" && (formik.values.Instrument == 'FUTIDX' || formik.values.Instrument == 'FUTSTK') ? 3 : formik.values.Exchange == "NFO" && (formik.values.Instrument == 'OPTIDX' || formik.values.Instrument == 'OPTSTK') ? 4 : 4,
            disable: false,
        },
    ]

    const EntryRuleArr = [
        {
            name: "Timeframe",
            label: "Time Frame",
            type: "select",
            options: getTimeFrame && getTimeFrame.data.map((item) => ({
                label: item,
                value: item
            })),
            label_size: 12,
            headingtype: 2,
            hiding: false,
            col_size: 3,
            disable: false,
        },
        {
            name: "Strategy",
            label: "Pattern Type",
            type: "select",
            options: location.state.scriptType.data[location.state.scriptType.len].CombinePattern.map((item) => ({
                label: item == "ChartingPattern" ? "Charting Pattern" : item == "CandlestickPattern" ? 'Candlestick Pattern' : item,
                value: item
            })),
            label_size: 12,
            hiding: false,
            col_size: 3,
            headingtype: 2,
            disable: false,
        },
        {
            name: "ETPattern",
            label: "Pattern Name",
            type: "select",
            options: formik.values.Strategy == 'ChartingPattern' ? getChartPattern.data && getChartPattern.data.map((item) => ({
                label: item,
                value: item
            })) :
                getPattern.data && getPattern.data.map((item) => ({
                    label: item,
                    value: item
                })),
            label_size: 12,
            hiding: false,
            headingtype: 2,
            col_size: 3,
            disable: false,
        },
        {
            name: "TType",
            label: "Transaction Type",
            type: "select",
            options: [
                { label: "BUY", value: "BUY" },
                { label: "SELL", value: "SELL" },

            ],
            label_size: 12,
            headingtype: 2,
            hiding: false,
            col_size: 3,
            disable: false,
        },

    ]


    const ExitRuleArr = [

        {
            name: "Targetvalue",
            label: "Target",
            type: "text3",
            label_size: 12,
            hiding: false,
            headingtype: 3,
            col_size: 4,
            disable: false,
        },
        {
            name: "Slvalue",
            label: "Stoploss",
            type: "text3",
            label_size: 12,
            headingtype: 3,
            hiding: false,
            col_size: 4,
            disable: false,
        },

    ]
    const RiskManagementArr = [
        {

            name: "TStype",
            label: "Measurement Type",
            type: "select",
            options: [
                { label: "Point", value: "Point" },
                { label: "Percantage", value: "Percantage" },
            ],

            label_size: 12,
            hiding: false,
            headingtype: 4,
            col_size: 4,
            disable: false,
        },

        {
            name: "Quantity",
            label: formik.values.Exchange == "NFO" ? "Lot" : "Quantity",
            type: "text3",

            label_size: 12,
            hiding: false,
            col_size: 4,
            headingtype: 4,
            disable: false,
        },
        {
            name: "Trade_Count",
            label: "Trade Count",
            type: "text3",
            label_size: 12,
            col_size: 4,
            disable: false,
            hiding: false,
        },


    ]

    const TimeArr = [

        {
            name: "EntryTime",
            label: "Entry Time",
            type: "timepiker",
            hiding: false,
            label_size: 12,
            col_size: 4,
            headingtype: 5,
            disable: false,
        },
        {
            name: "ExitTime",
            label: "Exit Time",
            type: "timepiker",
            hiding: false,
            label_size: 12,
            col_size: 4,
            headingtype: 5,
            disable: false,
        },
        {
            name: "ExitDay",
            label: "Exit Day",
            type: "select",
            options: [
                { label: "Intraday", value: "Intraday" },
                { label: "Delivery", value: "Delivery" },
            ],
            label_size: 12,
            hiding: false,
            col_size: 4,
            headingtype: 5,
            disable: false,
        },
    ]
    const OtherParameterArr = [
        {
            name: "Trade_Execution",
            label: "Trade Execution",
            type: "select",
            options: [
                { label: "Paper Trade", value: "Paper Trade" },
                { label: "Live Trade", value: "Live Trade" },
            ],

            label_size: 12,
            col_size: 4,
            disable: false,
            hiding: false,
        },

    ]

    const fields = [
        {
            name: "Heading",
            label: "Symbol_Selection",
            type: "heading",
            hiding: false,
            label_size: 12,
            headingtype: 1,
            data: SymbolSelectionArr.filter((item) => !item.showWhen || item.showWhen(formik.values)),
            col_size: 12,
            disable: false,
        },
        {
            name: "Heading",
            label: "Entry_Rule",
            type: "heading",
            hiding: false,
            label_size: 12,
            data: EntryRuleArr.filter((item) => !item.showWhen || item.showWhen(formik.values)),
            headingtype: 2,
            col_size: 12,
            disable: false,
        },
        {
            name: "Heading",
            label: "Risk_Management",
            type: "heading",
            hiding: false,
            label_size: 12,
            data: RiskManagementArr.filter((item) => !item.showWhen || item.showWhen(formik.values)),
            headingtype: 4,
            col_size: 12,
            disable: false,
        },
        {
            name: "Heading",
            label: "Exit_Rule",
            type: "heading",
            hiding: false,
            label_size: 12,
            data: ExitRuleArr.filter((item) => !item.showWhen || item.showWhen(formik.values)),
            headingtype: 3,
            headingtype: 3,
            col_size: 12,
            disable: false,
        },
        {
            name: "Heading",
            label: "Time_Duration",
            type: "heading",
            hiding: false,
            label_size: 12,
            data: TimeArr.filter((item) => !item.showWhen || item.showWhen(formik.values)),
            col_size: 12,
            headingtype: 5,
            disable: false,
        },
        {
            name: "Heading",
            label: "Other_Parameters",
            type: "heading",
            hiding: false,
            label_size: 12,
            col_size: 12,
            headingtype: 6,
            data: OtherParameterArr.filter((item) => !item.showWhen || item.showWhen(formik.values)),
            disable: false,
        },

    ];


    const getSymbol = async () => {
        if (formik.values.Exchange) {
            const data = { Exchange: formik.values.Exchange, Instrument: formik.values.Instrument }
            await Get_Symbol(data)
                .then((response) => {
                    if (response.Status) {
                        setSymbolData({
                            loading: false,
                            data: response.Symbol
                        })

                    }
                    else {
                        setSymbolData({
                            loading: false,
                            data: []
                        })

                    }
                })
                .catch((err) => {
                    console.log("Error in fatching the Symbol", err)
                })
        }
    }

    useEffect(() => {
        getSymbol()
    }, [formik.values.Instrument, formik.values.Exchange])


    const getStrikePrice = async () => {
        if (formik.values.Instrument && formik.values.Exchange && formik.values.Symbol) {

            const data = {
                Exchange: formik.values.Exchange,
                Instrument: formik.values.Instrument,
                Symbol: formik.values.Symbol
            }
            await Get_StrikePrice(data)
                .then((response) => {
                    if (response.Status) {
                        setStricke({
                            loading: false,
                            data: response.Strike
                        })
                    }
                })
        }
    }

    useEffect(() => {
        getStrikePrice()
    }, [formik.values.Instrument, formik.values.Exchange, formik.values.Symbol])

    const getExpiry = async () => {
        if (formik.values.Symbol) {
            const data = {
                Exchange: formik.values.Exchange,
                Instrument: formik.values.Exchange == "NSE" ? "" : formik.values.Instrument,
                Symbol: formik.values.Exchange == "NSE" ? "" : formik.values.Symbol,
                Strike: formik.values.Exchange == "NSE" ? "" : formik.values.Strike
            }

            await GET_EXPIRY_DATE(data)
                .then((response) => {
                    if (response.Status) {
                        setExpiryDate({
                            loading: false,
                            data: response['Expiry Date']
                        })

                    } else {
                        setExpiryDate({
                            loading: false,
                            data: []
                        })

                    }
                })
                .catch((err) => {
                    console.log("Error in finding the Expiry date", err)
                })
        }

    }


    useEffect(() => {
        getExpiry()
    }, [formik.values.Instrument, formik.values.Exchange, formik.values.Symbol, formik.values.Strike])


    const GetPatternTimeFrame = async () => {

        await Get_Pattern_Time_Frame()
            .then((response) => {
                setTimeFrame({
                    loading: false,
                    data: response
                })
            })
            .catch((err) => {
                console.log("Error in finding the time frame", err)
            })
    }



    const GetPatternName = async () => {
        await Get_Pattern_Name()
            .then((response) => {
                if (response.Status) {
                    setPattern({
                        loading: false,
                        data: response.PatternName
                    })
                }
                else {
                    setPattern({
                        loading: false,
                        data: []
                    })

                }
            })
            .catch((err) => {
                console.log("Error in finding the pattern", err)
            })
    }

    const GetPatternCharting = async () => {
        await Get_Pattern_Charting()
            .then((response) => {
                if (response.Status) {
                    setChartPattern({
                        loading: false,
                        data: response.PatternName
                    })
                }
                else {
                    setChartPattern({
                        loading: false,
                        data: []
                    })

                }
            })
    }

    useEffect(() => {
        GetPatternTimeFrame()
        GetPatternName()
        GetPatternCharting()
    }, [])


    useEffect(() => {
        if (formik.values.Symbol && formik.values.Symbol !== location.state.data.MainSymbol) {
            formik.setFieldValue('expirydata1', "");
            formik.setFieldValue('Optiontype', "");
            formik.setFieldValue('Strike', "");
        }
        if (formik.values.Strategy && formik.values.Strategy !== location.state.data.TradePattern) {

            formik.setFieldValue('ETPattern', "");
        }
        if (formik.values.Instrument == "FUTIDX" || formik.values.Instrument == "FUTSTK") {
            formik.setFieldValue('Optiontype', "")
            formik.setFieldValue('Strike', "")
        }
        if (formik.values.Exchange == "NSE") {
            formik.setFieldValue('Instrument', "")
        }
    }, [formik.values.Instrument, formik.values.Exchange, formik.values.Symbol, formik.values.Strategy])



    return (
        <>
            <AddForm
                fields={fields.filter((field) => !field.showWhen || field.showWhen(formik.values))}
                // page_title="Add Script pattern"
                page_title={`Add Script - pattern , Group Name : ${location.state.data.Username}`}

                btn_name="Add"
                btn_name1="Cancel"
                formik={formik}
                btn_name1_route={"/user/dashboard"}
            />
        </>
    );
};
export default AddClient;
