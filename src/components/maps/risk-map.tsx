import dynamic from "next/dynamic";

export const RiskMap = dynamic(
  () => import("@/components/maps/risk-map-client").then((mod) => mod.RiskMapClient),
  {
    ssr: false
  }
);
