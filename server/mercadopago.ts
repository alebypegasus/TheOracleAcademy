import { MercadoPagoConfig, Preference } from 'mercadopago';

// Instância do SDK
// Token de teste / sandbox ou real
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || 'TEST-1234567890-123456-1234567890';
export const mpConfig = new MercadoPagoConfig({ accessToken, options: { timeout: 5000 } });
