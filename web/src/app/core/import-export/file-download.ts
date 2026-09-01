/** Prompts the browser to save some text as a file. */
export function downloadTextFile(fileName: string, mimeType: string, contents: string): void {
  const url = URL.createObjectURL(new Blob([contents], { type: mimeType }));
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.click();

  // Freeing it immediately is safe: click() has already started the download.
  URL.revokeObjectURL(url);
}
