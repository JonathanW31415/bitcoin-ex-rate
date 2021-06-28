import "./App.css";
import React, { useEffect, useState } from "react";
import logo from "./bitcoin-logo.png";
import switch_logo from "./switch-logo.png";
import { Price } from "./components/Price";
import { CurrencyInput } from "./components/CurrencyInput";
import { bitcoinOptions } from "./bitcoinOptions.js";
import { Container, Row } from "react-bootstrap";

export const App = () => {
  const [Data, setData] = useState(null);
  const [Loaded, setLoaded] = useState(false);

  const [FiatCurrency, setFiatCurrency] = useState("GBP");
  const [CryptoCurrency, setCryptoCurrency] = useState("BTC");
  const [Amount, setAmount] = useState("");
  const [Type, setType] = useState("Fiat");

  const getFetchData = async () => {
    await fetch("https://blockchain.info/ticker", { cache: "no-cache" })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoaded(true);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getFetchData();
  }, []);

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      getFetchData();
    }, 60000);
    return () => clearInterval(interval);
  }, [Data]);

  const handleFiatChange = (amount, fiat, change) => {
    setFiatCurrency(fiat);
    if (change) {
      setAmount(amount);
      setType("Fiat");
    }
  };
  const handleCryptoChange = (amount, crypto, change) => {
    setCryptoCurrency(crypto);
    if (change) {
      setAmount(amount);
      setType("Crypto");
    }
  };

  const tryConvert = (amount, convert, to) => {
    const input = parseFloat(amount);
    if (Number.isNaN(input)) {
      return "";
    }
    const output = convert(input);
    let formatted;
    to === "Fiat"
      ? (formatted = output.toFixed(2))
      : (formatted = output.toFixed(
          bitcoinOptions[CryptoCurrency]["decimalPlaces"]
        ));
    return formatted.toString();
  };

  const toCrypto = (input) => {
    return (
      input /
      (Data[FiatCurrency]["15m"] * bitcoinOptions[CryptoCurrency]["conversion"])
    );
  };

  const toFiat = (input) => {
    return (
      input *
      Data[FiatCurrency]["15m"] *
      bitcoinOptions[CryptoCurrency]["conversion"]
    );
  };

  const crypto =
    Type === "Fiat" ? tryConvert(Amount, toCrypto, "Crypto") : Amount;
  const fiat = Type === "Crypto" ? tryConvert(Amount, toFiat, "Fiat") : Amount;

  return (
    <Container fluid className="App d-flex flex-column">
    <Container fluid className="content d-flex flex-column justify-content-center align-items-center">
      <Row className="justify-content-center">
        <img src={logo} className="App-logo m-2" alt="logo" />
      </Row>
      {Loaded ? (
        <>
          <Row className="mb-5 justify-content-center">
            <Price
              price={Data[FiatCurrency]["15m"]}
              symbol={Data[FiatCurrency]["symbol"]}
            />
          </Row>
          <Row className="my-3 justify-content-center">
            <CurrencyInput
              data={Data}
              type="Fiat"
              inputValue={fiat}
              currency={FiatCurrency}
              onCurrencyChange={handleFiatChange}
            />
          </Row>
          <Row className="my-3 justify-content-center">
            <img src={switch_logo} className="Switch-logo" alt="logo" />
          </Row>
          <Row className="mt-3 mb-5 justify-content-center">
            <CurrencyInput
              data={bitcoinOptions}
              type="Crypto"
              inputValue={crypto}
              currency={CryptoCurrency}
              onCurrencyChange={handleCryptoChange}
            />
          </Row>

        </>
      ) : null}
    </Container>
    <Container className="mb-3 d-flex flex-column align-items-bottom">
          <Row className="justify-content-center">
            <h6 className="bottom-color">Made with ❤️ in Britain</h6>
          </Row>
          <Row className="justify-content-center">
            <a
              className="font-weight-bold"
              href="https://github.com/jonathanwxyz/bitcoin-ex-rate"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source Code📜
            </a>
          </Row>
    </Container>
    </Container>
  );
};
