import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shruti Sharma - 3D Portfolio",
    short_name: "Shruti",
    description: "Shruti Sharma's interactive software engineering portfolio",
    start_url: `${BASE_PATH}/`,
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: `${BASE_PATH}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${BASE_PATH}/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
  };
}
