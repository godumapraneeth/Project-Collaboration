export default function Preview({ html = "", css = "", js = "" }) {
  const sourceDoc = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}<\/script> 
      </body>
    </html>
  `;

  return (
    <div className="h-full min-h-[300px] sm:min-h-[400px] rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-inner">
      <iframe
        srcDoc={sourceDoc}
        title="Live Preview"
        className="w-full h-full"
        sandbox="allow-scripts"
        frameBorder="0"
      />
    </div>
  );
}
