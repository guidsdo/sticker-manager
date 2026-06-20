import type { DesktopBridge } from "@ima-stickermanage/contracts/types";

declare global {
    interface Window {
        imaStickermanageDesktop?: DesktopBridge;
    }
}

export {};
