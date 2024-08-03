// types/global.d.ts

 interface Window {
    ethereum: any;
}


declare interface HeaderBoxProps {
    type?: "title" | "greeting";
    title: string;
    subtext: string;
    user?: string;
  }