const API_KEY = "e2346aa24873c9bd1b5100d7f35ab63143883716043cffbb321ae45cef036d7b"


const tickersHandlers = new Map()
// TODO refactor to use searchparams
const loadTickers = () => {
  if (tickersHandlers.size === 0) {
    return
  }
  
  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickersHandlers.keys()
    ].join(",")}&tsyms=USD&api_key=${API_KEY}`
    )
    .then(r => r.json())
    .then(rawData => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData)
        .map(([key, value]) => [key, value.USD])
      )
      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? []
        handlers.forEach(fn => fn(newPrice))
      })
    });
}

export const subscribeToTickers = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || []
  tickersHandlers.set(ticker, [...subscribers, cb])
}
export const unsubscribeFromTickers = ticker => {
  tickersHandlers.delete(ticker)
  // const subscribers = tickersHandlers.get(ticker) || []
  // tickersHandlers.set(ticker, subscribers.filter(fn => fn !== cb))
}

setInterval(loadTickers, 5000)

window.tickersHandlers = tickersHandlers
  // получить стоимость криптовалютных пар с АПИ? нет
  // получать ОБНОВЛЕНИЯ стоимости криптовалютных пар с АПИ да!