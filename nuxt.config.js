// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
 
  modules: ["@nuxtjs/supabase","@nuxtjs/tailwindcss", "shadcn-nuxt","@nuxtjs/color-mode" ],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    }
  },
  supabase: {
    redirect: false, // Disable redirects for auth by default
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  colorMode: {
    classSuffix: ''
  },
  components: {
    dirs: [
      { path: "~/components", extensions: ["vue"], pathPrefix: false },
      { path: "~/components/ui", extensions: ["vue"], pathPrefix: true },
    ],
  },
});