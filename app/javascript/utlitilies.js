export function classTokenize(string, separator=" ") {
  return string.split(separator).filter(i => i)
}

export function setRadioGroup(name, value) {
  document.querySelectorAll(`input[type=radio][name=${name}]`)
    .forEach(e=> {
      e.checked = e.value === value ? true : false
    })
}

export function changeClasses(selector, {remove, add, scope}) {
  scope = scope || document
  scope.querySelectorAll(selector)
    .forEach(e => {
      e.classList.remove(remove)
      e.classList.add(add)
    })
}
