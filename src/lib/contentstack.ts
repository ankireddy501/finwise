import * as Contentstack from 'contentstack';

// Vite/ESM interop for CommonJS modules
const cs: any = (Contentstack as any).default || Contentstack;

const API_KEY = import.meta.env.VITE_CONTENTSTACK_API_KEY || 'blt0feaf330086422ec';
const DELIVERY_TOKEN = import.meta.env.VITE_CONTENTSTACK_DELIVERY_TOKEN || 'cs1f8c9db6e675ceffa45fbc5c';
const ENVIRONMENT = import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT || 'production';
const HOST = import.meta.env.VITE_CONTENTSTACK_HOST || 'au-cdn.contentstack.com';

const Stack = cs.Stack(
  API_KEY,
  DELIVERY_TOKEN,
  ENVIRONMENT
);

// Since the user is using au-app.contentstack.com, 
// we set the host to the Australia region delivery endpoint.
Stack.setHost(HOST);

export default Stack;
