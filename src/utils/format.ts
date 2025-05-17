export function formatObjectContent(
  obj: unknown,
  indentLevel = 0,
  indentSize = 2,
): string {
  const jsonString = JSON.stringify(obj, null, indentSize);

  const lines = jsonString.split("\n");

  const contentLines = lines.slice(1, -1);

  const baseIndent = " ".repeat(indentSize * indentLevel);

  return contentLines
    .map((line) => {
      const trimmedLine = line.trimStart();

      const withoutKeyQuotes = trimmedLine.replace(
        /^"([^"]+)":/,
        (_, key) => `${key}:`,
      );

      return baseIndent + withoutKeyQuotes;
    })
    .join("\n");
}

export function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
