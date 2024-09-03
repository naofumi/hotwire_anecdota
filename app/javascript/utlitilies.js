export function classTokenize(string, separator=" ") {
  return string.split(separator).filter(i => i)
}
