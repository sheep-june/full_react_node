// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import eslint from "vite-plugin-eslint";

// // https://vite.dev/config/

// export default defineConfig({
//     plugins: [react()],
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

export default defineConfig({
    plugins: [react(), eslint()],
    server: {
        proxy: {
            "/api": "http://localhost:4000",
        },
    },

    appType: "spa",
});
