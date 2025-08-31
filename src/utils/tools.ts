// /*
//    * 文档打印
//    */
//   pagePrint: (title, html)=> {
//     let iframe = document.createElement("IFRAME");
//     iframe.setAttribute("style", "position:absolute;width:0;height:0");
//     iframe.setAttribute("id", "printIframe");
//     iframe.setAttribute("title", title);
//     iframe.srcdoc = `<html><head><title>${title}</title></head><body></body></html>`;
//     document.title = title;
//     document.body.appendChild(iframe);
//     const iframeWindow = iframe.contentWindow;
//     iframe.onload = () => {
//       iframeWindow.addEventListener("afterprint", function () {
//         setTimeout(function () {
//           document.body.removeChild(iframe);
//         }, 100);
//       });
//       iframe.contentWindow.document.body.innerHTML = html;
//       let imagesList = iframeWindow.document.images;
//       let imagesLoadIndex = 0;
//       if (imagesList.length === 0) {
//         iframeWindow.focus();
//         iframeWindow.print();
//       } else {
//         for (let k = 0; k < imagesList.length; k++) {
//           imagesList[k].onload = function () {
//             imagesLoadIndex++;
//             if (imagesLoadIndex === imagesList.length) {
//               iframeWindow.focus();
//               iframeWindow.print();
//             }
//           };
//         }
//       }
//     };
//   }
const pagePrint = (title, html)=> {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("style", "position:absolute;width:0;height:0");
  iframe.setAttribute("id", "printIframe");
  iframe.setAttribute("title", title);
  iframe.srcdoc = `<html><head><title>${title}</title></head><body></body></html>`;
  document.body.appendChild(iframe);
  const iframeWindow = iframe.contentWindow;

  iframe.onload = () => {
    iframeWindow.addEventListener("afterprint", () => {
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 100);
    });

    iframe.contentWindow.document.body.innerHTML = html;
    const imagesList = iframeWindow.document.images;
    let imagesLoadIndex = 0;

    if (imagesList.length === 0) {
      iframeWindow.focus();
      iframeWindow.print();
    } else {
      const handleImageLoad = () => {
        imagesLoadIndex += 1;
        if (imagesLoadIndex === imagesList.length) {
          iframeWindow.focus();
          iframeWindow.print();
        }
      };

      for (let k = 0; k < imagesList.length; k+=1) {
        imagesList[k].onload = handleImageLoad;
      }
    }
  };
}
export default pagePrint;