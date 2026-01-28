/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTENTSTACK_API_KEY: string
  readonly VITE_CONTENTSTACK_DELIVERY_TOKEN: string
  readonly VITE_CONTENTSTACK_ENVIRONMENT: string
  readonly VITE_CONTENTSTACK_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
