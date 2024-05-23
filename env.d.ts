// env.d.ts
interface ImportMetaEnv {
  readonly VITE_REACT_APP_API: string;
  readonly VITE_PROMOTION_API: string;
  // añade más variables de entorno según sea necesario
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
