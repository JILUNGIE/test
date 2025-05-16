import { usb } from "usb";

class usbModule {
  public addEventListener(cb: () => void) {
    usb.addListener("attach", cb);
    usb.addListener("detach", cb);
  }
}

export default usbModule;
