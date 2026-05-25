const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({ 
  accessToken: 'APP_USR-2174728131721230-052423-1bd07e0e02871207136872a57137704b-3423925668', 
  options: { timeout: 5000 } 
});

const preference = new Preference(client);

preference.create({
  body: {
    items: [
      {
        id: "oracle-plan-medium-mensal",
        title: "Plano Ascendente - Mensal",
        quantity: 1,
        unit_price: 49.9,
        currency_id: "BRL"
      }
    ],
    external_reference: "sub:medium:mensal:1"
  }
})
.then(res => {
  console.log("SUCCESS:", res.id);
})
.catch(err => {
  console.error("ERROR:", err.message);
  console.error("RESPONSE BODY:", JSON.stringify(err, null, 2));
});
