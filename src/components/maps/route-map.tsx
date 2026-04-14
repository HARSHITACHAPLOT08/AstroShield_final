import dynamic from "next/dynamic";

export const RouteMap = dynamic(
  () => import("@/components/maps/route-map-client").then((mod) => mod.RouteMapClient),
  {
    ssr: false
  }
);
