import katex from "katex";

export const renderMath = (element) => {
  // Display math: $$...$$
  element.innerHTML = element.innerHTML.replace(
    /\$\$([\s\S]+?)\$\$/g,
    (_, equation) =>
      katex.renderToString(equation.trim(), {
        displayMode: true,
        throwOnError: false,
      })
  );

  // Inline math: \( ... \)
  element.innerHTML = element.innerHTML.replace(
    /\\\((.*?)\\\)/g,
    (_, equation) =>
      katex.renderToString(equation.trim(), {
        displayMode: false,
        throwOnError: false,
      })
  );
};