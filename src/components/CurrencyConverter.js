import { useState } from "react";
import ExchangeRate from "./ExchangeRate";
import axios from "axios";

const CurrencyConverter = () => {
    const currencies = ['BTC', 'ETH', 'USD', 'XRP', 'LTC', 'ADA'];

    const [chosenPrimaryCurrency, setChosenPrimaryCurrency] = useState('BTC');
    const [chosenSecondaryCurrency, setChosenSecondaryCurrency] = useState('BTC');
    const [amount, setAmount] = useState(1);
    const [exchangedData, setExchangedData] = useState({
        primaryCurrency: 'BTC',
        secondaryCurrency: 'BTC',
        exchangeRate: 0
    });

    const [result, setResult] = useState(0)
    
    const reset = () => {
        setChosenPrimaryCurrency('BTC');
        setChosenSecondaryCurrency('BTC');
        setAmount(1);
        setExchangedData({
            primaryCurrency: 'BTC',
            secondaryCurrency: 'BTC',
            exchangeRate: 0
        });
        setResult(0);
    }

    const convert = () => {
        const options = {
            method: 'GET',
            url: 'https://alpha-vantage.p.rapidapi.com/query',
            params: {from_currency: chosenPrimaryCurrency, function: 'CURRENCY_EXCHANGE_RATE', to_currency: chosenSecondaryCurrency},
            headers: {
              'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
              'x-rapidapi-key': process.env.REACT_APP_RAPID_API_KEY
            }
          };
          
          axios.request(options).then((response) => {
              console.log(response.data);
            setResult(response.data['Realtime Currency Exchange Rate']['5. Exchange Rate'] * amount);
            setExchangedData({
                primaryCurrency: chosenPrimaryCurrency,
                secondaryCurrency: chosenSecondaryCurrency,
                exchangeRate: response.data['Realtime Currency Exchange Rate']['5. Exchange Rate'] 
            })
          }).catch((error) => {
              console.error(error);
          });
    }

    return (
        <div className="currency-converter">
            <h2>Currency Converter</h2>
            <div className="input-box">
                <table>
                    <tbody>
                        <tr>
                            <td>Primary Currency</td>
                            <td>
                                <input type="number" name="currency-name-1" value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </td>
                            <td>
                                <select
                                    name="currency-option-1"
                                    value={chosenPrimaryCurrency}
                                    className="currency-options"
                                    onChange={(e) => setChosenPrimaryCurrency(e.target.value)}>
                                    {currencies.filter(curr => curr != 'USD').map((currency, index) => (<option key={index}>{currency}</option>))}</select>
                            </td>
                        </tr>

                        <tr>
                            <td>Secondary Currency</td>
                            <td>
                                <input type="number" name="currency-name-2" disabled = "disabled" value={result} />
                            </td>
                            <td>
                                <select
                                    name="currency-option-2"
                                    value={chosenSecondaryCurrency}
                                    className="currency-options"
                                    onChange={(e) => setChosenSecondaryCurrency(e.target.value)}>
                                    {currencies.map((currency, index) => (<option key={index}>{currency}</option>))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <button id="convert-button" className="btnConvert" onClick={convert}>Convert</button>
                                <button id="convert-reset" className="btnReset" onClick={reset}>Reset</button>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
 
                
            </div>

            <ExchangeRate exchangedData = {exchangedData} />
        </div>
    )
}

export default CurrencyConverter;
