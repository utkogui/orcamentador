import localFont from "next/font/local";

export const moderat = localFont({
  src: [
    {
      path: "../../../matilha-ds/fonts/Moderat/Moderat-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../matilha-ds/fonts/Moderat/Moderat-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../matilha-ds/fonts/Moderat/Moderat-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../matilha-ds/fonts/Moderat/Moderat-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-moderat",
  display: "swap",
});
