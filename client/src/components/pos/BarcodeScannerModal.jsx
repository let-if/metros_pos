// // client/src/components/pos/BarcodeScannerModal.jsx
// import { useEffect, useRef } from 'react';
// import { Html5QrcodeScanner } from 'html5-qrcode';
// import { Camera, X } from 'lucide-react';

// export default function BarcodeScannerModal({ onClose, onScanSuccess }) {
//   const scannerRef = useRef(null);

//   useEffect(() => {
//     const scanner = new Html5QrcodeScanner(
//       "reader",
//       { fps: 10, qrbox: { width: 250, height: 150 } },
//       /* verbose= */ false
//     );

//     scanner.render(
//       (decodedText) => {
//         scanner.clear();
//         onScanSuccess(decodedText);
//       },
//       (error) => {
//         // Scanning frame errors can be ignored as it continuously scans
//       }
//     );

//     return () => {
//       scanner.clear().catch(error => console.error('Failed to clear html5QrcodeScanner. ', error));
//     };
//   }, []);

//   return (
//     <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl max-w-md w-full border border-yellow-500/30 shadow-2xl overflow-hidden p-6 space-y-4">
//         <div className="flex items-center justify-between border-b pb-3">
//           <h3 className="font-bold text-sm text-[#022036] flex items-center gap-2">
//             <Camera className="h-4 w-4 text-yellow-600" /> Scan Product Barcode / QR
//           </h3>
//           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
//           <div id="reader" className="w-full"></div>
//         </div>

//         <p className="text-[11px] text-slate-500 text-center">
//           Position the product barcode or QR code inside the camera view frame. Alternatively, use a USB barcode scanner directly on the POS register.
//         </p>
//       </div>
//     </div>
//   );
// }
// client/src/components/pos/BarcodeScannerModal.jsx
import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, X, Sparkles } from 'lucide-react';

export default function BarcodeScannerModal({ onClose, onScanSuccess }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 150 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        onScanSuccess(decodedText);
      },
      (error) => {
        // Scanning frame errors can be ignored as it continuously scans
      }
    );

    return () => {
      scanner.clear().catch(error => console.error('Failed to clear html5QrcodeScanner. ', error));
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#022036]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-yellow-500/30 shadow-2xl overflow-hidden p-6 space-y-5 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <h3 className="font-extrabold text-sm text-[#022036] flex items-center gap-2">
            <div className="p-2 rounded-xl bg-yellow-400/20 text-yellow-600">
              <Camera className="h-4 w-4" />
            </div>
            Scan Product Barcode / QR
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50 p-3 shadow-2xs">
          <div id="reader" className="w-full"></div>
        </div>

        <p className="text-[11px] text-slate-500 text-center font-medium leading-relaxed">
          Position the product barcode or QR code inside the camera view frame. Alternatively, use a USB barcode scanner directly on the POS register.
        </p>
      </div>
    </div>
  );
}