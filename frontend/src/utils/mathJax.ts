export function typesetMath() {
  if (typeof window !== 'undefined' && (window as any).MathJax && (window as any).MathJax.typesetPromise) {
    // Delay slightly to let React complete DOM updates
    setTimeout(() => {
      (window as any).MathJax.typesetPromise().catch((err: any) => {
        console.warn("MathJax typesetting failed", err);
      });
    }, 100);
  }
}
