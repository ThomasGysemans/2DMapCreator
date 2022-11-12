import type { SweetAlert2 } from "sweetalert2-react-content";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2/dist/sweetalert2";

/**
 * Gets the Swal instance
 */
export const getSwal = (): SweetAlert2 => {
  return withReactContent(Swal);
};