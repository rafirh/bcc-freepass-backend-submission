import env from '#start/env'

const midtransConfig = {
  isProduction: env.get('MIDTRANS_ENV') === 'production',
  serverKey: env.get('MIDTRANS_SERVER_KEY'),
  clientKey: env.get('MIDTRANS_CLIENT_KEY'),
}

export default midtransConfig
